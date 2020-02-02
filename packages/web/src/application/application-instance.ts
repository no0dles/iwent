import {ApplicationDomStore} from '../dom/application-dom-store';
import {ApplicationContext} from './application-context';
import {ApplicationEventHandler} from './application-event-handler';
import {ApplicationEvent, EventBus, EventConstructable, EventStore} from '@iwent/core';

export class ApplicationInstance {
  private readonly domStore: ApplicationDomStore;
  private readonly eventStore = new EventStore<ApplicationEvent<any>>();
  private readonly errorListeners: ((err: Error) => void)[] = [];

  constructor(private handlers: { [key: string]: ApplicationEventHandler<any>[] } = {},
              private eventBus: EventBus) {
    this.domStore = new ApplicationDomStore(this.errorListeners);
    this.eventBus.on('receive', (event, afterId) => {
      this.receive(event, afterId);
    })
  }

  on(event: 'error', listener: (err: Error) => void) {
    this.errorListeners.push(listener);
  }

  restore(id?: string | null) {
    if (id) {
      const event = this.eventStore.get(id);
      if (!event) {
        throw new Error('can not restore, event does not exist');
      }
    }

    this.domStore.restore(id);
  }

  dispatch<T>(eventType: EventConstructable<T>, payload: T, options?: { id?: string }) {
    const result = this.addEvent(eventType, payload, options);
    this.eventBus.send(result.event).then(afterId => {
      if (result.afterId !== afterId) {
        this.moveEventDown(result.event, afterId);
      }
    });

    return result;
  }

  close() {
    this.eventBus.close();
  }

  private addEvent<T>(eventType: EventConstructable<T>, payload: T, options?: { id?: string }) {
    const id = (options ? options.id : ApplicationEvent.generateId()) || ApplicationEvent.generateId();
    const event: ApplicationEvent<any> = {id, data: payload, type: eventType.type};
    const afterId = this.eventStore.push(id, event);
    const success = this.runEvent(event);
    return {event, afterId, success};
  }

  private receive(event: ApplicationEvent<any>, afterId: string | null) {
    const existingEvent = this.eventStore.get(event.id);
    if (existingEvent) {
      const prevExistingEvent = this.eventStore.prev(event.id);
      if ((!prevExistingEvent && !afterId) || (prevExistingEvent && prevExistingEvent.id === afterId)) {
        return;
      } else {
        this.moveEventDown(event, afterId);
      }
    } else {
      this.insertEvent(event, afterId);
    }
  }

  private runEvent<T>(event: ApplicationEvent<T>) {
    const context = new ApplicationContext(this, this.domStore);
    let success = true;
    for (const handler of this.handlers[event.type]) {
      try {
        handler.handle(context, event);
      } catch (e) {
        for (const errorListener of this.errorListeners) {
          errorListener(e);
        }
        success = false;
        break;
      }
    }

    context.close();

    if (!success) {
      const prevEvent = this.eventStore.prev(event.id);
      this.restore(prevEvent ? prevEvent.id : null);
    }

    this.domStore.checkpoint(event.id);

    return success;
  }

  private insertEvent<T>(event: ApplicationEvent<T>, after?: string | null) {
    this.eventStore.insertAfter(event.id, event, after);
    this.replayAfter(after);
  }

  private moveEventDown(event: ApplicationEvent<any>, afterId?: string | null) {
    const prevEvent = this.eventStore.prev(event.id);
    this.eventStore.move(event.id, afterId);
    this.replayAfter(prevEvent ? prevEvent.id : undefined);
  }

  private replayAfter(afterId?: string | null) {
    this.restore(afterId);

    let replayEvent = afterId ? this.eventStore.next(afterId) : this.eventStore.first();
    while (replayEvent) {
      this.runEvent(replayEvent);
      replayEvent = this.eventStore.next(replayEvent.id);
    }
  }
}