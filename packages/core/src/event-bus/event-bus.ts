import {ApplicationEvent} from '../application/application-event';

export interface EventBus {
  send(event: ApplicationEvent<any>): Promise<string | null>;

  on(event: 'receive', listener: (event: ApplicationEvent<any>, after: string | null) => void): void;

  close(): void;
}