import { vect } from "../helpers/Vector";
import { Menu } from "./Menu";
import { MenuAction } from "./MenuAction";
import { MenuBranch } from "./MenuBranch";

export class MenuBar {
  constructor(element, params = {content: []}) {
    this.stagingElement = document.createElement('div');
    this.container = document.createElement('div');
    element.appendChild(this.stagingElement);
    element.appendChild(this.container);
    this.stagingElement.onclick = () => this.clearMenu();
    // ADD STYLING
    this.title = params.title || '';
    const h = document.createElement("h1");
    h.textContent = this.title;
    this.container.appendChild(h);
    params.content.forEach(m => {
      const button = document.createElement('button');
      button.textContent = m.title;
      const menu = this.buildMenu(m.children);
      button.onclick = this.loadMenu(menu);
    });
  }

  buildMenu(children = []) {
    return new Menu(children.map(i => this.buildMenuItem(i)));
  }

  buildMenuItem(params = {}) {
    if (params.type === 'action') {
      return new MenuAction(params.name, params.hoverText, params.action);
    } else if (params.type === 'branch') {
      const subMenu = this.buildMenu(params.children);
      return new MenuBranch(params.name, subMenu, params.position);
    }
  }

  loadMenu(menu) {
    this.clearMenu();
    const rect = menu.element.getBoundingClientRect();
    menu.setPosition(vect(rect.left, rect.bottom));
    this.stagingElement.appendChild(menu.element);
    this.stagingElement.style.zIndex = "1";
    this.currentMenu = menu;
  }

  clearMenu() {
    if (this.currentMenu !== null) {
      this.stagingElement.removeChild(this.currentMenu.element);
      this.currentMenu = null;
      this.stagingElement.style.zIndex = "inherit";
    }
  }
}
