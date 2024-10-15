'use client';

import React from 'react'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Progress} from '@/components/ui/progress'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

const data = [
    {name: 'Mon', hours: 2},
    {name: 'Tue', hours: 3},
    {name: 'Wed', hours: 4},
    {name: 'Thu', hours: 3},
    {name: 'Fri', hours: 5},
    {name: 'Sat', hours: 2},
    {name: 'Sun', hours: 1},
]

export default function ProductivityDashboard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Productivity Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Weekly Goal Progress</h3>
                        <Progress value={75} className="w-full [&>*]:bg-green-600 dark:[&>*]:bg-green-400"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium mb-2">Study Hours</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Line type="monotone" dataKey="hours" stroke="#8884d8"/>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}