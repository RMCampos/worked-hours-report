# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based worked hours tracking application (TaskNote App) that allows users to track daily work hours, generate reports, and manage themes. The app uses Appwrite as a backend service for data persistence and user authentication.

## Development Commands

- `npm run dev` - Start development server on port 5000 with host flag
- `npm run build` - Build for production (runs TypeScript compilation then Vite build)
- `npm run preview` - Build and preview production build on port 5000
- `npm test` - Run tests with Vitest
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix

## Architecture

### Core Structure
- **React 19** with TypeScript and Vite build system
- **Bootstrap 5** with React Bootstrap for UI components
- **Appwrite** integration for backend services (authentication, database, storage)
- **Context-based state management** for themes, auth, and messaging

### Key Contexts
- `ThemeProvider` (`src/context/themeContext.tsx`) - Manages light/dark theme switching
- `AuthProvider` (`src/context/authContext.tsx`) - Handles user authentication state
- `MessageProvider` (`src/context/MessageContext.tsx`) - Global message/notification system

### Main Components
- `TodayTracker` - Daily time tracking interface with up to 6 time entries
- `Report` - Monthly/period reporting functionality with JSON export/import
- `Navigation` - App navigation and user authentication UI
- `DarkButton` - Theme toggle functionality

### Data Models
- `DailyReport` - Structure for daily work reports with multiple time periods
- `TodayTrackerStore` - State structure for current day tracking (6 time slots)
- `MonthAmount` - Monthly hours/minutes aggregation

### Storage Service
The `storage-service/server.ts` provides Appwrite integration with functions for:
- User authentication (sign up/in/out)
- Theme persistence per user
- Time tracking data CRUD operations
- Period-based data retrieval

## Configuration

### Environment Variables
Required Vite environment variables for Appwrite integration:
- `VITE_PROJECT_ID` - Appwrite project ID
- `VITE_DATABASE_ID` - Appwrite database ID
- `VITE_WHOURS_TRACKER_COLLECTION_ID` - Time tracking collection
- `VITE_WHOURS_THEME_COLLECTION_ID` - User theme preferences collection
- `VITE_WHOURS_AMOUNT_COLLECTION_ID` - Monthly amounts collection

### Build Configuration
- **Vite config**: Custom port 5000, Bootstrap alias, source maps enabled
- **TypeScript**: Strict mode, React JSX transform, ESNext target
- **ESLint**: TypeScript + React rules with Stylistic formatting (2-space indent, single quotes)

### Path Aliases
- `@` → `./src` (configured in vite.config.ts)
- `~bootstrap` → `node_modules/bootstrap`

## Development Notes

The app supports both local JSON file import/export for time tracking data and cloud persistence through Appwrite. Time tracking supports up to 3 work periods per day (6 time entries total: start/stop pairs).