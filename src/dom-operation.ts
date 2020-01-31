

export type DomOperation =
  DomAppendOperation
  | DomRemoveOperation
  | DomCheckpointOperation
  | DomAddEventListenerOperation
  | DomRemoveEventListenerOperation;

export interface DomAddEventListenerOperation {
  type: 'add_event_listener'
  elementId: string;
  listener: () => void;
  event: string;
}

export interface DomRemoveEventListenerOperation {
  type: 'remove_event_listener'
  elementId: string;
  listener: () => void;
  event: string;
}

export interface DomAppendOperation {
  type: 'append_element'
  elementId: string;
  containerId: string;
  html: string;
}

export interface DomRemoveOperation {
  type: 'remove_element';
  containerId: string;
  elementId: string;
  html: string;
}

export interface DomCheckpointOperation {
  type: 'checkpoint';
  id: string;
}