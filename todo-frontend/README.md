TaskEngine is a TypeScript based productivity workspace built to reduce friction in task management. It automates categorization, 
draft saving, and cleanup so you can focus on actual work instead of maintaining lists.

Most to do apps require constant manual organization. TaskEngine removes that overhead by handling categorization and persistence automatically,
while keeping the interface fast and minimal.

![Dark Mode](./todo-frontend/assets/dark_main_app.png)
![Light Mode](./todo-frontend/assets/light_main_app.png)

Automatic Categorization

  The engine (ItemTypeDetector.ts) analyzes task titles as user types, and assigns categories automatically.
  No manual tagging or dropdown selection required.

Examples:

  “Pay rent” → Finance

  “Debug API” → Programming

  “Call boss” → Urgent

3 day removal
  Deleted tasks are moved to Trash with a timestamp.
  They remain recoverable for three days before permanent removal.

  This provides a safety buffer without long term clutter.

  Workspace AutoSave

The (useNoteAutoSave) hook ensures drafts are preserved:
  Writes immediately to localStorage

  Debounces database saves

  Prevents unnecessary network requests

  Survives page refreshes

  The result is a responsive editing experience with reliable persistence.

Keyboard Shortcuts
  Cmd + B	Toggle sidebar
  Cmd + L	Toggle theme
  Cmd + I	Jump to notes


Tech Stack:
  React
  TypeScript
  Vite
  Supabase
  LocalStorage (draft buffering)

