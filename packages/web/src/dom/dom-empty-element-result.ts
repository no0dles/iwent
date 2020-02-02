import {DomElementResult} from './dom-element-result';

export class DomEmptyElementResult implements DomElementResult {

  addClass(name: string): boolean {
    return false;
  }

  addEventListener(event: string, listener: () => void): boolean {
    return false;
  }

  getElementsByClassName(name: string): DomElementResult[] {
    return [];
  }
}