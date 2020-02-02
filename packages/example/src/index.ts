import {HttpEventBus} from '@iwent/web';
import {exampleApp} from './app';
import {AddLaneEvent} from './add-lane/add-lane.event';

const http = new HttpEventBus('http://localhost:3333');
const instance = exampleApp.listen(http);

const button = document.createElement('button');
button.innerText = 'Add lane'
button.addEventListener('click', () => {
  instance.dispatch(AddLaneEvent, {laneId: 'abc'});
});
document.body.append(button);