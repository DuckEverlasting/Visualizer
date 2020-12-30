import { Display } from "./Display";
import { BarsProgram } from "./programs/BarsProgram";
import { Program } from "./programs/Program";

export class Visualizer {
  constructor(containingElement, params = {}) {
    this.display = new Display(containingElement);
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 32;
    this.behavior = params.behavior || this.getDefaultBehavior();
    this.updateFrequency = params.updateFrequency || 1000 / 60;
    this.frame = 0;
    this.isRendering = false;
    this.lastRenderAt = null;
  }

  getDefaultBehavior() {
    return new BarsProgram(this.analyser);
  }

  setBehavior(behavior) {
    this.behavior = behavior;
  }

  setAudioSource(source) {
    if (this.source) {
      this.source.disconnect();
    }
    this.source = this.audioContext.createMediaElementSource(source);
    this.source.connect(this.analyser);
    this.source.connect(this.audioContext.destination);
  }

  startRender() {
    if (this.isRendering) {
      return;
    }
    const renderLoop = () => {
      if (!this.behavior || !this.analyser || !this.display) {
        return this.stopRender();
      }
      const now = Date.now();
      const delta = now - this.lastRenderAt;
      if (delta > this.updateFrequency) {
        this.behavior.updateData();
      }
      this.behavior.updatePhysics(delta);
      this.behavior.render(this.display);
      this.lastRenderAt = now;
      this.frame = requestAnimationFrame(renderLoop);
    }
    this.behavior.updateData();
    this.lastRenderAt = Date.now();
    this.frame = requestAnimationFrame(renderLoop);
    this.isRendering = true;
  }

  stopRender() {
    if (!this.isRendering) {
      return;
    }
    cancelAnimationFrame(this.frame);
    this.isRendering = false;
  }
}
