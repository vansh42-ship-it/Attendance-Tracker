import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAttendance } from '../store/useAttendance';

interface ProfileModalProps {
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { profile, updateProfile } = useAttendance();
  
  const [name, setName] = useState(profile.name);
  const [rollNo, setRollNo] = useState(profile.rollNo);
  const [batch, setBatch] = useState(profile.batch);
  const [section, setSection] = useState(profile.section);
  const [college, setCollege] = useState(profile.college);
  const [currentCgpa, setCurrentCgpa] = useState(profile.currentCgpa);
  const [targetCgpa, setTargetCgpa] = useState(profile.targetCgpa);
  const [photo, setPhoto] = useState(profile.profilePhoto || '');
  
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    
    // Check file size (max 5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Please select an image under 5MB.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const targetSize = 150; // 150x150px is perfect for avatar
        
        // Calculate crop to make it a square
        let srcX = 0;
        let srcY = 0;
        let srcSize = Math.min(img.width, img.height);
        
        if (img.width > img.height) {
          srcX = (img.width - img.height) / 2;
        } else {
          srcY = (img.height - img.width) / 2;
        }

        canvas.width = targetSize;
        canvas.height = targetSize;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, targetSize, targetSize);
          
          // Compress to JPEG with 0.8 quality (approx 10-20KB)
          const base64 = canvas.toDataURL('image/jpeg', 0.8);
          setPhoto(base64);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Student Name',
      rollNo: rollNo.trim(),
      batch: batch.trim(),
      section: section.trim(),
      college: college.trim(),
      currentCgpa: Number(currentCgpa) || 0,
      targetCgpa: Number(targetCgpa) || 0,
      profilePhoto: photo,
    });
    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-4 sm:pt-8 overflow-y-auto bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-canvas rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300 overflow-hidden flex flex-col border border-hairline">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-hairline flex justify-between items-center bg-canvas">
          <div>
            <h3 className="text-lg font-bold text-ink">Edit Student Profile</h3>
            <p className="text-xs text-mute mt-0.5">Customize your student identity and academic targets</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-mute hover:text-ink hover:bg-canvas-soft-2 rounded-full transition-colors shrink-0"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Avatar Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-hairline/50">
            <div className="relative group shrink-0">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-canvas-soft-2 border border-hairline shadow-level-2 flex items-center justify-center animate-all duration-300">
                {photo ? (
                  <img src={photo} alt="Profile Preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-display-md text-mute font-medium uppercase">
                    {(name || 'S').charAt(0)}
                  </span>
                )}
              </div>
              {photo && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-1.5 -right-1.5 p-1 bg-error hover:bg-error-deep text-white rounded-full shadow-md transition-colors"
                  title="Remove Photo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
            </div>

            <div
              className={`flex-1 w-full border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer ${
                dragActive ? 'border-primary bg-primary/5' : 'border-hairline bg-canvas-soft-2 hover:bg-canvas-soft'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              <p className="text-xs font-bold text-ink">Drag profile photo here or click to browse</p>
              <p className="text-[10px] text-mute">Supports JPG, PNG, WebP (compressed to square)</p>
              {error && (
                <p className="text-[10px] text-error font-medium mt-1 flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-error"></span> {error}
                </p>
              )}
            </div>
          </div>

          {/* Identity Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="student-name" className="text-[11px] font-bold text-body uppercase tracking-wider">
                Full Name
              </label>
              <input
                id="student-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vansh Kumar"
                className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas-soft-2 text-ink focus:bg-canvas focus:border-primary outline-none transition-all placeholder:text-mute text-sm"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="student-roll" className="text-[11px] font-bold text-body uppercase tracking-wider">
                Roll Number / Student ID
              </label>
              <input
                id="student-roll"
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="e.g. 2K20/CO/400"
                className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas-soft-2 text-ink focus:bg-canvas focus:border-primary outline-none transition-all placeholder:text-mute text-sm"
              />
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="student-batch" className="text-[11px] font-bold text-body uppercase tracking-wider">
                Batch / Graduation Year
              </label>
              <input
                id="student-batch"
                type="text"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                placeholder="e.g. 2023 - 2027"
                className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas-soft-2 text-ink focus:bg-canvas focus:border-primary outline-none transition-all placeholder:text-mute text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="student-section" className="text-[11px] font-bold text-body uppercase tracking-wider">
                Section / Class
              </label>
              <input
                id="student-section"
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="e.g. CSE-1"
                className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas-soft-2 text-ink focus:bg-canvas focus:border-primary outline-none transition-all placeholder:text-mute text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="student-college" className="text-[11px] font-bold text-body uppercase tracking-wider">
                College / University
              </label>
              <input
                id="student-college"
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Delhi Technological University"
                className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas-soft-2 text-ink focus:bg-canvas focus:border-primary outline-none transition-all placeholder:text-mute text-sm"
              />
            </div>
          </div>

          {/* Academic Targets / CGPA */}
          <div className="border-t border-hairline/50 pt-5 space-y-4">
            <h4 className="caption-mono text-mute uppercase tracking-widest text-[10px]">CGPA Monitor Settings</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="current-cgpa" className="text-[11px] font-bold text-body uppercase tracking-wider">
                    Current CGPA
                  </label>
                  <span className="text-xs font-semibold text-ink font-geist-mono">{Number(currentCgpa).toFixed(2)}</span>
                </div>
                <input
                  id="current-cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={currentCgpa || ''}
                  onChange={(e) => setCurrentCgpa(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 8.45"
                  className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas-soft-2 text-ink focus:bg-canvas focus:border-primary outline-none transition-all placeholder:text-mute text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="target-cgpa" className="text-[11px] font-bold text-body uppercase tracking-wider">
                    Target CGPA
                  </label>
                  <span className="text-xs font-semibold text-ink font-geist-mono">{Number(targetCgpa).toFixed(2)}</span>
                </div>
                <input
                  id="target-cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={targetCgpa || ''}
                  onChange={(e) => setTargetCgpa(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 9.00"
                  className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas-soft-2 text-ink focus:bg-canvas focus:border-primary outline-none transition-all placeholder:text-mute text-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-hairline/50">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 h-11 rounded-xl border border-hairline text-body font-bold hover:bg-canvas-soft-2 active:scale-[0.98] transition-all text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 h-11 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 active:scale-[0.98] shadow-lg shadow-primary/10 transition-all text-sm"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
