import {EventBus} from './event-bus';
import {ApplicationEvent} from '../application/application-event';
import {EventStore} from '../event-store/event-store';

export class MockEventBus implements EventBus {
  private eventStore = new EventStore<ApplicationEvent<any>>();
  private listeners: { [key: string]: ((event: ApplicationEvent<any>, after: string | null) => void)[] } = {};

  close(): void {
  }

  on(event: 'receive', listener: (event: ApplicationEvent<any>, after: string) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  push(event: ApplicationEvent<any>) {
    this.eventStore.push(event.id, event);
  }

  async send(event: ApplicationEvent<any>): Promise<string | null> {
    const afterId = this.eventStore.push(event.id, event);
    for (const listener of this.listeners['receive'] || []) {
      listener(event, afterId);
    }
    return afterId;
  }

  async get(id: string): Promise<ApplicationEvent<any> | null> {
    return this.eventStore.get(id);
  }

  async getNext(id?: string | null): Promise<ApplicationEvent<any>[]> {
    const events: ApplicationEvent<any>[] = [];
    let current = id ? this.eventStore.next(id) : this.eventStore.first();
    while (current) {
      events.push(current);
      current = this.eventStore.next(current.id);
    }
    return events;
  }
}