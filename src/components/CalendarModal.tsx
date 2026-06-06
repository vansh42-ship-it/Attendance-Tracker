import React, { useState } from "react";
import { useAttendance, type AttendanceStatus } from "../store/useAttendance";

interface CalendarModalProps {
  onClose: () => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ onClose }) => {
  const { subjects, logs, markAttendance } = useAttendance();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const selectedDateStr = formatDate(selectedDate);

  const hasAttendanceOnDate = (day: number) => {
    const dateStr = formatDate(new Date(year, month, day));
    return logs.some((l) => l.date === dateStr);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 overflow-y-auto bg-black/60">
      <div className="bg-canvas rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300 overflow-hidden flex flex-col border border-hairline">
        <div className="px-5 py-4 border-b border-hairline flex justify-between items-center bg-canvas">
          <div>
            <h3 className="text-lg font-bold text-ink">Attendance Calendar</h3>
            <p className="text-xs text-mute mt-0.5">
              Review and mark previous attendances
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-mute hover:text-ink hover:bg-canvas-soft-2 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-base font-bold text-ink">
                {new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  year: "numeric",
                }).format(viewDate)}
              </h4>
              <div className="flex gap-1.5">
                <button
                  onClick={prevMonth}
                  className="p-1.5 hover:bg-canvas-soft-2 rounded-lg border border-hairline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-canvas-soft-2 rounded-lg border border-hairline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="text-center py-1 text-[9px] font-bold text-mute uppercase tracking-widest"
                >
                  {d}
                </div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
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
                      aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all border
                      ${isSelected ? "bg-primary border-primary text-on-primary shadow-md shadow-primary/20 scale-105 z-10" : "hover:bg-canvas-soft-2 border-hairline text-ink"}
                      ${isToday && !isSelected ? "border-primary/50 text-primary font-bold" : ""}
                    `}
                  >
                    <span className="text-xs">{day}</span>
                    {hasAttendance && (
                      <div
                        className={`w-0.5 h-0.5 rounded-full mt-0.5 ${isSelected ? "bg-on-primary" : "bg-primary"}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Marking Section */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div>
              <h4 className="text-base font-bold text-ink mb-0.5">
                {new Intl.DateTimeFormat("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                }).format(selectedDate)}
              </h4>
              <p className="text-xs text-mute">Mark attendance</p>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto max-h-[300px] pr-1">
              {subjects.map((subject) => {
                const log = logs.find(
                  (l) =>
                    l.subjectId === subject.id && l.date === selectedDateStr,
                );
                return (
                  <div
                    key={subject.id}
                    className="p-3 rounded-lg border border-hairline bg-canvas-soft flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-semibold text-ink truncate max-w-[120px]">
                        {subject.name}
                      </span>
                      {log && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider
                          ${
                            log.status === "present"
                              ? "bg-success/10 text-success"
                              : log.status === "absent"
                                ? "bg-error/10 text-error"
                                : "bg-warning/10 text-warning"
                          }
                        `}
                        >
                          {log.status}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() =>
                          markAttendance(subject.id, "present", selectedDateStr)
                        }
                        className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all border
                          ${log?.status === "present" ? "bg-success border-success text-white" : "bg-canvas border-hairline text-mute hover:text-success hover:border-success"}
                        `}
                      >
                        P
                      </button>
                      <button
                        onClick={() =>
                          markAttendance(subject.id, "absent", selectedDateStr)
                        }
                        className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all border
                          ${log?.status === "absent" ? "bg-error border-error text-white" : "bg-canvas border-hairline text-mute hover:text-error hover:border-error"}
                        `}
                      >
                        A
                      </button>
                      <button
                        onClick={() =>
                          markAttendance(subject.id, "leave", selectedDateStr)
                        }
                        className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all border
                          ${log?.status === "leave" ? "bg-warning border-warning text-white" : "bg-canvas border-hairline text-mute hover:text-warning hover:border-warning"}
                        `}
                      >
                        L
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-hairline bg-canvas-soft-2 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 h-9 rounded-lg bg-ink text-canvas text-sm font-bold hover:opacity-90 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
