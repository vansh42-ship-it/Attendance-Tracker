import React from 'react';
import { AttendanceProvider } from '../store/useAttendance';
import { TaskPlanner } from './TaskPlanner';

export const PlannerPage: React.FC = () => {
  return (
    <AttendanceProvider>
      <div className="max-w-[1400px] mx-auto px-s-md md:px-s-lg py-s-3xl md:py-s-5xl">
        <TaskPlanner />
      </div>
    </AttendanceProvider>
  );
};
