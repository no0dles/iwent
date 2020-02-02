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
    bus.close();
    await server.close();
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

  // it('should close connection', async () => {
  //   await bus.opened;
  //   bus.close();
  //   expect(server.clients.length).toEqual(0);
  // });
});