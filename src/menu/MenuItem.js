export class MenuItem {
  constructor(name) {
    this.name = name;
    this.element = document.createElement("div");
    this.addTextNode(this.name);
  }

  appendTo(containingElement) {
    containingElement.appendChild(this.element);
  }

  addTextNode(text) {
    const span = document.createElement("span"),
      t = document.createTextNode(text);
    span.appendChild(t);
    this.element.appendChild(span);
  }

  close() {}
}
