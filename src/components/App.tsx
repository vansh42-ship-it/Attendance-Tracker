import React, { useState, useEffect } from 'react';
import { Dashboard } from './Dashboard';
import { Hero } from './Hero';
import { useAttendance, AttendanceProvider } from '../store/useAttendance';

const AppContent: React.FC = () => {
  const { subjects } = useAttendance();
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  useEffect(() => {
    // If user has subjects, go straight to dashboard
    if (subjects.length > 0) {
      setView('dashboard');
    }
  }, [subjects.length]);

  if (view === 'landing' && subjects.length === 0) {
    return <Hero onStart={() => setView('dashboard')} />;
  }

  return <Dashboard />;
};

export const App: React.FC = () => {
  return (
    <AttendanceProvider>
      <AppContent />
    </AttendanceProvider>
  );
};
