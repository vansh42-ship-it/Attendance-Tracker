import React from 'react';

export const Hero: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="relative isolate overflow-hidden min-h-screen bg-canvas selection:bg-primary selection:text-on-primary">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="mesh-gradient absolute left-[50%] top-0 h-[1000px] w-[2000px] -translate-x-[50%] opacity-[0.25]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-s-md md:px-s-lg pt-s-4xl md:pt-s-section pb-s-4xl md:pb-s-section text-center">
        <div className="inline-flex items-center gap-s-sm px-s-sm py-1 rounded-full border border-hairline bg-canvas-soft-2 mb-s-xl animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
          <p className="caption-mono text-[10px] uppercase tracking-[0.2em] text-body font-medium">Now in public alpha</p>
        </div>
        
        <h1 className="display-xl text-[40px] sm:text-[64px] md:text-[96px] leading-[1.1] md:leading-[0.9] tracking-[-0.05em] mb-s-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          Predict your success. <span className="text-primary italic block sm:inline">Automate your bunking.</span>
        </h1>
        
        <p className="body-md md:body-lg text-body max-w-2xl mx-auto mb-s-3xl text-balance animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 ease-out">
          The most advanced attendance tracker for students. Subject-wise logs, 
          predictive bunking algorithms, and a minimalist design inspired by world-class developer tools.
        </p>
        
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-s-md sm:gap-s-lg animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 ease-out">
          <button 
            onClick={onStart}
            className="button-primary h-14 px-s-xl text-lg shadow-level-4 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
            aria-label="Start using the dashboard"
          >
            Start Tracking Free
          </button>
          <a 
            href="https://github.com/Vansh/AttendanceTracker" 
            className="button-secondary h-14 px-s-xl text-lg flex items-center justify-center gap-s-sm transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-hairline-strong focus-visible:ring-offset-2 outline-none"
          >
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            View Source
          </a>
        </div>

        <div className="mt-s-3xl md:mt-s-section grid grid-cols-1 md:grid-cols-3 gap-s-xl text-left animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500 ease-out">
          <div className="card-marketing p-s-xl border border-hairline/50 hover:shadow-level-4">
            <div className="w-10 h-10 rounded-md bg-canvas-soft-2 flex items-center justify-center mb-s-lg border border-hairline shadow-level-1">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
            </div>
            <h3 className="display-sm mb-s-md tracking-tighter">Subject-wise logs.</h3>
            <p className="body-sm text-body leading-relaxed">Track every subject independently with custom targets and unique attendance history.</p>
          </div>
          <div className="card-marketing p-s-xl border border-hairline/50 hover:shadow-level-4">
            <div className="w-10 h-10 rounded-md bg-canvas-soft-2 flex items-center justify-center mb-s-lg border border-hairline shadow-level-1">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2v20"/><path d="m17 17-5 5-5-5"/><path d="m7 7 5-5 5 5"/></svg>
            </div>
            <h3 className="display-sm mb-s-md tracking-tighter">Predictive bunking.</h3>
            <p className="body-sm text-body leading-relaxed">Our algorithms tell you exactly how many classes you can skip while staying above your goals.</p>
          </div>
          <div className="card-marketing p-s-xl border border-hairline/50 hover:shadow-level-4">
            <div className="w-10 h-10 rounded-md bg-canvas-soft-2 flex items-center justify-center mb-s-lg border border-hairline shadow-level-1">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <h3 className="display-sm mb-s-md tracking-tighter">Vercel inspired.</h3>
            <p className="body-sm text-body leading-relaxed">Designed for speed and clarity. A stark, minimalist interface that stays out of your way.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
