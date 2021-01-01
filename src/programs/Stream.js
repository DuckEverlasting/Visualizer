export class Stream {
  constructor(params = {}) {
    this.value = 0;
    this.max = 100;
    this.min = 0;
    this.behaviors = [];
    this.threshold = params.threshold || 0;
  }

  render(display) {

  }

  updateData(value) {
    if (value < this.threshold) {
      return;
    }
    this.behaviors.forEach(a => a.updateData(value));
  }

  updatePhysics(delta) {
    this.behaviors.forEach(a => a.updatePhysics(delta));
  }
}
