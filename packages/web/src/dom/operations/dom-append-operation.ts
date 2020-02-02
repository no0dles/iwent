import {DomOperation} from './dom-operation';
import {DomElementResult} from '../dom-element-result';
import {DomRemoveOperation} from './dom-remove-operation';
import {ApplicationDomStore} from '../application-dom-store';

export class DomAppendOperation implements DomOperation<DomElementResult> {
  type = 'append_element';

  constructor(private domStore: ApplicationDomStore,
              private containerId: string,
              private elementId: string,
              private html: string) {

  }

  execute() {
    const element = document.createElement('div');
    element.innerHTML = this.html;
    element.id = this.elementId;

    const container = document.getElementById(this.containerId);
    if (container) {
      container.append(element);
    }

    return this.domStore.getElement(this.elementId);
  }

  reverseOperation(): DomOperation<any> {
    return new DomRemoveOperation(this.domStore, this.containerId, this.elementId, this.html);
  }
}
