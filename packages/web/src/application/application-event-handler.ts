import {ApplicationEventContext} from './application-event-context';
import {ApplicationEvent} from '@iwent/core';

export interface ApplicationEventHandler<T> {
  handle(context: ApplicationEventContext, event: ApplicationEvent<T>): void;
}