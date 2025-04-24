// views/profile/ProfileView.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { User, Settings, Bell, Calendar, Info } from 'lucide-react';
import { useWeekend } from '../../context/WeekendContext';

export default function ProfileView() {
  const { events } = useWeekend();
  
  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex flex-col items-center mb-8">
        <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <User size={48} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold">User Profile</h2>
        <p className="text-gray-600">user@example.com</p>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-4">Account Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {Object.values(events).reduce((acc, curr) => acc + curr.length, 0)}
              </p>
              <p className="text-xs text-gray-600">Total Plans</p>
            </div>
            <div className="bg-pink-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-pink-600">
                {Object.values(events).reduce((acc, curr) => 
                  acc + curr.filter(e => e.type === 'holiday').length, 0)}
              </p>
              <p className="text-xs text-gray-600">Holidays</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <div className="border-b p-4">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-gray-500 mr-3" />
              <span className="font-medium">Account Settings</span>
            </div>
          </div>
          <div className="border-b p-4">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-gray-500 mr-3" />
              <span className="font-medium">Notifications</span>
            </div>
          </div>
          <div className="border-b p-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-3" />
              <span className="font-medium">Calendar Preferences</span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-gray-500 mr-3" />
              <span className="font-medium">About WeekendView</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}