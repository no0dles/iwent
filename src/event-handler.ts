import {RobinEvent} from './index';
import {EventContext} from './event-context';
import {EventType} from './application-context';

export abstract class EventHandler<T extends EventType> {
  abstract handle(context: EventContext, event: RobinEvent<T>): void;
}