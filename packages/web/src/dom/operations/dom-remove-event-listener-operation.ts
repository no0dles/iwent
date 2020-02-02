import {DomAddEventListenerOperation} from './dom-add-event-listener-operation';
import {DomOperation} from './dom-operation';
import {ApplicationDomStore} from '../application-dom-store';

export class DomRemoveEventListenerOperation implements DomOperation<boolean> {
  type = 'remove_event_listener';

  constructor(private domStore: ApplicationDomStore,
              private elementId: string,
              private event: string,
              private listener: () => void) {

  }

  execute() {
    const element = document.getElementById(this.elementId);
    if (element) {
      element.removeEventListener(this.event, this.listener);
      return true;
    }
    return false;
  }

  reverseOperation() {
    return new DomAddEventListenerOperation(this.domStore, this.elementId, this.event, this.listener);
  }
}
