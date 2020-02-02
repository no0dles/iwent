import {AddLaneEvent} from './handlers/add-lane/add-lane.event';
import {AddCardEvent} from './handlers/add-card/add-card.event';
import {AddCardListenerEvent} from './handlers/add-card-listener/add-card-listener.event';
import {RemoveLaneEvent} from './handlers/remove-lane/remove-lane.event';
import {ApplicationInstance} from '@iwent/web';
import {exampleApp} from './app';
import {Defer, MockEventBus} from '@iwent/core';

describe('index', () => {
  let instance: ApplicationInstance;

  beforeEach(() => {
    instance = exampleApp.listen(new MockEventBus());
    document.body.innerHTML = '<div id="board"></div>'
  });

  it('add lane and card', () => {
    instance.dispatch(AddLaneEvent, {laneId: 'abc'}, {id: 'a'});
    instance.dispatch(AddCardEvent, {laneId: 'abc', cardId: 'def', title: 'cardtitle'}, {id: 'b'});
    expect(document.body.innerHTML).toBe('<div id="board"><div id="lane-abc" class="lane"><div class="header"><button id="add-card-abc" class="btn block">Add card</button></div><div id="card-def" class="card">cardtitle</div></div></div>');
  });

  it('add lane and listener and throw error', async () => {
    instance.dispatch(AddLaneEvent, {laneId: 'abc'}, {id: 'a'});
    instance.dispatch(AddCardEvent, {laneId: 'abc', cardId: 'def', title: 'cardtitle'}, {id: 'b'});
    instance.dispatch(AddCardListenerEvent, {laneId: 'abc', cardId: 'def'}, {id: 'c'});

    const defer = new Defer();
    instance.on('error', err => {
      expect(err.message).toEqual('should not happend');
      defer.resolve();
    });

    document.getElementById('card-def')?.click();

    await defer.promise;
  });

  it('add lane and listener and restore', () => {
    instance.dispatch(AddLaneEvent, {laneId: 'abc'}, {id: 'a'});
    instance.dispatch(AddCardEvent, {laneId: 'abc', cardId: 'def', title: 'cardtitle'}, {
      id: 'b',
    });
    instance.dispatch(AddCardListenerEvent, {laneId: 'abc', cardId: 'def'}, {id: 'c'});
    instance.restore('b');
    document.getElementById('card-def')?.click();
    expect(document.body.innerHTML).toBe('<div id="board"><div id="lane-abc" class="lane"><div class="header"><button id="add-card-abc" class="btn block">Add card</button></div><div id="card-def" class="card">cardtitle</div></div></div>');
  });


  it('add lane and click', () => {
    instance.dispatch(AddLaneEvent, {laneId: 'abc'}, {id: 'a'});
    document.getElementById(`lane-abc`)?.click();
    expect(document.body.innerHTML).toBe('<div id="board"><div id="lane-abc" class="lane"><div class="header"><button id="add-card-abc" class="btn block">Add card</button></div></div></div>');
  });

  it('add lane and restore', () => {
    instance.dispatch(AddLaneEvent, {laneId: 'abc'}, {id: 'a'});
    document.getElementById(`add-card-abc`)?.click();
    expect(document.body.innerHTML).toMatch(/id=\"card\-[a-z0-9]{10}\"/);
    instance.restore('a');
    expect(document.body.innerHTML).toEqual('<div id="board"><div id="lane-abc" class="lane"><div class="header"><button id="add-card-abc" class="btn block">Add card</button></div></div></div>');
  });

  it('add lane event', () => {
    instance.dispatch(AddLaneEvent, {laneId: 'abc'}, {id: 'a'});
    expect(document.body.innerHTML).toEqual('<div id="board"><div id="lane-abc" class="lane"><div class="header"><button id="add-card-abc" class="btn block">Add card</button></div></div></div>');
  });

  it('reset to the beginning', () => {
    instance.dispatch(AddLaneEvent, {laneId: 'abc'}, {id: 'a'});
    instance.restore();
    expect(document.body.innerHTML).toEqual('<div id="board"></div>');
  });

  it('add and remove lane', () => {
    instance.dispatch(AddLaneEvent, {laneId: 'abc'}, {id: 'a'});
    instance.dispatch(RemoveLaneEvent, {laneId: 'abc'}, {id: 'b'});
    expect(document.body.innerHTML).toEqual('<div id="board"></div>');
  });

  it('reset to specific event', () => {
    instance.dispatch(AddLaneEvent, {laneId: 'abc'}, {id: 'a'});
    instance.dispatch(AddLaneEvent, {laneId: 'def'}, {id: 'b'});
    expect(document.body.innerHTML).toEqual('<div id="board"><div id="lane-abc" class="lane"><div class="header"><button id="add-card-abc" class="btn block">Add card</button></div></div><div id="lane-def" class="lane"><div class="header"><button id="add-card-def" class="btn block">Add card</button></div></div></div>');
    instance.restore('a');
    expect(document.body.innerHTML).toEqual('<div id="board"><div id="lane-abc" class="lane"><div class="header"><button id="add-card-abc" class="btn block">Add card</button></div></div></div>');
  });
});