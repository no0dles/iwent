import {RemoveLaneEvent} from './remove-lane/remove-lane.event';
import {AddLaneEvent} from './add-lane/add-lane.event';
import {RemoveLaneEventHandler} from './remove-lane/remove-lane.handler';
import {AddCardEvent} from './add-card/add-card.event';
import {AddCardEventHandler} from './add-card/add-card.handler';
import {AddCardListenerEvent} from './add-card-listener/add-card-listener.event';
import {AddCardListenerEventHandler} from './add-card-listener/add-card-listener.handler';
import {AddLaneEventHandler} from './add-lane/add-lane.handler';
import {Application} from '@iwent/web';

export const exampleApp = new Application();

exampleApp.addEventHandler(AddLaneEvent, new AddLaneEventHandler());
exampleApp.addEventHandler(RemoveLaneEvent, new RemoveLaneEventHandler());
exampleApp.addEventHandler(AddCardEvent, new AddCardEventHandler());
exampleApp.addEventHandler(AddCardListenerEvent, new AddCardListenerEventHandler());