import {ApplicationEventHandler} from './application-event-handler';
import {ApplicationInstance} from './application-instance';
import {EventConstructable} from '@iwent/core';
import {ApplicationInstanceOptions} from './application-instance-options';
import {Constructable} from '@iwent/core';
import {IwentElement} from '../element';

export class Application {
  private handlers: { [key: string]: ApplicationEventHandler<any>[] } = {};

  addEventHandler<T>(eventType: EventConstructable<T>, handler: ApplicationEventHandler<T>) {
    if (!this.handlers[(<any>eventType).type]) {
      this.handlers[(<any>eventType).type] = [];
    }
    this.handlers[(<any>eventType).type].push(handler);
  }

  addComponent<T extends IwentElement>(component: Constructable<T> & {element: string, register: (app: Application) => void}) {
    component.register(this);
    window.customElements.define(component.element, component);
  }

  listen(options: ApplicationInstanceOptions) {
    return new ApplicationInstance(this.handlers, options);
  }
}

