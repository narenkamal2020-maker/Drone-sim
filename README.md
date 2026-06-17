# ⚡ Catalyst Node - Club Collaboration & Project Workspace

Catalyst Node is a premium, recruiter-grade project management and collaboration platform designed for high-performing teams and university clubs. Built on the modern **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, and **MongoDB/Mongoose**, it provides a performance-optimized cyber-glass visual workspace.

The core engine is an interactive **Kanban Board** featuring an **offline-first local state pattern** with **background server synchronization** and automatic status rollback upon network or server failures.

---

## 📂 Target Directory Architecture

The repository enforces a strict separation of concerns, unidirectional data flow, and complete, strict TypeScript coverage (zero `any` type escapes).

```plaintext
src/
├── app/
│   ├── layout.tsx             # Global layout (providers, metadata, Plus Jakarta Sans font)
│   ├── page.tsx               # Main Dashboard with Analytics Grid, Side Panels & Modals
│   └── api/
│       ├── tasks/route.ts     # Task CRUD (GET, POST)
│       ├── tasks/[id]/route.ts# Task Mutations (PATCH, DELETE)
│       ├── projects/route.ts  # Projects Core API (GET, POST)
│       └── members/route.ts   # Team Members API (GET, POST)
├── config/
│   └── db.ts                  # Idempotent MongoDB connection client with pooling
├── models/
│   ├── Task.ts                # Task Mongoose Schema & TS interfaces
│   ├── Project.ts             # Project Mongoose Schema & TS interfaces
│   └── Member.ts              # Member Mongoose Schema & TS interfaces
├── components/
│   ├── ui/                    # Reusable visual atoms (Badge, Button, Card)
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── dashboard/             # Composite molecules (KanbanBoard, MetricsCard, FilterBar)
│   │   ├── KanbanBoard.tsx
│   │   ├── MetricsCard.tsx
│   │   └── FilterBar.tsx
│   └── TaskCard.tsx           # Glassmorphic drag-and-drop Card component
├── lib/
│   ├── utils.ts               # Tail-merge styling utilities
│   └── validation.ts          # Zod runtime verification schemas
```

---

## ⚙️ Technical Specifications & Blueprints

### 1. Offline-First & Background Sync Pattern
When a user updates a task's status (by dragging-and-dropping a card, or using the quick action arrow triggers):
1. **Optimistic Local State Update**: The task's status changes instantly in the client-side React state.
2. **Visual Feedback**: The card displays a subtle amber `Syncing...` badge.
3. **Background Sync**: A `PATCH` API request is dispatched in the background to modify the database.
4. **Error Rollback**: If the network request fails (e.g. server down, database timeout), the card reverts to its original column, the syncing indicator disappears, and a red `ShieldAlert` notification badge appears on the card for 5 seconds to alert the user of the sync failure.

### 2. Strict Type Safety
- **Explicit React Typing**: All event handlers (`React.DragEvent`, `React.ChangeEvent`, `React.FormEvent`) are strictly typed.
- **Zero `any` Declarations**: All variables and API responses are typed according to their schema interfaces (`ITask`, `IProject`, `IMember`), guaranteeing compiling integrity.

### 3. Data Schema & Relationships
- **Projects**: Core entities that catalog tasks. Includes `name`, `description`, and `category` (Development, Design, Marketing).
- **Members**: Club collaborators who are assigned to tasks. Contains `name`, `role`, `email` (unique), and a hex `avatarColor` for custom dynamic avatar generations.
- **Tasks**: Relational tasks featuring a `projectId` reference (required) and `assignedTo` member reference (nullable). Includes a calendar `dueDate` and `priority` tags.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js v20+](https://nodejs.org)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally (port `27017`) or a MongoDB Atlas URI.

### 1. Clone & Install Dependencies
Navigate to the root directory and install dependencies:
```bash
# Using npm.cmd on Windows if PowerShell execution policies are restricted:
npm.cmd install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/catalyst_node
```

### 3. Run Development Server
```bash
npm.cmd run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🛠️ Build Verification

To run static type checking, code validation, and compile the optimized production bundle:
```bash
npm.cmd run build
```

The output shows 100% compile success:
```plaintext
✓ Compiled successfully in 36.8s
  Running TypeScript ...
  Finished TypeScript in 60s ...
  Collecting page data using 3 workers ...
✓ Generating static pages using 3 workers (9/9) in 3.2s
  Finalizing page optimization ...
Exit code: 0
```

---

## 🎨 Premium Visual Elements

- **Main Canvas background**: `#0A0E17` representing a rich dark space theme.
- **Cyber-Glass Panel Card Styling**: Frosted overlays utilizing `bg-[#161F30]/60`, custom backdrop-blurs, and fine `border border-slate-800` styling.
- **Micro-Interactions**: Custom scale click animations (`active:scale-[0.98]`) on buttons, cards, and modal triggers.
- **Glow Accents**: Colored focus rings and status glows matching status markers (Electric Sky Blue `#0EA5E9`, Cyber Amber `#F59E0B`, Emerald Green `#10B981`, and Neon Crimson `#EF4444`).
