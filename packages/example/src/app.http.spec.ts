import {AddLaneEvent} from './add-lane/add-lane.event';
import {ApplicationEvent, Defer, MockEventBus} from '@iwent/core';
import {exampleApp} from './app';

describe('app event bus', () => {
  let eventBus: MockEventBus;

  beforeEach(async () => {
    eventBus = new MockEventBus();
  });

  afterEach(async () => {
    eventBus.close();
  });

  it('should receive event', async () => {
    const receivedDefer = new Defer<{ event: ApplicationEvent<any>, afterId: string | null }>();
    eventBus.on('receive', (event, afterId) => {
      receivedDefer.resolve({event, afterId});
    });

    const sendEvent = {id: 'a', data: {}, type: 'test'};
    const sendResult = await eventBus.send(sendEvent);
    expect(sendResult).toBe(null);

    const result = await receivedDefer.promise;

    expect(result.event).toEqual(sendEvent);
    expect(result.afterId).toBe(null);

    eventBus.close();
  });

  it('should receive event and return afterId', async () => {
    const eventA = {id: 'a', data: {}, type: 'test'};
    const eventB = {id: 'b', data: {}, type: 'test'};
    const sendAResult = await eventBus.send(eventA);
    expect(sendAResult).toBe(null);
    const sendBResult = await eventBus.send(eventB);
    expect(sendBResult).toBe('a');
  });


  it('should dispatch events and sync', async () => {
    document.body.innerHTML = '<div id="board"></div><div id="board"></div>';

    const instanceA = exampleApp.listen(eventBus);
    const instanceB = exampleApp.listen(eventBus);

    const receiveDefer = new Defer<void>();
    eventBus.on('receive', (event, after) => {
      if (event.id === 'b') {
        receiveDefer.resolve();
      }
    });

    instanceA.dispatch(AddLaneEvent, {laneId: 'abc'}, {id: 'a'});
    instanceB.dispatch(AddLaneEvent, {laneId: 'def'}, {id: 'b'});

    await receiveDefer.promise;
    console.log(document.body.innerHTML);
  });


  it('should move dispatched event down', async () => {
    document.body.innerHTML = '<div id="board"></div>/div>';

    const instance = exampleApp.listen(eventBus);

    const event: ApplicationEvent<any> = {id: 'a', type: 'add_lane', data: {laneId: 'def'}};
    eventBus.push(event);

    instance.dispatch(AddLaneEvent, {laneId: 'abc'}, {id: 'b'});
    await eventBus.send(event);

    console.log(document.body.innerHTML);
  });
});