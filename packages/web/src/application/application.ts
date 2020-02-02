import {ApplicationEventHandler} from './application-event-handler';
import {ApplicationInstance} from './application-instance';
import {EventBus, EventConstructable} from '@iwent/core';

export class Application {
  private handlers: { [key: string]: ApplicationEventHandler<any>[] } = {};

  addEventHandler<T>(eventType: EventConstructable<T>, handler: ApplicationEventHandler<T>) {
    if (!this.handlers[(<any>eventType).type]) {
      this.handlers[(<any>eventType).type] = [];
    }
    this.handlers[(<any>eventType).type].push(handler);
  }

  listen(eventBus: EventBus) {
    return new ApplicationInstance(this.handlers, eventBus);
  }
}

