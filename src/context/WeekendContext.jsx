import React, { createContext, useContext, useState, useEffect } from 'react';

// Helper functions
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
    ['Beach Trip', 'Mountain Retreat', 'Amsterdam', 'Family Visit', 'Paris'],
    ['Wedding', 'Birthday Party', 'Conference', 'Concert', 'Dinner', 'Sports Event'],
  ];
  const notesArr = [
    'All-day',
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

// Create context
const WeekendContext = createContext();

export function WeekendProvider({ children }) {
  const [weekends, setWeekends] = useState([]);
  const [events, setEvents] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeekend, setSelectedWeekend] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [newEvent, setNewEvent] = useState({ title: '', type: 'event', notes: '' });
  const [editingEvent, setEditingEvent] = useState(null);
  
  // Initialize data
  useEffect(() => {
    const generatedWeekends = getNextYearWeekends();
    setWeekends(generatedWeekends);
    setEvents(generateSampleEvents(generatedWeekends));
  }, []);
  
  // Event handlers
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
  
  // Helper functions
  const hasEvents = (id) => events[id] && events[id].length > 0;
  const hasHolidays = (id) => events[id] && events[id].some(e => e.type === 'holiday');
  const hasRegularEvents = (id) => events[id] && events[id].some(e => e.type === 'event');
  
  const getHolidayTitle = (id) => {
    if (!events[id]) return null;
    const holiday = events[id].find(e => e.type === 'holiday');
    return holiday ? holiday.title : null;
  };
  
  const getRegularEventCount = (id) => {
    if (!events[id]) return 0;
    return events[id].filter(e => e.type === 'event').length;
  };
  
  const getWeekendStatus = (weekend) => {
    const eventsList = events[weekend.id] || [];
    const holidays = eventsList.filter(e => e.type === 'holiday');
    
    if (holidays.length === 0) return 'free';
    if (holidays.some(e => e.notes && (e.notes.includes('Morning') || e.notes.includes('Evening')))) {
      return 'partial';
    }
    return 'busy';
  };
  
  return (
    <WeekendContext.Provider
      value={{
        weekends,
        events,
        selectedMonth,
        setSelectedMonth,
        selectedWeekend,
        setSelectedWeekend,
        currentYear,
        setCurrentYear,
        newEvent,
        setNewEvent,
        editingEvent,
        setEditingEvent,
        addEvent,
        updateEventTitle,
        deleteEvent,
        getWeekendsByMonth,
        navigateMonth,
        hasEvents,
        hasHolidays,
        hasRegularEvents,
        getHolidayTitle,
        getRegularEventCount,
        getWeekendStatus
      }}
    >
      {children}
    </WeekendContext.Provider>
  );
}

// Custom hook for using the context
export function useWeekend() {
  const context = useContext(WeekendContext);
  if (context === undefined) {
    throw new Error('useWeekend must be used within a WeekendProvider');
  }
  return context;
}

// Constants
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function getMonthsInOrder() {
  const now = new Date().getMonth();
  const orderedMonths = [];
  const indices = [];
  for (let i = 0; i < 12; i++) {
    indices.push((now + i) % 12);
    orderedMonths.push(MONTHS[(now + i) % 12]);
  }
  return { orderedMonths, orderedMonthIndices: indices };
}

export function getYearForMonth(idx, currentYear) {
  return (idx < new Date().getMonth() ? currentYear + 1 : currentYear);
}

export function formatDate(date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}