import { Display } from "./Display";
import { MenuBar } from "./menu";
import { BarsProgram } from "./programs/BarsProgram";
import { MirroredBarsProgram } from "./programs/MirroredBarsProgram";
import { NoteBarsProgram } from "./programs/NoteBarsProgram";
import { NoteBlobProgram } from "./programs/NoteBlobProgram";
import { RippleProgram } from "./programs/RippleProgram";

export class Visualizer {
  constructor(containingElement, params = {}) {
    this.display = new Display(containingElement);
    this.audioContext = new AudioContext({
      latencyHint: "playback",
      sampleRate: 48000
    });
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 8192;
    this.analyser.smoothingTimeConstant = 0;
    this.program = params.program ? this.getProgram(params.program) : this.getDefaultProgram();
    this.updateFrequency = params.updateFrequency || 1000 / 60;
    this.frame = 0;
    this.isRendering = false;
    this.lastRenderAt = null;
    console.log(params.menuElement)
    if (params.menuElement) {
      this.menuBar = new MenuBar(params.menuElement, {
        title: "ALEXANDER SAMUEL KLEIN!",
        content: [
          {
            name: "Source",
            children: [
              {
                name: "test",
                type: "action",
                action: () => console.log("TEST")
              },
              {
                name: "other test",
                type: "action",
                action: () => console.log("OTHER TEST")
              }
            ]
          },
          {
            name: "Visualizer",
            children: [
              {
                name: "Bars",
                type: "action",
                action: () => console.log("BARS")
              }
            ]
          }
        ]
      })
    }

    
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.source.connect(this.analyser);
      this.source.connect(this.audioContext.destination);
    });
  }

  getProgram(slug) {
    switch(slug) {
      case 'bars':
        return new BarsProgram(this.analyser);
      case 'mirroredbars':
        return new MirroredBarsProgram(this.analyser);
      case 'notebars':
        return new NoteBarsProgram(this.analyser);
      case 'noteblob':
        return new NoteBlobProgram(this.analyser);
      case 'ripple':
        return new RippleProgram(this.analyser);
      default:
        throw new Error('No such program: ' + slug);
    }
  }

  getDefaultProgram() {
    return new BarsProgram(this.analyser);
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
      if (!this.program || !this.analyser || !this.display) {
        return this.stopRender();
      }
      const now = Date.now();
      const delta = now - this.lastRenderAt;
      if (delta > this.updateFrequency) {
        this.program.updateData();
      }
      this.program.updatePhysics(delta);
      this.program.render(this.display);
      this.lastRenderAt = now;
      this.frame = requestAnimationFrame(renderLoop);
    }
    this.program.updateData();
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
