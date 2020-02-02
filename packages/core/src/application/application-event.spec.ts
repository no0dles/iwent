import {ApplicationEvent} from './application-event';

describe('application-event', () => {
  it('should generate random id', () => {
    const value = ApplicationEvent.generateId();
    expect(value.length).toBe(10);
  })
});