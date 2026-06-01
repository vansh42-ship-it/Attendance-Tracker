# 📊 AttendanceTracker.xyz

A high-performance, privacy-focused, premium web utility designed for college students to effortlessly track subject-wise attendance, manage weekly timetables, and maintain baseline academic targets (e.g., 75% minimum criteria).

Built using **Astro** for server-side pre-rendered speed and SEO maximization, coupled with reactive **React component islands** for fluid client-side data mutations.

---

## ✨ Unique Selling Propositions (USPs)

* **🧠 Context-Aware Dashboard:** The application automatically evaluates the current calendar day relative to the user's master timetable, dynamically floating "Active Class Channels" to the absolute top of the feed to minimize user tracking friction.
* **⚡ Absolute Input Sovereignty (Odd-Day Overrides):** While optimized for structure via smart defaults, the architecture never restricts user logging. Students retain total freedom to record unexpected makeup lectures, extra classes, or custom weekend labs outside the scope of their standard timetable.
* **📋 Dynamic Parser Engine:** Features an intelligent text-scraping fallback mechanism. Users can instantly import an entire semester's schedule via a single JSON configuration or by copying and pasting a messy text string (`Day: Sub1, Sub2`).
* **🗂️ Multi-Subject Array Matrix:** Natively handles vast, multi-branch engineering curriculums, electives, and standalone practical lab courses with individual target thresholds.

---

## 🚀 Tech Stack

* **Framework Engine:** [Astro JS](https://astro.build/) (Static Site Generation / Isomorphic Hybrid Architecture)
* **Interactive Layer:** React JS (Leveraging Astro's isolated hydration islands)
* **Styling Framework:** Tailwind CSS (Fluid design, dark-mode adaptive layouts)
* **State Management:** Zustand (Reactive local storage tracking persistence)

---

## 🛠️ Project File Architecture

```text
AttendanceTracker/
├── public/                 # Static assets pipeline (Direct copy deployment)
│   ├── favicon.svg         # High-resolution custom vector brand mark
│   └── robots.txt          # Production crawler configuration directive
├── src/
│   ├── components/         # Highly specialized UI islands (React/Astro components)
│   │   ├── TimetableModal.tsx    # Drag-Drop/Paste parsing file pipeline
│   │   └── TimetableEditor.tsx   # Interactive scheduling matrix grid
│   ├── layouts/            # Base document meta blueprints
│   ├── styles/             # Global Tailwind directives
│   └── pages/              # Clean filesystem-based URL routing layout trees
│       └── index.astro     # Core dashboard interface entry point
├── astro.config.mjs        # Engine configurations
└── package.json            # Development dependencies baseline
