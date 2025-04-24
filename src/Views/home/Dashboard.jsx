import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useWeekend, getMonthsInOrder, getYearForMonth } from '../../context/WeekendContext';

export default function Dashboard({ onNavigate }) {
  const { 
    getWeekendsByMonth, 
    getWeekendStatus, 
    events, 
    currentYear,
    formatDate 
  } = useWeekend();
  
  const { orderedMonths, orderedMonthIndices } = getMonthsInOrder();
  
  // Group months by year for the home view
  const groupMonthsByYear = () => {
    const result = {};
    orderedMonthIndices.forEach((m, i) => {
      const year = getYearForMonth(m, currentYear);
      if (!result[year]) result[year] = [];
      result[year].push({ monthIndex: m, monthName: orderedMonths[i] });
    });
    return result;
  };
  
  const monthsByYear = groupMonthsByYear();
  
  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <h2 className="mb-6 text-xl font-semibold text-primary">Holiday Calendar Overview</h2>
      
      {Object.entries(monthsByYear).map(([year, months]) => (
        <div key={year} className="mb-8">
          <h3 className="mb-3 text-lg font-medium text-gray-700">{year}</h3>
          <div className="grid grid-cols-3 gap-4">
            {months.slice(0, 6).map(({ monthIndex, monthName }) => {
              const monthWeekends = getWeekendsByMonth(monthIndex);
              return (
                <Card
                  key={monthIndex}
                  className="cursor-pointer transition hover:shadow-md"
                  onClick={() => {
                    onNavigate('plans', 'month');
                  }}
                >
                  <CardContent className="p-4">
                    <div className="mb-2 text-center">
                      <p className="font-medium text-gray-900">{monthName}</p>
                    </div>
                    {monthWeekends.length > 0 ? (
                      <div className="flex justify-center">
                        <div className="grid grid-cols-5 gap-1 w-4/5">
                          {monthWeekends.map(weekend => {
                            const status = getWeekendStatus(weekend);
                            let dotColor = "";
                            
                            // Assign colors based on weekend status
                            if (status === 'busy') dotColor = "bg-pink-500";
                            else if (status === 'partial') dotColor = "bg-purple-400";
                            else dotColor = "bg-white border border-gray-300"; // free
                            
                            return (
                              <div
                                key={weekend.id}
                                className={`h-2 w-2 rounded-full ${dotColor}`}
                                title={`${formatDate(weekend.dates.saturday)} - ${formatDate(weekend.dates.sunday)}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-xs text-gray-500">No weekends</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Quick Statistics Card */}
      <Card className="mt-8">
        <CardContent className="p-4">
          <h3 className="mb-3 font-medium text-gray-900">Your Weekend Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                {Object.values(events).reduce((acc, curr) => 
                  acc + curr.filter(e => e.type === 'holiday').length, 0)}
              </p>
              <p className="text-xs text-gray-600">Planned Holidays</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-500">
                {Object.values(events).reduce((acc, curr) => 
                  acc + curr.filter(e => e.type === 'event').length, 0)}
              </p>
              <p className="text-xs text-gray-600">Planned Events</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Legend for dots */}
      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-pink-500"></div>
          <span>Holiday</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-purple-400"></div>
          <span>Partial Holiday</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-white border border-gray-300"></div>
          <span>Free</span>
        </div>
      </div>
    </motion.div>
  );
}