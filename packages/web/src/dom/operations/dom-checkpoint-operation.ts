import {DomOperation} from './dom-operation';

export class DomCheckpointOperation implements DomOperation<void> {
  type = 'checkpoint';

  constructor(public id: string) {

  }

  execute(): void {

  }

  reverseOperation(): DomOperation<any> | null {
    return null;
  }
}