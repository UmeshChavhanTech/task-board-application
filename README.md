#  Task Board Application

A responsive and modern task board app built using **React**, **Vite**, **TypeScript**, **Tailwind CSS**, and **React Query**. Users can view boards, see tasks by columns, and manage their productivity.

##  Live Demo

▶ [View Live App](https://task-board-application-m938wggq5-umeshs-projects-46e58dc1.vercel.app/)

---

##  Features

-  Column and Task-based Board View
-  Create/Edit/Delete Columns and Tasks
-  Dark Mode Ready
-  Component-Based Design
-  Lightning-fast Vite Setup
-  Tailwind CSS theming
-  React Query for State Management
-  Modal Management (Task/Column creation)
-  Toast Notifications with `sonner` and custom Toaster

---

##  Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Bundler**: Vite
- **State Management**: React Context, React Query
- **Routing**: React Router
- **Utilities**: Headless UI, Sonner, Radix UI, clsx

---

## 📁 Folder Structure

src/
├── components/
│ ├── ui/
│ ├── CreateTaskForm.tsx
│ ├── TaskCard.tsx
├── context/
│ └── BoardContext.tsx
├── pages/
│ ├── BoardView.tsx
│ ├── BoardDetail.tsx
│ ├── NotFound.tsx
├── types/
│ └── index.ts
├── App.tsx
├── main.tsx
└── index.css


---

## Getting Started Locally

### Prerequisites

- Node.js 18+
- Git

### Installation

```bash
git clone https://github.com/<your-username>/task-board-application.git
cd task-board-application
npm install
npm run dev
