import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAttendance, type AcademicTask } from '../store/useAttendance';

interface TaskModalProps {
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ onClose }) => {
  const { subjects, addTask } = useAttendance();
  
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [dueDate, setDueDate] = useState(new Intl.DateTimeFormat('en-CA').format(new Date()));
  const [type, setType] = useState<AcademicTask['type']>('assignment');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title.');
      return;
    }
    if (!subjectId) {
      setError('Please link this task to a subject. Go to the Dashboard to create subjects first.');
      return;
    }
    setError(null);
    addTask({
      title: title.trim(),
      subjectId,
      dueDate,
      type,
      status: 'not_started',
      notes: notes.trim(),
    });
    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-4 sm:pt-12 overflow-y-auto bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-canvas rounded-2xl w-full max-w-[500px] shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300 overflow-hidden flex flex-col border border-hairline">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-hairline flex justify-between items-center bg-canvas">
          <div>
            <h3 className="text-lg font-bold text-ink">New Planner Task</h3>
            <p className="text-xs text-mute mt-0.5">Schedule a homework assignment, exam, or submission</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-mute hover:text-ink hover:bg-canvas-soft-2 rounded-full transition-colors shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-error-soft/50 border border-error/20 text-xs text-error font-medium flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-error"></span> {error}
            </div>
          )}

          {/* Task Title */}
          <div className="space-y-1.5">
            <label htmlFor="task-title" className="text-[11px] font-bold text-body uppercase tracking-wider">
              Task Title
            </label>
            <input
              id="task-title"
              type="text"
              autoFocus
              placeholder="e.g. Lab Report 5, Final Semester Exam"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas-soft-2 text-ink focus:bg-canvas focus:border-primary outline-none transition-all placeholder:text-mute text-sm"
              required
            />
          </div>

          {/* Type Selector (Segmented buttons) */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-body uppercase tracking-wider block">
              Task Type
            </label>
            <div className="flex bg-canvas-soft-2 p-0.5 rounded-md border border-hairline w-full">
              {(['assignment', 'exam', 'submission', 'other'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${type === t ? 'bg-canvas text-ink shadow-sm' : 'text-mute hover:text-body'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Linked Subject */}
            <div className="space-y-1.5">
              <label htmlFor="task-subject" className="text-[11px] font-bold text-body uppercase tracking-wider">
                Link to Subject
              </label>
              {subjects.length === 0 ? (
                <div className="text-xs text-mute py-2">Create subjects first!</div>
              ) : (
                <select
                  id="task-subject"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas-soft-2 text-ink focus:bg-canvas focus:border-primary outline-none transition-all text-sm cursor-pointer"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label htmlFor="task-due" className="text-[11px] font-bold text-body uppercase tracking-wider">
                Due Date
              </label>
              <input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas-soft-2 text-ink focus:bg-canvas focus:border-primary outline-none transition-all text-sm cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label htmlFor="task-notes" className="text-[11px] font-bold text-body uppercase tracking-wider">
              Notes (Optional)
            </label>
            <textarea
              id="task-notes"
              placeholder="e.g. Topics to cover: Modules 1-4, submit online before 11:59 PM"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-20 p-3 rounded-lg border border-hairline bg-canvas-soft-2 text-ink focus:bg-canvas focus:border-primary outline-none transition-all placeholder:text-mute text-sm resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-hairline/50">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 h-11 rounded-xl border border-hairline text-body font-bold hover:bg-canvas-soft-2 active:scale-[0.98] transition-all text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 h-11 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 active:scale-[0.98] shadow-lg shadow-primary/10 transition-all text-sm cursor-pointer"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
