import { BumpBehavior } from "./streamBehaviors/BumpBehavior";
import { Program } from "./Program";
import { Stream } from "./Stream";

export class NoteCircleBarsProgram extends Program {
  constructor(analyzer) {
    super(analyzer);
    // BAD! fix this
    this.streams = [];
    for (let i = 0; i <= 48; i++) {
      this.streams.push(new Stream({ threshold: 50 }));
      this.streams[i].note = i + 48;
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
    ctx.save();
    ctx.translate(0, .2 * display.canvas.height);
    ctx.save();
    ctx.translate(.5 * display.canvas.width, .5 * display.canvas.height);
    ctx.rotate(90 * Math.PI / 180);
    for (let i = 0; i < this.streams.length; i++) {
      // ctx.fillStyle = this.colors[i % this.colors.length];
      ctx.rotate(fillIncrement * Math.PI / 360);
      ctx.fillStyle = `hsl(${fillIncrement * i * .95}, 100%, 50%)`;
      ctx.beginPath();
      ctx.fillRect(
        -.5 * barWidth,
        0,
        barWidth,
        maxHeight * this.streams[i].value / 100
      )
    }
    ctx.restore();
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(
      .5 * (display.canvas.width - 1.5 * maxHeight),
      display.canvas.height * .5,
      maxHeight * 1.5,
      display.canvas.height * .05
    );
    ctx.beginPath();
    ctx.arc(display.canvas.width * .5, display.canvas.height * .5, maxHeight * .1, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }
}
