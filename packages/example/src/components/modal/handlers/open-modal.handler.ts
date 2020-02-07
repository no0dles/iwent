import {ApplicationEvent} from '@iwent/core';
import {ApplicationEventContext, ApplicationEventHandler} from '@iwent/web';
import {OpenModalEvent} from '../events/open-modal.event';

export class OpenModalEventHandler implements ApplicationEventHandler<OpenModalEvent> {
  handle(context: ApplicationEventContext, event: ApplicationEvent<OpenModalEvent>): void {
    context.domStore.appendChild('board', event.data.modal);
  }
}
