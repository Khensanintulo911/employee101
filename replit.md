# DevPulse HR Portal

## Overview
A full-stack HR management application built with React, Express, and PostgreSQL. The application provides an executive dashboard for managing employees, leave requests, disciplinary cases, and training.

## Tech Stack
- **Frontend**: React 18 with TypeScript, Vite, TailwindCSS, Radix UI components
- **Backend**: Express 5 with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite 7

## Project Structure
```
├── client/           # React frontend
│   ├── src/          # React source code
│   ├── public/       # Static assets
│   └── index.html    # HTML template
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API routes
│   ├── storage.ts    # Database storage layer
│   ├── db.ts         # Database connection
│   └── vite.ts       # Vite dev server integration
├── shared/           # Shared code between frontend and backend
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # Shared route definitions
└── attached_assets/  # Asset files
```

## Scripts
- `npm run dev` - Start development server (serves both frontend and backend)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-provided by Replit)
- `PORT` - Server port (defaults to 5000)

## Development
The development server runs on port 5000 and serves both the Express API and the Vite-powered React frontend. HMR is enabled for fast development.

## Deployment
Configured for autoscale deployment with build step.
