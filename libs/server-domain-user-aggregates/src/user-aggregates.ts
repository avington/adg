import { AggregateRoot } from '@adg/server-shared-kernel';
import { UserCreatedEvent } from '@adg/server-domain-user-events';
import { UserNameUpdatedEvent } from '@adg/server-domain-user-events';
import { v4 as uuid } from 'uuid';

export interface UserAggregateState {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class UserAggregate extends AggregateRoot {
  private state: Partial<UserAggregateState> = {};

  // Command handler: create user
  public createUser(data: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt?: Date;
  }) {
    if (this.state.userId) {
      throw new Error('User already exists');
    }
    const event = new UserCreatedEvent(uuid(), data.userId, this.version + 1, {
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      createdAt: data.createdAt ?? new Date(),
    });
    this.apply(event);
  }

  // Command handler: update user name
  public updateUserName(data: {
    userId: string;
    firstName: string;
    lastName: string;
    updatedAt?: Date;
  }) {
    if (!this.state.userId) {
      throw new Error('User does not exist');
    }
    if (
      this.state.firstName === data.firstName &&
      this.state.lastName === data.lastName
    ) {
      return; // No change
    }
    const event = new UserNameUpdatedEvent(
      crypto.randomUUID(),
      data.userId,
      this.version + 1,
      {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        updatedAt: data.updatedAt ?? new Date(),
      }
    );
    this.apply(event);
  }

  // Event applier: UserCreatedEvent
  protected onUserCreatedEvent(event: UserCreatedEvent) {
    this.state = {
      userId: event.payload.userId,
      firstName: event.payload.firstName,
      lastName: event.payload.lastName,
      email: event.payload.email,
      createdAt: event.payload.createdAt,
      updatedAt: event.payload.createdAt,
    };
  }

  // Event applier: UserNameUpdatedEvent
  protected onUserNameUpdatedEvent(event: UserNameUpdatedEvent) {
    this.state.firstName = event.payload.firstName;
    this.state.lastName = event.payload.lastName;
    this.state.updatedAt = event.payload.updatedAt;
  }

  // Optionally expose state for reading
  public getState(): Partial<UserAggregateState> {
    return { ...this.state };
  }
}
