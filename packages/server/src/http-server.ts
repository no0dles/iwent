import * as http from 'http';
import {Defer} from '@iwent/core';
import {HttpRouter} from './http-router';

export class HttpServer {
  private server: http.Server;
  public router = new HttpRouter();
  private readonly errorListeners: ((err: Error) => void)[] = [];

  constructor() {
    this.server = http.createServer((req, res) => {
      const handled = this.router.handle(req, res);
      if (!handled) {
        res.writeHead(404).end();
      }
    });
    this.server.on('error', err => {
      for (const errorListener of this.errorListeners) {
        errorListener(err);
      }
    });
  }

  on(event: 'error', handler: (err: Error) => void) {
    this.errorListeners.push(handler);
  }

  listen(port: number) {
    const defer = new Defer<void>();
    this.server.listen(port, () => {
      defer.resolve();
    });
    return defer.promise;
  }

  close() {
    const defer = new Defer<void>();
    this.server.close(err => {
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve();
      }
    });
    return defer.promise;
  }
}
