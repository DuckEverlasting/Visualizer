export class Visualizer {
  // containingElement: HTMLDivElement - contains canvas
  // data: Data - controls streams of data
  // behavior: Behavior - handles rendering of data
  // display: Display - holds info about canvas

  constructor(containingElement) {
    this.display = new Display(containingElement);
    this.data = this.getDefaultData();
    this.behavior = this.getDefaultBehavior();
  }

  setBehavior(behavior) {
    this.behavior = behavior;
  }
}