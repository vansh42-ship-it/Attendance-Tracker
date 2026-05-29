import React, { createContext, useContext, useState, useEffect } from 'react';

export type AttendanceStatus = 'present' | 'absent' | 'leave';

export interface Subject {
  id: string;
  name: string;
  targetPercentage: number;
}

export interface AttendanceLog {
  id: string;
  subjectId: string;
  date: string;
  status: AttendanceStatus;
}

export interface TimetableEntry {
  day: number; // 0 (Sunday) to 6 (Saturday)
  subjectId: string;
  startTime?: string;
  endTime?: string;
}

interface AttendanceContextType {
  subjects: Subject[];
  logs: AttendanceLog[];
  timetable: TimetableEntry[];
  addSubject: (name: string, target?: number) => Subject;
  deleteSubject: (id: string) => void;
  markAttendance: (subjectId: string, status: AttendanceStatus, date?: string) => void;
  getSubjectStats: (subjectId: string) => any;
  overallPercentage: () => number;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  uploadTimetable: (entries: { day: number; subjectName: string }[]) => void;
  getTodayClasses: () => any[];
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedSubjects = localStorage.getItem('at_subjects');
      const savedLogs = localStorage.getItem('at_logs');
      const savedTimetable = localStorage.getItem('at_timetable');
      if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
      if (savedLogs) setLogs(JSON.parse(savedLogs));
      if (savedTimetable) setTimetable(JSON.parse(savedTimetable));
    } catch (e) {
      console.error("Failed to load attendance data", e);
    }
    setIsInitialized(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('at_subjects', JSON.stringify(subjects));
    localStorage.setItem('at_logs', JSON.stringify(logs));
    localStorage.setItem('at_timetable', JSON.stringify(timetable));
  }, [subjects, logs, timetable, isInitialized]);

  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const addSubject = (name: string, target: number = 75) => {
    const newSubject: Subject = {
      id: generateId(),
      name,
      targetPercentage: target,
    };
    setSubjects(prev => [...prev, newSubject]);
    return newSubject;
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter((s) => s.id !== id));
    setLogs(prev => prev.filter((l) => l.subjectId !== id));
    setTimetable(prev => prev.filter((t) => t.subjectId !== id));
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const uploadTimetable = (entries: { day: number; subjectName: string }[]) => {
    const newTimetable: TimetableEntry[] = [];
    const updatedSubjects = [...subjects];

    entries.forEach(entry => {
      let subject = updatedSubjects.find(s => s.name.toLowerCase() === entry.subjectName.toLowerCase());
      if (!subject) {
        subject = {
          id: generateId(),
          name: entry.subjectName,
          targetPercentage: 75,
        };
        updatedSubjects.push(subject);
      }
      newTimetable.push({
        day: entry.day,
        subjectId: subject.id,
      });
    });

    setSubjects(updatedSubjects);
    setTimetable(newTimetable);
  };

  const getTodayClasses = () => {
    const today = new Date().getDay();
    return timetable
      .filter(t => t.day === today)
      .map(t => ({
        ...t,
        subject: subjects.find(s => s.id === t.subjectId)
      }))
      .filter(t => t.subject !== undefined);
  };

  const markAttendance = (subjectId: string, status: AttendanceStatus, date?: string) => {
    const targetDate = date || new Intl.DateTimeFormat('en-CA').format(new Date()); // YYYY-MM-DD
    const newLog: AttendanceLog = {
      id: generateId(),
      subjectId,
      date: targetDate,
      status,
    };
    setLogs(prev => {
      const filtered = prev.filter(l => !(l.subjectId === subjectId && l.date === targetDate));
      return [...filtered, newLog];
    });
  };

  const getSubjectStats = (subjectId: string) => {
    const subjectLogs = logs.filter((l) => l.subjectId === subjectId);
    const attended = subjectLogs.filter((l) => l.status === 'present').length;
    const absent = subjectLogs.filter((l) => l.status === 'absent').length;
    const leave = subjectLogs.filter((l) => l.status === 'leave').length;
    
    const conducted = attended + absent;
    const percentage = conducted > 0 ? (attended / conducted) * 100 : 0;
    
    const subject = subjects.find(s => s.id === subjectId);
    const target = subject?.targetPercentage || 75;

    const safeBunks = target > 0 ? Math.max(0, Math.floor((attended * 100) / target - conducted)) : 0;

    let toAttend = 0;
    if (percentage < target && target < 100) {
      toAttend = Math.ceil((target * conducted - 100 * attended) / (100 - target));
    } else if (percentage < target && target === 100) {
      toAttend = Infinity; // Technically impossible to reach 100% if one is missed
    }

    return {
      attended,
      absent,
      leave,
      conducted,
      percentage,
      safeBunks,
      toAttend,
    };
  };

  const overallPercentage = () => {
    const totalAttended = logs.filter(l => l.status === 'present').length;
    const totalAbsent = logs.filter(l => l.status === 'absent').length;
    const totalConducted = totalAttended + totalAbsent;
    return totalConducted > 0 ? (totalAttended / totalConducted) * 100 : 0;
  };

  return React.createElement(AttendanceContext.Provider, {
    value: {
      subjects,
      logs,
      timetable,
      addSubject,
      deleteSubject,
      markAttendance,
      getSubjectStats,
      overallPercentage,
      updateSubject,
      uploadTimetable,
      getTodayClasses,
    }
  }, children);
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
