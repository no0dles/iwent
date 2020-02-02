import {AddCardEvent} from './add-card.event';
import {ApplicationEvent} from '@iwent/core';
import {ApplicationEventHandler, ApplicationEventContext} from '@iwent/web';
import {RemoveCardEvent} from '../remove-card/remove-card.event';

export class AddCardEventHandler implements ApplicationEventHandler<AddCardEvent> {
  handle(context: ApplicationEventContext, event: ApplicationEvent<AddCardEvent>): void {

    const removeCardBtnId = event.data.cardId;

    const template = `
      <span>${event.data.title}</span>
      <button id="${removeCardBtnId}">x</button>
    `;

    const card = context.domStore.appendElement(`lane-${event.data.laneId}`, `card-${event.data.cardId}`, template);
    card.addClass('card');

    const removeBtn = context.domStore.getElement(removeCardBtnId);
    removeBtn.addClass('btn');
    removeBtn.addEventListener('click', () => {
      context.dispatch(RemoveCardEvent, {
        laneId: event.data.laneId, cardId: event.data.cardId,
      });
    });

  }
}
