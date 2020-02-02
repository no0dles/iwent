import * as http from "http";
import {ApplicationEvent, Defer} from '@iwent/core';

export class HttpServerClient {
  private messageId = 0;

  constructor(private response: http.ServerResponse) {

  }

  push(event: ApplicationEvent<any>, afterId: string | null) {
    this.response.write(`id: ${this.messageId}\n`);
    this.response.write(`data: ${JSON.stringify({event, afterId})}\n\n`);
    this.messageId++;
  }

  close() {
    const defer = new Defer<void>();
    this.response.end(() => defer.resolve());
    return defer.promise;
  }
}
