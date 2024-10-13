import React from 'react'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'

export default function StudyTips() {
    return (
        <Card>

            <CardTitle className="bg-blue-100 dark:bg-gray-800 dark:text-blue-100
                text-lg font-semibold p-3 mb-4">Study Tips</CardTitle>

            <CardContent>
                <ul className="list-disc list-inside space-y-2">
                    <li>Take regular breaks</li>
                    <li>Stay hydrated</li>
                    <li>Use active recall techniques</li>
                </ul>
            </CardContent>
        </Card>
    )
}