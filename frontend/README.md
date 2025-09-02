# Frontend - AI Agent Platform

## Overview

This is the React.js frontend for the AI Agent Builder & Management Platform. It provides a comprehensive web interface for building, managing, and orchestrating intelligent agents with integrations to Google AI Studio, Google Workspace apps, Gemini API, and GitHub.

## Features

- **Agent Catalog**: Browse and deploy pre-built AI agents
- **Connector Management**: Configure integrations with external services
- **Agent Run History**: Monitor and analyze agent execution logs
- **Workspace Settings**: Team management and platform configuration
- **Kernel Documentation**: Access to platform documentation and guides

## Architecture

- **React.js** with functional components and hooks
- **Component-based architecture** with reusable UI components
- **API integration** with backend services for agents, connectors, and kernel
- **Responsive design** for desktop and mobile use

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API server running (see /core directory)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Development Server

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.js      # Navigation sidebar
│   ├── Header.js       # Top navigation bar
│   ├── Layout.js       # Main layout wrapper
│   └── modals/         # Modal dialogs
├── pages/              # Main application pages
├── api/                # API client functions
├── App.js             # Root application component
└── index.js           # Application entry point
```

## API Integration

The frontend communicates with three main API services:

- **Agent API**: Agent CRUD operations and execution
- **Connector API**: Third-party service integrations
- **Kernel API**: Platform core functionality and documentation

## Contributing

When adding new components or pages:

1. Follow React functional component patterns
2. Add proper PropTypes or TypeScript definitions
3. Include API integration comments
4. Maintain responsive design principles
5. Update this README when adding major features
