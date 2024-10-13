import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RightSidebar() {
  return (
    <aside className="w-64 bg-background p-4 border-l">
      <Card>
        <CardHeader>
          <CardTitle>Study Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            <li>Take regular breaks</li>
            <li>Stay hydrated</li>
            <li>Use active recall techniques</li>
          </ul>
        </CardContent>
      </Card>
    </aside>
  )
}