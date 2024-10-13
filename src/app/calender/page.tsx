import React from 'react'
import CalendarWidget from '@/components/calendar-widget'

export default function CalendarPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <CalendarWidget />
    </div>
  )
}