export type DefaultConstructable<T = any> = { new (): T };
export type Constructable<T = any> = { new (...args: any[]): T };

export type EventConstructable<T = any> = DefaultConstructable<T> & {type: string};