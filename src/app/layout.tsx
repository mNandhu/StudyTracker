'use client';
import React from 'react'
import {ThemeProvider} from '@/components/theme-provider'
import Sidebar from '@/components/sidebar'
import {Button} from '@/components/ui/button'
import {Moon, Sun} from 'lucide-react'
import {useTheme} from 'next-themes'
import '@/app/globals.css'

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className="bg-background text-foreground">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex h-screen">

                <div className={"w-24 mr-4"}><Sidebar/></div>
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="container mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-4xl font-bold ">Student Productivity App</h1>
                            <ThemeToggle/>
                        </div>
                        {children}
                    </div>
                </main>
            </div>
        </ThemeProvider>
        </body>
        </html>
    )
}

function ThemeToggle() {
    const {setTheme, theme} = useTheme()

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
            <Moon
                className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}