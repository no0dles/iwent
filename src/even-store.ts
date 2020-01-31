import {RobinEvent} from './index';

export class EventStore {
  private events: { [key: string]: { event: RobinEvent<any> | null, prev: string, next: string } } = {
    'first': {next: 'last', event: null} as any,
    'last': {prev: 'first', event: null} as any,
  };

  get(id: string): RobinEvent<any> | null {
    return this.events[id] ? this.events[id].event : null;
  }

  getLast(): RobinEvent<any> | null {
    if (this.events['last'].next === 'first') {
      return null;
    }
    return this.events[this.events['last'].prev].event;
  }

  getFirst(): RobinEvent<any> | null {
    if (this.events['first'].next === 'last') {
      return null;
    }
    return this.events[this.events['first'].next].event;
  }

  getPrev(id: string): RobinEvent<any> | null {
    if (!this.events[id]) {
      return null;
    }
    if (this.events[id].next === 'first') {
      return null;
    }
    return this.events[this.events[id].prev].event;
  }

  getAfter(id: string): RobinEvent<any> | null {
    if (!this.events[id]) {
      return null;
    }
    if (this.events[id].next === 'last') {
      return null;
    }
    return this.events[this.events[id].next].event;
  }

  pushEvent(event: RobinEvent<any>) {
    this.insertEventAfter(event, this.events['last'].prev);
  }

  insertEventAfter(event: RobinEvent<any>, after?: string) {
    if (after) {
      this.events[event.id] = {
        event: event,
        next: this.events[after].next,
        prev: after,
      };
      if (this.events[after].next) {
        this.events[this.events[after].next].prev = event.id;
      }
      this.events[after].next = event.id;
    } else {
      this.events[event.id] = {
        event: event,
        next: this.events['first'].next,
        prev: 'first',
      };
      this.events[this.events['first'].next].prev = event.id;
      this.events['first'].next = event.id;
    }
  }

  moveEvent(eventId: string, afterId?: string) {
    const moveToBeforeId = afterId ? afterId : 'first';

    const moveToBefore = this.events[moveToBeforeId];
    const moveToAfter = this.events[moveToBefore.next];
    const eventToMove = this.events[eventId];
    const eventToMoveBefore = this.events[eventToMove.prev];
    const eventToMoveAfter = this.events[eventToMove.next];

    const eventToMovePrev = eventToMove.prev;
    const eventToMoveNext = eventToMove.next;

    eventToMove.prev = moveToBeforeId;
    eventToMove.next = moveToBefore.next;
    eventToMoveBefore.next = eventToMoveNext;
    eventToMoveAfter.prev = eventToMovePrev;
    moveToBefore.next = eventId;
    moveToAfter.prev = eventId;
  }
}