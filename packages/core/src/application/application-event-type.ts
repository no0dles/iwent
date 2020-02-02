export type DefaultConstructable<T = any> = { new (): T };

export type EventConstructable<T = any> = DefaultConstructable<T> & {type: string};