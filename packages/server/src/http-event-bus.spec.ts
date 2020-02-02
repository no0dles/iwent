import * as EventSource from 'eventsource';
import 'isomorphic-fetch';
import {HttpEventBus} from '@iwent/web';
import {HttpEventBusServer} from './http-server';
import {Defer} from '@iwent/core';

describe('http-event-bus', () => {
  let server: HttpEventBusServer;
  let bus: HttpEventBus;

  beforeEach(async () => {
    server = new HttpEventBusServer();
    await server.listen(3333);
    bus = new HttpEventBus('http://localhost:3333', {eventSourceFactory: endpoint => new EventSource(endpoint)});
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

  // it('should close connection', async () => {
  //   await bus.opened;
  //   bus.close();
  //   expect(server.clients.length).toEqual(0);
  // });
});