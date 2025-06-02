export interface IEvent<Payload = any> {
  id: string;
  type: string;
  timestamp: Date;
  aggregateId: string;
  version: number;
  payload: Payload;
}

export class Event<Payload = any> implements IEvent<Payload> {
  constructor(
    public id: string,
    public type: string,
    public timestamp: Date,
    public aggregateId: string,
    public version: number,
    public payload: Payload
  ) {}
}
