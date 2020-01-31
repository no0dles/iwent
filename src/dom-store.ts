import {AppendElementResult} from './element-result';

export interface DomStore {
  appendElement(containerId: string, elementId: string, html: string): AppendElementResult;
  getElement(elementId: string): AppendElementResult;
  removeElement(containerId: string, elementId: string): void;
}
