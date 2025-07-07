# ADG Monorepo

This repository is organized as an Nx workspace and implements an event-sourced architecture with a React client and a GraphQL query API.

## Event Sourcing (Backend)

- **Event Store:**  
  Uses a MongoDB-backed event store (`MongoEventStore`) to persist all domain events. Events are versioned and concurrency is enforced.
- **Event Bus:**  
  Publishes events using BullMQ queues (`BullMqEventBus`), enabling asynchronous event processing and integration with workers.
- **Domain Commands & Events:**  
  Domain logic is encapsulated in commands (e.g., `CreateUserCommand`, `UpdateUserNameCommand`) and events (e.g., `UserCreatedEvent`, `UserNameUpdatedEvent`).
- **Command Handlers:**  
  Command handlers process incoming commands, apply business logic, and emit events to the event store and event bus.
- **Read Model Projection:**  
  Workers (e.g., `processor-user-events`) listen for domain events and update MongoDB read models for efficient querying.

## Query API (GraphQL)

- **Apollo Server:**  
  Provides a GraphQL endpoint for querying the read model stored in MongoDB.
- **Resolvers & Type Definitions:**  
  Loads GraphQL type definitions and resolvers dynamically, supporting modular schema development.
- **Express Integration:**  
  The GraphQL server is mounted on an Express app, with CORS and logging middleware for development.

## Client Application (Frontend)

- **React App:**  
  The client is a React application using React Router for navigation.
- **Authentication:**  
  Integrates Google OAuth for authentication, storing credentials in session storage and managing user state.
- **API Communication:**  
  Uses Axios to communicate with the backend API, sending authenticated requests. Will eventually use GraphQL for main queries.
- **Feature Modules:**  
  Implements feature-based code splitting and lazy loading for scalable UI development.
- **Lots Management:**
  - **Lot List Table:** View, edit, and delete lots in a responsive table.

## Development

- **Nx Workspace:**  
  Use Nx CLI and Nx Console for code generation, building, and running tasks.
- **Running the App:**
  - Start the backend: `nx serve server`
  - Start the event processor: `nx serve processor-user-events`
  - Start the GraphQL query API: `nx serve query`
  - Start the frontend: `nx serve client`

### Authentication Bypass for Development

For development and testing purposes, you can bypass the Google OAuth authentication by setting the `BYPASS_AUTH` environment variable to `true`. This is useful for:

- Testing GraphQL Playground without needing authentication tokens
- Local development when you don't want to set up Google OAuth
- Automated testing scenarios

**To enable authentication bypass:**

1. Set the environment variable: `BYPASS_AUTH=true`
2. Start your services (query server, etc.)
3. Access GraphQL Playground at `http://localhost:4000/graphql` without authentication

**Warning:** Never use `BYPASS_AUTH=true` in production environments. This feature should only be used for development and testing.

When authentication is bypassed, a mock user is automatically created with:

- Email: `dev@example.com`
- Name: `Development User`
- Sub: `dev-user-123`

---

For more details, see the individual library and app README files.
