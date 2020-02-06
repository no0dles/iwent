import {MyModal} from './modal';

export class CloseModalEvent {
  static type = 'close-modal';
  modal: MyModal;
}