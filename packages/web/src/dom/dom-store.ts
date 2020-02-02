import {DomElementResult} from './dom-element-result';

export interface DomStore {
  appendElement(containerId: string, elementId: string, html: string): DomElementResult;
  getElement(elementId: string): DomElementResult;
  removeElement(containerId: string, elementId: string): void;
}
