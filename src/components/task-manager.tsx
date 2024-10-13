'use client'

import React, {useState} from 'react'
import {Card, CardContent, CardTitle} from '@/components/ui/card'
import {Checkbox} from '@/components/ui/checkbox'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'

export default function TaskManager() {
    const [tasks, setTasks] = useState<Array<{ id: number; text: string; completed: boolean }>>([])
    const [newTask, setNewTask] = useState('')

    const addTask = () => {
        if (newTask.trim()) {
            setTasks([...tasks, {id: Date.now(), text: newTask, completed: false}])
            setNewTask('')
        }
    }

    const toggleTask = (id: number) => {
        setTasks(tasks.map(task =>
            task.id === id ? {...task, completed: !task.completed} : task
        ))
    }

    return (
        <Card className="rounded-xl overflow-hidden">
            {/*<CardHeader>*/}
                <CardTitle className="bg-blue-100 dark:bg-gray-800 dark:text-blue-100
                text-lg font-semibold p-3 mb-4">Tasks</CardTitle>
            {/*</CardHeader>*/}
            <CardContent>
                <ul className="space-y-2">
                    {tasks.map(task => (
                        <li key={task.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`task-${task.id}`}
                                checked={task.completed}
                                onCheckedChange={() => toggleTask(task.id)}
                            />
                            <label
                                htmlFor={`task-${task.id}`}
                                className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                            >
                                {task.text}
                            </label>
                        </li>
                    ))}
                </ul>
                <div className="flex space-x-2 mt-4">
                    <Input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add a new task"
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                        className={"rounded-xl"}
                    />
                    <Button onClick={addTask}>Add</Button>
                </div>
            </CardContent>
        </Card>
    )
}