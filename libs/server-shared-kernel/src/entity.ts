// Entity base class
export abstract class Entity<TId = string> {
  public readonly id: TId;

  constructor(id: TId) {
    this.id = id;
  }

  // Entities are compared by their ID
  public equals(object?: Entity<TId>): boolean {
    if (object == null || object == undefined) return false;
    if (this === object) return true;
    return this.id === object.id;
  }
}
