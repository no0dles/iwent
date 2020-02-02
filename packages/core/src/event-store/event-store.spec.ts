import {EventStore} from './event-store';

describe('event-store', () => {
  let store: EventStore<any>;

  beforeEach(() => {
    store = new EventStore();
  });

  function expectEvents(...ids: string[]) {
    let event = store.first();
    let index = 0;
    while (event) {
      expect(event.id).toBe(ids[index]);
      index++;
      event = store.next(event.id);
    }
    expect(event).toBe(null);
    console.log('compare first');
    expect(store.first()?.id).toBe(ids[0]);
    console.log('compare last');
    expect(store.last()?.id).toBe(ids[ids.length - 1]);
  }

  function push(id: string) {
    store.push(id, {id});
  }

  function move(id: string, afterId?: string) {
    store.move(id, afterId);
  }

  function insertAfter(id: string, afterId?: string) {
    store.insertAfter(id, {id}, afterId);
  }

  it('insert after first', () => {
    insertAfter('a');
    insertAfter('b', 'a');
    expectEvents('a', 'b');
  });

  it('insert after undefined', () => {
    insertAfter('a');
    insertAfter('b');
    expectEvents('b', 'a');
  });

  it('push two events', () => {
    push('a');
    push('b');
    expectEvents('a', 'b');
  });

  it('move last event', () => {
    push('a');
    push('b');
    move('b', undefined);
    expectEvents('b', 'a');
  });

  it('move first event', () => {
    push('b');
    push('a');
    move('b', 'a');
    expectEvents('a', 'b');
  });

  it('get of non existing', () => {
    const event = store.get('a');
    expect(event).toBe(null);
  });

  it('prev of non existing', () => {
    const event = store.prev('a');
    expect(event).toBe(null);
  });

  it('next of non existing', () => {
    const event = store.next('a');
    expect(event).toBe(null);
  });

  it('next at end', () => {
    push('a');
    const event = store.next('a');
    expect(event).toBe(null);
  });

  it('prev at beginning', () => {
    push('a');
    const event = store.prev('a');
    expect(event).toBe(null);
  });

  it('move to current position', () => {
    push('a');
    move('a', undefined);
    expectEvents('a');
  });

  it('move last to first event', () => {
    push('a');
    push('b');
    push('c');
    move('c');
    expectEvents('c', 'a', 'b');
  });
});