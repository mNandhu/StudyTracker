import React from 'react'
import Link from 'next/link'
import {Home, Calendar, MessageSquare, Settings} from 'lucide-react'
import {Button} from '@/components/ui/button'

export default function Sidebar() {
    return (
        <aside className="w-64 bg-secondary text-secondary-foreground pl-0.5 pt-6">
            <nav className="space-y-2">
                <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/" className="flex items-center space-x-2">
                        <Home className="h-5 w-5"/>
                        <span>Dashboard</span>
                    </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/calender" className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5"/>
                        <span>Calendar</span>
                    </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/assistant" className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5"/>
                        <span>AI Assistant</span>
                    </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/settings" className="flex items-center space-x-2">
                        <Settings className="h-5 w-5"/>
                        <span>Settings</span>
                    </Link>
                </Button>
            </nav>
        </aside>
    )
}