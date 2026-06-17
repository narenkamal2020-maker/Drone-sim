<div align="center">

# 🧩 WorkSync

### A Modern Collaboration Platform for Student Organizations & Project Teams

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**[🚀 Live Demo](https://work-sync-22gfpcuk0-narenkamal2020-makers-projects.vercel.app/)**

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Build & Run](#-build--run)
- [Deployment](#-deployment)
- [API Overview](#-api-overview)
- [Architecture](#-architecture)
- [Future Improvements](#-future-improvements)
- [Performance](#-performance)
- [Author](#-author)
- [License](#-license)

---

## 🌐 Overview

**WorkSync** is a full-stack collaboration platform purpose-built for student organizations, club committees, and small project teams that need a lightweight but powerful way to coordinate work. Most student-run clubs rely on a patchwork of spreadsheets, group chats, and sticky notes to manage tasks and events — a system that breaks down quickly as membership grows and responsibilities multiply.

WorkSync solves this by giving every organization a centralized workspace: a Kanban-driven task board, project tracking, member management, and real activity history, all wrapped in a clean, modern interface. It is designed to feel as approachable as a personal to-do app while offering the structure teams need to actually ship projects on time.

**Target audience:**

- College and university club leadership teams
- Student project groups coordinating deliverables
- Hackathon and competition teams
- Any small organization that wants Trello-style workflow without third-party SaaS overhead

The project also serves as a demonstration of modern full-stack engineering practices — type-safe APIs, a clean data layer, and a production-ready deployment pipeline — making it a strong reference implementation for a Next.js + MongoDB application.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🖥️ **Modern Dashboard** | A unified home view summarizing active projects, pending tasks, and team activity at a glance. |
| 📋 **Kanban Board** | Drag-friendly board with **To Do**, **In Progress**, and **Done** columns for clear workflow visualization. |
| ✅ **Task Management** | Create, edit, assign, and track tasks with priority levels, descriptions, and due dates. |
| 📁 **Project Management** | Group related tasks under projects, monitor status, and track completion at the project level. |
| 👥 **Team Member Management** | Add and manage members, assign ownership of tasks and projects, and track individual contributions. |
| 🔔 **Activity Feed** | A real-time log of task updates, status changes, and team actions for full transparency. |
| 🔍 **Search & Filtering** | Quickly locate tasks or projects by keyword, status, assignee, or priority. |
| 📅 **Due Dates** | Set and visualize deadlines to keep teams accountable and on schedule. |
| 📊 **Analytics Dashboard** | Visual breakdowns of task completion rates, workload distribution, and project velocity. |
| 📈 **Progress Tracking** | Live progress indicators at both the task and project level. |
| 📱 **Responsive Design** | A fully adaptive layout that works seamlessly across desktop, tablet, and mobile devices. |
| 🌑 **Dark Glassmorphism UI** | A polished, modern dark theme using frosted-glass surfaces, subtle blur, and depth-driven design. |
| 🗄️ **MongoDB Persistence** | All workspace data is reliably stored and queried via MongoDB Atlas. |
| 🔗 **REST API** | A well-structured, predictable API layer powering every client interaction. |
| 🏗️ **Production-Ready Architecture** | Clean separation of concerns between UI, API routes, business logic, and data models. |

---

## 📸 Screenshots

> Replace the placeholders below with actual screenshots stored in a `/screenshots` or `/public/screenshots` directory.

| Landing Page | Dashboard |
|---|---|
<img width="1918" height="900" alt="image" src="https://github.com/user-attachments/assets/b26238e6-c1e5-4671-9d6c-d9a63cb4850b" />

| Kanban Board | Create Task |
|---|---|
<img width="1013" height="731" alt="image" src="https://github.com/user-attachments/assets/352948c5-ea3e-4710-89c8-1cee7629b4c1" />


| Project Management | Analytics |
|---|---|
<img width="381" height="658" alt="image" src="https://github.com/user-attachments/assets/2d1190de-e2fa-478a-9da6-e6b0b64338ad" />


---

## 🛠️ Tech Stack

**Frontend**

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework for routing, rendering, and full-stack capabilities |
| React | Component-driven UI library |
| TypeScript | Static typing for safer, more maintainable code |
| Tailwind CSS | Utility-first styling for rapid, consistent UI development |

**Backend**

| Technology | Purpose |
|---|---|
| Next.js API Routes | Serverless API endpoints colocated with the frontend |
| MongoDB | NoSQL database for flexible, document-based data storage |
| Mongoose | Schema-based ODM for modeling and validating MongoDB data |

**Development & Tooling**

| Tool | Purpose |
|---|---|
| ESLint | Code quality and consistency enforcement |
| npm | Package management and script execution |
| Vercel | Hosting and CI/CD deployment platform |

---

## 📂 Project Structure

```
worksync/
├── src/
│   ├── app/                   # Next.js App Router pages & API routes
│   │   ├── api/                # REST API endpoints (tasks, projects, members, etc.)
│   │   ├── dashboard/           # Dashboard route and views
│   │   ├── analytics/           # Analytics route and views
│   │   └── layout.tsx           # Root layout and global providers
│   ├── components/             # Reusable UI components (Kanban, cards, modals, nav)
│   ├── lib/                    # Database connection, utilities, and shared helpers
│   ├── models/                 # Mongoose schemas (Task, Project, Member, Activity)
│   ├── types/                  # Shared TypeScript types and interfaces
│   └── styles/                 # Global styles and Tailwind configuration
├── public/                     # Static assets (images, icons, screenshots)
├── .env.local                  # Local environment variables (not committed)
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project dependencies and scripts
```

---

## ⚙️ Installation

Follow these steps to set up WorkSync locally.

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/worksync.git
cd worksync
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your environment file

```bash
cp .env.example .env.local
```

### 4. Configure MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user and whitelist your IP address (or allow access from anywhere for development).
3. Copy your connection string and add it to `.env.local` as `MONGODB_URI`.

### 5. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root with the following variable:

```env
MONGODB_URI=
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | The connection string for your MongoDB Atlas cluster, used to establish a connection between the application and the database. This should include your cluster credentials and target database name, and must be kept private (never committed to version control). |

---

## 🏗️ Build & Run

| Command | Description |
|---|---|
| `npm install` | Installs all project dependencies |
| `npm run dev` | Starts the local development server with hot reloading |
| `npm run build` | Creates an optimized production build |
| `npm start` | Runs the production build locally |

---

## 🚀 Deployment

WorkSync is configured for seamless deployment on **Vercel**, the platform built by the creators of Next.js.

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/new).
3. Under **Project Settings → Environment Variables**, add:
   - `MONGODB_URI` — your production MongoDB Atlas connection string
4. Trigger a deployment. Vercel automatically detects the Next.js framework and applies the correct build settings.
5. Every subsequent push to the main branch triggers an automatic redeployment.

The live deployment for this project can be viewed here:
**[work-sync-22gfpcuk0-narenkamal2020-makers-projects.vercel.app](https://work-sync-22gfpcuk0-narenkamal2020-makers-projects.vercel.app/)**

---

## 🔗 API Overview

All API routes are implemented as Next.js Route Handlers under `src/app/api/`. The endpoints below are organized by resource.

| Resource | Endpoint | Description |
|---|---|---|
| **Tasks** | `/api/tasks` | Create, retrieve, update, and delete tasks |
| **Projects** | `/api/projects` | Manage project records and their associated tasks |
| **Members** | `/api/members` | Manage team member profiles and assignments |
| **Activities** | `/api/activities` | Retrieve the activity feed log for the workspace |
| **Workspace** | `/api/workspace` | Fetch aggregated workspace-level data |
| **Analytics** | `/api/analytics` | Retrieve computed metrics for dashboards and reports |

> Each route follows standard REST conventions (`GET`, `POST`, `PUT`/`PATCH`, `DELETE`) and returns predictable JSON responses with appropriate HTTP status codes.

---

## 🏛️ Architecture

WorkSync follows a clean, layered architecture that keeps concerns isolated and the codebase easy to extend:

```
        UI (React Components)
                 │
                 ▼
        API Routes (Next.js)
                 │
                 ▼
        Business Logic Layer
                 │
                 ▼
        MongoDB Models (Mongoose)
                 │
                 ▼
        MongoDB Atlas (Data Storage)
```

This structure is intentionally scalable and maintainable for several reasons:

- **Separation of concerns** — UI components never talk to the database directly; all data access flows through well-defined API routes.
- **Centralized business logic** — Validation, computed fields, and data transformations live in a single layer, reducing duplication.
- **Schema-driven data integrity** — Mongoose models enforce consistent structure and validation rules at the database boundary.
- **Framework-native scalability** — Next.js API routes deploy as independent serverless functions, allowing the backend to scale horizontally without infrastructure management.
- **Type safety end-to-end** — TypeScript interfaces shared across the frontend and backend reduce runtime errors and ease refactoring.

---

## 🔮 Future Improvements

- 🔐 **Authentication** — User accounts, sessions, and secure login (e.g., NextAuth.js)
- ⚡ **Real-Time Collaboration** — Live multi-user updates via WebSockets
- 🔔 **Notifications** — In-app and email alerts for task assignments and deadlines
- 📎 **File Uploads** — Attach documents and images directly to tasks
- 📆 **Calendar Integration** — Sync deadlines with Google Calendar / iCal
- 🛡️ **Role-Based Access Control** — Granular permissions for admins, leads, and members
- 💬 **Team Chat** — Built-in messaging for in-context team communication
- 🖱️ **Drag-and-Drop Improvements** — Enhanced Kanban interactions with smoother animations and multi-select

---

## ⚡ Performance

WorkSync is built with performance and maintainability as first-class concerns:

- **Server-side rendering** for fast initial page loads and improved SEO
- **Optimized API routes** designed for minimal payloads and efficient database queries
- **Component reuse** across views to reduce bundle size and duplication
- **Responsive design** that performs consistently across all screen sizes
- **Clean architecture** that keeps the codebase easy to navigate and extend
- **End-to-end type safety** that catches errors at compile time rather than runtime

---

## ✍️ Author

**WorkSync** was designed and built as a full-stack portfolio project demonstrating modern web development practices with Next.js, TypeScript, and MongoDB.

| | |
|---|---|
| 👤 **Name** | K Naren_ |
| 💼 **Role** | Full-Stack Developer |
| 🔗 **GitHub** | [github.com/narenkamal2020-maker](https://github.com/narenkamal2020-maker) |
| 🌐 **Live Project** | [work-sync-22gfpcuk0-narenkamal2020-makers-projects.vercel.app](https://work-sync-22gfpcuk0-narenkamal2020-makers-projects.vercel.app/) |

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

<div align="center">

**⭐ If you find this project useful, consider giving it a star on GitHub!**

</div>
