import { vect } from "../helpers/Vector";
import { MenuItem } from "./MenuItem";

export class MenuBranch extends MenuItem {
  constructor(name, child, childPosition = ["right", "top"]) {
    super(name);
    this.active = false;
    this.child = child;
    this.childPosition = childPosition;
    this.addTextNode(">");
    this.element.className = "menu-branch";
    this.element.onclick = (e) => {
      this.open();
      e.stopPropagation();
    }
    this.element.onmouseenter = e => {
      setTimeout(() => {
        if (!this.active) {
          this.open();
        }
      }, 300)
    };
  }

  open() {
    this.parent.closeAll();
    this.child.setPosition(this.getChildVector());
    this.element.appendChild(this.child.element);
    this.active = true;
  }

  close() {
    if (this.active) {
      this.child.closeAll();
      this.element.removeChild(this.child.element);
      this.active = false;
    }
  }

  getChildVector() {
    return vect(
      this.childPosition[0] === "right" ? this.element.clientWidth : 0,
      this.childPosition[1] === "bottom" ? this.element.clientHeight : 0
    )
  }
}
