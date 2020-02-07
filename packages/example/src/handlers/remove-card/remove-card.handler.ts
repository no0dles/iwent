import {RemoveCardEvent} from './remove-card.event';
import {ApplicationEvent} from '@iwent/core';
import {ApplicationEventHandler, ApplicationEventContext} from '@iwent/web';

export class RemoveCardEventHandler implements ApplicationEventHandler<RemoveCardEvent> {
  handle(context: ApplicationEventContext, event: ApplicationEvent<RemoveCardEvent>): void {
    context.domStore.removeElement(`lane-${event.data.laneId}`, `card-${event.data.cardId}`);
  }
}
