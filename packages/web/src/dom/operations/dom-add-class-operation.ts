import {DomOperation} from './dom-operation';
import {ApplicationDomStore} from '../application-dom-store';
import {DomRemoveClassOperation} from './dom-remove-class-operation';

export class DomAddClassOperation implements DomOperation<boolean> {
  type = 'add_class';

  constructor(private domStore: ApplicationDomStore,
              private elementId: string,
              private name: string) {

  }

  execute() {
    const element = document.getElementById(this.elementId);
    if (element) {
      element.classList.add(this.name);
      return true;
    }
    return false;
  }

  reverseOperation() {
    return new DomRemoveClassOperation(this.domStore, this.elementId, this.name);
  }
}
