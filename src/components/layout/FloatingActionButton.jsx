import React from 'react';
import { Plus, Calendar, List, Grid } from 'lucide-react';

export default function FloatingActionButton({ 
  isOpen, 
  onToggle, 
  onCreatePlan, 
  onCreateTask, 
  onStartProject 
}) {
  return (
    <div className="fixed right-4 bottom-24 z-40">
      {isOpen && (
        <div className="absolute bottom-16 right-2 flex flex-col-reverse items-end space-y-2 space-y-reverse">
          <div className="flex items-center mb-2">
            <div className="mr-2 rounded bg-white py-1 px-2 text-sm shadow">
              Start project
            </div>
            <button 
              className="rounded-full bg-purple-500 p-2 text-white shadow-lg hover:bg-purple-600"
              onClick={onStartProject}
            >
              <Grid size={20} />
            </button>
          </div>
          <div className="flex items-center mb-2">
            <div className="mr-2 rounded bg-white py-1 px-2 text-sm shadow">
              Create task
            </div>
            <button 
              className="rounded-full bg-blue-500 p-2 text-white shadow-lg hover:bg-blue-600"
              onClick={onCreateTask}
            >
              <List size={20} />
            </button>
          </div>
          <div className="flex items-center mb-2">
            <div className="mr-2 rounded bg-white py-1 px-2 text-sm shadow">
              Add plan
            </div>
            <button 
              className="rounded-full bg-pink-500 p-2 text-white shadow-lg hover:bg-pink-600"
              onClick={onCreatePlan}
            >
              <Calendar size={20} />
            </button>
          </div>
        </div>
      )}
      <button
        className="h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 flex items-center justify-center"
        onClick={onToggle}
      >
        <Plus size={24} />
      </button>
    </div>
  );
}