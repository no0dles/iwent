import {DomOperation} from './dom-operation';
import {DomAppendOperation} from './dom-append-operation';
import {ApplicationDomStore} from '../application-dom-store';

export class DomRemoveOperation implements DomOperation<boolean> {
  type = 'remove_element';

  constructor(private domStore: ApplicationDomStore,
              private containerId: string,
              private elementId: string,
              private html: string) {

  }

  execute() {
    const container = this.domStore.root.getElementById(this.containerId);
    const element = this.domStore.root.getElementById(this.elementId);
    if (container && element) {
      container.removeChild(element);
      return true;
    }
    return false;
  }

  reverseOperation(): DomOperation<any> {
    return new DomAppendOperation(this.domStore, this.containerId, this.elementId, this.html);
  }
}
