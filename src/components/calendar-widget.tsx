'use client'

import React from 'react'
import {Card, CardContent, CardTitle} from '@/components/ui/card'
import {Calendar} from '@/components/ui/calendar'

export default function CalendarWidget() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [plans, setPlans] = React.useState<string | null>(null)

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate)
        if (selectedDate) {
            const day = selectedDate.getDate()
            const month = selectedDate.toLocaleString('default', {month: 'long'})

            if (day === 13) {
                setPlans(`Midterm exam for ${month} starts`)
            }
            else
            {
                setPlans(`No plans for ${day} ${month}`)
            }
        } else {
            setPlans(null)
        }
    }

    return (
        <Card className="rounded-xl overflow-hidden">
            <CardTitle className="bg-blue-100 dark:bg-gray-800 dark:text-blue-100
                text-lg font-semibold p-3 mb-4">
                Schedule
            </CardTitle>
            <CardContent className="flex flex-row items-start justify-between">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                />
                <div className="ml-4 flex-grow">
                    {plans && (
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300">
                            {plans}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}