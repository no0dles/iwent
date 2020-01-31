export interface ApplicationContext {
  dispatch<T extends EventType>(type: DefaultConstructable<T>, payload: T, options?: { id?: string });
}

export type DefaultConstructable<T = any> = { new (): T };
export type EventConstructable<T extends EventType> = { new (): T,  };

export abstract class EventType {
  static type: string;
}