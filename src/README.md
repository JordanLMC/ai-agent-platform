# Agent Kernel Backend

The backend core for the AI Agent Platform - a modular TypeScript architecture that provides comprehensive API endpoints for agent management, workflow orchestration, and third-party integrations.

## Architecture Overview

The Agent Kernel follows a modular, service-oriented architecture built on Node.js and TypeScript:

### Core Modules
- **API Layer** (`/api/v1/`) - RESTful endpoints with versioning support
- **Services** (`/services/`) - Business logic and core functionality
- **Models** (`/models/`) - Data entities and interface definitions
- **Plugins** (`/plugins/`) - Extensible integrations for agents, connectors, and tools
- **Middleware** (`/middleware/`) - Authentication, logging, and request processing
- **Config** (`/config/`) - Environment and application configuration
- **Utils** (`/utils/`) - Shared utilities and helper functions

### API Endpoints

#### Agents API (`/api/v1/agents/`)
- `GET /agents` - List all available agents
- `POST /agents` - Create new agent configuration
- `GET /agents/:id` - Get agent details
- `PUT /agents/:id` - Update agent configuration
- `DELETE /agents/:id` - Remove agent
- `POST /agents/:id/deploy` - Deploy agent to runtime

#### Agent Runs API (`/api/v1/agentRuns/`)
- `GET /runs` - List agent execution history
- `POST /runs` - Trigger new agent execution
- `GET /runs/:id` - Get run details and logs
- `POST /runs/:id/stop` - Stop running agent

#### Connectors API (`/api/v1/connectors/`)
- `GET /connectors` - List available integrations
- `POST /connectors` - Configure new connector
- `GET /connectors/:id` - Get connector details
- `PUT /connectors/:id` - Update connector settings
- `POST /connectors/:id/test` - Test connector connection

#### Schedules API (`/api/v1/schedules/`)
- `GET /schedules` - List scheduled workflows
- `POST /schedules` - Create new schedule
- `GET /schedules/:id` - Get schedule details
- `PUT /schedules/:id` - Update schedule configuration
- `DELETE /schedules/:id` - Remove schedule

#### Workspaces API (`/api/v1/workspaces/`)
- `GET /workspaces` - List user workspaces
- `POST /workspaces` - Create new workspace
- `GET /workspaces/:id` - Get workspace details
- `PUT /workspaces/:id` - Update workspace settings

#### Logs API (`/api/v1/logs/`)
- `GET /logs` - Query system and agent logs
- `GET /logs/agents/:id` - Get agent-specific logs
- `GET /logs/runs/:id` - Get run execution logs

#### Auth API (`/api/v1/auth/`)
- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh
- `GET /auth/profile` - User profile
- `POST /auth/logout` - Session termination

## Gemini API Integration

The Agent Kernel leverages Google's Gemini API for advanced AI capabilities:

### API Contracts

**Agent Configuration Schema**
```typescript
interface AgentConfig {
  id: string;
  name: string;
  description: string;
  geminiModel: 'gemini-pro' | 'gemini-pro-vision';
  systemInstructions: string;
  tools: ToolConfig[];
  connectors: ConnectorReference[];
  scheduling?: ScheduleConfig;
}
```

**Gemini Integration Points**
- Content generation and analysis
- Natural language processing for agent instructions
- Vision capabilities for document/image analysis
- Function calling for tool integration
- Multi-turn conversations with context retention

### Google AI Studio Design Patterns

The backend implements design patterns from Google AI Studio:

1. **Prompt Engineering**: Structured system instructions with context injection
2. **Function Calling**: Dynamic tool invocation based on conversation context
3. **Safety Settings**: Content filtering and responsible AI practices
4. **Model Configuration**: Temperature, top-k, and top-p parameter management
5. **Context Management**: Conversation history and state persistence

## Build & Run Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- TypeScript 5.0+
- Google AI Studio API key
- Environment configuration (see `.env.example`)

### Development Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Run database migrations (if applicable)
npm run migrate

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_PROJECT_ID=your_project_id

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Database (if applicable)
DATABASE_URL=your_database_connection_string

# External Integrations
GOOGLE_WORKSPACE_KEY=your_workspace_api_key
GITHUB_TOKEN=your_github_token
```

### API Documentation

Once running, API documentation is available at:
- Development: `http://localhost:3001/api/docs`
- Swagger/OpenAPI spec: `http://localhost:3001/api/swagger.json`

### Testing

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# API endpoint tests
npm run test:api

# Coverage report
npm run test:coverage
```

## Plugin Architecture

The Agent Kernel supports extensible plugins:

### Agent Plugins (`/plugins/agents/`)
Custom agent types with specific capabilities

### Connector Plugins (`/plugins/connectors/`)
Third-party service integrations (Google Workspace, GitHub, etc.)

### Tool Plugins (`/plugins/tools/`)
Reusable tools for agent workflows (web scraping, data processing, etc.)

## Contributing

1. Follow TypeScript best practices and ESLint rules
2. Add comprehensive tests for new features
3. Update API documentation for endpoint changes
4. Ensure compatibility with Gemini API contracts
5. Maintain plugin interface consistency

## Security Considerations

- API key management and rotation
- Input validation and sanitization
- Rate limiting and quota management
- Audit logging for all operations
- Secure storage of sensitive configuration

---

**Built with Google AI Studio design principles and Gemini API integration for enterprise-grade AI agent orchestration.**
