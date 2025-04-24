// views/plans/MonthView.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeekend, MONTHS } from '../../context/WeekendContext';

export default function MonthView({ onNavigate }) {
  const { 
    selectedMonth,
    currentYear,
    navigateMonth,
    getWeekendsByMonth,
    hasEvents,
    events,
    editingEvent,
    updateEventTitle,
    deleteEvent,
    setSelectedWeekend,
    formatDate
  } = useWeekend();
  
  const mWeekends = getWeekendsByMonth(selectedMonth);
  
  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
          <ChevronLeft size={20} />
        </Button>
        <h2 className="text-xl font-semibold text-primary">
          {MONTHS[selectedMonth]} {currentYear}
        </h2>
        <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
          <ChevronRight size={20} />
        </Button>
      </div>
      {mWeekends.length === 0 ? (
        <p className="text-gray-600">No weekends this month.</p>
      ) : (
        <div className="space-y-4">
          {mWeekends.map((w) => (
            <Card key={w.id} className="hover:shadow-md">
              <CardContent className="space-y-3 p-4">
                <h3
                  className="cursor-pointer font-medium text-gray-900"
                  onClick={() => {
                    setSelectedWeekend(w);
                    onNavigate('weekend');
                  }}
                >
                  {formatDate(w.dates.saturday)} – {formatDate(w.dates.sunday)}
                </h3>
                {hasEvents(w.id) ? (
                  events[w.id].map((ev) => (
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
                          onChange={(e) => updateEventTitle(w.id, ev.id, e.target.value)}
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
                        <Button variant="ghost" size="icon" onClick={() => deleteEvent(w.id, ev.id)}>
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
          ))}
        </div>
      )}
    </motion.div>
  );
}