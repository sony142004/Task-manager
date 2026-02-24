# ProTasks - Premium Task Manager

## Project Overview
ProTasks is a full-stack Kanban-style task management system designed for teams and individuals who need a high-performance, visually stunning workflow tool. It supports dynamic task organization, rich metadata integration (Slack, GitHub, Gmail), and a seamless dark/light mode experience.

## ✨ Key Features
- **Kanban Workflow**: Manage tasks through 'To Do', 'In Progress', 'In Review', and 'Done' stages.
- **Premium Design**: Built with a custom Design System using Inter typography and glassmorphic elements.
- **Dark Mode**: Fully dynamic theme switching with persistent local state.
- **Rich Media**: Supports image attachments and integration icons for Slack, GitHub, and more.
- **Real-time Persistence**: Powered by a Node.js/SQLite backend for reliable data storage.

## 🛠️ Technologies Used
- **Frontend**: React (Vite), Framer Motion, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Deployment**: Vercel (Monorepo configuration)
- **Styling**: Vanilla CSS with Design Tokens (Custom Properties)

## 🏗️ Architecture
The project is structured as a **Monorepo**:
- `/frontend`: React application with Vite, optimized for fast performance and high-quality UI.
- `/backend`: REST API handling CRUD operations and database persistence.
- `vercel.json`: Handles complex routing and builds for production environments.

## 🚦 Getting Started
### Local Development
1. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. **Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```

## 📝 API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks ordered by creation date |
| POST | `/api/tasks` | Create a new task with image, tags, and status |
| PUT | `/api/tasks/:id` | Update an existing task's metadata or status |
| DELETE| `/api/tasks/:id` | Permanently remove a task |
