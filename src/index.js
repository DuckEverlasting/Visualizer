import Tetris from "./media/TetrisBg1.mp3";
import FinalCountdown from "./media/FinalCountdown.mp3";
import { Visualizer } from "./Visualizer";

const container = document.getElementById('main-container');
const menuElement = document.getElementById('menu-container');
const song = new Audio(Tetris);

let started = false;

function start() {
  if (started) {
    return;
  }
  // song.play();
  const visualizer = new Visualizer(container, {
    program: 'noteblob',
    menuElement
  });
  // visualizer.setAudioSource(song);
  visualizer.startRender();
  started = true;
}

container.onclick = start;
