import {EventStore} from './even-store';

describe('event-store', () => {
  let store: EventStore;

  beforeEach(() => {
    store = new EventStore();
  });

  function expectEvents(...ids: string[]) {
    let event = store.getFirst();
    let index = 0;
    while (event) {
      expect(event.id).toBe(ids[index]);
      index++;
      event = store.getAfter(event.id);
    }
    expect(event).toBe(null);
    console.log('compare first');
    expect(store.getFirst()?.id).toBe(ids[0]);
    console.log('compare last');
    expect(store.getLast()?.id).toBe(ids[ids.length - 1]);
  }

  function push(id: string) {
    store.pushEvent({id, data: {}, type: 'test'});
  }

  function move(id: string, afterId?: string) {
    store.moveEvent(id, afterId);
  }

  function insertAfter(id: string, afterId?: string) {
    store.insertEventAfter({id, data: {}, type: 'test'}, afterId);
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

  it('move last to first event', () => {
    push('a');
    push('b');
    push('c');
    move('c');
    expectEvents( 'c', 'a', 'b');
  });
});