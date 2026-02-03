"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Activity,
  Clock,
  User,
  Filter
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

export interface ActivityEntry {
  id: string
  action: string
  entity: string
  entityId: string
  user: string
  timestamp: string
  details?: string
}

interface ActivityLogProps {
  activities: ActivityEntry[]
  title?: string
  showFilter?: boolean
  maxHeight?: string
}

export function ActivityLog({ 
  activities, 
  title = "سجل النشاط",
  showFilter = true,
  maxHeight = "400px"
}: ActivityLogProps) {
  const [filter, setFilter] = useState<string>("all")

  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(a => a.entity === filter)

  const entities = [...new Set(activities.map(a => a.entity))]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          {title}
        </CardTitle>
        {showFilter && entities.length > 1 && (
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 ml-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {entities.map(entity => (
                <SelectItem key={entity} value={entity}>
                  {entity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea style={{ maxHeight }} className="pl-4">
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start gap-3 pb-4 border-b border-border last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    {" "}
                    <span className="text-muted-foreground">{activity.action}</span>
                    {" "}
                    <Badge variant="secondary" className="text-xs">
                      {activity.entity} #{activity.entityId}
                    </Badge>
                  </p>
                  {activity.details && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.details}
                    </p>
                  )}
                  <time className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3" />
                    {activity.timestamp}
                  </time>
                </div>
              </div>
            ))}

            {filteredActivities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                لا يوجد نشاط لعرضه
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Sample activity data
export const sampleActivities: ActivityEntry[] = [
  {
    id: "1",
    action: "أنشأ طلب جديد",
    entity: "طلب",
    entityId: "1001",
    user: "أحمد محمد",
    timestamp: "منذ 5 دقائق"
  },
  {
    id: "2",
    action: "غيّر حالة الطلب إلى 'مع التوصيل'",
    entity: "طلب",
    entityId: "998",
    user: "خالد علي",
    timestamp: "منذ 15 دقيقة"
  },
  {
    id: "3",
    action: "أضاف عميل جديد",
    entity: "عميل",
    entityId: "150",
    user: "أحمد محمد",
    timestamp: "منذ ساعة",
    details: "عميل: فهد السالم - الرياض"
  },
  {
    id: "4",
    action: "عدّل سعر المنتج",
    entity: "منتج",
    entityId: "25",
    user: "خالد علي",
    timestamp: "منذ ساعتين",
    details: "تم تغيير السعر من 150 إلى 175 ر.س"
  },
  {
    id: "5",
    action: "سجّل إرجاع",
    entity: "طلب",
    entityId: "995",
    user: "أحمد محمد",
    timestamp: "منذ 3 ساعات",
    details: "السبب: رفض العميل الاستلام"
  }
]
