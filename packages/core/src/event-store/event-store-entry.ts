export interface EventStoreEntry<T> {
  event: T;
  prev: string | null;
  next: string | null;
}