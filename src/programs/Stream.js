export class Stream {
  constructor() {
    this.value = 0;
    this.max = 100;
    this.min = 0;
    this.behaviors = [];
  }

  updateData(value) {
    this.behaviors.forEach(a => a.updateData(value));
  }

  updatePhysics(delta) {
    this.behaviors.forEach(a => a.updatePhysics(delta));
  }
}
