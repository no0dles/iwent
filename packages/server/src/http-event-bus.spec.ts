import * as EventSource from 'eventsource';
import 'isomorphic-fetch';
import {HttpEventBus} from '@iwent/web';
import {Defer} from '@iwent/core';
import {HttpEventBusServer} from './http-event-bus-server';

describe('http-event-bus', () => {
  let server: HttpEventBusServer;
  let bus: HttpEventBus;

  beforeEach(async () => {
    server = new HttpEventBusServer();
    await server.listen(3000);
    bus = new HttpEventBus('http://localhost:3000', {eventSourceFactory: endpoint => new EventSource(endpoint)});
  });

  afterEach(async () => {
    if (bus) {
      bus.close();
    }
    if (server) {
      await server.close();
    }
  });

  it('should open event source', async () => {
    await bus.opened;
  });

  it('should receive event', async () => {
    await bus.opened;

    const receivedDefer = new Defer();
    bus.on('receive', (event, afterId) => {
      expect(event).toEqual({id: 'a', type: 'test', data: {}});
      expect(afterId).toBe(null);
      receivedDefer.resolve();
    });
    await bus.send({id: 'a', type: 'test', data: {}});
    await receivedDefer.promise;
  });

  it('should send and get event', async () => {
    await bus.send({id: 'a', type: 'test', data: {}});
    const event = await bus.get('a');
    expect(event).toEqual({id: 'a', type: 'test', data: {}});
  });

  it('should get events', async () => {
    const expectedEvents = [{id: 'a', data: {}, type: 'test'}, {id: 'b', data: {}, type: 'test'}, {id: 'c', data: {}, type: 'test'}];
    for(const event of expectedEvents) {
      server.eventStore.push(event.id, event);
    }

    const actualEvents = await bus.getNext();
    expect(actualEvents).toEqual(expectedEvents);
  });

  it('should get events after id', async () => {
    const expectedEvents = [{id: 'a', data: {}, type: 'test'}, {id: 'b', data: {}, type: 'test'}, {id: 'c', data: {}, type: 'test'}];
    for(const event of expectedEvents) {
      server.eventStore.push(event.id, event);
    }

    const actualEvents = await bus.getNext('b');
    expect(actualEvents).toEqual([{id: 'c', data: {}, type: 'test'}]);
  });


  // it('should close connection', async () => {
  //   await bus.opened;
  //   bus.close();
  //   expect(server.clients.length).toEqual(0);
  // });
});