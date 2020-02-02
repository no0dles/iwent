import {AddCardListenerEvent} from './add-card-listener.event';
import {ApplicationEvent} from '@iwent/core';
import {ApplicationEventHandler, ApplicationEventContext} from '@iwent/web';

export class AddCardListenerEventHandler implements ApplicationEventHandler<AddCardListenerEvent> {
  handle(context: ApplicationEventContext, event: ApplicationEvent<AddCardListenerEvent>): void {
    const element = context.domStore.getElement(`card-${event.data.cardId}`);
    element.addEventListener('click', () => {
      throw new Error('should not happend');
    });
  }
}
