

// views/plans/WeekendDetailView.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeekend } from '../../context/WeekendContext';

export default function WeekendDetailView() {
  const { 
    selectedWeekend,
    events,
    editingEvent,
    setEditingEvent,
    updateEventTitle,
    deleteEvent,
    newEvent,
    setNewEvent,
    addEvent,
    formatDate
  } = useWeekend();
  
  if (!selectedWeekend) return <div className="p-6">No weekend selected</div>;
  
  const wEvents = events[selectedWeekend.id] || [];
  
  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <h2 className="mb-6 text-xl font-semibold text-primary">
        {formatDate(selectedWeekend.dates.saturday)} – {formatDate(selectedWeekend.dates.sunday)}
      </h2>
      <AnimatePresence initial={false}>
        {wEvents.length > 0 ? (
          wEvents.map((ev) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <Card className="mb-4">
                <CardContent className="space-y-2 p-4">
                  <span className={`inline-block rounded px-2 py-1 text-xs text-white ${
                    ev.type === 'holiday' ? 'bg-pink-500' : 'bg-blue-500'
                  }`}>
                    {ev.type === 'holiday' ? 'Holiday' : 'Event'}
                  </span>
                  {editingEvent === ev.id ? (
                    <Input
                      value={ev.title}
                      onChange={(e) => updateEventTitle(selectedWeekend.id, ev.id, e.target.value)}
                      onBlur={() => setEditingEvent(null)}
                      autoFocus
                    />
                  ) : (
                    <h4 className="font-medium text-gray-900">{ev.title}</h4>
                  )}
                  {ev.notes && <p className="text-sm text-gray-600">{ev.notes}</p>}
                  <div className="flex gap-2 pt-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditingEvent(ev.id)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteEvent(selectedWeekend.id, ev.id)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <p className="mb-6 text-gray-500">No plans yet.</p>
        )}
      </AnimatePresence>
      {/* add new plan */}
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
            onClick={() => addEvent(selectedWeekend.id)}
          >
            Add Plan
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}