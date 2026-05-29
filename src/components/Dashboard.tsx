import React, { useState } from 'react';
import { useAttendance } from '../store/useAttendance';
import { SubjectCard } from './SubjectCard';
import { TimetableModal } from './TimetableModal';
import { CalendarModal } from './CalendarModal';

export const Dashboard: React.FC = () => {
  const { subjects, addSubject, deleteSubject, markAttendance, getSubjectStats, overallPercentage, getTodayClasses } = useAttendance();
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newTargetPercentage, setNewTargetPercentage] = useState(75);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const todayClasses = getTodayClasses();
  const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      addSubject(newSubjectName.trim(), newTargetPercentage);
      setNewSubjectName('');
      setNewTargetPercentage(75);
      setShowAddForm(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen selection:bg-primary selection:text-on-primary">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="mesh-gradient absolute left-[50%] top-0 h-[800px] w-[1600px] -translate-x-[50%] opacity-20" />
      </div>

      <div className="max-w-[1400px] mx-auto px-s-md md:px-s-lg py-s-3xl md:py-s-5xl">
        <header className="mb-s-4xl md:mb-s-6xl flex flex-col md:flex-row justify-between items-start md:items-end gap-s-lg md:gap-s-xl border-b border-hairline pb-s-lg md:pb-s-xl">
          <div className="space-y-s-sm md:space-y-s-md">
            <div className="flex items-center gap-s-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-success"></span>
              <p className="caption-mono text-mute uppercase tracking-widest text-[10px]">Attendance System v1.0</p>
            </div>
            <h1 className="display-lg md:display-xl text-ink max-w-2xl">
              Your academic command center.
            </h1>
          </div>
          
          <div className="text-left md:text-right flex flex-col items-start md:items-end mt-s-md md:mt-0">
            <p className="caption-mono text-mute uppercase mb-s-xs text-[10px]">Overall Performance</p>
            <div className="flex items-baseline gap-s-xxs tabular-nums">
              <p className="text-[48px] xs:text-[64px] font-semibold leading-none tracking-[-0.05em] text-ink">
                {overallPercentage().toFixed(1)}
              </p>
              <span className="text-display-sm xs:text-display-md text-mute font-normal">%</span>
            </div>
          </div>
        </header>

        <section className="space-y-s-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-s-md">
            <div className="space-y-s-xxs">
              <h2 className="display-md text-ink">Active Subjects</h2>
              <p className="body-sm text-mute">Tracking {subjects.length} subjects this semester.</p>
            </div>
            <div className="flex flex-wrap gap-s-xs sm:gap-s-sm w-full sm:w-auto">
              <button 
                onClick={() => setShowCalendarModal(true)}
                className="flex-1 sm:flex-none button-secondary-sm flex items-center justify-center gap-s-xxs px-s-sm h-[32px] !rounded-pill border border-hairline shadow-sm hover:bg-canvas-soft-2 transition-all"
                aria-label="View calendar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span className="xs:inline">Calendar</span>
              </button>
              <button 
                onClick={() => setShowTimetableModal(true)}
                className="flex-1 sm:flex-none button-secondary-sm flex items-center justify-center gap-s-xxs px-s-sm h-[32px] !rounded-pill border border-hairline shadow-sm hover:bg-canvas-soft-2 transition-all"
                aria-label="Upload timetable"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span className="xs:inline">Timetable</span>
              </button>
              <button 
                onClick={() => setShowAddForm(true)}
                className="flex-[2] sm:flex-none button-primary-sm flex items-center justify-center gap-s-xxs px-s-md h-[32px] !rounded-pill shadow-level-2"
                aria-label="Add a new subject"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Subject
              </button>
            </div>
          </div>

          {todayClasses.length > 0 && (
            <div className="p-s-md sm:p-s-lg rounded-xl bg-canvas-soft border border-hairline animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between mb-s-md">
                <div className="flex items-center gap-s-xs">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
                  <h3 className="caption-mono text-ink uppercase tracking-wider text-[11px]">Today's Schedule — {todayName}</h3>
                </div>
              </div>
              <div className="flex flex-wrap gap-s-xs sm:gap-s-sm">
                {todayClasses.map((cls, idx) => (
                  <div key={idx} className="px-s-sm sm:px-s-md py-s-xs rounded-lg bg-canvas border border-hairline shadow-sm flex items-center gap-s-xs sm:gap-s-sm">
                    <span className="body-sm-strong text-ink truncate max-w-[120px] sm:max-w-none">{cls.subject?.name}</span>
                    <div className="flex gap-0.5 sm:gap-1">
                      <button 
                        onClick={() => markAttendance(cls.subjectId, 'present')}
                        className="p-1 hover:bg-success/10 text-success rounded transition-colors"
                        title="Mark Present"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </button>
                      <button 
                        onClick={() => markAttendance(cls.subjectId, 'absent')}
                        className="p-1 hover:bg-error/10 text-error rounded transition-colors"
                        title="Mark Absent"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {subjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-s-6xl border border-hairline rounded-lg bg-canvas/50 backdrop-blur-sm shadow-level-1 px-s-md">
              <div className="w-16 h-16 rounded-full bg-canvas-soft-2 flex items-center justify-center mb-s-xl border border-hairline">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mute"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
              </div>
              <p className="body-lg text-ink font-medium mb-s-xs text-center">No subjects tracked yet.</p>
              <p className="body-sm text-mute mb-s-lg text-center max-w-[300px]">Add your subjects and their target attendance percentages to start tracking.</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="button-primary px-s-xl h-10 text-sm w-full xs:w-auto"
              >
                Create First Subject
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-s-lg md:gap-s-xl">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  stats={getSubjectStats(subject.id)}
                  onMark={(status) => markAttendance(subject.id, status)}
                  onDelete={() => deleteSubject(subject.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Simulator / Insights Section */}
        {subjects.length > 0 && (
          <section className="mt-s-4xl md:mt-s-6xl">
            <div className="card-marketing bg-primary text-on-primary border-none shadow-level-4 overflow-hidden relative p-s-lg sm:p-s-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gradient-develop-start to-gradient-preview-end opacity-20 blur-3xl -mr-32 -mt-32" />
              <div className="relative z-10 grid lg:grid-cols-2 gap-s-2xl md:gap-s-3xl items-center">
                <div className="space-y-s-md sm:space-y-s-lg">
                  <div className="flex items-center gap-s-xs">
                    <span className="px-s-xs py-1 rounded-full bg-on-primary/10 caption-mono text-[10px] text-on-primary border border-on-primary/20 tracking-wider">PREDICTIVE INSIGHTS</span>
                  </div>
                  <h2 className="display-md sm:display-lg text-on-primary leading-tight">Need a break? <br/>See if you can afford it.</h2>
                  <p className="body-sm sm:body-md text-on-primary/70 max-w-md">Our algorithms calculate exactly how many classes you can skip without falling below your target goals.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-s-md sm:gap-s-lg">
                  <div className="p-s-md sm:p-s-lg rounded-md bg-on-primary/5 border border-on-primary/10 backdrop-blur-sm">
                    <p className="caption-mono text-on-primary/50 mb-s-xs uppercase text-[10px] tracking-widest">Safe to skip</p>
                    <p className="text-[24px] sm:text-display-md text-on-primary tabular-nums">
                      {subjects.reduce((acc, s) => acc + getSubjectStats(s.id).safeBunks, 0)} 
                      <span className="text-body-sm font-normal text-on-primary/50 ml-s-xs">classes total</span>
                    </p>
                  </div>
                  <div className="p-s-md sm:p-s-lg rounded-md bg-on-primary/5 border border-on-primary/10 backdrop-blur-sm">
                    <p className="caption-mono text-on-primary/50 mb-s-xs uppercase text-[10px] tracking-widest">Must attend</p>
                    <p className="text-[24px] sm:text-display-md text-on-primary tabular-nums">
                      {subjects.filter(s => getSubjectStats(s.id).percentage < s.targetPercentage).length} 
                      <span className="text-body-sm font-normal text-on-primary/50 ml-s-xs">critical subjects</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Add Subject Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-canvas rounded-2xl w-full max-w-[440px] shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300 overflow-hidden flex flex-col border border-hairline">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-hairline flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-ink">New Subject</h3>
                <p className="text-sm text-mute mt-0.5">Define your course and attendance goal</p>
              </div>
              <button 
                onClick={() => setShowAddForm(false)} 
                className="p-2 text-mute hover:text-ink hover:bg-canvas-soft-2 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleAddSubject} className="p-6 space-y-8">
              {/* Subject Name Section */}
              <div className="space-y-2.5">
                <label htmlFor="subject-name" className="text-[13px] font-semibold text-body uppercase tracking-wider">
                  Subject Name
                </label>
                <input
                  id="subject-name"
                  autoFocus
                  type="text"
                  placeholder="e.g. Distributed Systems"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-hairline bg-canvas-soft-2 text-ink focus:bg-canvas focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-mute"
                  required
                />
              </div>
              
              {/* Target Percentage Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label htmlFor="target-percentage" className="text-[13px] font-semibold text-body uppercase tracking-wider">
                    Target Percentage
                  </label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-ink tabular-nums">{newTargetPercentage}</span>
                    <span className="text-lg font-bold text-mute">%</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <input
                    id="target-percentage"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={newTargetPercentage}
                    onChange={(e) => setNewTargetPercentage(parseInt(e.target.value))}
                    className="w-full h-2 bg-hairline rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[11px] font-bold text-mute">0%</span>
                    <div className="h-1 w-1 rounded-full bg-hairline"></div>
                    <span className="text-[11px] font-bold text-mute">50%</span>
                    <div className="h-1 w-1 rounded-full bg-hairline"></div>
                    <span className="text-[11px] font-bold text-mute">100%</span>
                  </div>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)} 
                  className="flex-1 h-12 rounded-xl border border-hairline text-body font-bold hover:bg-canvas-soft-2 active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 h-12 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 active:scale-[0.98] shadow-lg shadow-primary/10 transition-all"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Timetable Modal */}
      {showTimetableModal && (
        <TimetableModal onClose={() => setShowTimetableModal(false)} />
      )}

      {/* Calendar Modal */}
      {showCalendarModal && (
        <CalendarModal onClose={() => setShowCalendarModal(false)} />
      )}
    </div>
  );
};
