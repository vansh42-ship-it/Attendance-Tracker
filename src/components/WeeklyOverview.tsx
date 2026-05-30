import React from 'react';
import { useAttendance } from '../store/useAttendance';

export const WeeklyOverview: React.FC = () => {
  const { subjects, timetable } = useAttendance();
  const days = [
    { id: 1, name: 'Mon' },
    { id: 2, name: 'Tue' },
    { id: 3, name: 'Wed' },
    { id: 4, name: 'Thu' },
    { id: 5, name: 'Fri' },
    { id: 6, name: 'Sat' },
    { id: 0, name: 'Sun' }
  ];

  const currentDay = new Date().getDay();

  return (
    <div className="space-y-s-md">
      <div className="flex items-center justify-between">
        <h3 className="caption-mono text-mute uppercase tracking-widest text-[10px]">Weekly Overview</h3>
        <div className="flex gap-2">
           <span className="flex items-center gap-1.5">
             <span className="h-1.5 w-1.5 rounded-full bg-primary/20"></span>
             <span className="text-[10px] font-bold text-mute uppercase">Scheduled</span>
           </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-s-sm">
        {days.map((day) => {
          const dayClasses = timetable.filter(t => t.day === day.id);
          const isToday = day.id === currentDay;

          return (
            <div 
              key={day.id} 
              className={`p-s-sm rounded-xl border transition-all ${isToday ? 'bg-canvas border-primary shadow-level-2 ring-1 ring-primary/5' : 'bg-canvas-soft border-hairline'}`}
            >
              <div className="flex justify-between items-center mb-s-sm">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isToday ? 'text-primary' : 'text-mute'}`}>
                  {day.name}
                </span>
                {isToday && <span className="h-1 w-1 rounded-full bg-primary animate-pulse"></span>}
              </div>
              
              <div className="space-y-1.5 min-h-[60px]">
                {dayClasses.map((entry, idx) => {
                  const subject = subjects.find(s => s.id === entry.subjectId);
                  return (
                    <div key={idx} className="px-2 py-1 rounded bg-canvas border border-hairline/50 shadow-sm overflow-hidden">
                      <p className="text-[10px] font-medium text-ink truncate">
                        {subject?.name || 'Unknown'}
                      </p>
                    </div>
                  );
                })}
                {dayClasses.length === 0 && (
                  <p className="text-[9px] text-mute italic opacity-50 py-2">No classes</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
