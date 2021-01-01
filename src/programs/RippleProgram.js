import { BumpBehavior } from "./streamBehaviors/BumpBehavior";
import { Program } from "./Program";

export class RippleProgram extends Program {
  constructor(analyzer) {
    super(analyzer);
    this.streams.forEach(s => {
      s.behaviors.push(new BumpBehavior(s, {
        attack: 50,
        decay: 15,
        hold: .2
      }));
    })
    this.colors = ["red", "blue", "green", "orange", "purple", "teal"]
  }

  render(display) {
    const ctx = display.canvas.getContext('2d');
    const maxRadius = Math.min(display.canvas.width, display.canvas.height) * .5;
    ctx.clearRect(0, 0, display.canvas.width, display.canvas.height);
    ctx.lineWidth = Math.max(maxRadius * .01, 2);
    for (let i = 0; i < this.streams.length; i++) {
      ctx.strokeStyle = this.colors[i % this.colors.length];
      ctx.beginPath();
      ctx.arc(display.canvas.width * .5, display.canvas.height * .5, maxRadius * this.streams[i].value / 100, 0, 2 * Math.PI);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(display.canvas.width * .5, display.canvas.height * .5, maxRadius * .1, 0, 2 * Math.PI);
    ctx.fill();
  }
}
