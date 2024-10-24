'use client'

import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import {usePathname, useRouter} from 'next/navigation'
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {Button} from '@/components/ui/button'
import {ScrollArea} from '@/components/ui/scroll-area'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible'
import {useTheme} from 'next-themes'
import {
    Home,
    Calendar,
    BookOpen,
    Settings,
    MessageSquare,
    User2,
    ChevronDown,
    LogOut,
    Sun,
    Moon,
    Plus,
    Trash2,
    MessageCircle,
    SquareCheckBig
} from 'lucide-react'

interface Chat {
    id: string;
    title: string;
}

export default function AppSidebar() {
    const {setTheme, theme} = useTheme()
    const [isAIMenuOpen, setIsAIMenuOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const [chats, setChats] = useState<Chat[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const isActive = (path: string) => pathname === path

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    useEffect(() => {
        fetchChats()
    }, [])

    const fetchChats = async () => {
        try {
            const response = await fetch('http://localhost:5000/chats')
            const data = await response.json()
            setChats(data)
        } catch (error) {
            console.error('Error fetching chats:', error)
        }
    }

    const createNewChat = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('http://localhost:5000/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({title: `Chat ${chats.length + 1}`}),
            })
            const newChat = await response.json()
            setChats(prevChats => [...prevChats, newChat])
            router.push(`/assistant/${newChat.id}`)
        } catch (error) {
            console.error('Error creating new chat:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteChat = async (chatId: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            await fetch(`http://localhost:5000/chats/${chatId}`, {
                method: 'DELETE',
            })
            setChats(prevChats => prevChats.filter(chat => chat.id !== chatId))

            if (pathname === `/assistant/${chatId}`) {
                const remainingChats = chats.filter(chat => chat.id !== chatId)
                if (remainingChats.length > 0) {
                    router.push(`/assistant/${remainingChats[0].id}`)
                } else {
                    router.push('/assistant')
                }
            }
        } catch (error) {
            console.error('Error deleting chat:', error)
        }
    }

    const isChatActive = (chatId: string) => {
        return pathname === `/assistant/${chatId}`
    }

    return (
        <Sidebar collapsible="icon"
                 className="border-r fixed left-0 top-0 h-full transition-all duration-300 ease-in-out">
            <SidebarHeader className="p-4">
                <Link href="/" className="flex items-center space-x-2">
                    <BookOpen className="h-6 w-6"/>
                    <span className="text-lg font-bold group-data-[collapsible=icon]:hidden">StudyTracker</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <ScrollArea className="h-[calc(100vh-10rem)]">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link href="/" passHref legacyBehavior>
                                <SidebarMenuButton asChild isActive={isActive('/')} className="ml-2">
                                    <a className="flex items-center">
                                        <Home className="h-4 w-4"/>
                                        <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                                    </a>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <Collapsible open={isAIMenuOpen} onOpenChange={setIsAIMenuOpen} className="ml-2">
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <MessageSquare className="h-4 w-4"/>
                                    <span className="group-data-[collapsible=icon]:hidden">Assistant</span>
                                    <ChevronDown
                                        className="ml-auto h-4 w-4 transition-transform group-data-[collapsible=icon]:hidden"/>
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {chats.map((chat) => (
                                        <SidebarMenuSubItem key={chat.id}>
                                            <Link href={`/assistant/${chat.id}`} passHref legacyBehavior>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={isChatActive(chat.id)}
                                                    className="flex justify-between items-center"
                                                >
                                                    <a>
                                                        <div className="flex items-center">
                                                            <MessageCircle className="mr-2 h-4 w-4"/>
                                                            <span>{chat.title}</span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => deleteChat(chat.id, e)}
                                                            className="ml-2 p-0 hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive"/>
                                                        </Button>
                                                    </a>
                                                </SidebarMenuSubButton>
                                            </Link>
                                        </SidebarMenuSubItem>
                                    ))}
                                    <SidebarMenuSubItem>
                                        <Button
                                            onClick={createNewChat}
                                            disabled={isLoading}
                                            className="w-full justify-start"
                                            variant="ghost"
                                        >
                                            <Plus className="mr-2 h-4 w-4"/>
                                            New Chat
                                        </Button>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </Collapsible>
                        <SidebarMenuItem>
                            <Link href="/calendar" passHref legacyBehavior>
                                <SidebarMenuButton asChild isActive={isActive('/calendar')} className="ml-2">
                                    <a className="flex items-center">
                                        <Calendar className="h-4 w-4"/>
                                        <span className="group-data-[collapsible=icon]:hidden">Calendar</span>
                                    </a>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link href="/tasks" passHref legacyBehavior>
                                <SidebarMenuButton asChild isActive={isActive('/tasks')} className="ml-2">
                                    <a className="flex items-center">
                                        <SquareCheckBig className="h-4 w-4"/>
                                        <span className="group-data-[collapsible=icon]:hidden">Tasks</span>
                                    </a>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link href="/settings" passHref legacyBehavior>
                                <SidebarMenuButton asChild isActive={isActive('/settings')} className="ml-2">
                                    <a className="flex items-center">
                                        <Settings className="h-4 w-4"/>
                                        <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                                    </a>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={toggleTheme} className="ml-2">
                                {theme === 'dark' ? (
                                    <Sun className="h-4 w-4"/>
                                ) : (
                                    <Moon className="h-4 w-4"/>
                                )}
                                <span className="group-data-[collapsible=icon]:hidden">
                                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </ScrollArea>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarTrigger/>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <Avatar className="h-6 w-6 mr-2">
                                        <AvatarImage src="https://github.com/mNandhu.png" alt="@username"/>
                                        <AvatarFallback>UN</AvatarFallback>
                                    </Avatar>
                                    <span className="group-data-[collapsible=icon]:hidden">mNandhu</span>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <User2 className="mr-2 h-4 w-4"/>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4"/>
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <LogOut className="mr-2 h-4 w-4"/>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}