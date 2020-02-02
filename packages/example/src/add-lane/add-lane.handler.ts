import {AddLaneEvent} from './add-lane.event';
import {AddCardEvent} from '../add-card/add-card.event';
import {ApplicationEvent} from '@iwent/core';
import {ApplicationEventHandler, ApplicationEventContext} from '@iwent/web';

export class AddLaneEventHandler implements ApplicationEventHandler<AddLaneEvent> {
  handle(context: ApplicationEventContext, event: ApplicationEvent<AddLaneEvent>): void {
    const element = context.domStore.appendElement('board', `lane-${event.data.laneId}`, 'lane');
    element.addEventListener('click', () => {
      context.dispatch(AddCardEvent, {
        laneId: event.data.laneId, title: 'test', cardId: ApplicationEvent.generateId(),
      })
    });
  }
}
