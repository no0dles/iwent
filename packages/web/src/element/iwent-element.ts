export class IwentElement extends HTMLElement {
  protected shadow: ShadowRoot;

  constructor(template: string) {
    super();
    const templateEl = document.createElement('template');
    templateEl.innerHTML = template;

    this.shadow = this.attachShadow({mode: 'closed'});
    this.shadow.appendChild(templateEl.content.cloneNode(true));
  }
}
