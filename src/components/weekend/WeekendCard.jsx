// components/weekend/WeekendCard.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeekend } from '../../context/WeekendContext';

export default function WeekendCard({ weekend, onClick }) {
  const { formatDate, hasEvents, events, editingEvent, setEditingEvent, updateEventTitle, deleteEvent } = useWeekend();
  
  return (
    <Card className="hover:shadow-md">
      <CardContent className="space-y-3 p-4">
        <h3
          className="cursor-pointer font-medium text-gray-900"
          onClick={onClick}
        >
          {formatDate(weekend.dates.saturday)} – {formatDate(weekend.dates.sunday)}
        </h3>
        {hasEvents(weekend.id) ? (
          events[weekend.id].map((ev) => (
            <div
              key={ev.id}
              className={`flex items-center justify-between rounded px-2 py-1 text-sm text-white ${
                ev.type === 'holiday' ? 'bg-pink-500' : 'bg-blue-500'
              }`}
            >
              {editingEvent === ev.id ? (
                <input
                  className="w-full bg-transparent outline-none"
                  value={ev.title}
                  onChange={(e) => updateEventTitle(weekend.id, ev.id, e.target.value)}
                  onBlur={() => setEditingEvent(null)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingEvent(null)}
                  autoFocus
                />
              ) : (
                <span>{ev.title}</span>
              )}
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setEditingEvent(ev.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteEvent(weekend.id, ev.id)}>
                  <Trash2 className="h-4 w-4 text-red-200" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Free weekend</p>
        )}
      </CardContent>
    </Card>
  );
}
