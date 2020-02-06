import {RemoveLaneEvent} from './handlers/remove-lane/remove-lane.event';
import {AddLaneEvent} from './handlers/add-lane/add-lane.event';
import {RemoveLaneEventHandler} from './handlers/remove-lane/remove-lane.handler';
import {AddCardEvent} from './handlers/add-card/add-card.event';
import {AddCardEventHandler} from './handlers/add-card/add-card.handler';
import {AddCardListenerEvent} from './handlers/add-card-listener/add-card-listener.event';
import {AddCardListenerEventHandler} from './handlers/add-card-listener/add-card-listener.handler';
import {AddLaneEventHandler} from './handlers/add-lane/add-lane.handler';
import {Application} from '@iwent/web';
import {MyModal} from './components/modal/modal';

export const exampleApp = new Application();

exampleApp.addEventHandler(AddLaneEvent, new AddLaneEventHandler());
exampleApp.addEventHandler(RemoveLaneEvent, new RemoveLaneEventHandler());
exampleApp.addEventHandler(AddCardEvent, new AddCardEventHandler());
exampleApp.addEventHandler(AddCardListenerEvent, new AddCardListenerEventHandler());
exampleApp.addComponent(MyModal);
