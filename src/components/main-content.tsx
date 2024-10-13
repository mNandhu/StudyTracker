import React from 'react'
import {Card, CardContent} from '@/components/ui/card'

export default function MainContent({children}: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1 md:col-span-2">
                <CardContent>{children}</CardContent>
            </Card>
        </div>
    )
}