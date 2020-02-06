import {Application, ApplicationEventContext, ApplicationEventHandler, IwentElement} from '@iwent/web';
import {OpenModalEvent} from './open-modal.event';
import {CloseModalEvent} from './close-modal.event';
import {ApplicationEvent} from '@iwent/core';

export class MyModal extends IwentElement {
  static element = 'my-modal';

  private readonly saveBtn: HTMLElement | null;
  private readonly input: HTMLInputElement | null;

  saveFn: (text: string) => void;

  constructor() {
    super(require('./modal.html'));

    this.saveBtn = this.shadow.getElementById('save-btn');
    this.input = this.shadow.getElementById('input') as HTMLInputElement;
    if (this.saveBtn) {
      this.saveBtn.addEventListener('click', this.handleSaveClick);
    }
  }

  disconnectedCallback() {
    if (this.saveBtn) {
      this.saveBtn.removeEventListener('click', this.handleSaveClick);
    }
  }

  private handleSaveClick = () => {
    if (this.input?.value && this.saveFn) {
      this.saveFn(this.input.value);
    }
  };

  static register(app: Application) {
    app.addEventHandler(OpenModalEvent, new OpenModalEventHandler());
    app.addEventHandler(CloseModalEvent, new CloseModalEventHandler());
  }

  present(context: ApplicationEventContext) {
    context.dispatch(OpenModalEvent, {modal: this}, {send:false});
  }

  close(context: ApplicationEventContext) {
    console.log('dispatch close');
    context.dispatch(CloseModalEvent, {modal: this}, {send:false});
  }
}

class OpenModalEventHandler implements ApplicationEventHandler<OpenModalEvent> {
  handle(context: ApplicationEventContext, event: ApplicationEvent<OpenModalEvent>): void {
    context.domStore.appendChild('board', event.data.modal);
  }
}

class CloseModalEventHandler implements ApplicationEventHandler<CloseModalEvent> {
  handle(context: ApplicationEventContext, event: ApplicationEvent<CloseModalEvent>): void {
    context.domStore.removeChild('board', event.data.modal);
  }
}