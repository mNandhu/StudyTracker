'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Search, Bell, Edit, Calendar as CalendarIcon, Plus, ClipboardList, ChevronDown, ChevronUp, Check, Trash2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ObjectId } from 'mongodb'

interface TaskType {
  name: string
  color: string
}

const INITIAL_TASK_TYPES: TaskType[] = [
  { name: 'Homework', color: '#4CAF50' },
  { name: 'Project', color: '#2196F3' },
  { name: 'Revision', color: '#FFC107' },
]

interface Task {
  _id?: ObjectId
  completed: boolean
  title: string
  description: string
  type: string
  dueDate: Date
  priority: 'Low' | 'Medium' | 'High'
  progress: number
}

export default function TasksFull() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskTypes, setTaskTypes] = useState<TaskType[]>(INITIAL_TASK_TYPES)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'Homework',
    dueDate: new Date(),
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    progress: 0
  })
  const [newTaskType, setNewTaskType] = useState({ name: '', color: '#000000' })
  const [activeTypeFilters, setActiveTypeFilters] = useState<string[]>([])
  const [stateFilter, setStateFilter] = useState<string[]>(['completed', 'pending', 'overdue'])
  const [searchQuery, setSearchQuery] = useState('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [expandedTaskId, setExpandedTaskId] = useState<ObjectId | null>(null)
  const [isAddingNewType, setIsAddingNewType] = useState(false)

  const addTask = useCallback(async () => {
    if (newTask.title.trim() && newTask.description.trim()) {
      try {
        const response = await fetch('/api/db/taskEntries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newTask, completed: false })
        })
        if (!response.ok) throw new Error('Failed to add task')
        const addedTask = await response.json()
        setTasks([...tasks, { ...addedTask, dueDate: new Date(addedTask.dueDate) }])
        setNewTask({ title: '', description: '', type: 'Homework', dueDate: new Date(), priority: 'Medium', progress: 0 })
      } catch (error) {
        console.error('Failed to add task:', error)
      }
    }
  }, [newTask, tasks])

  const addTaskType = useCallback(() => {
    if (newTaskType.name.trim() && newTaskType.color) {
      setTaskTypes([...taskTypes, newTaskType])
      setNewTaskType({ name: '', color: '#000000' })
      setIsAddingNewType(false)
    }
  }, [newTaskType, taskTypes])

  const toggleTask = async (id: ObjectId) => {
    try {
      const taskToToggle = tasks.find(task => task._id === id)
      if (!taskToToggle) return

      const response = await fetch('/api/db/taskEntries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskToToggle, completed: !taskToToggle.completed })
      })
      if (!response.ok) throw new Error('Failed to toggle task')

      setTasks(tasks.map(task =>
        task._id === id ? { ...task, completed: !task.completed } : task
      ))
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  const deleteTask = async (id: ObjectId) => {
    try {
      const response = await fetch('/api/db/taskEntries', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!response.ok) throw new Error('Failed to delete task')

      setTasks(tasks.filter(task => task._id !== id))
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const startEditing = (task: Task) => {
    setEditingTask({ ...task })
  }

  const saveEdit = async () => {
    if (editingTask) {
      try {
        const response = await fetch('/api/db/taskEntries', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingTask)
        })
        if (!response.ok) throw new Error('Failed to update task')

        setTasks(tasks.map(task =>
          task._id === editingTask._id ? editingTask : task
        ))
        setEditingTask(null)
      } catch (error) {
        console.error('Failed to update task:', error)
      }
    }
  }

  const toggleTypeFilter = (typeName: string) => {
    setActiveTypeFilters(prev =>
      prev.includes(typeName)
        ? prev.filter(type => type !== typeName)
        : [...prev, typeName]
    )
  }

  const filteredTasks = tasks.filter(task => {
    const typeMatch = activeTypeFilters.length === 0 || activeTypeFilters.includes(task.type)
    const stateMatch =
      (task.completed && stateFilter.includes('completed')) ||
      (!task.completed && new Date(task.dueDate) >= new Date() && stateFilter.includes('pending')) ||
      (!task.completed && new Date(task.dueDate) < new Date() && stateFilter.includes('overdue'))
    const searchMatch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    return typeMatch && stateMatch && searchMatch
  })

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
      <ResponsiveContainer width="100%" height={200}>
        <PieChart width={550} height={200}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            // innerRadius={0}
            outerRadius={80}
            // paddingAngle={6}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={stateFilter.includes(entry.name.toLowerCase()) ? 1 : 0.3}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            height={36}
            onClick={(data) => {
              const clickedState = data.value.toLowerCase()
              setStateFilter(prev =>
                prev.includes(clickedState)
                  ? prev.filter(state => state !== clickedState)
                  : [...prev, clickedState]
              )
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  const getTaskColor = (task: Task) => {
    const taskType = taskTypes.find(type => type.name === task.type)
    return taskType ? taskType.color : '#000000'
  }

  const renderTask = (task: Task) => {
    const isExpanded = expandedTaskId === task._id
    const taskColor = getTaskColor(task)

    return (
      <Card key={task._id?.toString()} className="mb-4">
        <CardHeader className="p-4 cursor-pointer" onClick={() => setExpandedTaskId(isExpanded ? null : task._id)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: taskColor }}></div>
              <CardTitle className={`text-lg ${task.completed ? 'line-through text-muted-foreground' : ''} break-words`}>
                {task.title}
              </CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Due: {format(new Date(task.dueDate), 'PP')}
              </span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="p-4">
            <p className="text-sm mb-4">{task.description}</p>
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant={task.priority === 'High' ? 'destructive' : (task.priority === 'Medium' ? 'secondary' : 'outline')}>
                {task.priority}
              </Badge>
              <span className="text-sm text-muted-foreground">{task.type}</span>
            </div>
            <Progress value={task.progress} className="mb-4" />
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" size="sm" onClick={() => startEditing(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Remind
              </Button>
              <Button variant="ghost" size="sm" onClick={() => task._id && toggleTask(task._id)}>
                <Check className="h-4 w-4 mr-2" />
                {task.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => task._id && deleteTask(task._id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    )
  }

  const renderTasksByType = () => {
    const tasksByType = taskTypes.reduce((acc, type) => {
      acc[type.name] = filteredTasks.filter(task => task.type === type.name)
      return acc
    }, {} as Record<string, Task[]>)

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(tasksByType).map(([type, tasks]) => (
          <Card key={type} className="mb-6">
            <CardHeader>
              <CardTitle>{type}</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length > 0 ? (
                tasks.map(renderTask)
              ) : (
                <p className="text-muted-foreground">No tasks of this type.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/db/taskEntries')
        if (!response.ok) throw new Error('Failed to fetch tasks')
        const fetchedTasks = await response.json()
        setTasks(fetchedTasks.map((task: Task) => ({
          ...task,
          dueDate: new Date(task.dueDate)
        })))
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      }
    }

    fetchTasks()
  }, [])

  return (
    <Card className="rounded-xl overflow-hidden w-full max-w-7xl mx-auto">
      <CardHeader className="bg-primary/10 dark:bg-primary/20">
        <CardTitle className="text-2xl font-semibold">Task Manager</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex space-x-2 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks"
              className="pl-10 rounded-xl"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
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
                <div className="flex space-x-4">
                  <Select value={newTask.type} onValueChange={(value) => {
                    if (value === 'add_new') {
                      setIsAddingNewType(true)
                    } else {
                      setNewTask({ ...newTask, type: value })
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskTypes.map(type => (
                        <SelectItem key={type.name} value={type.name}>{type.name}</SelectItem>
                      ))}
                      <SelectItem value="add_new">+ Add New Type</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={newTask.priority} onValueChange={(value: 'Low' | 'Medium' | 'High') => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Low', 'Medium', 'High'].map(priority => (
                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {isAddingNewType && (
                  <div className="space-y-4">
                    <Input
                      value={newTaskType.name}
                      onChange={(e) => setNewTaskType({ ...newTaskType, name: e.target.value })}
                      placeholder="New task type name"
                      className="rounded-xl"
                    />
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={newTaskType.color}
                        onChange={(e) => setNewTaskType({ ...newTaskType, color: e.target.value })}
                        className="w-12 h-12 p-1 rounded-md"
                      />
                      <Button onClick={addTaskType} className="flex-grow">Add New Type</Button>
                    </div>
                  </div>
                )}
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
                    />
                  </PopoverContent>
                </Popover>
                <Button onClick={addTask} className="w-full">Add Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2 p-4">
            <CardTitle className="text-lg mb-4">Task Statistics</CardTitle>
            <div className="h-[200px]">
              {renderTaskStatistics()}
            </div>
          </Card>

          <Card className="p-4">
            <CardTitle className="text-lg mb-4">Task Types</CardTitle>
            <div className="space-y-2">
              {taskTypes.map(type => (
                <div
                  key={type.name}
                  className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors ${
                    activeTypeFilters.includes(type.name) ? 'bg-secondary' : 'hover:bg-secondary/50'
                  }`}
                  onClick={() => toggleTypeFilter(type.name)}
                >
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: type.color }}></div>
                  <span>{type.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        {renderTasksByType()}
      </CardContent>
    </Card>
  )
}