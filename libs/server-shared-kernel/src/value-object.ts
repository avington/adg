// ValueObject base class
export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  // Value objects are compared by their properties
  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) return false;
    if (vo === this) return true;
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
