export class Display {
  constructor(containingElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = containingElement.clientWidth;
    this.canvas.height = containingElement.clientHeight;
    containingElement.appendChild(this.canvas);
  }
}
