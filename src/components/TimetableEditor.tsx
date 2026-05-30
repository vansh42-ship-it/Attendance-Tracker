import React, { useState } from 'react';
import { useAttendance } from '../store/useAttendance';

export const TimetableEditor: React.FC = () => {
  const { subjects, timetable, addTimetableEntry, removeTimetableEntry, clearTimetable } = useAttendance();
  const [newItem, setNewItem] = useState<{ [key: number]: string }>({});

  const days = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
    { id: 0, name: 'Sunday' }
  ];

  const handleAddItem = (dayId: number) => {
    const name = newItem[dayId];
    if (name && name.trim()) {
      addTimetableEntry(dayId, name.trim());
      setNewItem(prev => ({ ...prev, [dayId]: '' }));
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Reset Weekly Timetable? This will clear all scheduled classes but keep your subjects and history.")) {
      clearTimetable();
    }
  };

  return (
    <div className="space-y-s-xl animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-s-md border-b border-hairline pb-s-md">
        <div>
          <h2 className="display-sm text-ink">Weekly Schedule</h2>
          <p className="body-sm text-mute">Manage your recurring classes for each day</p>
        </div>
        <button 
          onClick={handleClearAll}
          className="px-s-md py-1.5 rounded-pill bg-error/5 text-error hover:bg-error hover:text-on-primary text-[10px] font-bold uppercase tracking-widest transition-all border border-error/20"
        >
          Reset Timetable
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-s-md">
        {days.map(day => (
          <div key={day.id} className="flex flex-col gap-s-sm bg-canvas-soft rounded-xl border border-hairline p-s-md min-h-[340px] shadow-sm">
            <h4 className="caption-mono text-mute uppercase tracking-[0.2em] mb-s-xxs">{day.name}</h4>
            
            <div className="flex flex-col gap-s-xs flex-1">
              {timetable.filter(t => t.day === day.id).map((entry, idx) => {
                const subject = subjects.find(s => s.id === entry.subjectId);
                return (
                  <div key={`${day.id}-${entry.subjectId}-${idx}`} className="group relative p-s-sm rounded-lg bg-canvas border border-hairline hover:border-hairline-strong transition-all shadow-level-1">
                    <p className="body-sm-strong text-ink pr-s-lg truncate">{subject?.name || 'Unknown'}</p>
                    <button 
                      onClick={() => removeTimetableEntry(day.id, entry.subjectId)}
                      className="absolute top-1.5 right-1.5 p-1 text-mute hover:text-error opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-error/5"
                      aria-label="Remove subject"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                );
              })}
              {timetable.filter(t => t.day === day.id).length === 0 && (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-hairline rounded-lg">
                  <p className="text-[10px] text-mute uppercase tracking-tighter">No classes</p>
                </div>
              )}
            </div>

            <div className="mt-s-md flex gap-s-xxs">
              <input 
                type="text"
                placeholder="Add class..."
                value={newItem[day.id] || ''}
                onChange={(e) => setNewItem(prev => ({ ...prev, [day.id]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem(day.id)}
                className="flex-1 min-w-0 h-9 px-s-sm rounded-lg bg-canvas border border-hairline text-sm text-ink placeholder:text-mute focus:outline-none focus:border-primary transition-all"
              />
              <button 
                onClick={() => handleAddItem(day.id)}
                className="h-9 w-9 shrink-0 rounded-lg bg-primary text-on-primary hover:opacity-90 flex items-center justify-center transition-all shadow-level-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
