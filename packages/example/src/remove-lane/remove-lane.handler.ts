import {RemoveLaneEvent} from './remove-lane.event';
import {ApplicationEvent} from '@iwent/core';
import {ApplicationEventHandler, ApplicationEventContext} from '@iwent/web';

export class RemoveLaneEventHandler implements ApplicationEventHandler<RemoveLaneEvent> {
  handle(context: ApplicationEventContext, event: ApplicationEvent<RemoveLaneEvent>): void {
    context.domStore.removeElement('board', `lane-${event.data.laneId}`);
  }
}