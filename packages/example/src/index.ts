import {HttpEventBus} from '@iwent/web';
import {exampleApp} from './app';
import {AddLaneEvent} from './handlers/add-lane/add-lane.event';
import {ApplicationEvent} from '@iwent/core';

const http = new HttpEventBus('http://localhost:3333');
const instance = exampleApp.listen(http);

const button = document.getElementById('add-lane-btn');
if (button) {
  button.addEventListener('click', () => {
    instance.dispatch(AddLaneEvent, {laneId: ApplicationEvent.generateId()});
  });
}