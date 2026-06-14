import React, { useState, useRef, useEffect } from 'react';
import { useAttendance, AttendanceProvider } from '../store/useAttendance';
import { ProfileModal } from './ProfileModal';

const HeaderProfileContent: React.FC = () => {
  const { profile } = useAttendance();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="h-8 w-8 rounded-full overflow-hidden bg-canvas-soft-2 border border-hairline shadow-sm hover:border-hairline-strong transition-all flex items-center justify-center shrink-0 cursor-pointer focus:outline-none relative"
        title={`${profile.name} - Profile Menu`}
        aria-expanded={showDropdown}
        aria-haspopup="menu"
      >
        {profile.profilePhoto ? (
          <img src={profile.profilePhoto} alt={profile.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-[11px] font-bold text-mute uppercase">
            {profile.name.charAt(0)}
          </span>
        )}
      </button>

      {showDropdown && (
        <div 
          className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-canvas border border-hairline shadow-level-5 p-4 z-50 text-left animate-in zoom-in-95 duration-100 origin-top-right"
          role="menu"
        >
          {/* Header */}
          <div className="pb-3 border-b border-hairline/80">
            <p className="text-sm font-bold text-ink truncate">{profile.name}</p>
            {profile.rollNo && (
              <p className="caption-mono text-[10px] text-body mt-0.5 truncate">ID: {profile.rollNo}</p>
            )}
          </div>

          {/* Academic Info */}
          {(profile.section || profile.batch || profile.college) && (
            <div className="py-2.5 border-b border-hairline/80 space-y-1">
              {(profile.section || profile.batch) && (
                <p className="caption-mono text-[9px] text-mute uppercase tracking-wider">
                  {profile.section} {profile.section && profile.batch && '•'} {profile.batch}
                </p>
              )}
              {profile.college && (
                <p className="text-[11px] text-body leading-tight truncate" title={profile.college}>
                  {profile.college}
                </p>
              )}
            </div>
          )}

          {/* CGPA display */}
          <div className="py-3 border-b border-hairline/80 flex justify-between items-center font-geist-mono">
            <div>
              <p className="caption-mono text-mute uppercase tracking-widest text-[8px] mb-0.5">Current CGPA</p>
              <p className="text-sm font-black text-ink">{profile.currentCgpa ? profile.currentCgpa.toFixed(2) : '--'}</p>
            </div>
            <div className="text-right">
              <p className="caption-mono text-mute uppercase tracking-widest text-[8px] mb-0.5">Target CGPA</p>
              <p className={`text-sm font-black ${profile.currentCgpa >= profile.targetCgpa && profile.targetCgpa > 0 ? 'text-success' : 'text-ink'}`}>
                {profile.targetCgpa ? profile.targetCgpa.toFixed(2) : '--'}</p>
            </div>
          </div>

          {/* Edit Profile button */}
          <div className="pt-2">
            <button
              onClick={() => {
                setShowDropdown(false);
                setShowModal(true);
              }}
              className="w-full h-8 rounded-md bg-primary text-on-primary text-xs font-bold hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <ProfileModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export const HeaderProfile: React.FC = () => {
  return (
    <AttendanceProvider>
      <HeaderProfileContent />
    </AttendanceProvider>
  );
};
