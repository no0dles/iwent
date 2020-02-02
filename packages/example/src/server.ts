/* istanbul ignore file */

import {HttpEventBusServer} from '@iwent/server';

const server = new HttpEventBusServer();
server.listen(3333);