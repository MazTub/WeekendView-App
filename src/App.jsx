import React, { useState } from 'react';
import { WeekendProvider } from './context/WeekendContext';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import SideDrawer from './components/layout/SideDrawer';
import FloatingActionButton from './components/layout/FloatingActionButton';
import Dashboard from './views/home/Dashboard';
import PlansOverview from './views/plans/PlansOverview';
import MonthView from './views/plans/MonthView';
import WeekendDetailView from './views/plans/WeekendDetailView';
import ProfileView from './views/profile/ProfileView';

export default function App() {
  const [mainView, setMainView] = useState('home');
  const [subView, setSubView] = useState('overview');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);
  
  // Render the appropriate view based on navigation state
  const renderMainView = () => {
    if (mainView === 'home') {
      return <Dashboard onNavigate={(view, subView) => {
        setMainView(view);
        if (subView) setSubView(subView);
      }} />;
    } else if (mainView === 'plans') {
      if (subView === 'overview') return <PlansOverview onNavigate={setSubView} />;
      if (subView === 'month') return <MonthView onNavigate={setSubView} />;
      if (subView === 'weekend') return <WeekendDetailView onNavigate={setSubView} />;
      return <PlansOverview onNavigate={setSubView} />;
    } else if (mainView === 'profile') {
      return <ProfileView />;
    }
  };
  
  // Plan sub-navigation header for the Plans view
  const PlanNavigationHeader = () => (
    <div className="flex justify-between mb-4 border-b pb-2">
      <button
        className={`px-3 py-1 rounded-md text-sm flex items-center ${
          subView === 'overview' ? 'bg-primary text-white' : 'bg-white border'
        }`}
        onClick={() => setSubView('overview')}
      >
        <span className="mr-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
               strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </span>
        Overview
      </button>
      <button
        className={`px-3 py-1 rounded-md text-sm flex items-center ${
          subView === 'month' ? 'bg-primary text-white' : 'bg-white border'
        }`}
        onClick={() => setSubView('month')}
      >
        <span className="mr-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
               strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </span>
        Month
      </button>
    </div>
  );
  
  return (
    <WeekendProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header 
          title={mainView === 'home' ? 'Dashboard' : 
                mainView === 'plans' ? 'Weekend Plans' : 'Profile'}
          onMenuClick={() => setDrawerOpen(true)}
        />
        
        {/* Side Drawer */}
        <SideDrawer 
          isOpen={drawerOpen} 
          onClose={() => setDrawerOpen(false)} 
        />
        
        {/* Overlay for drawer */}
        {drawerOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50" 
            onClick={() => setDrawerOpen(false)}
          />
        )}
        
        {/* Main Content */}
        <main className="pb-24">
          {/* Plan sub-navigation for the Plans view */}
          {mainView === 'plans' && (
            <div className="px-6 pt-6">
              <PlanNavigationHeader />
            </div>
          )}
          
          {renderMainView()}
        </main>
        
        {/* Floating Action Button */}
        <FloatingActionButton 
          isOpen={showFabMenu} 
          onToggle={() => setShowFabMenu(!showFabMenu)}
          onCreatePlan={() => {
            setMainView('plans');
            setSubView('overview');
            setShowFabMenu(false);
          }}
          onCreateTask={() => {
            setMainView('plans');
            setSubView('weekend');
            setShowFabMenu(false);
          }}
          onStartProject={() => {
            alert('Start new project feature coming soon!');
            setShowFabMenu(false);
          }}
        />
        
        {/* Bottom Tab Navigation */}
        <BottomNav 
          activeView={mainView} 
          onChange={(view) => {
            setMainView(view);
            if (view === 'plans') setSubView('overview');
            setShowFabMenu(false);
          }} 
        />
      </div>
    </WeekendProvider>
  );
}