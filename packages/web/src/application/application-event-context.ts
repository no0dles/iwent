import {DomStore} from '../dom/dom-store';
import {ApplicationContextDispatchOptions} from './application-context-dispatch-options';
import {EventConstructable} from '@iwent/core';

export interface ApplicationEventContext {
  domStore: DomStore;
  dispatch<T>(type: EventConstructable<T>, payload: T, options?: ApplicationContextDispatchOptions);
}