import * as http from 'http';
import * as url from 'url';
import {Defer} from '@iwent/core';
import {UrlWithStringQuery} from 'url';

export class HttpRequest {
  private readonly parsedUrl: UrlWithStringQuery;
  private readonly bodyDefer = new Defer<string>();
  private readonly queryValues: { [key: string]: string } = {};

  public path: string;
  public hostname: string;

  constructor(private req: http.IncomingMessage) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      this.bodyDefer.resolve(body);
    });
    this.parsedUrl = url.parse(req.url || '');
    this.path = this.parsedUrl.pathname || '';
    for (const keypair of this.parsedUrl.query?.split('&') || []) {
      const values = keypair.split('=');
      this.queryValues[values[0]] = values[1];
    }
  }

  query(name: string): string | null {
    return this.queryValues[name] || null;
  }

  get body() {
    return this.bodyDefer.promise;
  }

  json<T>(): Promise<T> {
    return this.bodyDefer.promise.then(body => <T>JSON.parse(body));
  }

  get onClose() {
    const defer = new Defer();
    this.req.on('close', () => {
      defer.resolve();
    });
    return defer.promise;
  }
}