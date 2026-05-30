import React, { useState, useRef } from "react";
import { useAttendance } from "../store/useAttendance";
import { TimetableEditor } from "./TimetableEditor";

interface TimetableModalProps {
  onClose: () => void;
}

export const TimetableModal: React.FC<TimetableModalProps> = ({ onClose }) => {
  const { uploadTimetable } = useAttendance();
  const [activeTab, setActiveTab] = useState<'upload' | 'edit'>('edit');
  const [dragActive, setDragActive] = useState(false);
  const [pasteText, setPasteText] = useState("");
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
      if (text.trim().startsWith("[") || text.trim().startsWith("{")) {
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          uploadTimetable(data);
          onClose();
          return;
        }
      }

      const lines = text.split("\n").filter((line) => line.trim() !== "");
      const entries: { day: number; subjectName: string }[] = [];

      const dayMap: { [key: string]: number } = {
        sunday: 0, sun: 0, monday: 1, mon: 1, tuesday: 2, tue: 2, wednesday: 3, wed: 3, thursday: 4, thu: 4, friday: 5, fri: 5, saturday: 6, sat: 6,
      };

      lines.forEach((line) => {
        if (line.includes(":")) {
          const [dayStr, subjectsStr] = line.split(":");
          const day = dayMap[dayStr.trim().toLowerCase()];
          if (day !== undefined) {
            subjectsStr.split(",").forEach((s) => {
              if (s.trim()) entries.push({ day, subjectName: s.trim() });
            });
          }
        } else if (line.includes(",")) {
          const [dayStr, name] = line.split(",");
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
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => processTimetableData(event.target?.result as string);
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => processTimetableData(event.target?.result as string);
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-canvas rounded-2xl w-full max-w-5xl max-h-[90vh] shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300 overflow-hidden flex flex-col border border-hairline">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-hairline flex justify-between items-center bg-canvas">
          <div className="flex flex-col sm:flex-row sm:items-center gap-s-md sm:gap-s-xl">
            <div>
              <h3 className="text-xl font-bold text-ink">Timetable Manager</h3>
              <p className="text-sm text-mute mt-0.5">Organize your weekly classes</p>
            </div>
            
            <div className="flex bg-canvas-soft-2 p-1 rounded-pill border border-hairline w-fit h-fit">
              <button 
                onClick={() => setActiveTab('edit')}
                className={`px-s-md py-1 rounded-pill text-[11px] font-bold uppercase tracking-wider transition-all ${activeTab === 'edit' ? 'bg-canvas text-ink shadow-sm' : 'text-mute hover:text-body'}`}
              >
                Manual Edit
              </button>
              <button 
                onClick={() => setActiveTab('upload')}
                className={`px-s-md py-1 rounded-pill text-[11px] font-bold uppercase tracking-wider transition-all ${activeTab === 'upload' ? 'bg-canvas text-ink shadow-sm' : 'text-mute hover:text-body'}`}
              >
                Import
              </button>
            </div>
          </div>
          
          <button onClick={onClose} className="p-2 text-mute hover:text-ink hover:bg-canvas-soft-2 rounded-full transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-hairline">
          {activeTab === 'edit' ? (
            <TimetableEditor />
          ) : (
            <div className="max-w-2xl mx-auto space-y-8 py-s-xl">
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 transition-all flex flex-col items-center justify-center gap-4 ${dragActive ? "border-primary bg-primary/5" : "border-hairline bg-canvas-soft"}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              >
                <div className="w-16 h-16 rounded-full bg-canvas flex items-center justify-center shadow-level-2 border border-hairline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mute"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                </div>
                <div className="text-center space-y-1">
                  <p className="body-md-strong text-ink">Drag & drop your timetable file</p>
                  <p className="body-sm text-mute">Supports JSON, CSV, or TXT formats</p>
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="button-secondary h-10 text-sm mt-2">Browse Files</button>
                <input ref={fileInputRef} type="file" className="hidden" accept=".json,.csv,.txt" onChange={handleFileChange} />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-hairline"></span></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-mute"><span className="bg-canvas px-4">Or paste schedule text</span></div>
              </div>

              <div className="space-y-4">
                <textarea
                  className="w-full h-48 p-4 rounded-xl border border-hairline bg-canvas-soft text-ink focus:bg-canvas focus:border-primary outline-none transition-all placeholder:text-mute font-geist-mono text-sm"
                  placeholder={`Monday: Math, Physics, CS\nTuesday: Distributed Systems, Lab`}
                  value={pasteText} onChange={(e) => setPasteText(e.target.value)}
                />
                {error && <p className="text-sm text-error font-medium flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-error"></span>{error}</p>}
                
                <div className="p-4 rounded-xl bg-canvas-soft-2 border border-hairline">
                  <p className="text-xs text-body leading-relaxed">
                    <strong>Format Tip:</strong> Use <code>Day: Subject1, Subject2</code>. We'll create any subjects that don't exist yet!
                  </p>
                </div>
                
                <button
                  onClick={() => processTimetableData(pasteText)}
                  disabled={!pasteText.trim()}
                  className="button-primary w-full h-12 shadow-level-3 disabled:opacity-50"
                >
                  Import Schedule
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-hairline bg-canvas-soft-2 flex justify-end">
          <button onClick={onClose} className="px-8 h-10 rounded-xl bg-ink text-canvas font-bold hover:opacity-90 transition-all">Done</button>
        </div>
      </div>
    </div>
  );
};
