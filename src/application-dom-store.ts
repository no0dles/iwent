import {DomStore} from './dom-store';
import {
  DomAddEventListenerOperation,
  DomAppendOperation, DomOperation,
  DomRemoveEventListenerOperation,
  DomRemoveOperation,
} from './dom-operation';
import {AppendElementResult} from './element-result';

export class ApplicationDomStore implements DomStore {
  private operations: DomOperation[] = [];

  appendElement(containerId: string, elementId: string, html: string): AppendElementResult {
    const operation: DomAppendOperation = {type: 'append_element', elementId, containerId, html};
    const result = this.runAppendElement(operation);
    this.operations.push(operation);
    return result;
  }

  getElement(elementId: string): AppendElementResult {
    return this.getElementResult(elementId);
  }

  removeElement(containerId: string, elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      const operation: DomRemoveOperation = {type: 'remove_element', elementId, containerId, html: element.innerHTML};
      this.runRemoveElement(operation);
      this.operations.push(operation);
    }
  }

  private getElementResult(elementId: string): AppendElementResult {
    return {
      addEventListener: (event: string, listener: () => void) => {
        const addOperation: DomAddEventListenerOperation = {
          listener,
          event,
          elementId: elementId,
          type: 'add_event_listener',
        };
        this.runAddEventListener(addOperation);
        this.operations.push(addOperation);
      },
    };
  }

  private runAppendElement(operation: DomAppendOperation) {
    const element = document.createElement('div');
    element.innerHTML = operation.html;
    element.id = operation.elementId;

    const container = document.getElementById(operation.containerId);
    if (container) {
      container.append(element);
    }

    return this.getElementResult(operation.elementId);
  }

  private runAddEventListener(operation: DomAddEventListenerOperation) {
    const element = document.getElementById(operation.elementId);
    if (element) {
      element.addEventListener(operation.event, operation.listener);
    }
  }

  private runRemoveEventListener(operation: DomRemoveEventListenerOperation) {
    const element = document.getElementById(operation.elementId);
    if (element) {
      element.removeEventListener(operation.event, operation.listener);
    }
  }

  private runRemoveElement(operation: DomRemoveOperation) {
    const container = document.getElementById(operation.containerId);
    const element = document.getElementById(operation.elementId);
    if (container && element) {
      container.removeChild(element);
    }
  }

  checkpoint(id: string) {
    this.operations.push({type: 'checkpoint', id: id});
  }

  restore(id?: string) {
    while (this.operations.length > 0) {
      const last = this.operations[this.operations.length - 1];
      if (last.type === 'checkpoint' && last.id === id) {
        return;
      }

      switch (last.type) {
        case 'append_element':
          this.runRemoveElement({
            html: last.html,
            containerId: last.containerId,
            elementId: last.elementId,
            type: 'remove_element',
          });
          break;
        case 'add_event_listener':
          this.runRemoveEventListener({
            type: 'remove_event_listener',
            elementId: last.elementId,
            event: last.event,
            listener: last.listener,
          });
          break;
        case 'remove_event_listener':
          this.runAddEventListener({
            type: 'add_event_listener',
            elementId: last.elementId,
            event: last.event,
            listener: last.listener,
          });
          break;
        case 'remove_element':
          this.runAppendElement({
            elementId: last.elementId,
            containerId: last.containerId,
            html: last.html,
            type: 'append_element',
          });
          break;
      }

      this.operations.pop();
    }
  }
}

