export interface DomOperation<T> {
  type: string;
  execute(): T;
  reverseOperation(): DomOperation<any> | null;
}