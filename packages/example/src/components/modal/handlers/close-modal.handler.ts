import {ApplicationEvent} from '@iwent/core';
import {ApplicationEventContext, ApplicationEventHandler} from '@iwent/web';
import {CloseModalEvent} from '../events/close-modal.event';

export class CloseModalEventHandler implements ApplicationEventHandler<CloseModalEvent> {
  handle(context: ApplicationEventContext, event: ApplicationEvent<CloseModalEvent>): void {
    context.domStore.removeChild('board', event.data.modal);
  }
}