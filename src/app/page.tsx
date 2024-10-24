import AIAssistant from '@/components/ai-assistant'
import CalendarWidget from '@/components/calendar-widget'
import TasksDashboard from "@/components/tasks-dashboard";
import ScheduleWidget from '@/components/schedule-widget'

export default function Home() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3">

                <div className="lg:col-span-2 space-y-6 w-fit">
                    <div className="bg-card  p-6">
                        <TasksDashboard/>
                    </div>
                    <div className={"bg-card  p-6"}>
                        <CalendarWidget mode="dashboard"/>

                    </div>
                </div>
                <div className="lg:col-span-1 space-y-6 w-full">
                    <div className="bg-card   p-6 w-fit">
                        <AIAssistant/>
                    </div>
                    <div className="bg-card   p-6 w-fit">
                        <ScheduleWidget/>
                    </div>
                </div>
            </div>
        </div>
    )
}

//TODO: Implement Widget for Daily Schedule