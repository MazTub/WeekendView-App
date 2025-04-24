import React from 'react';
import { Menu, Bell, HelpCircle } from 'lucide-react';

export default function Header({ title, onMenuClick }) {
  return (
    <header className="flex items-center justify-between bg-primary px-4 py-3 text-white shadow-md">
      <div className="flex items-center gap-2">
        <button 
          className="rounded-full p-1 hover:bg-white/20"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex gap-1">
        <button className="rounded-full p-1 hover:bg-white/20">
          <HelpCircle size={20} />
        </button>
        <button className="rounded-full p-1 hover:bg-white/20">
          <div className="relative">
            <Bell size={20} />
            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></div>
          </div>
        </button>
      </div>
    </header>
  );
}