import {Defer} from './defer';

describe('defer', () => {
  it('should resolve promise', async () => {
    const defer = new Defer();
    defer.resolve();
    await defer.promise;
  });

  it('should reject promise', () => {
    expect.assertions(1);
    const defer = new Defer();
    defer.reject(new Error('test'));
    expect(defer.promise).rejects.toEqual({
      error: 'test',
    });
  });

  it('should not resolve already rejected promise', () => {
    const defer = new Defer();
    defer.reject(new Error('test'));
    expect(() => defer.resolve()).toThrow();
    expect(defer.promise).rejects.toEqual({
      error: 'test',
    });
  });

  it('should not reject already resolve promise', async () => {
    const defer = new Defer();
    defer.resolve();
    expect(() => defer.reject(new Error('test'))).toThrow();
    await defer.promise;
  });

  it('should not resolve already resolve promise again', async () => {
    const defer = new Defer<number>();
    defer.resolve(1);

    expect(() => defer.resolve(2)).toThrow();
    await defer.promise;
    expect(defer.promise).resolves.toEqual(1);
  });

  it('should not resolve already resolve promise again', async () => {
    const defer = new Defer<number>();
    defer.reject(new Error('test'));

    expect(() => defer.reject(new Error('test2'))).toThrow();
    expect(defer.promise).rejects.toEqual({
      error: 'test',
    });
  });

  it('should be rejected after rejection', async () => {
    const defer = new Defer<number>();
    expect(defer.isResolved).toBe(false);
    expect(defer.isRejected).toBe(false);

    const error = new Error('test');
    defer.reject(error);
    expect(defer.isResolved).toBe(false);
    expect(defer.isRejected).toBe(true);
    expect(defer.rejectedError).toBe(error);
  });

  it('should be resolved after resolving', async () => {
    const defer = new Defer<number>();
    expect(defer.isResolved).toBe(false);
    expect(defer.isRejected).toBe(false);

    defer.resolve(1);
    expect(defer.isResolved).toBe(true);
    expect(defer.isRejected).toBe(false);
    expect(defer.resolvedResult).toBe(1);
  });
});