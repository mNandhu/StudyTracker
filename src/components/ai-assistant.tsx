'use client'

import React, {useState, useEffect, useRef} from 'react'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {ScrollArea} from '@/components/ui/scroll-area'
import {Avatar, AvatarFallback} from '@/components/ui/avatar'
import {Send, Loader2, User, Bot, Edit2, Trash2, X} from 'lucide-react'
import {useToast} from '@/hooks/use-toast'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
}

interface Chat {
    id: string
    title: string
    messages: Message[]
}

interface AIAssistantProps {
    chatId?: string;
    onUpdateTitle?: (chatId: string, newTitle: string) => void;
    onDeleteChat?: (chatId: string) => void;
    onCreateChat?: () => void;
}

export default function AIAssistant({
                                        chatId,
                                        onUpdateTitle,
                                        onDeleteChat,
                                        onCreateChat,
                                    }: AIAssistantProps) {
    const [currentChat, setCurrentChat] = useState<Chat | null>(null)
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState('')
    const [showClearDialog, setShowClearDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const {toast} = useToast()

    const fetchChat = async (id: string) => {
        setIsFetching(true)
        console.log("Attempting to fetch chat with id: ", id)
        try {
            const response = await fetch(`http://localhost:5000/chats/${id}`)
            if (!response.ok) throw new Error('Failed to fetch chat')
            const data = await response.json()
            setCurrentChat(data)
            setEditTitle(data.title)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load chat",
                variant: "destructive"
            })
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        if (chatId) {
            fetchChat(chatId)
        }
    }, [chatId])

    useEffect(() => {
        scrollToBottom()
    }, [currentChat?.messages])

    const sendMessage = async () => {
        if (!input.trim() || !chatId || !currentChat) return

        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        }

        setCurrentChat(prev => prev ? {
            ...prev,
            messages: [...prev.messages, newMessage]
        } : null)
        setInput('')
        setIsLoading(true)

        try {
            const response = await fetch(`http://localhost:5000/chats/${chatId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMessage),
            })
            if (!response.ok) throw new Error('Failed to send message')
            const data = await response.json()

            setCurrentChat(prev => prev ? {
                ...prev,
                messages: [...prev.messages, data]
            } : null)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const updateTitle = async () => {
        if (!chatId || !editTitle.trim()) return

        try {
            const response = await fetch(`http://localhost:5000/chats/${chatId}/title`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({title: editTitle}),
            })
            if (!response.ok) throw new Error('Failed to update title')
            const data = await response.json()
            setCurrentChat(prev => prev ? {...prev, title: editTitle} : null)
            onUpdateTitle?.(chatId, editTitle)
            setIsEditing(false)
            toast({
                title: "Success",
                description: "Chat title updated",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update chat title",
                variant: "destructive"
            })
        }
    }

    const clearChat = async () => {
        if (!chatId) return

        try {
            await fetch(`http://localhost:5000/chats/${chatId}/clear`, {
                method: 'POST',
            })
            setCurrentChat(prev => prev ? {...prev, messages: []} : null)
            setShowClearDialog(false)
            toast({
                title: "Success",
                description: "Chat history cleared",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to clear chat history",
                variant: "destructive"
            })
        }
    }

    const deleteChat = async () => {
        if (!chatId || !onDeleteChat) return

        try {
            await fetch(`http://localhost:5000/chats/${chatId}`, {
                method: 'DELETE',
            })
            onDeleteChat(chatId)
            setShowDeleteDialog(false)
            toast({
                title: "Success",
                description: "Chat deleted",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete chat",
                variant: "destructive"
            })
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
    }

    if (isFetching) {
        return (
            <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin"/>
                <p className="mt-2 text-muted-foreground">Loading chat...</p>
            </Card>
        )
    }

    if (!chatId || !currentChat) {
        return (
            <Card className="w-full max-w-4xl mx-auto h-[709px] flex flex-col">
                <CardHeader className="flex-shrink-0">
                    <CardTitle className="text-2xl font-bold">AI Assistant</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col items-center justify-center">
                    <p className="text-muted-foreground mb-4">Select a chat or create a new one to begin</p>
                    <Button onClick={onCreateChat}>
                        Create New Chat
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card className="w-full max-w-4xl mx-auto flex flex-col">
                <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between">
                    {isEditing ? (
                        <div className="flex items-center space-x-2">
                            <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-[200px]"
                                onKeyDown={(e) => e.key === 'Enter' && updateTitle()}
                            />
                            <Button size="sm" onClick={updateTitle}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                                <X className="h-4 w-4"/>
                            </Button>
                        </div>
                    ) : (
                        <CardTitle className="text-2xl font-bold flex items-center">
                            {currentChat.title}
                            <Button
                                size="sm"
                                variant="ghost"
                                className="ml-2"
                                onClick={() => setIsEditing(true)}
                            >
                                <Edit2 className="h-4 w-4"/>
                            </Button>
                        </CardTitle>
                    )}
                    <div className="flex items-center space-x-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowClearDialog(true)}
                        >
                            Clear History
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col overflow-hidden">
                    <ScrollArea className="flex-grow pr-4">
                        {currentChat.messages.map(message => (
                            <div
                                key={message.id}
                                className={`flex ${
                                    message.role === 'user' ? 'justify-end' : 'justify-start'
                                } mb-4`}
                            >
                                <div
                                    className={`flex items-start space-x-2 ${
                                        message.role === 'user' ? 'flex-row-reverse' : ''
                                    }`}
                                >
                                    <Avatar>
                                        <AvatarFallback>
                                            {message.role === 'user' ? <User/> : <Bot/>}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        className={`p-3 rounded-lg ${
                                            message.role === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                        }`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef}/>
                    </ScrollArea>
                    <div className="flex items-center space-x-2 mt-4 flex-shrink-0">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button onClick={sendMessage} disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin"/>
                            ) : (
                                <Send className="h-4 w-4"/>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Clear Chat History</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to clear this chat&#39;s history? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={clearChat}>Clear</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this chat? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteChat}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}