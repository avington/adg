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

## Architecture Overview

This project follows a CQRS (Command Query Responsibility Segregation) and Event Sourcing architecture pattern with the Saga pattern for complex business process coordination.

### Architecture Flow

```
Commands → Command Handlers → Aggregates → Events → Event Store
                ↓
            Event Bus → Sagas/Event Handlers → Read Models
```

### Components

#### Commands & Command Handlers

- **Commands**: Represent user intentions to change system state
- **Command Handlers**: Process commands and coordinate between aggregates, event store, and event bus
- Example: `CreateLotCommand` → `CreateLotCommandHandler`

#### Aggregates

- **Aggregates**: Domain entities that enforce business rules and generate events
- **Event Sourcing**: State is derived from a sequence of events rather than stored directly
- Example: `LotAggregate` manages lot creation and updates

#### Events & Event Store

- **Events**: Immutable facts about what happened in the system
- **Event Store**: Persistent storage for all events, providing complete audit trail
- Example: `LotCreatedEvent`, `LotUpdatedEvent`

#### Event Bus

- **Event Bus**: Routes events to subscribers (sagas, read model projections, etc.)
- **Publishers**: Command handlers publish events after successful aggregate operations
- **Subscribers**: Sagas and event handlers subscribe to relevant events

#### Sagas

- **Sagas**: Coordinate complex business processes across multiple aggregates
- **Event-Driven**: React to events and orchestrate subsequent operations
- Example: `LotPositionUpdateSaga` updates position overviews when lots change

#### Read Models

- **Projections**: Optimized views of data for queries
- **Eventually Consistent**: Updated asynchronously via event handlers
- Example: Position overviews with calculated dollar cost averages

### Key Libraries

- `@adg/server-shared-kernel`: Core abstractions (Event, Command, AggregateRoot, IEventBus, IEventStore)
- `@adg/server-domain-lot-*`: Lot domain implementation (commands, events, aggregates, handlers, sagas)
- `@adg/server-domain-position-*`: Position domain implementation
- `@adg/global-formulas`: Business calculation logic (dollar cost averaging, etc.)
- `@adg/global-models`: Shared data models and interfaces
- `@adg/global-validations`: Input validation schemas

### Benefits

- **Scalability**: Separate read and write models can be optimized independently
- **Auditability**: Complete event history provides full audit trail
- **Flexibility**: Easy to add new projections and business processes
- **Testability**: Clear separation of concerns and event-driven architecture
- **Consistency**: Sagas ensure complex business processes maintain data consistency

---

For more details, see the individual library and app README files.
