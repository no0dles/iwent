import {AddLaneEvent} from './add-lane.event';
import {ApplicationEvent} from '@iwent/core';
import {ApplicationEventHandler, ApplicationEventContext} from '@iwent/web';
import {MyModal} from '../../components/modal/modal';
import {AddCardEvent} from '../add-card/add-card.event';

export class AddLaneEventHandler implements ApplicationEventHandler<AddLaneEvent> {
  handle(context: ApplicationEventContext, event: ApplicationEvent<AddLaneEvent>): void {
    const addCardBtnId = `add-card-${event.data.laneId}`;
    const element = context.domStore.appendElement('board', `lane-${event.data.laneId}`, `<div class="header"><button id="${addCardBtnId}" class="btn block">Add card</button></div>`);
    element.addClass('lane');

    const btn = context.domStore.getElement(addCardBtnId);
    btn.addEventListener('click', () => {
      const modal = new MyModal();
      modal.saveFn = text => {
        context.dispatch(AddCardEvent, {
          laneId: event.data.laneId,
          title: text,
          cardId: ApplicationEvent.generateId(),
        });
        modal.close(context);
      };
      modal.present(context);
    });
  }
}
