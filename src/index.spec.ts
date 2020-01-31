import {EventContext} from './event-context';
import {EventHandler} from './event-handler';
import {EventApplication} from './event-application';
import {getNewEventId, RobinEvent} from './index';

class AddLaneEvent {
  static type = 'add_lane';

  laneId: string;
}

class RemoveLaneEvent {
  static type = 'remove_lane';

  laneId: string;
}

class AddCardEvent {
  static type = 'add_card';

  laneId: string;
  title: string;
  cardId: string;
}

class AddCardListenerEvent {
  static type = 'add_card_listener';

  laneId: string;
  cardId: string;
}


class AddLaneEventHandler extends EventHandler<AddLaneEvent> {
  handle(context: EventContext, event: RobinEvent<AddLaneEvent>): void {
    const element = context.store.appendElement('board', `lane-${event.data.laneId}`, 'lane');
    element.addEventListener('click', () => {
      context.app.dispatch(AddCardEvent, {
        laneId: event.data.laneId, title: 'test', cardId: getNewEventId(),
      })
    });
  }
}

class RemoveLaneEventHandler extends EventHandler<RemoveLaneEvent> {
  handle(context: EventContext, event: RobinEvent<RemoveLaneEvent>): void {
    context.store.removeElement('board', `lane-${event.data.laneId}`);
  }
}

class AddCardEventHandler extends EventHandler<AddCardEvent> {
  handle(context: EventContext, event: RobinEvent<AddCardEvent>): void {
    context.store.appendElement(`lane-${event.data.laneId}`, `card-${event.data.cardId}`, `${event.data.title}`);
  }
}

class AddCardListenerEventHandler extends EventHandler<AddCardListenerEvent> {
  handle(context: EventContext, event: RobinEvent<AddCardListenerEvent>): void {
    const element = context.store.getElement(`card-${event.data.cardId}`);
    element.addEventListener('click', () => {
      throw new Error('should not happend');
    });
  }
}

describe('index', () => {
  let app: EventApplication;

  beforeAll(() => {
    app = new EventApplication('http://localhost:3000');
    app.addEventHandler(AddLaneEvent, new AddLaneEventHandler());
    app.addEventHandler(RemoveLaneEvent, new RemoveLaneEventHandler());
    app.addEventHandler(AddCardEvent, new AddCardEventHandler());
    app.addEventHandler(AddCardListenerEvent, new AddCardListenerEventHandler());
    document.body.innerHTML = '<div id="board"></div>'
  });

  it('add lane and card', () => {
    app.addEvent(AddLaneEvent, {laneId: 'abc'}, {id: 'a'});
    app.addEvent(AddCardEvent, {laneId: 'abc', cardId: 'def', title: 'cardtitle'}, {id: 'b'});
    console.log(document.body.innerHTML);
  });

  // it('add lane and listener and throw error', () => {
  //   app.addEvent<AddLaneEvent>({id: 'a', data: {laneId: 'abc'}, type: 'add_lane'});
  //   app.addEvent<AddCardEvent>({id: 'b', data: {laneId: 'abc', cardId: 'def', title: 'cardtitle'}, type: 'add_card'});
  //   app.addEvent<AddCardListenerEvent>({id: 'c', data: {laneId: 'abc', cardId: 'def'}, type: 'add_card_listener'});
  //   document.getElementById('card-def').click();
  // });
  //
  // it('add lane and listener and restore', () => {
  //   app.addEvent<AddLaneEvent>({id: 'a', data: {laneId: 'abc'}, type: 'add_lane'});
  //   app.addEvent<AddCardEvent>({id: 'b', data: {laneId: 'abc', cardId: 'def', title: 'cardtitle'}, type: 'add_card'});
  //   app.addEvent<AddCardListenerEvent>({id: 'c', data: {laneId: 'abc', cardId: 'def'}, type: 'add_card_listener'});
  //   app.restore('b');
  //   document.getElementById('card-def').click();
  // });
  //
  //
  // it('add lane and click', () => {
  //   app.addEvent<AddLaneEvent>({id: 'a', data: {laneId: 'abc'}, type: 'add_lane'});
  //   document.getElementById(`lane-abc`).click();
  //   console.log(document.body.innerHTML);
  // });
  //
  // it('add lane and click', () => {
  //   app.addEvent<AddLaneEvent>({id: 'a', data: {laneId: 'abc'}, type: 'add_lane'});
  //   document.getElementById(`lane-abc`).click();
  //   console.log(document.body.innerHTML);
  // });
  //
  //
  // it('add lane and restore', () => {
  //   app.addEvent<AddLaneEvent>({id: 'a', data: {laneId: 'abc'}, type: 'add_lane'});
  //   document.getElementById(`lane-abc`).click();
  //   app.restore('a');
  //   console.log(document.body.innerHTML);
  // });
  //
  // it('add lane event', () => {
  //   app.addEvent<AddLaneEvent>({id: 'a', data: {laneId: 'abc'}, type: 'add_lane'});
  //   console.log(document.body.innerHTML);
  // });
  //
  // it('reset to the beginning', () => {
  //   app.addEvent<AddLaneEvent>({id: 'a', data: {laneId: 'abc'}, type: 'add_lane'});
  //   app.restore();
  //
  //   console.log(document.body.innerHTML);
  // });
  //
  // it('add and remove lane', () => {
  //   app.addEvent<AddLaneEvent>({id: 'a', data: {laneId: 'abc'}, type: 'add_lane'});
  //   app.addEvent<RemoveLaneEvent>({id: 'b', data: {laneId: 'abc'}, type: 'remove_lane'});
  //
  //   console.log(document.body.innerHTML);
  // });
  //
  // it('reset to specific event', () => {
  //   app.addEvent<AddLaneEvent>({id: 'a', data: {laneId: 'abc'}, type: 'add_lane'});
  //   app.addEvent<AddLaneEvent>({id: 'b', data: {laneId: 'def'}, type: 'add_lane'});
  //   console.log(document.body.innerHTML);
  //   app.restore('a');
  //
  //   console.log(document.body.innerHTML);
  // });
});