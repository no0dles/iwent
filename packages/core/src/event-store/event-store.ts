import {EventStoreEntry} from './event-store-entry';

export class EventStore<T> {
  private events: { [key: string]: EventStoreEntry<T> } = {
    'first': {next: 'last', event: null} as any,
    'last': {prev: 'first', event: null} as any,
  };

  size = 0;

  get(id: string): T | null {
    return this.events[id] ? this.events[id].event : null;
  }

  last(): T | null {
    return this.prev('last');
  }

  first(): T | null {
    return this.next('first');
  }

  prev(id: string): T | null {
    const event = this.events[id];
    if (!event) {
      return null;
    }
    if (!event.prev || event.prev === 'first') {
      return null;
    }
    return this.events[event.prev].event;
  }

  next(id: string): T | null {
    const event = this.events[id];
    if (!event) {
      return null;
    }
    if (!event.next || event.next === 'last') {
      return null;
    }
    return this.events[event.next].event;
  }

  push(eventId: string, event: T) {
    return this.insertAfter(eventId, event, this.events['last'].prev);
  }

  insertAfter(eventId: string, event: T, after?: string | null) {
    if (after) {
      this.events[eventId] = {
        event: event,
        next: this.events[after].next,
        prev: after,
      };
      const afterNext = this.events[after].next;
      if (afterNext) {
        this.events[afterNext].prev = eventId;
      }
      this.events[after].next = eventId;
      if (after === 'first') {
        return null;
      }
      this.size++;
      return after;
    } else {
      this.events[eventId] = {
        event: event,
        next: this.events['first'].next,
        prev: 'first',
      };
      const next = this.events['first'].next;
      if (next) {
        this.events[next].prev = eventId;
      }
      this.events['first'].next = eventId;
      this.size++;
      return null;
    }
  }

  move(eventId: string, afterId?: string | null) {
    const moveToBeforeId = afterId ? afterId : 'first';

    if (moveToBeforeId === this.events[eventId].prev) {
      return;
    }

    const moveToBefore = this.events[moveToBeforeId];
    const moveToAfter = moveToBefore.next ? this.events[moveToBefore.next] : null;
    const eventToMove = this.events[eventId];
    const eventToMoveBefore = eventToMove.prev ? this.events[eventToMove.prev] : null;
    const eventToMoveAfter = eventToMove.next ? this.events[eventToMove.next] : null;

    const eventToMovePrev = eventToMove.prev;
    const eventToMoveNext = eventToMove.next;

    eventToMove.prev = moveToBeforeId;
    eventToMove.next = moveToBefore.next;

    if (eventToMoveBefore) {
      eventToMoveBefore.next = eventToMoveNext;
    }
    if (eventToMoveAfter) {
      eventToMoveAfter.prev = eventToMovePrev;
    }
    moveToBefore.next = eventId;
    if (moveToAfter) {
      moveToAfter.prev = eventId;
    }
  }
}