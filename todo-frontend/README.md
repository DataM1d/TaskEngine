🚀 Task Manager Pro: High Performance Todo Engine
A sophisticated, type safe Task Management Dashboard engineered with React 18, TypeScript, and Supabase. This project represents a complete architectural evolution from a standard JavaScript implementation to a robust, scalable enterprise grade application.

🛠️ Current Architectural State
1. Type Safe Evolution (JS → TS)
The core engine has been completely refactored to TypeScript. By implementing strict interface definitions for Todo, Category, and SidebarStats, i have eliminated entire classes of runtime errors and improved developer velocity through IDE autocompletion and compile time validation.

2. Intelligent Auto Classification Engine
Standard todo apps require manual tagging. This system features a Smart Classification Service that utilizes:

Contextual Keyword Mapping: Automatically identifies URGENT or WORK tasks based on title semantics.

Persistence Cache (ai_cache): A custom Supabase implementation that "remembers" user specific categorization patterns to personalize the automation over time.

3. Advanced State & Performance Management
Optimistic UI Updates: Utilizing custom hooks to provide instantaneous user feedback while syncing with the Supabase PostgreSQL backend.

Soft Delete Architecture: Implemented a non destructive "Trash" workflow allowing for task recovery and "Recovered" status tracking before permanent purging.

Strategic Memoization: Used React.memo and useCallback to ensure the UI remains performant as the task list scales.

🗄️ Database Architecture & Infrastructure
The backend is powered by a normalized PostgreSQL schema, fully documented in the /supabase directory as Infrastructure as Code.

100% Production Accuracy
The provided schema.sql is mirrored directly from the live production environment to ensure zero drift between development and deployment:

Native UUID Generation: Utilizes gen_random_uuid() for primary keys to ensure global uniqueness.

Timestamp Precision: Enforces timezone('utc'::text, now()) for consistent audit logs across different time zones.

Stateful Boolean Flags: Beyond simple status strings, the schema utilizes is_completed, is_deleted, and is_recovered flags for granular state tracking.

Relational Integrity: Strictly maps todos_category_id_fkey to maintain data consistency across relational tables.

✅ Automated Data Hygiene
Successfully implemented a PostgreSQL background worker utilizing the pg_cron extension:

Automation Live: The purge-trash-daily job is scheduled for 0 0 * * * (every midnight).

Business Logic: A custom PL/pgSQL function (purge_old_trash) surgically removes items marked as 'deleted' only after a 3-day retention period, preventing database bloat.

🎨 Design Philosophy: UX-First
Modern Glassmorphism: Utilizes backdrop filters and semi transparent surfaces to create depth without visual clutter.

Spatial Architecture: Implements a balanced asymmetrical layout (280px sidebar / 1400px container) to optimize horizontal scanning.

Depth & Dimensionality: Leverages multi layered shadowing to produce a tactile 3D effect.

📅 The Roadmap: Version 2.0
🏗️ In Progress: Granular Planning (Notes) — Expanding the Todo interface to support nested notes and descriptions.

🏗️ In Progress: Dynamic Customization — Allowing users to define custom categories and dashboard tabs.

🧪 Future: Calendar Integration — Chronological visualization of task density and deadlines.

🚦 Getting Started
Clone and Install: npm install

Environment Setup: Configure .env with Supabase credentials.

Database Setup: Run the contents of supabase/migrations/schema.sql in your Supabase SQL editor.

Run: npm run dev

Developed with precision by DataM1d.