import * as EventSource from 'eventsource';
import {HttpEventBusServer} from './http-server';
import * as request from 'request';
import {ApplicationEvent, Defer} from '@iwent/core';

describe('http-server', () => {
  let server: HttpEventBusServer;

  beforeEach(async () => {
    server = new HttpEventBusServer();
    await server.listen(3333);
  });

  afterEach(async () => {
    await server.close();
  });

  it('should post event', async () => {
    const afterId = await sendEvent({id: 'a', type: 'test', data: {}});
    expect(afterId).toBe(null);

    const event = await server.eventStore.first();
    expect(event).toEqual({id: 'a', type: 'test', data: {}});
  });

  it('should return afterId', async () => {
    const afterId = await sendEvent({id: 'a', type: 'test', data: {}});
    expect(afterId).toBe(null);

    const afterId2 = await sendEvent({id: 'b', type: 'test', data: {}});
    expect(afterId2).toBe('a');

    const firstEvent = await server.eventStore.first();
    const lastEvent = await server.eventStore.last();
    expect(firstEvent).toEqual({id: 'a', type: 'test', data: {}});
    expect(lastEvent).toEqual({id: 'b', type: 'test', data: {}});
  });

  it('should receive event from eventsource', async () => {
    const source = new EventSource('http://localhost:3333');
    const receivedMessageDefer = new Defer();
    source.addEventListener('message', e => {
      const messageData = JSON.parse(e.data);
      expect(messageData).toEqual({
        afterId: null,
        event: {
          id: 'a',
          data: {},
          type: 'test',
        },
      });
      receivedMessageDefer.resolve();
    });

    const connectedDefer = new Defer();
    source.onopen = () => {
      connectedDefer.resolve();
    };

    await connectedDefer.promise;
    await sendEvent({id: 'a', data: {}, type: 'test'});
    await receivedMessageDefer.promise;
    source.close();
  });

  function sendEvent(event: ApplicationEvent<any>) {
    const defer = new Defer<string | null>();
    request.post('http://localhost:3333', {json: event}, async (err, res) => {
      if (err) {
        defer.reject(err)
      } else {
        const afterId = res.body ? res.body.toString() : null;
        defer.resolve(afterId);
      }
    });
    return defer.promise;
  }
});