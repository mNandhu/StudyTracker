import React from 'react'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'

export default function StudyTips() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Study Tips</CardTitle>
            </CardHeader>
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