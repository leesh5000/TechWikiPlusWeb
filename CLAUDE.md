# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TechWikiPlusApp is the frontend application for a crowdsourcing platform where AI-generated technical documentation is verified and improved by the community. This repository contains only the frontend application, while the backend is developed separately using Kotlin + Spring Boot.

## Technology Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

### Backend

- **Separate Repository**: Kotlin + Spring Boot (to be developed)
- **API Communication**: RESTful endpoints

## Project Structure

```text
TechWikiPlusApp/
├── apps/
│   └── frontend/          # Next.js application
│       ├── app/          # App Router pages
│       ├── components/   # React components
│       ├── lib/         # Utilities and helpers
│       └── styles/      # Global styles
├── docs/                 # Project documentation
├── .gitignore           # Git ignore rules
├── package.json         # Root package configuration
└── README.md            # Project README
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

- [x] Responsive design with Tailwind CSS
- [x] Dark mode support
- [x] Mobile-friendly UI
- [x] Homepage layout
- [x] Header/Navigation component

### To be Implemented

- [ ] Document list page
- [ ] Document detail page
- [ ] Contribution page
- [ ] Leaderboard page
- [ ] User authentication (when backend is ready)
- [ ] Content management features
- [ ] Search functionality

## Development Guidelines

### Code Standards

- **TypeScript**: All new code must use TypeScript
- **Components**: Use React functional components with hooks
- **Styling**: Use Tailwind CSS classes
- **File naming**: Use kebab-case for files, PascalCase for components
- **Imports**: Use absolute imports with `@/` prefix

### Git Workflow

- **Branch Strategy**: GitHub Flow
  - `main`: Main branch
  - `feature/*`: Feature development

### Code Quality

- Write clean, readable code
- Follow React best practices
- Use semantic HTML elements
- Ensure accessibility (a11y)
- Write meaningful commit messages

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

## Notes for AI Assistant

- This is a frontend-only project
- Backend API is not yet implemented
- Focus on UI/UX improvements and component development
- Ensure responsive design for all screen sizes
- Maintain consistent styling with Tailwind CSS
- Follow Next.js 15 App Router conventions