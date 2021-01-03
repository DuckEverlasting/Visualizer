import { MenuItem } from "./MenuItem";

export class MenuAction extends MenuItem {
  constructor(name, hoverText, action) {
    super(name);
    this.disabled = false;
    this.hoverText = hoverText;
    this.action = action;
    this.element.onclick = e => {
      if (this.disabled) {
        e.stopPropagation();
      } else {
        this.action(e);
      }
    };
    this.element.title = this.hoverText;
    this.element.className = "menu-action"
  }
}
