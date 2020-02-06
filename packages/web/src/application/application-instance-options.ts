import {EventBus} from '@iwent/core';

export interface ApplicationInstanceOptions {
  bus: EventBus;
  root: Document;
}