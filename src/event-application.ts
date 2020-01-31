import {EventStore} from './even-store';
import {EventHandler} from './event-handler';
import {getNewEventId, RobinEvent} from './index';
import {ApplicationEventContext} from './application-event-context';
import {ApplicationDomStore} from './application-dom-store';
import {ApplicationContext, DefaultConstructable, EventType} from './application-context';

interface EventBus {
  send(event: RobinEvent<any>): Promise<void>;

  on(event: 'receive', listener: (event: RobinEvent<any>, after: string) => void): void;

  close(): void;
}

export class MockBus implements EventBus {
  close(): void {
  }

  on(event: 'receive', listener: (event: RobinEvent<any>, after: string) => void): void {
  }

  send(event: RobinEvent<any>): Promise<void> {
    return Promise.resolve();
  }

}

export class EventSourceBus implements EventBus {
  private sseSource: EventSource;
  private listeners: { [key: string]: ((event: RobinEvent<any>, after: string) => void)[] } = {};

  constructor(private endpoint: string) {
    this.sseSource = new EventSource(`${endpoint}/eventstream`);

    this.sseSource.addEventListener('message', (e) => {
      const messageData = JSON.parse(e.data);
      for (const listener of this.listeners['receive'] || []) {
        listener(messageData.event, messageData.afterId);
      }
    });
  }

  on(event: 'receive', listener: (event: RobinEvent<any>, after: string) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  async send(event: RobinEvent<any>): Promise<void> {
    await fetch(`${this.endpoint}/event`, {
      body: JSON.stringify(event),
      method: 'POST',
    });
  }

  close() {
    this.sseSource.close();
  }
}

export class EventApplication implements ApplicationContext {
  private handlers: { [key: string]: EventHandler<any>[] } = {};
  private domStore = new ApplicationDomStore();
  private eventStore = new EventStore();

  constructor(private bus: EventBus) {
    this.bus.on('receive', (event, after) => {
      this.receive(event, after);
    })
  }

  close() {
    this.bus.close();
  }

  addEventHandler<T extends EventType>(eventType: DefaultConstructable<T>, handler: EventHandler<T>) {
    if (!this.handlers[(<any>eventType).type]) {
      this.handlers[(<any>eventType).type] = [];
    }
    this.handlers[(<any>eventType).type].push(handler);
  }

  addEvent<T extends EventType>(eventType: DefaultConstructable<T>, payload: T, options?: { id?: string }) {
    const id = (options ? options.id : getNewEventId()) || getNewEventId();
    const event: RobinEvent<any> = {id, data: payload, type: (<any>eventType).type};
    return this.pushEvent(event);
  }

  dispatch<T extends EventType>(eventType: DefaultConstructable<T>, payload: T, options?: { id?: string }) {
    const event = this.addEvent(eventType, payload, options);
    this.bus.send(event);
  }

  private pushEvent(event: RobinEvent<any>) {
    this.eventStore.pushEvent(event);
    this.runEvent(event);
    return event;
  }

  private receive(event: RobinEvent<any>, afterId: string) {
    const existingEvent = this.eventStore.get(event.id);
    if (existingEvent) {
      const prevExistingEvent = this.eventStore.getPrev(event.id);
      if (prevExistingEvent && prevExistingEvent.id === afterId) {
        return;
      } else {
        this.moveEventDown(event, afterId);
      }
    } else {
      this.insertEvent(event, afterId);
    }
  }

  private runEvent<T>(event: RobinEvent<T>) {
    const context = new ApplicationEventContext(this.domStore, this);
    for (const handler of this.handlers[event.type]) {
      handler.handle(context, event);
    }
    context.close();
    this.domStore.checkpoint(event.id);
  }

  restore(id?: string) {
    if (id) {
      const event = this.eventStore.get(id);
      if (!event) {
        throw new Error('can not restore, event does not exist');
      }
    }

    this.domStore.restore(id);
  }

  private insertEvent<T>(event: RobinEvent<T>, after?: string) {
    this.eventStore.insertEventAfter(event, after);
    this.replayAfter(after);
  }

  private moveEventDown(event: RobinEvent<any>, afterId?: string) {
    const prevEvent = this.eventStore.getPrev(event.id);
    this.eventStore.moveEvent(event, afterId);
    this.replayAfter(prevEvent ? prevEvent.id : undefined);
  }

  private replayAfter(afterId?: string) {
    this.restore(afterId);

    let replayEvent = afterId ? this.eventStore.getAfter(afterId) : this.eventStore.getFirst();
    while (replayEvent) {
      this.runEvent(replayEvent);
      replayEvent = this.eventStore.getAfter(replayEvent.id);
    }
  }
}

