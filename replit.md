# Resorter360 Admin Panel

## Overview

This is a React-based admin panel for managing a real estate platform specializing in 360° virtual tours. The application provides a comprehensive interface for managing properties, locations, content, and file storage, with multi-language support and integration with external APIs for real estate data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing without React Router overhead
- **State Management**: TanStack Query for server state management with automatic caching and synchronization
- **UI Framework**: Shadcn/UI components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Form Management**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture  
- **Server**: Express.js with TypeScript serving both API endpoints and static assets
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations and migrations
- **Database Provider**: Neon Database (serverless PostgreSQL) for scalable cloud database hosting
- **API Proxy**: Express server acts as a proxy to external Resorter360 API while providing local functionality
- **Build System**: Vite for fast development and optimized production builds with ESBuild for server bundling

### Data Storage Solutions
- **Primary Database**: PostgreSQL accessed via Drizzle ORM with schema definitions in shared folder
- **File Storage**: Google Cloud Storage integration for handling property images, documents, and media files
- **Session Storage**: In-memory storage for admin sessions (development setup, would use Redis in production)
- **Static Assets**: Vite-managed static file serving with optimized bundling

### Authentication and Authorization
- **Admin Authentication**: Simple username/password system with session-based authentication
- **Session Management**: Server-side session storage with cookie-based client identification
- **Default Admin**: Hardcoded admin user for development (admin/admin123)
- **Route Protection**: Client-side route guards for authenticated admin access

### External Dependencies
- **Resorter360 API**: External REST API for property, city, region, place, and blog data management
- **Google Cloud Storage**: File upload and storage service for property images and documents  
- **Kuula Integration**: 360° virtual tour embedding platform for immersive property experiences
- **Multi-language Support**: Built-in translation system supporting Georgian (ka), English (en), and Russian (ru)
- **Calendar Integration**: iCalendar support for property availability and booking management
- **Uppy File Uploader**: Advanced file upload interface with drag-drop, progress tracking, and multiple file support

### Key Architectural Decisions

**Proxy Pattern**: The Express server acts as a proxy to the external Resorter360 API, allowing the frontend to communicate through a single endpoint while maintaining separation of concerns. This provides flexibility for caching, request modification, and local data augmentation.

**Shared Schema**: Database schemas and TypeScript types are defined in a shared folder accessible to both client and server, ensuring type consistency across the full stack and reducing duplication.

**Multi-language Architecture**: Language support is implemented through a flexible LanguageDto structure that can be attached to any entity, allowing for scalable internationalization without database schema changes.

**Component-Based UI**: The interface uses a modular component system with reusable UI components, form components, and page-specific layouts, promoting maintainability and consistent user experience.

**File Upload Strategy**: File uploads are handled through Google Cloud Storage with a local proxy endpoint, providing scalable storage while maintaining a simple upload interface through Uppy components.