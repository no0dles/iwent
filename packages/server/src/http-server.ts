import * as http from 'http';
import {Defer} from '@iwent/core';
import {HttpRouter} from './http-router';

export class HttpServer {
  private server: http.Server;
  public router = new HttpRouter();

  constructor() {
    this.server = http.createServer((req, res) => {
      const handled = this.router.handle(req, res);
      if (!handled) {
        res.writeHead(404).end();
      }
    });
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
