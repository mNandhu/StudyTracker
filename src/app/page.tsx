import React from 'react'
import AIAssistant from '@/components/ai-assistant'
import CalendarWidget from '@/components/calendar-widget'
import TaskManager from '@/components/task-manager'
import StudyTips from '@/components/study-tips'

export default function Home() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
            <div className="lg:row-span-2">
                <div className={"h-full"}><AIAssistant/></div>
            </div>
            <div className="space-y-6">
                <CalendarWidget/>
                <TaskManager/>
            </div>
            <div className="md:col-span-2">
                <StudyTips/>
            </div>
        </div>
    )
}