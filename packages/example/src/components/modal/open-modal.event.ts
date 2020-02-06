import {MyModal} from './modal';

export class OpenModalEvent {
  static type = 'open-modal';

  modal: MyModal;
}