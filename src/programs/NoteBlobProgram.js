import { BumpBehavior } from "./streamBehaviors/BumpBehavior";
import { Program } from "./Program";
import { Stream } from "./Stream";

export class NoteBlobProgram extends Program {
  constructor(analyzer) {
    super(analyzer);
    // BAD! fix this
    this.streams = [];
    for (let i = 0; i <= 84; i++) {
      this.streams.push(new Stream({ threshold: 50 }));
      this.streams[i].note = i + 24;
    }
    this.streams.forEach(s => {
      s.behaviors.push(new BumpBehavior(s, {
        attack: 200,
        decay: 100,
        hold: .1
      }));
    });
    this.colors = ['red', 'orange', 'yellow', 'lime', 'cyan', 'blue', 'purple'];
  }

  getNoteData(index) {
    const lowerBound = 16.35 * Math.pow(2, (index - .5) / 12);
    const upperBound = 16.35 * Math.pow(2, (index + .5) / 12);
    const binSize = 48000 / this.analyser.frequencyBinCount;
    const binArr = this.frequencyData.slice(Math.round(lowerBound / binSize), Math.round(upperBound / binSize) + 1);
    return binArr.reduce((a,b) => a + b, 0) / binArr.length;
  }

  updateData() {
    this.analyser.getByteFrequencyData(this.frequencyData);
    for (let i = 0; i < this.streams.length; i++) {
      this.streams[i].updateData(this.getNoteData(this.streams[i].note));
    }
  }

  render(display) {
    const ctx = display.canvas.getContext('2d');
    const maxHeight = display.canvas.height * .5;
    const barWidth = (display.canvas.width * .75) / this.streams.length;
    ctx.clearRect(0, 0, display.canvas.width, display.canvas.height);
    const fillIncrement = 360 / this.streams.length;
    for (let i = 0; i < this.streams.length; i++) {
      // ctx.fillStyle = this.colors[i % this.colors.length];
      ctx.fillStyle = `hsl(${fillIncrement * i}, 100%, 50%)`;
      const left = i === 0 ? 
        this.streams[i].value / 100 :
        (this.streams[i].value + this.streams[i - 1].value) / 200;
      const right = i === this.streams.length - 1 ? 
        this.streams[i].value / 100 :
        (this.streams[i].value + this.streams[i + 1].value) / 200;
      ctx.beginPath();
      ctx.moveTo(
        display.canvas.width * .125 + i * barWidth,
        display.canvas.height * .75
      );
      ctx.lineTo(
        display.canvas.width * .125 + i * barWidth, 
        display.canvas.height * .75 - maxHeight * left
      );
      ctx.quadraticCurveTo(
        display.canvas.width * .125 + (i + .5) * barWidth, 
        display.canvas.height * .75 - maxHeight * this.streams[i].value / 100,
        display.canvas.width * .125 + (i + 1) * barWidth, 
        display.canvas.height * .75 - maxHeight * right
      );
      ctx.lineTo(
        display.canvas.width * .125 + (i + 1) * barWidth,
        display.canvas.height * .75
      );
      ctx.closePath();
      ctx.fill();
    }
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(
      display.canvas.width * .125,
      display.canvas.height * .75,
      display.canvas.width * .75,
      display.canvas.height * .05
    );
  }
}
