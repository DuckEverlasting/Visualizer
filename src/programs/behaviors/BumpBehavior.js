import { Behavior } from "./Behavior";

export class BumpBehavior extends Behavior {
  constructor(parent, params = {}) {
    super(parent);
    this.attack = params.attack || 200;
    this.decay = params.decay || 50;
    this.hold = params.hold || .1;
    this.holdFor = 0;
    this.risingTo = 0;
  }

  updateData(value) {
    const fractionValue = (value + 1) / 2.56
    if (this.parent.value < fractionValue && this.risingTo < fractionValue) {
      this.risingTo = fractionValue;
    }
  }

  updatePhysics(delta) {
    const secondsPassed = delta / 1000;
    if (this.holdFor > 0) {
      this.holdFor = Math.max(this.holdFor - secondsPassed, 0);
    } else if (this.risingTo) {
      this.parent.value = Math.min(this.risingTo, this.parent.value + this.attack * secondsPassed);
      if (this.parent.value === this.risingTo) {
        this.risingTo = 0;
        this.holdFor = this.hold;
      }
    } else {
      this.parent.value = Math.max(this.parent.value - this.decay * secondsPassed, this.parent.min);
    }
  }
}
