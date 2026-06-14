import React, { useState } from 'react';
import { useAttendance, type AcademicTask } from '../store/useAttendance';
import { TaskModal } from './TaskModal';

export const TaskPlanner: React.FC = () => {
  const { subjects, tasks, deleteTask, updateTask } = useAttendance();
  
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'exam' | 'assignment' | 'submission'>('all');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'completed'>('pending');

  const getDaysDiff = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getUrgencyGroup = (task: AcademicTask) => {
    if (task.status === 'completed') return 'completed';
    const diff = getDaysDiff(task.dueDate);
    if (diff < 0) return 'overdue';
    if (diff === 0) return 'today';
    if (diff > 0 && diff <= 7) return 'thisWeek';
    return 'later';
  };

  const formatDateLabel = (dateStr: string) => {
    const diff = getDaysDiff(dateStr);
    if (diff < 0) {
      const absDiff = Math.abs(diff);
      return `Overdue by ${absDiff} day${absDiff > 1 ? 's' : ''}`;
    }
    if (diff === 0) return 'Due Today';
    if (diff === 1) return 'Due Tomorrow';
    
    // Default formatted date like "Jun 15"
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(dateStr));
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Filter by type
    if (filterType !== 'all' && task.type !== filterType) return false;
    
    // Filter by status
    if (filterStatus === 'completed' && task.status !== 'completed') return false;
    if (filterStatus === 'pending' && task.status === 'completed') return false;
    
    return true;
  });

  // Group tasks
  const groups: { [key: string]: AcademicTask[] } = {
    overdue: [],
    today: [],
    thisWeek: [],
    later: [],
    completed: [],
  };

  filteredTasks.forEach((task) => {
    const group = getUrgencyGroup(task);
    groups[group].push(task);
  });

  // Sort groups by date
  Object.keys(groups).forEach((key) => {
    groups[key].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  });

  const toggleComplete = (task: AcademicTask) => {
    updateTask(task.id, {
      status: task.status === 'completed' ? 'not_started' : 'completed',
    });
  };

  const pendingCount = tasks.filter(t => t.status !== 'completed').length;

  return (
    <div className="space-y-s-lg animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-hairline pb-s-lg">
        <div className="space-y-1">
          <h1 className="display-lg text-ink">Academic Planner</h1>
          <p className="body-sm text-mute">
            {pendingCount > 0 ? `You have ${pendingCount} pending deadlines.` : 'All caught up! Nice work.'}
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="button-primary-sm flex items-center justify-center gap-s-xxs px-s-md h-[36px] !rounded-pill shadow-level-2 cursor-pointer font-bold uppercase tracking-wider text-xs shrink-0 self-stretch sm:self-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Task
        </button>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col xs:flex-row gap-s-sm justify-between items-stretch xs:items-center py-s-xs">
        {/* Category type filter */}
        <div className="flex bg-canvas-soft-2 p-0.5 rounded-pill border border-hairline w-full xs:w-auto h-fit overflow-x-auto">
          {(['all', 'exam', 'assignment', 'submission'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-1.5 rounded-pill text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                filterType === t ? 'bg-canvas text-ink shadow-sm' : 'text-mute hover:text-body'
              }`}
            >
              {t}s
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex bg-canvas-soft-2 p-0.5 rounded-pill border border-hairline w-full xs:w-auto h-fit">
          {(['pending', 'completed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex-1 xs:flex-none px-4 py-1.5 rounded-pill text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === s ? 'bg-canvas text-ink shadow-sm' : 'text-mute hover:text-body'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Task List Groups */}
      <div className="space-y-s-xl pt-2">
        {filteredTasks.length === 0 ? (
          <div className="py-8 space-y-12">
            <div className="flex flex-col items-center justify-center py-s-5xl border border-hairline border-dashed rounded-lg bg-canvas/30 px-s-md">
              <div className="w-12 h-12 rounded-full bg-canvas flex items-center justify-center mb-s-md border border-hairline shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mute"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
              </div>
              <p className="body-md text-ink font-semibold mb-s-xxs text-center">No tasks found</p>
              <p className="body-sm text-mute mb-s-lg text-center max-w-[280px]">No {filterType !== 'all' ? filterType : ''} tasks matching "{filterStatus}" criteria.</p>
              <button 
                onClick={() => setShowModal(true)}
                className="button-primary px-s-lg h-9 text-xs w-full xs:w-auto cursor-pointer"
              >
                Create Task
              </button>
            </div>

            {tasks.length === 0 && (
              <div className="border-t border-hairline pt-8 animate-in fade-in duration-700">
                <h2 className="display-sm text-ink mb-6">Planner Features & Capabilities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-s-lg">
                  <div className="p-s-lg border border-hairline rounded-lg bg-canvas-soft shadow-level-1">
                    <h3 className="body-sm-strong text-ink mb-s-xs font-semibold uppercase tracking-wider text-[11px]">Deadlines At A Glance</h3>
                    <p className="body-sm text-body">Categorizes assignments, quizzes, and exam dates automatically by urgency (Overdue, Today, This Week, Later) so you never miss a submission.</p>
                  </div>
                  <div className="p-s-lg border border-hairline rounded-lg bg-canvas-soft shadow-level-1">
                    <h3 className="body-sm-strong text-ink mb-s-xs font-semibold uppercase tracking-wider text-[11px]">Subject Integrations</h3>
                    <p className="body-sm text-body">Link submissions directly to your courses to align your academic planner with your subject wise attendance logs and bunk predictions.</p>
                  </div>
                  <div className="p-s-lg border border-hairline rounded-lg bg-canvas-soft shadow-level-1">
                    <h3 className="body-sm-strong text-ink mb-s-xs font-semibold uppercase tracking-wider text-[11px]">Local-First Security</h3>
                    <p className="body-sm text-body">All task records, schedules, and logs are saved directly in your browser's local storage. Zero tracking, zero cloud latency, and 100% offline support.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-s-2xl">
            {/* Render groups */}
            {([
              { key: 'overdue', title: 'Overdue Deadlines', color: 'text-error bg-error-soft/30 border-error/20' },
              { key: 'today', title: 'Due Today', color: 'text-primary bg-primary/5 border-primary/20' },
              { key: 'thisWeek', title: 'Due This Week', color: 'text-mute bg-canvas-soft-2 border-hairline' },
              { key: 'later', title: 'Due Later', color: 'text-mute bg-canvas-soft-2 border-hairline' },
              { key: 'completed', title: 'Completed', color: 'text-success bg-success/10 border-success/20' },
            ] as const).map((group) => {
              const list = groups[group.key];
              if (!list || list.length === 0) return null;

              return (
                <div key={group.key} className="space-y-3">
                  <div className="flex items-center gap-s-xs">
                    <h3 className="caption-mono text-mute uppercase tracking-widest text-[10px] font-bold">
                      {group.title}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-canvas-soft-2 border border-hairline text-body font-geist-mono">
                      {list.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {list.map((task) => {
                      const subject = subjects.find(s => s.id === task.subjectId);
                      const isOverdue = group.key === 'overdue';
                      const isToday = group.key === 'today';
                      const isCompleted = task.status === 'completed';

                      return (
                        <div 
                          key={task.id}
                          className={`group p-4 rounded-xl border bg-canvas shadow-sm flex items-start gap-3 transition-all hover:border-hairline-strong relative overflow-hidden`}
                        >
                          {/* Colored vertical indicator bar */}
                          <div 
                            className={`absolute top-0 left-0 bottom-0 w-1 transition-all ${
                              isCompleted 
                                ? 'bg-success' 
                                : isOverdue 
                                  ? 'bg-error animate-pulse' 
                                  : isToday 
                                    ? 'bg-primary' 
                                    : 'bg-mute/20'
                            }`}
                          />
                          
                          {/* Checkbox circle */}
                          <button
                            type="button"
                            onClick={() => toggleComplete(task)}
                            className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                              isCompleted 
                                ? 'bg-primary border-primary text-on-primary' 
                                : isOverdue 
                                  ? 'border-error/50 hover:bg-error-soft/10 text-transparent hover:text-error/30' 
                                  : 'border-hairline hover:border-hairline-strong hover:bg-canvas-soft-2 text-transparent hover:text-mute'
                            }`}
                            title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </button>

                          {/* Task details */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                              <span className={`body-sm-strong text-ink leading-tight break-words ${isCompleted ? 'line-through text-mute' : ''}`}>
                                {task.title}
                              </span>
                              
                              {/* Subject Badge */}
                              {subject && (
                                <span className="px-1.5 py-0.5 rounded border border-hairline bg-canvas-soft-2 text-[9px] font-bold text-body uppercase tracking-wider">
                                  {subject.name}
                                </span>
                              )}

                              {/* Task Type Badge */}
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                task.type === 'exam' 
                                  ? 'bg-violet/10 text-violet border border-violet/20' 
                                  : task.type === 'submission' 
                                    ? 'bg-cyan/10 text-cyan-deep border border-cyan/20' 
                                    : 'bg-canvas-soft border border-hairline text-body'
                              }`}>
                                {task.type}
                              </span>
                            </div>

                            {/* Date detail */}
                            <p className={`caption-mono text-[10px] font-semibold ${
                              isCompleted 
                                ? 'text-success/80' 
                                : isOverdue 
                                  ? 'text-error' 
                                  : isToday 
                                    ? 'text-primary' 
                                    : 'text-mute'
                            }`}>
                              {isCompleted ? 'Completed' : formatDateLabel(task.dueDate)}
                            </p>

                            {/* Task Notes */}
                            {task.notes && (
                              <p className="text-[11px] text-body/70 leading-relaxed whitespace-pre-wrap pt-0.5 max-w-xl">
                                {task.notes}
                              </p>
                            )}
                          </div>

                          {/* Delete Action (visible on hover) */}
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 text-mute opacity-0 group-hover:opacity-100 transition-all hover:text-error hover:bg-error/10 rounded-lg shrink-0 cursor-pointer"
                            title="Delete Task"
                            aria-label="Delete Task"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <TaskModal onClose={() => setShowModal(false)} />
      )}
      
    </div>
  );
};
