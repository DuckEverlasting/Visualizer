import { BumpBehavior } from "./streamBehaviors/BumpBehavior";
import { Program } from "./Program";

export class MirroredBarsProgram extends Program {
  constructor(analyzer) {
    super(analyzer);
    this.streams.forEach(s => {
      s.behaviors.push(new BumpBehavior(s));
    })
    this.colors = ["red", "blue", "green", "orange", "purple", "teal"]
  }

  render(display) {
    const ctx = display.canvas.getContext('2d');
    const maxHeight = display.canvas.height * .75;
    const barWidth = (display.canvas.width * .75) / this.streams.length;
    ctx.clearRect(0, 0, display.canvas.width, display.canvas.height);
    for (let i = 0; i < this.streams.length; i++) {
      ctx.fillStyle = this.colors[i % this.colors.length];
      ctx.beginPath();
      ctx.fillRect(
        display.canvas.width * .125 + i * barWidth,
        display.canvas.height * .5 - maxHeight * this.streams[i].value / 200,
        barWidth,
        maxHeight * this.streams[i].value / 100
      )
    }
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(
      display.canvas.width * .125,
      display.canvas.height * .495,
      display.canvas.width * .75,
      display.canvas.height * .01
    );
  }
}
