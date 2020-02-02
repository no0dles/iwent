import {EventBus} from './event-bus';
import {ApplicationEvent} from '../application/application-event';
import {EventStore} from '../event-store/event-store';

export class MockEventBus implements EventBus {
  private eventStore = new EventStore();
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
}