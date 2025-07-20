# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TechWikiPlusApp is a crowdsourcing platform frontend where AI-generated technical documentation is verified and improved by the community. Built with Next.js 15, it provides a comprehensive document review system with real-time voting and verification workflows.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **React**: React 19
- **Styling**: Tailwind CSS + shadcn/ui design system
- **Icons**: Lucide React
- **Markdown**: React Markdown with GitHub Flavored Markdown support
- **Syntax Highlighting**: React Syntax Highlighter with VS Code-style themes

## Essential Commands

```bash
cd apps/frontend    # Navigate to frontend
npm install         # Install dependencies
npm run dev         # Development server (http://localhost:3000)
npm run build       # Production build
npm run start       # Production server
npm run lint        # ESLint check
npx tsc --noEmit   # TypeScript type check
```

**Note**: No test framework is currently configured. Consider adding Jest/React Testing Library when needed.

## Critical Architecture Patterns

### Next.js 15 Dynamic Routes
All dynamic route components MUST await params:
```typescript
// ✅ CORRECT
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}

// ❌ WRONG - Will cause build errors
export default function Page({ params }: { params: { id: string } }) {
  const id = params.id // Error in Next.js 15
}
```

### Document Review System Architecture

The review system (`/app/docs/[id]/review/ReviewPageContent.tsx`) implements:

1. **Multi-line Selection**: Drag to select multiple lines for commenting
2. **Comment System**:
   - Types: '개선' (improvement), '오류' (error), '제안' (suggestion), '질문' (question)
   - Suggested changes with strikethrough original + green replacement text
   - Auto-expanding textareas
   - Keyboard shortcuts: Alt+Enter (submit), ESC (cancel)
3. **Event Handling**: Critical `stopPropagation` on button `onMouseDown` to prevent conflicts with drag selection
4. **Voting System**: Real-time vote counting during 72-hour verification period

### Theme System (VS Code Style Dark Mode)

Global CSS variables in `globals.css`:
```css
.dark {
  --background: 0 0% 11.8%;    /* VS Code #1e1e1e equivalent */
  --card: 0 0% 14.5%;          /* VS Code #252526 equivalent */
  --foreground: 0 0% 83.1%;    /* Soft gray, not pure white */
  --border: 0 0% 27.5%;        /* More visible borders */
}
```

Theme persistence via localStorage in `Header.tsx`:
- Checks `localStorage.getItem('theme')`
- Falls back to system preference
- Smooth transitions with CSS

### Real-time Countdown System

Verification countdown implementation pattern:
```typescript
// ReviewCountdown component pattern
const calculateTimeRemaining = (endTime: string) => {
  const difference = new Date(endTime).getTime() - new Date().getTime()
  // Returns formatted string: "X시간 Y분 Z초 남음"
}

useEffect(() => {
  const timer = setInterval(() => {
    setTimeRemaining(calculateTimeRemaining(deadline))
  }, 1000)
  return () => clearInterval(timer)
}, [deadline])
```

### Mock Data Patterns

All mock data follows consistent structure for easy API integration:
```typescript
type VerificationStatus = 'unverified' | 'verifying' | 'verified'

interface Document {
  id: number
  verificationStatus: VerificationStatus
  verificationStartedAt?: string  // ISO string
  verificationEndAt?: string      // ISO string
  upvotes: number
  downvotes: number
}
```

## Component Patterns

### Server vs Client Components
- **Server Components**: Data fetching, no state/effects (`page.tsx` files)
- **Client Components**: Interactivity, state management (use `'use client'`)
- **Never mix**: Async Client Components will fail

### Reusable Components
- **Dropdown**: Centralized dropdown with click-outside handling
- **DocumentActions**: Handles verification state transitions and voting
- **CodeBlock**: Syntax highlighting with dark mode detection

## Key Implementation Details

### Review Page Read-Only Mode
`ReviewPageContent` accepts props for reusability:
```typescript
interface ReviewPageContentProps {
  doc: Document
  readOnly?: boolean           // Disables editing
  initialComments?: ReviewComment[]  // Pre-populated comments
}
```

### Auto-expanding Textareas
```typescript
const adjustHeight = (element: HTMLTextAreaElement) => {
  element.style.height = 'auto'
  element.style.height = `${element.scrollHeight}px`
}
```

### Tooltip Positioning
Comments tooltip appears on hover with debounced show/hide to prevent flickering.

## Development Workflow

1. **Feature Development**: Create feature branches from `main`
2. **Component Creation**: Check existing patterns in `/components`
3. **Styling**: Use Tailwind classes, follow shadcn/ui conventions
4. **Dark Mode**: Test both light and dark modes
5. **Responsive**: Mobile-first approach, test all breakpoints

## Current Implementation Status

### Completed Features
- Document listing with search/filter
- Document detail with markdown rendering  
- Review system with multi-line comments
- Verification workflow with 72-hour countdown
- Dark mode with VS Code-style colors
- Responsive design for all screens

### Pending Features
- Backend API integration (currently using mock data)
- User authentication
- Real-time notifications
- Document editing interface
- Contribution/Leaderboard pages

## Important Notes

- All data is currently mocked - maintain consistent patterns for future API integration
- Review system's `+ 버튼` click handling requires `onMouseDown` with `stopPropagation`
- Countdown timers auto-update document status after 72 hours (mock behavior)
- Theme changes use CSS transitions for smooth switching
- Always test drag selection in review mode after any event handler changes