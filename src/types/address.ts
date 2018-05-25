export class AddressType {
  private readonly addressRegex = /address(\[([0-9]*)\])?/;
  public isType(input: string): boolean {
    return input.match(this.addressRegex) !== null;
  }
}
