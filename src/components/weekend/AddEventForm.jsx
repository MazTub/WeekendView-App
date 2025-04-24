// components/weekend/AddEventForm.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWeekend } from '../../context/WeekendContext';

export default function AddEventForm({ weekendId }) {
  const { newEvent, setNewEvent, addEvent } = useWeekend();
  
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <h3 className="font-medium text-gray-900">Add New Plan</h3>
        <Input
          placeholder="Event title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <div className="flex gap-2">
          <Button
            className={newEvent.type === 'event' ? 'bg-blue-500 text-white' : 'bg-gray-200'}
            onClick={() => setNewEvent({ ...newEvent, type: 'event' })}
          >
            Event
          </Button>
          <Button
            className={newEvent.type === 'holiday' ? 'bg-pink-500 text-white' : 'bg-gray-200'}
            onClick={() => setNewEvent({ ...newEvent, type: 'holiday' })}
          >
            Holiday
          </Button>
        </div>
        <textarea
          className="w-full rounded border p-2"
          placeholder="Notes (optional)"
          rows={3}
          value={newEvent.notes}
          onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
        />
        <Button
          className="w-full bg-primary text-white hover:bg-primary/90"
          disabled={!newEvent.title}
          onClick={() => addEvent(weekendId)}
        >
          Add Plan
        </Button>
      </CardContent>
    </Card>
  );
}