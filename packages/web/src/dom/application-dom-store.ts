import {DomStore} from './dom-store';
import {DomElementResult} from './dom-element-result';
import {DomAppendOperation} from './operations/dom-append-operation';
import {DomOperation} from './operations/dom-operation';
import {DomRemoveOperation} from './operations/dom-remove-operation';
import {DomAddEventListenerOperation} from './operations/dom-add-event-listener-operation';
import {DomCheckpointOperation} from './operations/dom-checkpoint-operation';
import {DomAddClassOperation} from './operations/dom-add-class-operation';
import {DomEmptyElementResult} from './dom-empty-element-result';
import {DomAppendChildOperation} from './operations/dom-append-child-operation';
import {DomRemoveChildOperation} from './operations/dom-remove-child-operation';

export class ApplicationDomStore implements DomStore {
  private readonly operations: DomOperation<any>[] = [];

  constructor(public readonly root: Document,
              private readonly errorListeners: ((err: Error) => void)[]) {
  }

  appendChild(containerId: string, element: HTMLElement) {
    return this.addOperation(new DomAppendChildOperation(this, containerId, element));
  }

  removeChild(containerId: string, element: HTMLElement) {
    return this.addOperation(new DomRemoveChildOperation(this, containerId, element));
  }

  appendElement(containerId: string, elementId: string, html: string): DomElementResult {
    return this.addOperation(new DomAppendOperation(this, containerId, elementId, html));
  }

  getElement(elementId: string): DomElementResult {
    const element = this.root.getElementById(elementId);
    return this.getElementResult(element);
  }

  removeElement(containerId: string, elementId: string) {
    const element = this.root.getElementById(elementId);
    if (element) {
      this.addOperation(new DomRemoveOperation(this, containerId, elementId, element.innerHTML));
      return true;
    }
    return false;
  }

  emitError(err: Error) {
    for (const errorListener of this.errorListeners) {
      errorListener(err);
    }
    if (this.errorListeners.length === 0) {
      console.error(err);
    }
  }

  private addOperation<T>(operation: DomOperation<T>): T {
    const result = operation.execute();
    this.operations.push(operation);
    return result;
  }

  private getElementResult(element: Element | null): DomElementResult {
    if (!element) {
      return new DomEmptyElementResult();
    }

    return {
      addEventListener: (event: string, listener: () => void) => {
        return this.addOperation(new DomAddEventListenerOperation(this, element.id, event, listener));
      },
      addClass: name => {
        return this.addOperation(new DomAddClassOperation(this, element.id, name));
      },
      getElementsByClassName: name => {
        const elements = element.getElementsByClassName(name);
        const results: DomElementResult[] = [];
        for (let i = 0; i < elements.length; i++) {
          results.push(this.getElementResult(elements.item(i)));
        }
        return results;
      },
    };
  }

  checkpoint(id: string) {
    return this.addOperation(new DomCheckpointOperation(id));
  }

  restore(id?: string | null) {
    while (this.operations.length > 0) {
      const last = this.operations[this.operations.length - 1];
      if (last.type === 'checkpoint' && (<DomCheckpointOperation>last).id === id) {
        return;
      }

      const reverseOperation = last.reverseOperation();
      if (reverseOperation) {
        reverseOperation.execute();
      }

      this.operations.pop();
    }
  }
}

