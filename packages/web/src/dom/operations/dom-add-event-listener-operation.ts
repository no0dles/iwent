import {DomOperation} from './dom-operation';
import {DomRemoveEventListenerOperation} from './dom-remove-event-listener-operation';
import {ApplicationDomStore} from '../application-dom-store';

export class DomAddEventListenerOperation implements DomOperation<boolean> {
  type = 'add_event_listener';

  private readonly listener: () => void;

  constructor(private domStore: ApplicationDomStore,
              private elementId: string,
              private event: string,
              listener: () => void) {
    const listenerStore = this.domStore;
    this.listener = function () {
      try {
        listener.apply(null, arguments);
      } catch (e) {
        listenerStore.emitError(e);
      }
    };
  }

  execute() {
    const element = this.domStore.root.getElementById(this.elementId);
    if (element) {
      element.addEventListener(this.event, this.listener);
      return true;
    }
    return false;
  }

  reverseOperation(): DomRemoveEventListenerOperation {
    return new DomRemoveEventListenerOperation(this.domStore, this.elementId, this.event, this.listener);
    ;
  }
}