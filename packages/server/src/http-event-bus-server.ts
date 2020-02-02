import {HttpServerClient} from './http-server-client';
import {ApplicationEvent, EventStore} from '@iwent/core';
import {HttpServer} from './http-server';

export class HttpEventBusServer {
  private server = new HttpServer();
  public clients: HttpServerClient[] = [];
  public eventStore = new EventStore<ApplicationEvent<any>>();

  constructor() {
    this.server.router.middleware((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Cache-Control, Last-Event-ID, Content-Type');
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    });

    this.server.router.get('/', (req, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });
      res.write('\n');
      const client = new HttpServerClient(res);
      this.clients.push(client);
      req.on('close', () => {
        const index = this.clients.indexOf(client);
        this.clients.splice(index);
      });
    });

    this.server.router.post('/', (req, res) => {
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
    });

    this.server.router.options((req, res) => {
      res.writeHead(200);
      res.end();
    });
  }

  listen(port: number) {
    return this.server.listen(port);
  }

  async close(): Promise<void> {
    for (const client of this.clients) {
      await client.close();
    }
    await this.server.close();
  }
}