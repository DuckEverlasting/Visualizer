import { Stream } from "./Stream";

export class Program {
  constructor(analyzer) {
    this.analyser = analyzer;
    this.streams = [];
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    for (let i = 0; i < 4; i++) {
      this.streams.push(new Stream());
    }
  }

  updateData() {
    this.analyser.getByteFrequencyData(this.frequencyData);
    console.log(this.frequencyData);
    for (let i = 0; i < 4; i++) {
      const peak = Math.max(
        this.frequencyData[i * 4],
        this.frequencyData[i * 4 + 1],
        this.frequencyData[i * 4 + 2],
        this.frequencyData[i * 4 + 3]
      );
      this.streams[i].updateData(peak);
    }
  }

  updatePhysics(delta) {
    this.streams.forEach(s => s.updatePhysics(delta));
  }

  render(_display) {
    throw new Error('Method "render" not implemented');
  }
}
