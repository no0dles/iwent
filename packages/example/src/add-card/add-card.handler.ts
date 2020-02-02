import {AddCardEvent} from './add-card.event';
import {ApplicationEvent} from '@iwent/core';
import {ApplicationEventHandler, ApplicationEventContext} from '@iwent/web';

export class AddCardEventHandler implements ApplicationEventHandler<AddCardEvent> {
  handle(context: ApplicationEventContext, event: ApplicationEvent<AddCardEvent>): void {
    context.domStore.appendElement(`lane-${event.data.laneId}`, `card-${event.data.cardId}`, `${event.data.title}`);
  }
}
