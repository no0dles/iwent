export class RobinEvent<T> {
  id!: string;
  type!: string;
  data!: T;
}


export function getNewEventId() {
  return Math.random().toString(36).substr(2, 12);
}