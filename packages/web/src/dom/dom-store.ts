import {DomElementResult} from './dom-element-result';

export interface DomStore {
  appendElement(containerId: string, elementId: string, html: string): DomElementResult;
  getElement(elementId: string): DomElementResult;
  removeElement(containerId: string, elementId: string): void;
  appendChild(containerId: string, elm: HTMLElement): boolean;
  removeChild(containerId: string, element: HTMLElement): boolean;
}
