import {ApplicationEventContext} from './application-event-context';
import {ApplicationDomStore} from '../dom/application-dom-store';
import {DomStoreContext} from '../dom/dom-store-context';
import {ApplicationContextDispatchOptions} from './application-context-dispatch-options';
import {ApplicationInstance} from './application-instance';
import {EventConstructable} from '@iwent/core';

export class ApplicationContext implements ApplicationEventContext {
  domStore: DomStoreContext;

  constructor(private appInstance: ApplicationInstance,
              domStore: ApplicationDomStore) {
    this.domStore = new DomStoreContext(domStore);
  }

  close() {
    this.domStore.close();
  }

  dispatch<T>(type: EventConstructable<T>, payload: T, options?: ApplicationContextDispatchOptions) {
    return this.appInstance.dispatch(type, payload, options);
  }
}
