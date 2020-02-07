import {Application, ApplicationEventContext} from '@iwent/web';
import {OpenModalEvent} from './events/open-modal.event';
import {CloseModalEvent} from './events/close-modal.event';
import {IwentElement} from '@iwent/web/dist/element';
import {CloseModalEventHandler} from './handlers/close-modal.handler';
import {OpenModalEventHandler} from './handlers/open-modal.handler';

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
    context.dispatch(OpenModalEvent, {modal: this}, {temporary: true});
  }

  close(context: ApplicationEventContext) {
    context.dispatch(CloseModalEvent, {modal: this}, {temporary: true});
  }
}
