import {ApplicationContext} from './application-context';
import {DomStore} from './dom-store';

export interface EventContext {
  store: DomStore;
  app: ApplicationContext;
}