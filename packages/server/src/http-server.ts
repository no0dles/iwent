import * as http from 'http';
import {HttpServerClient} from './http-server-client';
import {ApplicationEvent, Defer, EventStore} from '@iwent/core';

export class HttpEventBusServer {
  private server: http.Server;
  public clients: HttpServerClient[] = [];
  public eventStore = new EventStore<ApplicationEvent<any>>();

  constructor() {
    this.server = http.createServer((req, res) => {
      if (req.method === 'GET') {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': 'http://localhost',
          'Access-Control-Allow-Headers': 'Cache-Control, Last-Event-ID',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
        });
        res.write('\n');
        const client = new HttpServerClient(res);
        this.clients.push(client);
        req.on('close', () => {
          const index = this.clients.indexOf(client);
          this.clients.splice(index);
        });
      } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
          const payload = JSON.parse(body);
          const afterId = this.eventStore.push(payload.id, payload);
          res.end(afterId);
          for (const client of this.clients) {
            client.push(payload, afterId);
          }
        });
      } else if (req.method === 'OPTIONS') {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': 'http://localhost',
          'Access-Control-Allow-Headers': 'Cache-Control, Last-Event-ID',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
        });
        res.end();
      }
    });
  }

  listen(port: number) {
    const defer = new Defer<void>();
    this.server.listen(port, () => {
      console.log('listening')
      defer.resolve()
    });
    return defer.promise;
  }

  async close(): Promise<void> {
    const defer = new Defer<void>();
    this.server.close(err => {
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve();
      }
    });
    for (const client of this.clients) {
      await client.close();
    }
    return defer.promise;
  }
}