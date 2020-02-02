import {ApplicationEvent, Defer, EventBus} from '@iwent/core';

export class HttpEventBus implements EventBus {
  private eventSource: EventSource;
  private openDefer = new Defer<void>();
  private listeners: { [key: string]: ((event: ApplicationEvent<any>, after: string | null) => void)[] } = {};

  constructor(private endpoint: string, options?: { eventSourceFactory?: (endpoint: string) => EventSource }) {
    if (options && options.eventSourceFactory) {
      this.eventSource = options.eventSourceFactory(endpoint);
    } else {
      this.eventSource = new EventSource(endpoint);
    }

    this.eventSource.onopen = () => {
      if (this.openDefer.isResolved) {
        return;
      }
      this.openDefer.resolve();
    };
    this.eventSource.addEventListener('message', (e) => {
      const messageData = JSON.parse(e.data);
      for (const listener of this.listeners['receive'] || []) {
        listener(messageData.event, messageData.afterId);
      }
    });
  }

  get opened() {
    return this.openDefer.promise;
  }

  on(event: 'receive', listener: (event: ApplicationEvent<any>, afterId: string | null) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  async send(event: ApplicationEvent<any>): Promise<string | null> {
    const response = await fetch(this.endpoint, {
      body: JSON.stringify(event),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const afterId = await response.text();
    if (afterId) {
      return afterId;
    }
    return null;
  }

  close() {
    this.eventSource.close();
  }
}