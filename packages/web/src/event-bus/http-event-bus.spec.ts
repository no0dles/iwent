import 'eventsource/lib/eventsource-polyfill';
import 'isomorphic-fetch';

import {HttpEventBus} from './http-event-bus';
import * as nock from 'nock';

describe('http-event-bus', () => {
  afterEach(() => {
    nock.abortPendingRequests();
    nock.restore();
  });

  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
  });

  it('should send event and return afterId null', async () => {
    nock('http://localhost:3000').post('/').reply(200, '');

    const client = new HttpEventBus('http://localhost:3000');
    const result = await client.send({id: 'a', type: 'test', data: {}});
    expect(result).toBe(null);
  });

  it('should send event and return afterId a', async () => {
    nock('http://localhost:3000').post('/').reply(200, 'a');

    const client = new HttpEventBus('http://localhost:3000');
    const result = await client.send({id: 'b', type: 'test', data: {}});
    expect(result).toBe('a');
  });
});