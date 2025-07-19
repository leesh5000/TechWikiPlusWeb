# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TechWikiPlus is a crowdsourcing platform where AI-generated technical documentation is verified and improved by the community. Contributors receive economic rewards for their contributions, creating a sustainable technical knowledge ecosystem.

## Technology Stack

### Frontend

- **Framework**: Next.js 18 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Editor**: Monaco Editor (for content editing)
- **Markdown**: react-markdown + remark plugins

### Backend

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL (main) + Redis (cache)
- **ORM**: Prisma
- **Authentication**: JWT + Passport.js
- **Search**: Elasticsearch
- **Storage**: AWS S3

### DevOps

- **Container**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

## Common Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run type-check

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

## Architecture Overview

### System Architecture

- **Frontend**: Next.js application served via CDN (CloudFlare)
- **Backend**: NestJS REST API (with optional GraphQL)
- **Database**: PostgreSQL with Redis caching layer
- **Storage**: AWS S3 for file storage
- **Search**: Elasticsearch for content search

### Key Design Patterns

1. **Authentication**: JWT-based with refresh tokens
2. **Authorization**: Role-based Access Control (RBAC)
3. **Caching**: Redis for frequently accessed data
4. **API Design**: RESTful endpoints following REST conventions
5. **Content Versioning**: Track all edits with version history

## Project Structure

```text
TechWikiPlus/
├── apps/
│   ├── frontend/          # Next.js application
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   ├── lib/         # Utilities and helpers
│   │   └── styles/      # Global styles
│   └── backend/          # NestJS application
│       ├── src/
│       │   ├── modules/  # Feature modules
│       │   ├── common/   # Shared utilities
│       │   └── main.ts   # Application entry
│       └── prisma/       # Database schema
├── packages/             # Shared packages
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Shared utilities
└── docs/                # Project documentation
```

## Database Schema

Key tables:

- `users`: User accounts with OAuth integration
- `posts`: AI-generated content
- `edit_requests`: Community edits with voting
- `point_transactions`: Reward tracking
- `advertisements`: Ad management

## API Endpoints

### Authentication

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`

### Content Management

- `GET /api/posts` - List posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts/:id/edit-request` - Submit edit

### User Management

- `GET /api/users/:id` - User profile
- `GET /api/users/:id/contributions` - User contributions

### Points System

- `GET /api/points/history` - Transaction history
- `POST /api/points/withdraw` - Request withdrawal

## Development Workflow

1. **Feature Development**:
   - Create feature branch from `main`
   - Implement with TDD approach
   - Ensure all tests pass
   - Submit PR with clear description

2. **Content Editing Flow**:
   - AI generates initial content
   - Users submit edit requests
   - Community votes on edits
   - Approved edits are merged
   - Contributors receive points

3. **Testing Strategy**:
   - Unit tests for business logic
   - Integration tests for API endpoints
   - E2E tests for critical user flows

## Performance Considerations

- Implement code splitting for frontend
- Use Redis caching for frequently accessed data
- Optimize database queries with proper indexing
- Implement virtual scrolling for long content lists
- Use CDN for static assets

## Security Guidelines

- All API endpoints require authentication (except public content viewing)
- Implement rate limiting on all endpoints
- Sanitize all user inputs, especially markdown content
- Use prepared statements to prevent SQL injection
- Encrypt sensitive data with AES-256
