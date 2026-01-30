# DevPulse HR Portal

A professional, full-stack Human Resources Management System (HRMS) designed for streamlined employee administration, leave management, and organizational oversight.

## 🚀 Features

- **Executive Dashboard**: Real-time visualization of HR metrics, employee distribution, and recent activities.
- **Employee Management**: Centralized database for employee records with built-in validation for compliance (ID numbers, email formats).
- **Leave Management**: Automated leave request workflow with intelligent duration tracking and HR notification logic.
- **Disciplinary Tracking**: Secure logging of workplace incidents and corrective actions.
- **Training & Development**: Comprehensive tracking of employee certifications and professional growth.

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript, Vite, TailwindCSS, Radix UI
- **Backend**: Express 5 (TypeScript)
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query (React Query)
- **UI Components**: Shadcn UI (Radix-based)

## 📦 Project Structure

```text
├── client/           # React frontend application
│   ├── src/          # Source code (Components, Pages, Hooks, Lib)
│   └── index.html    # Entry point
├── server/           # Express backend API
│   ├── storage.ts    # Data access layer
│   └── routes.ts     # API endpoints
├── shared/           # Shared types and Zod schemas
└── drizzle/          # Database migrations and configurations
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v20 or higher)
- PostgreSQL Database

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
4. Initialize the database:
   ```bash
   npm run db:push
   ```

### Development
Start the development server (runs both frontend and backend):
```bash
npm run dev
```

## 📝 License
MIT License - Copyright (c) 2026
