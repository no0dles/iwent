import {DomOperation} from './dom-operation';
import {ApplicationDomStore} from '../application-dom-store';
import {DomRemoveChildOperation} from './dom-remove-child-operation';

export class DomAppendChildOperation implements DomOperation<boolean> {
  type = 'append_child';

  constructor(private domStore: ApplicationDomStore,
              private containerId: string,
              private element: HTMLElement) {

  }

  execute() {
    const container = this.domStore.root.getElementById(this.containerId);
    if (container) {
      container.appendChild(this.element);
      return true;
    }
    return false;
  }

  reverseOperation(): DomOperation<any> | null {
    return new DomRemoveChildOperation(this.domStore, this.containerId, this.element);
  }

}