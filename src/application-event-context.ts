import {EventContext} from './event-context';
import {ApplicationContext} from './application-context';
import {ProxyDomStore} from './proxy-dom-store';
import {ApplicationDomStore} from './application-dom-store';


export class ApplicationEventContext implements EventContext {
  store: ProxyDomStore;

  constructor(domStore: ApplicationDomStore,
              public app: ApplicationContext) {
    this.store = new ProxyDomStore(domStore);
  }

  close() {
    this.store.close();
  }
}
