import React from 'react'
import TasksFull from "@/components/tasks-full";

export default function AssistantPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Page for Tasks</h1>
            <TasksFull/>
        </div>
    )
}