export interface ICommand<Payload = any> {
  id: string;
  type: string;
  timestamp: Date;
  aggregateId: string;
  payload: Payload;
}

export class Command<Payload = any> implements ICommand<Payload> {
  constructor(
    public id: string,
    public type: string,
    public timestamp: Date,
    public aggregateId: string,
    public payload: Payload
  ) {}
}
