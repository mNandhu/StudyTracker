'use client'

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Search, Bell, Edit, Calendar as CalendarIcon, Plus, ClipboardList } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'

const CATEGORIES = ['Homework', 'Project', 'Revision']
const PRIORITIES = ['Low', 'Medium', 'High']

interface Task {
  id: number
  completed: boolean
  title: string
  description: string
  category: string
  dueDate: Date
  priority: string
  progress: number
}

interface TaskManagerProps {
  mode: 'landscape' | 'portrait'
}

export default function TaskManager({ mode }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'Homework',
    dueDate: new Date(),
    priority: 'Medium',
    progress: 0
  })
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const addTask = useCallback(() => {
    if (newTask.title.trim() && newTask.description.trim()) {
      const task: Task = { ...newTask, id: Date.now(), completed: false }
      setTasks([...tasks, task])
      setNewTask({ title: '', description: '', category: 'Homework', dueDate: new Date(), priority: 'Medium', progress: 0 })
    }
  }, [newTask, tasks])

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const startEditing = (task: Task) => {
    setEditingTask({ ...task })
  }

  const saveEdit = () => {
    if (editingTask) {
      setTasks(tasks.map(task =>
        task.id === editingTask.id ? editingTask : task
      ))
      setEditingTask(null)
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    if (filter === 'overdue') return new Date(task.dueDate) < new Date() && !task.completed
    return true
  }).filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const taskStats = {
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed && new Date(task.dueDate) >= new Date()).length,
    overdue: tasks.filter(task => !task.completed && new Date(task.dueDate) < new Date()).length,
  }

  const pieData = [
    { name: 'Completed', value: taskStats.completed, color: '#4CAF50' },
    { name: 'Pending', value: taskStats.pending, color: '#FFC107' },
    { name: 'Overdue', value: taskStats.overdue, color: '#F44336' },
  ].filter(item => item.value > 0)

  const renderTaskStatistics = () => {
    if (pieData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <ClipboardList className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">Great! You don't have anything to do.</p>
        </div>
      )
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={60}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  const content = (
    <>
      <div className="flex space-x-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks"
            className="pl-10 rounded-xl"
          />
        </div>
        <Select onValueChange={setFilter} value={filter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tasks</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={`grid ${mode === 'landscape' ? 'grid-cols-2' : 'grid-cols-1'} gap-4 mb-4`}>
        <Card className="p-4">
          <CardTitle className="text-sm mb-2">Task Statistics</CardTitle>
          <div className="h-48">
            {renderTaskStatistics()}
          </div>
        </Card>

        <Card className="p-4">
          <CardTitle className="text-sm mb-2">Add New Task</CardTitle>
          <div className="space-y-2">
            <Input
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Task title"
              className="rounded-xl"
            />
            <Input
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Task description"
              className="rounded-xl"
            />
            <div className="flex space-x-2">
              <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {PRIORITIES.map(priority => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(new Date(newTask.dueDate), 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(newTask.dueDate)}
                  onSelect={(date) => date && setNewTask({ ...newTask, dueDate: date })}
                  initialFocus
                  className="bg-popover"
                />
              </PopoverContent>
            </Popover>
            <Button onClick={addTask} className="w-full">Add Task</Button>
          </div>
        </Card>
      </div>

      <ScrollArea className="h-[300px] rounded-md border p-4">
        <ul className="space-y-4">
          {filteredTasks.map(task => (
            <li key={task.id} className="flex items-start space-x-2 p-2 rounded-lg bg-secondary/10">
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-1"
              />
              <div className="flex-1">
                {editingTask && editingTask.id === task.id ? (
                  <div className="space-y-2">
                    <Label htmlFor={`edit-title-${task.id}`}>Task Title</Label>
                    <Input
                      id={`edit-title-${task.id}`}
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    />
                    <Label htmlFor={`edit-description-${task.id}`}>Task Description</Label>
                    <Input
                      id={`edit-description-${task.id}`}
                      value={editingTask.description}
                      onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    />
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <Label htmlFor={`edit-category-${task.id}`}>Category</Label>
                        <Select
                          value={editingTask.category}
                          onValueChange={(value) => setEditingTask({ ...editingTask, category: value })}
                        >
                          <SelectTrigger id={`edit-category-${task.id}`}>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            {CATEGORIES.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`edit-priority-${task.id}`}>Priority</Label>
                        <Select
                          value={editingTask.priority}
                          onValueChange={(value) => setEditingTask({ ...editingTask, priority: value })}
                        >
                          <SelectTrigger id={`edit-priority-${task.id}`}>
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            {PRIORITIES.map(priority => (
                              <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`edit-duedate-${task.id}`}>Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button id={`edit-duedate-${task.id}`} variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(new Date(editingTask.dueDate), 'PPP')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={new Date(editingTask.dueDate)}
                            onSelect={(date) => date && setEditingTask({ ...editingTask, dueDate: date })}
                            initialFocus
                            className="bg-popover"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor={`edit-progress-${task.id}`}>Progress</Label>
                      <Input
                        id={`edit-progress-${task.id}`}
                        type="number"
                        value={editingTask.progress}
                        onChange={(e) => setEditingTask({ ...editingTask, progress: parseInt(e.target.value, 10) })}
                        min="0"
                        max="100"
                      />
                    </div>
                    <Button onClick={saveEdit}>Save</Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={`task-${task.id}`}
                        className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {task.title}
                      </label>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => startEditing(task)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className={`text-sm mt-1  ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.description}
                    </p>
                    <div className="text-sm text-muted-foreground mt-1">
                      <Badge variant={task.priority === 'High' ? 'destructive' : (task.priority === 'Medium' ? 'secondary' : 'outline')}>
                        {task.priority}
                      </Badge>
                      <span className="ml-2">{task.category}</span>
                      <span className="ml-2">Due: {format(new Date(task.dueDate), 'PP')}</span>
                    </div>
                    <Progress value={task.progress} className="mt-2" />
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </>
  )

  return (
    <Card className="rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/10 dark:bg-primary/20">
        <CardTitle className="text-lg font-semibold">Task Manager</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {content}
      </CardContent>
    </Card>
  )
}