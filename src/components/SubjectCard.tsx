import React from 'react';
import type { Subject, AttendanceStatus } from '../store/useAttendance';

interface SubjectCardProps {
  subject: Subject;
  stats: {
    attended: number;
    absent: number;
    leave: number;
    conducted: number;
    percentage: number;
    safeBunks: number;
    toAttend: number;
  };
  onMark: (status: AttendanceStatus) => void;
  onDelete: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, stats, onMark, onDelete }) => {
  const isSafe = stats.percentage >= subject.targetPercentage;
  
  // Predict next class percentage
  const nextConducted = stats.conducted + 1;
  const ifPresent = ((stats.attended + 1) / nextConducted) * 100;
  const ifAbsent = (stats.attended / nextConducted) * 100;

  return (
    <div className="card-marketing group relative overflow-hidden transition-[box-shadow,border-color,transform] hover:shadow-level-4 flex flex-col h-full border border-hairline hover:border-hairline-strong bg-canvas">
      {/* Percentage Indicator Bar */}
      <div 
        className={`absolute top-0 left-0 h-1 transition-all duration-700 ease-in-out ${isSafe ? 'bg-success' : 'bg-error'}`}
        style={{ width: `${stats.percentage}%` }}
      />
      
      <div className="flex justify-between items-start mb-s-md md:mb-s-lg">
        <div className="space-y-s-xxs min-w-0 flex-1 mr-s-sm">
          <p className="caption-mono text-mute uppercase tracking-wider text-[10px] font-medium">Subject</p>
          <h3 className="display-sm text-ink leading-tight break-words" title={subject.name}>{subject.name}</h3>
        </div>
        <div className="text-right flex flex-col items-end shrink-0">
          <div className="flex items-baseline gap-s-xxs tabular-nums">
            <p className="text-[24px] sm:text-display-md text-ink leading-none">{stats.percentage.toFixed(1)}</p>
            <span className="text-body-sm text-mute font-normal">%</span>
          </div>
          <p className="caption-mono text-[10px] text-mute mt-s-xs uppercase tracking-tighter">Goal: {subject.targetPercentage}%</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-s-xxs sm:gap-s-xs mb-s-lg bg-canvas-soft-2/80 rounded-sm p-s-sm border border-hairline/50 tabular-nums">
        <div className="text-center">
          <p className="caption-mono text-mute text-[9px] uppercase mb-s-xxs font-semibold">Attended</p>
          <p className="body-sm-strong text-ink">{stats.attended}</p>
        </div>
        <div className="text-center">
          <p className="caption-mono text-mute text-[9px] uppercase mb-s-xxs font-semibold">Absent</p>
          <p className="body-sm-strong text-ink">{stats.absent}</p>
        </div>
        <div className="text-center">
          <p className="caption-mono text-mute text-[9px] uppercase mb-s-xxs font-semibold">Leave</p>
          <p className="body-sm-strong text-ink">{stats.leave}</p>
        </div>
        <div className="text-center">
          <p className="caption-mono text-mute text-[9px] uppercase mb-s-xxs font-semibold">Total</p>
          <p className="body-sm-strong text-ink">{stats.conducted}</p>
        </div>
      </div>

      <div className="space-y-s-sm mb-s-xl flex-grow">
        {isSafe ? (
          <div className="p-s-sm rounded-sm bg-success/[0.03] border border-success/20 space-y-s-xs transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-s-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-success"></span>
                <p className="body-sm text-success font-medium">Safe Zone</p>
              </div>
              <p className="body-sm-strong text-success tabular-nums">{stats.safeBunks} bunks left</p>
            </div>
            <p className="text-[11px] text-success/70 leading-normal">You are above your target. You can miss {stats.safeBunks} more classes safely.</p>
          </div>
        ) : (
          <div className="p-s-sm rounded-sm bg-error/[0.03] border border-error/20 space-y-s-xs transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-s-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-error animate-pulse"></span>
                <p className="body-sm text-error font-medium">Critical</p>
              </div>
              <p className="body-sm-strong text-error tabular-nums">Attend {stats.toAttend}</p>
            </div>
            <p className="text-[11px] text-error/70 leading-normal">You are below your target. Attend the next {stats.toAttend} classes to recover.</p>
          </div>
        )}

        {/* Next Class Simulator */}
        <div className="pt-s-sm border-t border-hairline/50">
          <p className="caption-mono text-[9px] text-mute uppercase mb-s-sm tracking-widest font-bold">Next Class Impact</p>
          <div className="flex gap-s-sm tabular-nums">
            <div className="flex-1 space-y-s-xs">
              <p className="text-[10px] text-body">If Present</p>
              <div className="flex items-baseline gap-s-xxs">
                <p className={`text-body-sm-strong ${ifPresent >= subject.targetPercentage ? 'text-success' : 'text-error'}`}>{ifPresent.toFixed(1)}</p>
                <span className="text-[9px] text-mute font-medium">%</span>
              </div>
            </div>
            <div className="flex-1 space-y-s-xs">
              <p className="text-[10px] text-body">If Absent</p>
              <div className="flex items-baseline gap-s-xxs">
                <p className={`text-body-sm-strong ${ifAbsent >= subject.targetPercentage ? 'text-success' : 'text-error'}`}>{ifAbsent.toFixed(1)}</p>
                <span className="text-[9px] text-mute font-medium">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-s-xs mt-auto">
        <button 
          onClick={() => onMark('present')}
          className="flex-[1.5] h-9 rounded-pill bg-primary text-on-primary body-sm-strong hover:opacity-90 transition-all active:scale-[0.98] shadow-level-2"
          aria-label={`Mark present for ${subject.name}`}
        >
          Present
        </button>
        <button 
          onClick={() => onMark('absent')}
          className="flex-1 h-9 rounded-pill border border-hairline bg-canvas text-ink body-sm-strong hover:bg-canvas-soft transition-all active:scale-[0.98]"
          aria-label={`Mark absent for ${subject.name}`}
        >
          Absent
        </button>
        <button 
          onClick={() => onMark('leave')}
          className="flex-1 h-9 rounded-pill border border-hairline bg-canvas text-mute body-sm-strong hover:text-ink hover:bg-canvas-soft transition-all active:scale-[0.98]"
          title="Mark Leave"
          aria-label={`Mark leave for ${subject.name}`}
        >
          Leave
        </button>
      </div>

      <button 
        onClick={onDelete}
        className="absolute top-4 right-4 text-mute opacity-0 group-hover:opacity-100 transition-all p-1 hover:text-error hover:bg-error/10 rounded-full"
        title="Delete Subject"
        aria-label={`Delete ${subject.name}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
      </button>
    </div>
  );
};
