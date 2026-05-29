import React, { useState } from 'react';
import { useAttendance, type AttendanceStatus } from '../store/useAttendance';

interface CalendarModalProps {
  onClose: () => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ onClose }) => {
  const { subjects, logs, markAttendance } = useAttendance();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  
  const selectedDateStr = formatDate(selectedDate);

  const hasAttendanceOnDate = (day: number) => {
    const dateStr = formatDate(new Date(year, month, day));
    return logs.some(l => l.date === dateStr);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-canvas rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300 overflow-hidden flex flex-col border border-hairline">
        <div className="px-6 py-5 border-b border-hairline flex justify-between items-center bg-canvas">
          <div>
            <h3 className="text-xl font-bold text-ink">Attendance Calendar</h3>
            <p className="text-sm text-mute mt-0.5">Review and mark previous attendances</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-mute hover:text-ink hover:bg-canvas-soft-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-ink">
                {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(viewDate)}
              </h4>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-canvas-soft-2 rounded-lg border border-hairline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-canvas-soft-2 rounded-lg border border-hairline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center py-2 text-[10px] font-bold text-mute uppercase tracking-widest">{d}</div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square p-2"></div>
              ))}
              {Array.from({ length: days }).map((_, i) => {
                const day = i + 1;
                const date = new Date(year, month, day);
                const isSelected = formatDate(date) === selectedDateStr;
                const isToday = formatDate(date) === formatDate(new Date());
                const hasAttendance = hasAttendanceOnDate(day);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all border
                      ${isSelected ? 'bg-primary border-primary text-on-primary shadow-lg shadow-primary/20 scale-105 z-10' : 'hover:bg-canvas-soft-2 border-hairline text-ink'}
                      ${isToday && !isSelected ? 'border-primary/50 text-primary font-bold' : ''}
                    `}
                  >
                    <span className="text-sm">{day}</span>
                    {hasAttendance && (
                      <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-on-primary' : 'bg-primary'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Marking Section */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <h4 className="text-lg font-bold text-ink mb-1">
                {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(selectedDate)}
              </h4>
              <p className="text-sm text-mute">Mark attendance for this date</p>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-2">
              {subjects.map(subject => {
                const log = logs.find(l => l.subjectId === subject.id && l.date === selectedDateStr);
                return (
                  <div key={subject.id} className="p-4 rounded-xl border border-hairline bg-canvas-soft flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-ink">{subject.name}</span>
                      {log && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                          ${log.status === 'present' ? 'bg-success/10 text-success' : 
                            log.status === 'absent' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'}
                        `}>
                          {log.status}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => markAttendance(subject.id, 'present', selectedDateStr)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border
                          ${log?.status === 'present' ? 'bg-success border-success text-white' : 'bg-canvas border-hairline text-mute hover:text-success hover:border-success'}
                        `}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markAttendance(subject.id, 'absent', selectedDateStr)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border
                          ${log?.status === 'absent' ? 'bg-error border-error text-white' : 'bg-canvas border-hairline text-mute hover:text-error hover:border-error'}
                        `}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => markAttendance(subject.id, 'leave', selectedDateStr)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border
                          ${log?.status === 'leave' ? 'bg-warning border-warning text-white' : 'bg-canvas border-hairline text-mute hover:text-warning hover:border-warning'}
                        `}
                      >
                        Leave
                      </button>
                    </div>
                  </div>
                );
              })}
              {subjects.length === 0 && (
                <p className="text-center text-mute py-8">No subjects added yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-hairline bg-canvas-soft-2 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 h-10 rounded-xl bg-ink text-canvas font-bold hover:opacity-90 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
