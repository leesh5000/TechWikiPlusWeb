# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TechWikiPlusApp is the frontend application for a crowdsourcing platform where AI-generated technical documentation is verified and improved by the community. This repository contains only the frontend application, while the backend is developed separately using Kotlin + Spring Boot.

## Technology Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **React**: React 19
- **Styling**: Tailwind CSS + shadcn/ui design system
- **Icons**: Lucide React
- **Markdown**: React Markdown with GitHub Flavored Markdown support
- **Syntax Highlighting**: React Syntax Highlighter
- **Utilities**: clsx, tailwind-merge

### Backend

- **Separate Repository**: Kotlin + Spring Boot (to be developed)
- **API Communication**: RESTful endpoints

## Project Structure

```text
TechWikiPlus/
├── apps/
│   └── frontend/              # Next.js 15 application
│       ├── app/              # App Router pages
│       │   ├── docs/         # Document-related pages
│       │   │   ├── [id]/     # Dynamic document routes
│       │   │   │   ├── review/   # Document verification pages
│       │   │   │   └── page.tsx  # Document detail page
│       │   │   └── page.tsx  # Document listing page
│       │   ├── contribute/   # Contribution pages
│       │   └── layout.tsx    # Root layout
│       ├── components/       # React components
│       │   ├── docs/         # Document-specific components
│       │   ├── home/         # Homepage components
│       │   ├── layout/       # Layout components (Header, Footer)
│       │   ├── markdown/     # Markdown rendering components
│       │   └── ui/           # Reusable UI components
│       ├── lib/              # Utilities and helpers
│       └── styles/           # Global CSS
├── docs/                     # Project documentation (planning, PRD, TRD)
├── CLAUDE.md                 # AI assistant guidance
└── README.md                 # Project overview
```

## Common Commands

```bash
# Navigate to frontend directory
cd apps/frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Frontend Features

### Implemented

- [x] Responsive design with Tailwind CSS + shadcn/ui
- [x] Dark mode support with theme toggle
- [x] Mobile-friendly UI with responsive navigation
- [x] Homepage with hero section and feature showcase
- [x] Header/Navigation with search bar
- [x] Document listing page with filtering and search
- [x] Document detail pages with markdown rendering
- [x] Document verification/review system with line-by-line comments
- [x] Real-time countdown timers for verification deadlines
- [x] Interactive voting system for document verification
- [x] Custom dropdown components with consistent styling
- [x] Code syntax highlighting in documents
- [x] Responsive document cards with status indicators

### To be Implemented

- [ ] Contribution page
- [ ] Leaderboard page  
- [ ] User authentication (when backend is ready)
- [ ] Real-time notifications
- [ ] Advanced search with filters
- [ ] Document editing interface
- [ ] User profile pages

## Architecture & Development Patterns

### Component Architecture

The application follows a clear separation between Server and Client Components:

- **Server Components**: Handle data fetching, static rendering (`/app/docs/[id]/page.tsx`, `/app/docs/[id]/review/page.tsx`)
- **Client Components**: Manage interactivity and state (`ReviewPageContent.tsx`, `DocumentActions.tsx`)
- **Shared Components**: Reusable UI components in `/components/ui/` and `/components/layout/`

### Document Verification System

Core architecture for the document review workflow:
- `VerificationStatus`: 'unverified' | 'verifying' | 'verified'
- Real-time countdown timers for verification deadlines
- Line-by-line comment system with type categorization
- Vote aggregation during verification period

### Mock Data Patterns

Currently uses mock data with realistic structure:
- Document objects with verification status and timestamps
- Comment system with author, type, and timestamp
- Consistent data shape for easy API integration later

### Custom Component Patterns

- **Dropdown Component**: Centralized, consistent dropdown UI across the app
- **DocumentActions**: Stateful component handling verification workflows
- **Markdown Rendering**: Custom components for code highlighting and responsive layout

### Development Guidelines

#### Code Standards

- **TypeScript**: All new code must use TypeScript with strict typing
- **Components**: Use React functional components with hooks
- **Styling**: Use Tailwind CSS classes following the shadcn/ui design system
- **File naming**: Use kebab-case for files, PascalCase for components
- **Imports**: Use absolute imports with `@/` prefix

#### Next.js 15 Specific Requirements

- **Dynamic Routes**: Always await `params` in page components due to Next.js 15 requirement
- **Server/Client Separation**: Never use async in Client Components marked with 'use client'
- **Component Composition**: Separate data fetching (Server) from interactivity (Client)

### Git Workflow

- **Branch Strategy**: GitHub Flow
  - `main`: Main branch
  - `feature/*`: Feature development

### Code Quality

- Write clean, readable code following React patterns
- Use semantic HTML elements for accessibility
- Ensure proper TypeScript typing for all props and state
- Follow established component patterns for consistency

## API Integration

When the backend is ready, the frontend will communicate via REST API endpoints. The API client will be implemented to handle:

- Authentication and authorization
- Content management
- User management
- Search and filtering

## Deployment

### Production Build

```bash
cd apps/frontend
npm run build
```

The build output will be in the `.next` directory and can be deployed to any platform that supports Next.js applications.

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Default port (3000) might be in use
   - Use `PORT=3001 npm run dev` to use different port

2. **Dependency Issues**
   - Run `npm install` to reinstall dependencies
   - Delete `node_modules` and reinstall if needed

3. **Build Errors**
   - Check TypeScript errors with `npx tsc --noEmit`
   - Ensure all imports are correct

## Project Goals

This frontend application aims to provide:

1. **Clean UI/UX**: Modern, responsive design
2. **Performance**: Fast loading and smooth interactions
3. **Accessibility**: Usable by everyone
4. **Maintainability**: Well-structured, documented code
5. **Scalability**: Easy to extend with new features

## Next.js 15 Development Notes

### Critical Next.js 15 Patterns

**Dynamic Route Parameters**: All dynamic route components must await params:
```typescript
// CORRECT: app/docs/[id]/page.tsx
export default async function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Use id...
}

// INCORRECT: Will cause build errors
export default function DocPage({ params }: { params: { id: string } }) {
  const id = params.id // Error in Next.js 15
}
```

**Server vs Client Component Separation**:
- Server Components: Async, handle data fetching, no state/effects
- Client Components: 'use client', handle user interactions, state management
- Never mix: Async Client Components will fail

### Current Implementation Patterns

**Document Verification Workflow**:
1. Server Component fetches document data (`page.tsx`)
2. Client Component handles interactive verification (`ReviewPageContent.tsx`)
3. Real-time updates use useEffect with cleanup for timers
4. Comment system uses local state with mock data structure

**Component Composition**:
- Layout components (`Header`, `Footer`) are Client Components for interactivity
- Page components are Server Components for data fetching  
- Interactive widgets (`DocumentActions`, `Dropdown`) are Client Components

## Notes for AI Assistant

- This is a frontend-only project with mock data for development
- Backend API is not yet implemented - maintain mock data patterns
- Focus on UI/UX improvements following shadcn/ui design system
- Ensure responsive design for all screen sizes (mobile-first approach)
- Maintain consistent styling with Tailwind CSS utility classes
- Follow Next.js 15 App Router conventions strictly (especially async params)
- When adding new features, separate Server and Client Components appropriately
- Use the established Dropdown component pattern for form controls
- Follow the document verification workflow patterns for new review features