import {DomOperation} from './dom-operation';
import {ApplicationDomStore} from '../application-dom-store';
import {DomAppendChildOperation} from './dom-append-child-operation';

export class DomRemoveChildOperation implements DomOperation<boolean> {
  type = 'remove_child';

  constructor(private domStore: ApplicationDomStore,
              private containerId: string,
              private element: HTMLElement) {

  }

  execute() {
    const container = this.domStore.root.getElementById(this.containerId);
    if (container) {
      container.removeChild(this.element);
      return true;
    }
    return false;
  }

  reverseOperation(): DomOperation<any> | null {
    return new DomAppendChildOperation(this.domStore, this.containerId, this.element);
  }

}