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

---

For more details, see the individual library and app README files.
