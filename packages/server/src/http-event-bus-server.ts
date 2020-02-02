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

    this.server.router.get('/event', (req, res) => {
      const id = req.query('id');
      const afterId = req.query('afterId');

      if (id) {
        const event = this.eventStore.get(id);
        res.writeHead(200, {
          'Content-Type': 'application/json',
        });
        res.write(JSON.stringify(event));
        res.end();
      }

      const events: ApplicationEvent<any>[] = [];
      let current = afterId ? this.eventStore.next(afterId) : this.eventStore.first();
      while (current) {
        events.push(current);
        current = this.eventStore.next(current.id);
      }

      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.write(JSON.stringify(events));
      res.end();
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

      req.onClose.then(() => {
        const index = this.clients.indexOf(client);
        this.clients.splice(index);
      });
    });

    this.server.router.post('/', async (req, res) => {
      const payload = await req.json<ApplicationEvent<any>>();
      const afterId = this.eventStore.push(payload.id, payload);
      res.end(afterId);
      for (const client of this.clients) {
        client.push(payload, afterId);
      }
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