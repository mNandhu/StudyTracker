'use client'

import React, {useState, useRef, useEffect} from 'react'
import {Card, CardContent, CardFooter, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {ScrollArea} from '@/components/ui/scroll-area'
import {Mic} from 'lucide-react'
import axios from 'axios'

export default function AIAssistant({className = ''}) {
    const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'ai' }>>([])
    const [input, setInput] = useState('')
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    const handleSend = async () => {
        if (input.trim()) {
            // Add user's message to the chat
            setMessages([...messages, {text: input, sender: 'user'}])

            try {
                // Send the input message to the Flask server
                const response = await axios.post('http://localhost:5000/api/ai', {message: input})

                // Add the response from the Flask server to the chat
                setMessages(prev => [...prev, {text: response.data.reply, sender: 'ai'}])
            } catch (error) {
                console.error('Error sending message to server:', error)
                setMessages(prev => [...prev, {text: 'Error communicating with the server.', sender: 'ai'}])
            }

            // Clear the input field
            setInput('')
        }
    }

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }, [messages])

    return (
        <Card className={`flex flex-col rounded-xl overflow-hidden ${className}`}
              style={{height: 'calc(81.5vh - 2rem)'}}>
            <CardTitle className="bg-blue-100 dark:bg-gray-800 dark:text-blue-100 text-lg font-semibold p-3 mb-4">AI
                Assistant</CardTitle>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full px-4" ref={scrollAreaRef}>
                    <div className="space-y-4 pb-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-2 rounded-lg ${
                                        message.sender === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-secondary-foreground'
                                    }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 bg-background">
                <div className="flex w-full items-center space-x-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button onClick={handleSend}>Send</Button>
                    <Button variant="outline" size="icon">
                        <Mic className="h-4 w-4"/>
                        <span className="sr-only">Voice input</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
