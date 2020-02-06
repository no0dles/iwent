import {DomStore} from './dom-store';
import {DomElementResult} from './dom-element-result';
import {ApplicationDomStore} from './application-dom-store';

export class DomStoreContext implements DomStore {
  private closed = false;

  constructor(private domStore: ApplicationDomStore) {
  }

  close() {
    this.closed = true;
  }

  private checkIfClosed() {
    if (this.closed) {
      throw new Error('dom store can not be used outside of event handler');
    }
  }

  appendElement(containerId: string, elementId: string, html: string): DomElementResult {
    this.checkIfClosed();
    return this.domStore.appendElement(containerId, elementId, html);
  }

  getElement(elementId: string) {
    this.checkIfClosed();
    return this.domStore.getElement(elementId);
  }

  removeElement(containerId: string, elementId: string) {
    this.checkIfClosed();
    return this.domStore.removeElement(containerId, elementId);
  }

  appendChild(containerId: string, elm: HTMLElement): boolean {
    this.checkIfClosed();
    return this.domStore.appendChild(containerId, elm);
  }

  removeChild(containerId: string, element: HTMLElement): boolean {
    this.checkIfClosed();
    return this.domStore.removeChild(containerId, element);
  }
}
