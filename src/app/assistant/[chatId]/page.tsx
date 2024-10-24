import React from 'react'
import AIAssistant from '@/components/ai-assistant'

type Props = {
    params: {
        chatId: string;
    };
};

export default async function AssistantPage({params}: Props) {
    const { chatId } = await params;
    if (!chatId) return <div>Loading...</div>
    console.log(chatId)
    return (
        <div className="container mx-auto p-4 h-full w-full">
            {/*<h1 className="text-2xl font-bold mb-4">Page for AI Assistant</h1>*/}
            <AIAssistant chatId={chatId as string}/>
        </div>
    )
}
