export interface DomElementResult {
  addEventListener(event: string, listener: () => void): boolean;
  addClass(name: string): boolean;
  getElementsByClassName(name: string): DomElementResult[];
}