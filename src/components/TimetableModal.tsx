import React, { useState, useRef } from 'react';
import { useAttendance } from '../store/useAttendance';

interface TimetableModalProps {
  onClose: () => void;
}

export const TimetableModal: React.FC<TimetableModalProps> = ({ onClose }) => {
  const { uploadTimetable } = useAttendance();
  const [dragActive, setDragActive] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processTimetableData = (text: string) => {
    try {
      // Try parsing as JSON first
      if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          // Expected format: [{ day: 1, subjectName: "Math" }, ...]
          uploadTimetable(data);
          onClose();
          return;
        }
      }

      // Try parsing as CSV or simple text
      // Format: Monday: Math, Physics
      // Or: 1, Math
      const lines = text.split('\n').filter(line => line.trim() !== '');
      const entries: { day: number; subjectName: string }[] = [];
      
      const dayMap: { [key: string]: number } = {
        'sunday': 0, 'sun': 0,
        'monday': 1, 'mon': 1,
        'tuesday': 2, 'tue': 2,
        'wednesday': 3, 'wed': 3,
        'thursday': 4, 'thu': 4,
        'friday': 5, 'fri': 5,
        'saturday': 6, 'sat': 6
      };

      lines.forEach(line => {
        if (line.includes(':')) {
          const [dayStr, subjectsStr] = line.split(':');
          const day = dayMap[dayStr.trim().toLowerCase()];
          if (day !== undefined) {
            subjectsStr.split(',').forEach(s => {
              if (s.trim()) entries.push({ day, subjectName: s.trim() });
            });
          }
        } else if (line.includes(',')) {
          const [dayStr, name] = line.split(',');
          const day = parseInt(dayStr.trim()) || dayMap[dayStr.trim().toLowerCase()];
          if (day !== undefined && name.trim()) {
            entries.push({ day, subjectName: name.trim() });
          }
        }
      });

      if (entries.length > 0) {
        uploadTimetable(entries);
        onClose();
      } else {
        setError("Could not find any valid timetable entries. Try 'Monday: Subject1, Subject2' format.");
      }
    } catch (err) {
      setError("Failed to parse data. Please check the format.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        processTimetableData(text);
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        processTimetableData(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-canvas rounded-2xl w-full max-w-[500px] shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300 overflow-hidden flex flex-col border border-hairline">
        <div className="px-6 py-5 border-b border-hairline flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-ink">Upload Timetable</h3>
            <p className="text-sm text-mute mt-0.5">Import your weekly schedule</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-mute hover:text-ink hover:bg-canvas-soft-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div 
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center gap-4 ${dragActive ? 'border-primary bg-primary/5' : 'border-hairline bg-canvas-soft-2'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-12 h-12 rounded-full bg-canvas flex items-center justify-center shadow-sm border border-hairline">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mute"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div className="text-center">
              <p className="body-md-strong text-ink">Drag & drop your timetable file</p>
              <p className="body-sm text-mute mt-1">Supports JSON or CSV (.txt)</p>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="button-secondary-sm px-s-lg h-9 border border-hairline"
            >
              Browse Files
            </button>
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept=".json,.csv,.txt"
              onChange={handleFileChange}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-hairline"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-canvas px-2 text-mute font-bold tracking-widest">Or paste text</span>
            </div>
          </div>

          <div className="space-y-4">
            <textarea 
              className="w-full h-32 p-4 rounded-xl border border-hairline bg-canvas-soft-2 text-ink focus:bg-canvas focus:border-primary outline-none transition-all placeholder:text-mute font-mono text-sm"
              placeholder={`Monday: Math, Physics\nTuesday: Chemistry, CS`}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />
            {error && <p className="text-sm text-error font-medium">{error}</p>}
            <button 
              onClick={() => processTimetableData(pasteText)}
              disabled={!pasteText.trim()}
              className="w-full h-12 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              Import Timetable
            </button>
          </div>

          <div className="p-4 rounded-xl bg-link-bg-soft/50 border border-link/10">
            <p className="text-xs text-link-deep leading-relaxed">
              <strong>Tip:</strong> You can paste your timetable in the format <code>Day: Subject1, Subject2</code>. We'll automatically create subjects that don't exist yet!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
