import {DomStore} from './dom-store';
import {DomElementResult} from './dom-element-result';
import {DomAppendOperation} from './operations/dom-append-operation';
import {DomOperation} from './operations/dom-operation';
import {DomRemoveOperation} from './operations/dom-remove-operation';
import {DomAddEventListenerOperation} from './operations/dom-add-event-listener-operation';
import {DomCheckpointOperation} from './operations/dom-checkpoint-operation';

export class ApplicationDomStore implements DomStore {
  private readonly operations: DomOperation<any>[] = [];

  constructor(private readonly errorListeners: ((err: Error) => void)[]) {
  }

  appendElement(containerId: string, elementId: string, html: string): DomElementResult {
    return this.addOperation(new DomAppendOperation(this, containerId, elementId, html));
  }

  getElement(elementId: string): DomElementResult {
    return this.getElementResult(elementId);
  }

  removeElement(containerId: string, elementId: string) {
    const element = document.getElementById(elementId);
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
  }

  private addOperation<T>(operation: DomOperation<T>): T {
    const result = operation.execute();
    this.operations.push(operation);
    return result;
  }

  private getElementResult(elementId: string): DomElementResult {
    return {
      addEventListener: (event: string, listener: () => void) => {
        return this.addOperation(new DomAddEventListenerOperation(this, elementId, event, listener));
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

