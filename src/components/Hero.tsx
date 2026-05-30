import React from 'react';

export const Hero: React.FC<{ onStart: () => void; customH1?: string }> = ({ onStart, customH1 }) => {
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
          {customH1 ? customH1 : (
            <>Predict your success. <span className="text-primary italic block sm:inline">Automate your bunking.</span></>
          )}
        </h1>
        
        <p className="body-md md:body-lg text-body max-w-2xl mx-auto mb-s-3xl text-balance animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 ease-out">
          The most advanced attendance tracker for students. Subject-wise logs, 
          predictive bunking algorithms, and a minimalist design inspired by world-class developer tools.
        </p>
        
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-s-md sm:gap-s-lg animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 ease-out mb-s-4xl">
          <button 
            onClick={onStart}
            className="button-primary h-14 px-s-xl text-lg shadow-level-4 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
            aria-label="Start using the dashboard"
          >
            Start Tracking Free
          </button>
        </div>

        {/* Features Section */}
        <div className="mt-s-3xl md:mt-s-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-s-xl text-left animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500 ease-out">
          <div className="card-marketing p-s-xl border border-hairline/50 hover:shadow-level-4">
            <div className="w-10 h-10 rounded-md bg-canvas-soft-2 flex items-center justify-center mb-s-lg border border-hairline shadow-level-1">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
            </div>
            <h3 className="display-sm mb-s-md tracking-tighter">Subject-wise logs.</h3>
            <p className="body-sm text-body leading-relaxed">The ultimate subject wise attendance tracker. Manage individual logs for all your courses and labs in one place.</p>
          </div>
          <div className="card-marketing p-s-xl border border-hairline/50 hover:shadow-level-4">
            <div className="w-10 h-10 rounded-md bg-canvas-soft-2 flex items-center justify-center mb-s-lg border border-hairline shadow-level-1">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2v20"/><path d="m17 17-5 5-5-5"/><path d="m7 7 5-5 5 5"/></svg>
            </div>
            <h3 className="display-sm mb-s-md tracking-tighter">Predictive bunking.</h3>
            <p className="body-sm text-body leading-relaxed">Advanced bunk calculator algorithms tell you exactly how many classes you can skip while staying above your goals.</p>
          </div>
          <div className="card-marketing p-s-xl border border-hairline/50 hover:shadow-level-4">
            <div className="w-10 h-10 rounded-md bg-canvas-soft-2 flex items-center justify-center mb-s-lg border border-hairline shadow-level-1">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22v-7l-2-2"/><path d="M17 22v-4.5"/><path d="M7 22v-11"/><path d="M12 10V4.5"/><path d="M12 2v1"/><path d="M12 7v1"/><path d="M12 12v1"/><path d="M12 17v1"/></svg>
            </div>
            <h3 className="display-sm mb-s-md tracking-tighter">Attendance 75.</h3>
            <p className="body-sm text-body leading-relaxed">Integrated attendance calculator 75. Automatically find how many classes you need to attend to hit the 75% mark.</p>
          </div>
          <div className="card-marketing p-s-xl border border-hairline/50 hover:shadow-level-4">
            <div className="w-10 h-10 rounded-md bg-canvas-soft-2 flex items-center justify-center mb-s-lg border border-hairline shadow-level-1">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <h3 className="display-sm mb-s-md tracking-tighter">College Grade UI.</h3>
            <p className="body-sm text-body leading-relaxed">The best college attendance calculator with a minimalist interface that tracks your attendance percentage in real-time.</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-s-section text-left max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-700 ease-out">
          <h2 className="display-md mb-s-xl tracking-tighter border-b border-hairline pb-s-md">Frequently Asked Questions</h2>
          <div className="space-y-s-xl">
            <div>
              <h4 className="body-md font-semibold text-ink mb-s-xs">What is an attendance calculator?</h4>
              <p className="body-sm text-body">An attendance calculator is a tool used by students to track their classes and calculate their current attendance percentage. Our college attendance calculator helps you stay on top of your goals.</p>
            </div>
            <div>
              <h4 className="body-md font-semibold text-ink mb-s-xs">How do I use the bunk calculator feature?</h4>
              <p className="body-sm text-body">Simply enter your current attended and total classes. The bunk calculator will tell you how many future classes you can miss while staying above your target, like the 75% requirement.</p>
            </div>
            <div>
              <h4 className="body-md font-semibold text-ink mb-s-xs">Can I track my subjects individually?</h4>
              <p className="body-sm text-body">Yes, this subject wise attendance tracker allows you to create separate logs for each course, ensuring you never fall behind in any specific subject.</p>
            </div>
            <div>
              <h4 className="body-md font-semibold text-ink mb-s-xs">Why is it important to stay above 75%?</h4>
              <p className="body-sm text-body">Most colleges require a minimum of 75% attendance to sit for exams. Our attendance calculator 75 helps you ensure you always meet this threshold effortlessly.</p>
            </div>
            <div>
              <h4 className="body-md font-semibold text-ink mb-s-xs">Is this attendance tracker free to use?</h4>
              <p className="body-sm text-body">Absolutely! Our attendance percentage calculator is free for all students to help them automate their bunking and focus more on their studies.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
