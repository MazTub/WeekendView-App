// components/weekend/EventItem.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeekend } from '../../context/WeekendContext';

export default function EventItem({ event, weekendId }) {
  const { editingEvent, setEditingEvent, updateEventTitle, deleteEvent } = useWeekend();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <Card className="mb-4">
        <CardContent className="space-y-2 p-4">
          <span className={`inline-block rounded px-2 py-1 text-xs text-white ${
            event.type === 'holiday' ? 'bg-pink-500' : 'bg-blue-500'
          }`}>
            {event.type === 'holiday' ? 'Holiday' : 'Event'}
          </span>
          {editingEvent === event.id ? (
            <Input
              value={event.title}
              onChange={(e) => updateEventTitle(weekendId, event.id, e.target.value)}
              onBlur={() => setEditingEvent(null)}
              autoFocus
            />
          ) : (
            <h4 className="font-medium text-gray-900">{event.title}</h4>
          )}
          {event.notes && <p className="text-sm text-gray-600">{event.notes}</p>}
          <div className="flex gap-2 pt-1">
            <Button variant="ghost" size="icon" onClick={() => setEditingEvent(event.id)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => deleteEvent(weekendId, event.id)}>
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}