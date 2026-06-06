import React, { useState } from 'react';
import { useAttendance } from '../store/useAttendance';

export const TimetableEditor: React.FC = () => {
  const { subjects, timetable, addTimetableEntry, removeTimetableEntry, clearTimetable } = useAttendance();
  const [newItem, setNewItem] = useState<{ [key: number]: { name: string; start: string; end: string } }>({});

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
    const item = newItem[dayId];
    if (item && item.name.trim()) {
      addTimetableEntry(dayId, item.name.trim(), item.start, item.end);
      setNewItem(prev => ({ ...prev, [dayId]: { name: '', start: '', end: '' } }));
    }
  };

  const updateNewItem = (dayId: number, field: string, value: string) => {
    setNewItem(prev => ({
      ...prev,
      [dayId]: {
        ...(prev[dayId] || { name: '', start: '', end: '' }),
        [field]: value
      }
    }));
  };

  const handleClearAll = () => {
    if (window.confirm("Reset Weekly Timetable? This will clear all scheduled classes but keep your subjects and history.")) {
      clearTimetable();
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-hairline pb-3">
        <div>
          <h2 className="text-base font-bold text-ink">Weekly Schedule</h2>
          <p className="text-xs text-mute">Manage your recurring classes for each day</p>
        </div>
        <button 
          onClick={handleClearAll}
          className="px-3 py-1 rounded-pill bg-error/5 text-error hover:bg-error hover:text-on-primary text-[9px] font-bold uppercase tracking-widest transition-all border border-error/20"
        >
          Reset Timetable
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
        {days.map(day => (
          <div key={day.id} className="flex flex-col gap-3 bg-canvas-soft rounded-xl border border-hairline p-4 min-h-[400px] shadow-sm transition-all hover:shadow-md">
            <h4 className="text-[10px] font-bold text-mute uppercase tracking-[0.2em] mb-1 border-b border-hairline/50 pb-2">{day.name}</h4>
            
            <div className="flex flex-col gap-2 flex-1">
              {timetable
                .filter(t => t.day === day.id)
                .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
                .map((entry) => {
                  const subject = subjects.find(s => s.id === entry.subjectId);
                  return (
                    <div key={entry.id} className="group relative p-3 rounded-lg bg-canvas border border-hairline hover:border-hairline-strong transition-all shadow-sm">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-ink pr-6 truncate">{subject?.name || 'Unknown'}</p>
                        {(entry.startTime || entry.endTime) && (
                          <p className="text-[11px] text-mute flex items-center gap-1.5 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {entry.startTime || '--:--'} - {entry.endTime || '--:--'}
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={() => removeTimetableEntry(entry.id)}
                        className="absolute top-2 right-2 p-1.5 text-mute hover:text-error opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-error/5"
                        aria-label="Remove subject"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  );
                })}
              {timetable.filter(t => t.day === day.id).length === 0 && (
                <div className="flex-1 flex items-center justify-center border border-dashed border-hairline rounded-lg bg-canvas/30">
                  <p className="text-[10px] text-mute uppercase font-bold tracking-tight">No classes</p>
                </div>
              )}
            </div>

            <div className="mt-3 space-y-2 border-t border-hairline/30 pt-3">
              <div className="space-y-2">
                <input 
                  type="text"
                  placeholder="Subject name..."
                  value={newItem[day.id]?.name || ''}
                  onChange={(e) => updateNewItem(day.id, 'name', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddItem(day.id)}
                  className="w-full h-9 px-3 rounded-lg bg-canvas border border-hairline text-sm text-ink placeholder:text-mute focus:outline-none focus:border-primary transition-all shadow-sm"
                />
                
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-mute uppercase px-1">Start Time</span>
                      <input 
                        type="time"
                        value={newItem[day.id]?.start || ''}
                        onChange={(e) => updateNewItem(day.id, 'start', e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-primary transition-all shadow-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-mute uppercase px-1">End Time</span>
                      <input 
                        type="time"
                        value={newItem[day.id]?.end || ''}
                        onChange={(e) => updateNewItem(day.id, 'end', e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-primary transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleAddItem(day.id)}
                    className="w-full h-10 rounded-lg bg-primary text-on-primary hover:opacity-90 flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span className="text-sm font-bold uppercase tracking-wider">Add Class</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
