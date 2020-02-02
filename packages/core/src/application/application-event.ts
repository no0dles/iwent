export class ApplicationEvent<T> {
  id!: string;
  type!: string;
  data!: T;

  static generateId() {
    return Math.random().toString(36).substr(2, 10);
  }
}