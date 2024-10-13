import React from 'react'
import AIAssistant from '@/components/ai-assistant'
import CalendarWidget from '@/components/calendar-widget'
import TaskManager from '@/components/task-manager'
import StudyTips from '@/components/study-tips'

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <AIAssistant />
      <div className="space-y-8">
        <CalendarWidget />
        <TaskManager />
      </div>
        <div className="md:col-span-2">
      <StudyTips  />
            </div>
    </div>
  )
}