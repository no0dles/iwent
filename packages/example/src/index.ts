import {HttpEventBus} from '@iwent/web';
import {exampleApp} from './app';

const http = new HttpEventBus('http://localhost:3333');
const instance = exampleApp.listen(http);