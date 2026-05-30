import React, { useState, useEffect } from 'react';
import { Dashboard } from './Dashboard';
import { Hero } from './Hero';
import { useAttendance, AttendanceProvider } from '../store/useAttendance';

const AppContent: React.FC<{ customH1?: string }> = ({ customH1 }) => {
  const { subjects } = useAttendance();
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  if (view === 'landing') {
    return <Hero onStart={() => setView('dashboard')} customH1={customH1} />;
  }

  return <Dashboard />;
};

export const App: React.FC<{ customH1?: string }> = ({ customH1 }) => {
  return (
    <AttendanceProvider>
      <AppContent customH1={customH1} />
    </AttendanceProvider>
  );
};
