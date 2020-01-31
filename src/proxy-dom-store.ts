import {DomStore} from './dom-store';
import {AppendElementResult} from './element-result';
import {ApplicationDomStore} from './application-dom-store';

export class ProxyDomStore implements DomStore {
  private closed = false;

  constructor(private domStore: ApplicationDomStore) {
  }

  close() {
    this.closed = true;
  }

  appendElement(containerId: string, elementId: string, html: string): AppendElementResult {
    if (this.closed) {
      throw new Error('not allowed');
    }
    return this.domStore.appendElement(containerId, elementId, html);
  }

  getElement(elementId: string) {
    if (this.closed) {
      throw new Error('not allowed');
    }
    return this.domStore.getElement(elementId);
  }

  removeElement(containerId: string, elementId: string): void {
    if (this.closed) {
      throw new Error('not allowed');
    }
    return this.domStore.removeElement(containerId, elementId);
  }
}
