import {ApplicationEvent, Defer} from '@iwent/core';
import * as request from 'request';

export function send(event: ApplicationEvent<any>) {
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