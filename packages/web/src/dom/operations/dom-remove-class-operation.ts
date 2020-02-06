import {DomOperation} from './dom-operation';
import {ApplicationDomStore} from '../application-dom-store';
import {DomAddClassOperation} from './dom-add-class-operation';

export class DomRemoveClassOperation implements DomOperation<boolean> {
  type = 'remove_class';

  constructor(private domStore: ApplicationDomStore,
              private elementId: string,
              private name: string) {

  }

  execute() {
    const element = this.domStore.root.getElementById(this.elementId);
    if (element) {
      element.classList.remove(this.name);
      return true;
    }
    return false;
  }

  reverseOperation(): DomOperation<any> {
    return new DomAddClassOperation(this.domStore, this.elementId, this.name);
  }
}
