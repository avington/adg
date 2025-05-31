import {
  CreateUserPayload,
  UserCreatedPayload,
  UserNameUpdatedPayload,
} from '@adg/global-models';
import { AggregateRoot } from '@adg/server-event-store';
import {
  USER_AGGREGATE_TYPE,
  USER_CREATED_EVENT,
  USER_NAME_UPDATED_EVENT,
  UserCreatedEvent,
  UserNameUpdatedEvent,
} from '@adg/server-user';
import { v4 as uuidv4 } from 'uuid';

export class UserAggregate extends AggregateRoot<
  UserCreatedEvent | UserNameUpdatedEvent
> {
  public lastName!: string;
  public firstName!: string;
  public email!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  constructor(id?: string) {
    super(id || uuidv4()); // Generate ID if not provided (for new aggregates)
  }

  get aggregateType(): string {
    return USER_AGGREGATE_TYPE;
  }

  // --- Command Handlers / Business Logic ---
  public createUser(payload: CreateUserPayload): void {
    // Check if 'this.email' is already set.
    // If so, this aggregate instance has already processed a UserCreatedEvent
    // and calling createUser again would be an invalid operation for this instance.
    if (this.email) {
      throw new Error(
        `User with ID '${this.aggregateId}' has already been created. Cannot call createUser again.`
      );
    }

    const creationTime = new Date();
    const eventPayload: UserCreatedPayload = {
      userId: this.aggregateId, // The user's ID is the aggregate's ID
      lastName: payload.lastName,
      email: payload.email,
      createdAt: creationTime,
    };

    this.apply<UserCreatedEvent>({
      aggregateId: this.aggregateId,
      aggregateType: this.aggregateType,
      eventType: USER_CREATED_EVENT,
      version: this.version + 1, // Tentative next version for the new event
      payload: eventPayload,
      timestamp: creationTime, // Consistent timestamp
    });
  }

  public updateName(payload: UserNameUpdatedPayload): void {
    if (!this.email) {
      // Check if user has been created (i.e., email is set)
      throw new Error(
        `User with ID '${this.aggregateId}' does not exist. Cannot update name.`
      );
    }
    if (this.lastName === payload.lastName) {
      console.log(
        `Name for user ${this.aggregateId} is already set to '${payload.lastName}'. No event will be emitted.`
      );
      return; // No change needed
    }

    const updateTime = new Date();
    this.apply<UserNameUpdatedEvent>({
      aggregateId: this.aggregateId,
      aggregateType: this.aggregateType,
      eventType: USER_NAME_UPDATED_EVENT,
      version: this.version + 1, // Tentative next version
      payload: { lastName: payload.lastName, updatedAt: updateTime },
      timestamp: updateTime,
    });
  }

  // --- Event Appliers ---
  protected onUserCreatedEvent(event: UserCreatedEvent): void {
    this.lastName = event.payload?.lastName ?? '';
    this.email = event.payload.email; // Email is set here
    this.createdAt = event.payload.createdAt;
    this.updatedAt = event.payload.createdAt; // Initially same as createdAt
    // Note: version is set by AggregateRoot.apply's call to this.version++ or this.version = event.version
  }

  protected onUserNameUpdatedEvent(event: UserNameUpdatedEvent): void {
    this.lastName = event.payload?.lastName ?? '';
    this.updatedAt = event.payload.updatedAt;
  }
}
