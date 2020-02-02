import {ApplicationEvent} from '../application/application-event';

export interface EventBus {
  send(event: ApplicationEvent<any>): Promise<string | null>;

  on(event: 'receive', listener: (event: ApplicationEvent<any>, after: string | null) => void): void;

  close(): void;

  get(id: string): Promise<ApplicationEvent<any> | null>;

  getNext(id?: string | null): Promise<ApplicationEvent<any>[]>;
}