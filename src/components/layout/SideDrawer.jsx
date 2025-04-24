import React from 'react';
import { Calendar, ChevronLeft, Settings, LifeBuoy, Info } from 'lucide-react';

export default function SideDrawer({ isOpen, onClose }) {
  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="bg-primary p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">WeekendView</h2>
            </div>
            <button 
              className="rounded-full p-1 hover:bg-white/20"
              onClick={onClose}
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="p-2">
            <button 
              className="w-full flex items-center rounded-md px-3 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                // Navigate to settings
                onClose();
              }}
            >
              <Settings className="h-5 w-5 mr-3 text-gray-500" />
              <span>Settings</span>
            </button>
            <button 
              className="w-full flex items-center rounded-md px-3 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                // Navigate to support
                onClose();
              }}
            >
              <LifeBuoy className="h-5 w-5 mr-3 text-gray-500" />
              <span>Support</span>
            </button>
            <button 
              className="w-full flex items-center rounded-md px-3 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                // Navigate to about
                onClose();
              }}
            >
              <Info className="h-5 w-5 mr-3 text-gray-500" />
              <span>About</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
