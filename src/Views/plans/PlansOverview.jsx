// views/plans/PlansOverview.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useWeekend, getMonthsInOrder, getYearForMonth } from '../../context/WeekendContext';

export default function PlansOverview({ onNavigate }) {
  const { 
    getWeekendsByMonth,
    hasHolidays,
    getHolidayTitle,
    getRegularEventCount,
    setSelectedWeekend,
    setSelectedMonth,
    setCurrentYear,
    currentYear
  } = useWeekend();
  
  const { orderedMonths, orderedMonthIndices } = getMonthsInOrder();
  
  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <h2 className="mb-6 text-xl font-semibold text-primary">12-Month Weekend Overview</h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {orderedMonthIndices.map((m, i) => {
          const monthWeekends = getWeekendsByMonth(m);
          const displayYear = getYearForMonth(m, currentYear);
          return (
            <Card key={m} className="overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="bg-primary/90 p-2 text-white cursor-pointer"
                  onClick={() => {
                    setSelectedMonth(m);
                    setCurrentYear(displayYear);
                    onNavigate('month');
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
                      const hasHoliday = hasHolidays(w.id);
                      const holidayTitle = getHolidayTitle(w.id);
                      const eventCount = getRegularEventCount(w.id);
                      
                      // Determine dot color based on event types
                      let dotColor = "";
                      if (hasHoliday) {
                        dotColor = "bg-pink-500"; // Holiday present
                      } else if (eventCount > 0) {
                        dotColor = "bg-blue-500"; // Only regular events
                      } else {
                        dotColor = "bg-white border border-gray-300"; // Free
                      }
                      
                      return (
                        <div
                          key={w.id}
                          className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition hover:bg-gray-100"
                          onClick={() => {
                            setSelectedWeekend(w);
                            setSelectedMonth(m);
                            setCurrentYear(displayYear);
                            onNavigate('weekend');
                          }}
                        >
                          <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                          <span className="text-sm">
                            {w.dates.saturday.getDate()}–{w.dates.sunday.getDate()}
                          </span>
                          <span className="ml-auto text-xs text-gray-600">
                            {holidayTitle ? holidayTitle : eventCount > 0 ? `${eventCount} event${eventCount > 1 ? 's' : ''}` : ''}
                          </span>
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
    </motion.div>
  );
}

