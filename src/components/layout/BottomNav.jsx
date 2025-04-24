import React from 'react';
import { Home, Calendar, User } from 'lucide-react';

export default function BottomNav({ activeView, onChange }) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t bg-white p-3 shadow-lg">
      <div className="flex items-center justify-between px-6">
        <button 
          onClick={() => onChange('home')}
          className={`flex flex-col items-center ${activeView === 'home' ? 'text-primary' : 'text-gray-500'}`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button 
          onClick={() => onChange('plans')}
          className={`flex flex-col items-center ${activeView === 'plans' ? 'text-primary' : 'text-gray-500'}`}
        >
          <Calendar size={20} />
          <span className="text-xs mt-1">Plans</span>
        </button>
        <button 
          onClick={() => onChange('profile')}
          className={`flex flex-col items-center ${activeView === 'profile' ? 'text-primary' : 'text-gray-500'}`}
        >
          <User size={20} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </footer>
  );
}