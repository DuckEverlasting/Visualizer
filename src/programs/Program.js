import { Stream } from "./Stream";

export class Program {
  constructor(analyzer) {
    this.analyser = analyzer;
    this.streams = [];
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    let n = this.analyser.frequencyBinCount;
    while (n > 1) {
      this.streams.push(new Stream());
      n /= 2;
    }
  }

  updateData() {
    this.analyser.getByteFrequencyData(this.frequencyData);
    for (let i = 0; i < this.streams.length; i++) {
      const arr = this.frequencyData.slice(Math.pow(2, i) - 1, Math.pow(2, i + 1) - 1);
      const avg = arr.reduce((a,b) => a + b, 0) / arr.length;
      this.streams[i].updateData(avg);
    }
  }

  updatePhysics(delta) {
    this.streams.forEach(s => s.updatePhysics(delta));
  }

  render(_display) {
    throw new Error('Method "render" not implemented');
  }
}
