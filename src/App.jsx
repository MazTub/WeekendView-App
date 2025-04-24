/*  WeekendPlannerApp.jsx  – modern “Emma” styling, Tailwind v3  */

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  List,
  Grid,
  Home,
  Edit2,
  Pencil,
  Trash2,
  Plus,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

// -----------------------------------------------------------------------------
// Emma‑style colour palette — add this to tailwind.config.cjs and restart Vite
// theme: {
//   extend: {
//     colors: {
//       primary: '#5C6AC4',   // Indigo
//       secondary: '#EFF4FF', // Light indigo background
//       accent: '#F472B6',    // Pink accent
//     },
//   },
// },
// -----------------------------------------------------------------------------

/* ─────────────────────────────────  utilities  ─────────────────────────────── */

// Get all weekends in the next 12 months
const getNextYearWeekends = () => {
  const weekends = [];
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 12);

  const currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() + ((6 - currentDate.getDay() + 7) % 7)); // first Saturday

  while (currentDate < endDate) {
    const saturday = new Date(currentDate);
    const sunday = new Date(currentDate);
    sunday.setDate(sunday.getDate() + 1);

    const saturdayMonth = saturday.getMonth();
    const sundayMonth = sunday.getMonth();

    weekends.push({
      id: weekends.length,
      dates: { saturday, sunday },
      month: saturdayMonth,
      splitMonth: saturdayMonth !== sundayMonth,
      events: [],
    });

    currentDate.setDate(currentDate.getDate() + 7); // next Saturday
  }
  return weekends;
};

// Sample seed data
const generateSampleEvents = (weekends) => {
  const sampleEvents = {};
  const eventTypes = ['holiday', 'event'];
  const titles = [
    ['Beach Trip', 'Mountain Retreat', 'City Break', 'Family Visit', 'Staycation'],
    ['Wedding', 'Birthday Party', 'Conference', 'Concert', 'Dinner', 'Sports Event'],
  ];
  const notesArr = [
    'All‑day',
    'Morning only',
    'Evening only',
    'Need to confirm',
    'Tickets booked',
  ];

  const weekendsToFill = Math.floor(weekends.length / 2);
  const pick = new Set();
  while (pick.size < weekendsToFill) pick.add(Math.floor(Math.random() * weekends.length));

  pick.forEach((id) => {
    sampleEvents[id] = [];
    const n = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < n; i++) {
      const ti = Math.floor(Math.random() * 2);
      sampleEvents[id].push({
        id: `${id}-${i}`,
        title: titles[ti][Math.floor(Math.random() * titles[ti].length)],
        type: eventTypes[ti],
        notes: Math.random() > 0.5 ? notesArr[Math.floor(Math.random() * notesArr.length)] : '',
      });
    }
  });
  return sampleEvents;
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const getMonthsInOrder = () => {
  const now = new Date().getMonth();
  const orderedMonths = [];
  const indices = [];
  for (let i = 0; i < 12; i++) {
    indices.push((now + i) % 12);
    orderedMonths.push(MONTHS[(now + i) % 12]);
  }
  return { orderedMonths, orderedMonthIndices: indices };
};

/* ─────────────────────────────  Main component  ───────────────────────────── */

export default function WeekendPlannerApp() {
  const [weekends, setWeekends] = useState([]);
  const [events, setEvents] = useState({});
  const [view, setView] = useState('home');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeekend, setSelectedWeekend] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: '', type: 'event', notes: '' });
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [editingEvent, setEditingEvent] = useState(null);
  const { orderedMonths, orderedMonthIndices } = getMonthsInOrder();

  /* ───── populate sample data on mount ───── */
  useEffect(() => {
    const gen = getNextYearWeekends();
    setWeekends(gen);
    setEvents(generateSampleEvents(gen));
  }, []);

  /* ───────────────  helpers  ─────────────── */
  const addEvent = (weekendId) => {
    if (!newEvent.title) return;
    setEvents((prev) => ({
      ...prev,
      [weekendId]: [...(prev[weekendId] || []), { id: Date.now(), ...newEvent }],
    }));
    setNewEvent({ title: '', type: 'event', notes: '' });
  };

  const updateEventTitle = (weekendId, eventId, title) => {
    setEvents((prev) => {
      const updated = { ...prev };
      const idx = updated[weekendId].findIndex((e) => e.id === eventId);
      if (idx !== -1) updated[weekendId][idx].title = title;
      return updated;
    });
    setEditingEvent(null);
  };

  const deleteEvent = (weekendId, eventId) => {
    setEvents((prev) => ({
      ...prev,
      [weekendId]: prev[weekendId].filter((e) => e.id !== eventId),
    }));
  };

  const getWeekendsByMonth = (month) =>
    weekends.filter((w) => (w.splitMonth ? w.month === month : w.month === month || w.dates.sunday.getMonth() === month));

  const formatDate = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  const hasEvents = (id) => events[id] && events[id].length > 0;
  const getBusyWeekendsCount = (m) => getWeekendsByMonth(m).filter((w) => hasEvents(w.id)).length;
  const getEventColor = (t) => (t === 'holiday' ? 'bg-blue-500' : 'bg-green-500');
  const getYearForMonth = (idx) => (idx < new Date().getMonth() ? currentYear + 1 : currentYear);

  const navigateMonth = (dir) => {
    let m = selectedMonth + dir;
    let yChange = 0;
    if (m > 11) {
      m = 0;
      yChange = 1;
    } else if (m < 0) {
      m = 11;
      yChange = -1;
    }
    setSelectedMonth(m);
    setCurrentYear((y) => y + yChange);
  };

  /* ─────────────────────────  Views  ───────────────────────── */

  const HomeView = () => (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-semibold text-primary">Weekend Availability Overview</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {orderedMonthIndices.map((m, i) => {
          const busy = getBusyWeekendsCount(m);
          const total = getWeekendsByMonth(m).length;
          const rate = total === 0 ? 0 : busy / total;
          const color =
            total === 0
              ? 'bg-gray-200'
              : rate === 0
              ? 'bg-green-400'
              : rate < 0.5
              ? 'bg-green-200'
              : rate < 1
              ? 'bg-yellow-200'
              : 'bg-red-200';
          const displayYear = getYearForMonth(m);
          return (
            <Card
              key={m}
              className={`cursor-pointer transition hover:shadow-md ${color}`}
              onClick={() => {
                setSelectedMonth(m);
                setCurrentYear(displayYear);
                setView('year');
              }}
            >
              <CardContent className="flex h-24 flex-col items-center justify-center gap-1 p-3 text-center">
                <p className="text-sm font-medium text-gray-900">{orderedMonths[i]}</p>
                <p className="text-xs text-gray-600">{displayYear}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const YearView = () => (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-primary">12‑Month Weekend Overview</h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {orderedMonthIndices.map((m, i) => {
          const monthWeekends = getWeekendsByMonth(m);
          const displayYear = getYearForMonth(m);
          return (
            <Card key={m} className="overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="bg-primary/90 p-2 text-white cursor-pointer"
                  onClick={() => {
                    setSelectedMonth(m);
                    setCurrentYear(displayYear);
                    setView('month');
                  }}
                >
                  <h3 className="font-medium text-sm text-center">
                    {orderedMonths[i]} {displayYear}
                  </h3>
                </div>
                <div className="space-y-2 p-3">
                  {monthWeekends.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">No weekends</p>
                  ) : (
                    monthWeekends.map((w) => {
                      const busy = hasEvents(w.id);
                      return (
                        <div
                          key={w.id}
                          className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition hover:bg-secondary"
                          onClick={() => {
                            setSelectedWeekend(w);
                            setView('weekend');
                            setSelectedMonth(m);
                            setCurrentYear(displayYear);
                          }}
                        >
                          <span
                            className={`h-3 w-3 rounded-full ${busy ? 'bg-red-500' : 'bg-green-500'}`}
                          />
                          <span className="text-sm">
                            {w.dates.saturday.getDate()}–{w.dates.sunday.getDate()}
                          </span>
                          {busy && (
                            <span className="ml-auto text-xs text-gray-500">
                              {events[w.id].length} plan{events[w.id].length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const MonthView = () => {
    const mWeekends = getWeekendsByMonth(selectedMonth);
    return (
      <div className="p-6">
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
                      setView('weekend');
                    }}
                  >
                    {formatDate(w.dates.saturday)} – {formatDate(w.dates.sunday)}
                  </h3>
                  {hasEvents(w.id) ? (
                    events[w.id].map((ev) => (
                      <div
                        key={ev.id}
                        className={`flex items-center justify-between rounded px-2 py-1 text-sm text-white ${getEventColor(ev.type)}`}
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
      </div>
    );
  };

  const WeekendDetailView = () => {
    if (!selectedWeekend) return null;
    const wEvents = events[selectedWeekend.id] || [];
    return (
      <div className="p-6">
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
                    <span className={`inline-block rounded px-2 py-1 text-xs text-white ${getEventColor(ev.type)}`}>
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
                className={newEvent.type === 'event' ? 'bg-green-500 text-white' : 'bg-gray-200'}
                onClick={() => setNewEvent({ ...newEvent, type: 'event' })}
              >
                Event
              </Button>
              <Button
                className={newEvent.type === 'holiday' ? 'bg-blue-500 text-white' : 'bg-gray-200'}
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
      </div>
    );
  };

  /* ─────────────────────────────  layout  ───────────────────────────── */

  return (
    <div className="min-h-screen bg-secondary">
      <header className="flex items-center justify-between bg-primary px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h1 className="text-lg font-semibold">WeekendView</h1>
        </div>
        <div className="flex gap-1">
          <Button
            variant={view === 'home' ? 'outline' : 'ghost'}
            size="icon"
            onClick={() => setView('home')}
          >
            <Home size={20} />
          </Button>
          <Button
            variant={view === 'year' ? 'outline' : 'ghost'}
            size="icon"
            onClick={() => setView('year')}
          >
            <Grid size={20} />
          </Button>
          <Button
            variant={view === 'month' ? 'outline' : 'ghost'}
            size="icon"
            onClick={() => setView('month')}
          >
            <Calendar size={20} />
          </Button>
          {selectedWeekend && (
            <Button
              variant={view === 'weekend' ? 'outline' : 'ghost'}
              size="icon"
              onClick={() => setView('weekend')}
            >
              <List size={20} />
            </Button>
          )}
        </div>
      </header>

      <main className="pb-24">
        {view === 'home' && <HomeView />}
        {view === 'year' && <YearView />}
        {view === 'month' && <MonthView />}
        {view === 'weekend' && <WeekendDetailView />}
      </main>

      {/* sticky footer navigation */}
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-white p-3 text-center text-sm text-gray-500">
        {view !== 'home' && (
          <button
            className="mx-auto flex items-center text-primary"
            onClick={() => setView(view === 'weekend' ? 'month' : view === 'month' ? 'year' : 'home')}
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to {view === 'weekend' ? 'Month' : view === 'month' ? 'Year' : 'Home'} View
          </button>
        )}
      </footer>
    </div>
  );
}
