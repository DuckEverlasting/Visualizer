/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/media/TetrisBg1.mp3":
/*!*********************************!*\
  !*** ./src/media/TetrisBg1.mp3 ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "ca1eadc991c009078fb47f895dedea3f.mp3");

/***/ }),

/***/ "./src/Display.js":
/*!************************!*\
  !*** ./src/Display.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Display": () => /* binding */ Display
/* harmony export */ });
class Display {
  constructor(containingElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = containingElement.clientWidth;
    this.canvas.height = containingElement.clientHeight;
    containingElement.appendChild(this.canvas);
  }
}


/***/ }),

/***/ "./src/Visualizer.js":
/*!***************************!*\
  !*** ./src/Visualizer.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Visualizer": () => /* binding */ Visualizer
/* harmony export */ });
/* harmony import */ var _Display__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Display */ "./src/Display.js");
/* harmony import */ var _programs_BarsProgram__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./programs/BarsProgram */ "./src/programs/BarsProgram.js");
/* harmony import */ var _programs_Program__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./programs/Program */ "./src/programs/Program.js");




class Visualizer {
  constructor(containingElement, params = {}) {
    this.display = new _Display__WEBPACK_IMPORTED_MODULE_0__.Display(containingElement);
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
    return new _programs_BarsProgram__WEBPACK_IMPORTED_MODULE_1__.BarsProgram(this.analyser);
  }

  setBehavior(behavior) {
    this.behavior = behavior;
  }

  setAudioSource(source) {
    if (this.source) {
      this.source.disconnect();
    }
    this.source = this.audioContext.createMediaElementSource(source);
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


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _media_TetrisBg1_mp3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./media/TetrisBg1.mp3 */ "./src/media/TetrisBg1.mp3");
/* harmony import */ var _Visualizer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Visualizer */ "./src/Visualizer.js");



const container = document.getElementById('main-container');

let started = false;

function start() {
  if (started) {
    return;
  }
  const song = new Audio(_media_TetrisBg1_mp3__WEBPACK_IMPORTED_MODULE_0__.default);
  document.getElementById('test-container').appendChild(song);
  const visualizer = new _Visualizer__WEBPACK_IMPORTED_MODULE_1__.Visualizer(container);
  visualizer.setAudioSource(song);
  song.play();
  visualizer.startRender();
  started = true;
}

container.onclick = start;


/***/ }),

/***/ "./src/programs/BarsProgram.js":
/*!*************************************!*\
  !*** ./src/programs/BarsProgram.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BarsProgram": () => /* binding */ BarsProgram
/* harmony export */ });
/* harmony import */ var _behaviors_BumpBehavior__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./behaviors/BumpBehavior */ "./src/programs/behaviors/BumpBehavior.js");
/* harmony import */ var _Program__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Program */ "./src/programs/Program.js");



class BarsProgram extends _Program__WEBPACK_IMPORTED_MODULE_1__.Program {
  constructor(analyzer) {
    super(analyzer);
    this.streams.forEach(s => {
      s.behaviors.push(new _behaviors_BumpBehavior__WEBPACK_IMPORTED_MODULE_0__.BumpBehavior(s));
      s.min = 10;
    })
    this.colors = ["red", "blue", "green", "orange", "purple", "teal"]
  }

  render(display) {
    const ctx = display.canvas.getContext('2d');
    const maxRadius = Math.min(display.canvas.width, display.canvas.height) * .5;
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(display.canvas.width * .5, display.canvas.height * .5, maxRadius * .1, 0, 2 * Math.PI);
    ctx.fill();
    ctx.lineWidth = Math.max(maxRadius * .05, 2);
    for (let i = 0; i < this.streams.length; i++) {
      ctx.strokeStyle = this.colors[i % this.colors.length];
      ctx.beginPath();
      ctx.arc(display.canvas.width * .5, display.canvas.height * .5, maxRadius * this.streams[i].value / 100, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
}


/***/ }),

/***/ "./src/programs/Program.js":
/*!*********************************!*\
  !*** ./src/programs/Program.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Program": () => /* binding */ Program
/* harmony export */ });
/* harmony import */ var _Stream__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Stream */ "./src/programs/Stream.js");


class Program {
  constructor(analyzer) {
    this.analyser = analyzer;
    this.streams = [];
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    for (let i = 0; i < 8; i++) {
      this.streams.push(new _Stream__WEBPACK_IMPORTED_MODULE_0__.Stream());
    }
  }

  updateData() {
    this.analyser.getByteFrequencyData(this.frequencyData);
    // for (let i = 0; i <= stream.length; i++) {
    //   stream[i].updateData(this.frequencyData[i]);
    // }
  }

  updatePhysics(delta) {
    this.streams.forEach(s => s.updatePhysics(delta));
  }

  render(_display) {
    throw new Error('Method "render" not implemented');
  }
}


/***/ }),

/***/ "./src/programs/Stream.js":
/*!********************************!*\
  !*** ./src/programs/Stream.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Stream": () => /* binding */ Stream
/* harmony export */ });
class Stream {
  constructor() {
    this.value = 0;
    this.max = 100;
    this.min = 0;
    this.behaviors = [];
  }

  updateData(value) {
    this.behaviors.forEach(a => a.updateData(value));
  }

  updatePhysics(delta) {
    this.behaviors.forEach(a => a.updatePhysics(delta));
  }
}


/***/ }),

/***/ "./src/programs/behaviors/Behavior.js":
/*!********************************************!*\
  !*** ./src/programs/behaviors/Behavior.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Behavior": () => /* binding */ Behavior
/* harmony export */ });
class Behavior {
  constructor(parent) {
    this.parent = parent;
  }

  updatePhysics() {}

  updateData(_value) {}
}


/***/ }),

/***/ "./src/programs/behaviors/BumpBehavior.js":
/*!************************************************!*\
  !*** ./src/programs/behaviors/BumpBehavior.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BumpBehavior": () => /* binding */ BumpBehavior
/* harmony export */ });
/* harmony import */ var _Behavior__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Behavior */ "./src/programs/behaviors/Behavior.js");


class BumpBehavior extends _Behavior__WEBPACK_IMPORTED_MODULE_0__.Behavior {
  constructor(parent, params = {}) {
    super(parent);
    this.attack = params.attack || 200;
    this.decay = params.decay || 50;
    this.hold = params.hold || .1;
    this.holdFor = 0;
    this.isRising = 0;
  }

  updateData(_value) {
    this.isRising = true;
  }

  updatePhysics(delta) {
    const secondsPassed = delta / 1000;
    if (this.holdFor > 0) {
      this.holdFor = Math.max(this.holdFor - secondsPassed, 0);
    } else if (this.isRising) {
      this.parent.value = Math.min(this.parent.max, this.parent.value + this.attack * secondsPassed);
      if (this.parent.value === this.parent.max) {
        this.isRising = false;
        this.holdFor = this.hold;
      }
    } else {
      this.parent.value = Math.max(this.parent.value - this.decay * secondsPassed, this.parent.min);
    }
  }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92aXN1YWxpemVyLy4vc3JjL21lZGlhL1RldHJpc0JnMS5tcDMiLCJ3ZWJwYWNrOi8vdmlzdWFsaXplci8uL3NyYy9EaXNwbGF5LmpzIiwid2VicGFjazovL3Zpc3VhbGl6ZXIvLi9zcmMvVmlzdWFsaXplci5qcyIsIndlYnBhY2s6Ly92aXN1YWxpemVyLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovL3Zpc3VhbGl6ZXIvLi9zcmMvcHJvZ3JhbXMvQmFyc1Byb2dyYW0uanMiLCJ3ZWJwYWNrOi8vdmlzdWFsaXplci8uL3NyYy9wcm9ncmFtcy9Qcm9ncmFtLmpzIiwid2VicGFjazovL3Zpc3VhbGl6ZXIvLi9zcmMvcHJvZ3JhbXMvU3RyZWFtLmpzIiwid2VicGFjazovL3Zpc3VhbGl6ZXIvLi9zcmMvcHJvZ3JhbXMvYmVoYXZpb3JzL0JlaGF2aW9yLmpzIiwid2VicGFjazovL3Zpc3VhbGl6ZXIvLi9zcmMvcHJvZ3JhbXMvYmVoYXZpb3JzL0J1bXBCZWhhdmlvci5qcyIsIndlYnBhY2s6Ly92aXN1YWxpemVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Zpc3VhbGl6ZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3Zpc3VhbGl6ZXIvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly92aXN1YWxpemVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdmlzdWFsaXplci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3Zpc3VhbGl6ZXIvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vdmlzdWFsaXplci93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpRUFBZSxxQkFBdUIseUNBQXlDLEU7Ozs7Ozs7Ozs7Ozs7O0FDQXhFO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1BvQztBQUNpQjtBQUNSOztBQUV0QztBQUNQLDRDQUE0QztBQUM1Qyx1QkFBdUIsNkNBQU87QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSw4REFBVztBQUMxQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUMvRDJDO0FBQ0Q7O0FBRTFDOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLHlEQUFNO0FBQy9CO0FBQ0EseUJBQXlCLG1EQUFVO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEJ3RDtBQUNwQjs7QUFFN0IsMEJBQTBCLDZDQUFPO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixpRUFBWTtBQUN2QztBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIseUJBQXlCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDNUJrQzs7QUFFM0I7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCLDRCQUE0QiwyQ0FBTTtBQUNsQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixvQkFBb0I7QUFDMUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDM0JPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDZk87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ1JzQzs7QUFFL0IsMkJBQTJCLCtDQUFRO0FBQzFDLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQzlCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0E7V0FDQSxDQUFDLEk7Ozs7O1dDUEQsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esa0M7Ozs7VUNmQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImNhMWVhZGM5OTFjMDA5MDc4ZmI0N2Y4OTVkZWRlYTNmLm1wM1wiOyIsImV4cG9ydCBjbGFzcyBEaXNwbGF5IHtcclxuICBjb25zdHJ1Y3Rvcihjb250YWluaW5nRWxlbWVudCkge1xyXG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIHRoaXMuY2FudmFzLndpZHRoID0gY29udGFpbmluZ0VsZW1lbnQuY2xpZW50V2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBjb250YWluaW5nRWxlbWVudC5jbGllbnRIZWlnaHQ7XHJcbiAgICBjb250YWluaW5nRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IERpc3BsYXkgfSBmcm9tIFwiLi9EaXNwbGF5XCI7XHJcbmltcG9ydCB7IEJhcnNQcm9ncmFtIH0gZnJvbSBcIi4vcHJvZ3JhbXMvQmFyc1Byb2dyYW1cIjtcclxuaW1wb3J0IHsgUHJvZ3JhbSB9IGZyb20gXCIuL3Byb2dyYW1zL1Byb2dyYW1cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWaXN1YWxpemVyIHtcclxuICBjb25zdHJ1Y3Rvcihjb250YWluaW5nRWxlbWVudCwgcGFyYW1zID0ge30pIHtcclxuICAgIHRoaXMuZGlzcGxheSA9IG5ldyBEaXNwbGF5KGNvbnRhaW5pbmdFbGVtZW50KTtcclxuICAgIHRoaXMuYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xyXG4gICAgdGhpcy5hbmFseXNlciA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUFuYWx5c2VyKCk7XHJcbiAgICB0aGlzLmFuYWx5c2VyLmZmdFNpemUgPSAzMjtcclxuICAgIHRoaXMuYmVoYXZpb3IgPSBwYXJhbXMuYmVoYXZpb3IgfHwgdGhpcy5nZXREZWZhdWx0QmVoYXZpb3IoKTtcclxuICAgIHRoaXMudXBkYXRlRnJlcXVlbmN5ID0gcGFyYW1zLnVwZGF0ZUZyZXF1ZW5jeSB8fCAxMDAwIC8gNjA7XHJcbiAgICB0aGlzLmZyYW1lID0gMDtcclxuICAgIHRoaXMuaXNSZW5kZXJpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMubGFzdFJlbmRlckF0ID0gbnVsbDtcclxuICB9XHJcblxyXG4gIGdldERlZmF1bHRCZWhhdmlvcigpIHtcclxuICAgIHJldHVybiBuZXcgQmFyc1Byb2dyYW0odGhpcy5hbmFseXNlcik7XHJcbiAgfVxyXG5cclxuICBzZXRCZWhhdmlvcihiZWhhdmlvcikge1xyXG4gICAgdGhpcy5iZWhhdmlvciA9IGJlaGF2aW9yO1xyXG4gIH1cclxuXHJcbiAgc2V0QXVkaW9Tb3VyY2Uoc291cmNlKSB7XHJcbiAgICBpZiAodGhpcy5zb3VyY2UpIHtcclxuICAgICAgdGhpcy5zb3VyY2UuZGlzY29ubmVjdCgpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zb3VyY2UgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2Uoc291cmNlKTtcclxuICB9XHJcblxyXG4gIHN0YXJ0UmVuZGVyKCkge1xyXG4gICAgaWYgKHRoaXMuaXNSZW5kZXJpbmcpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcmVuZGVyTG9vcCA9ICgpID0+IHtcclxuICAgICAgaWYgKCF0aGlzLmJlaGF2aW9yIHx8ICF0aGlzLmFuYWx5c2VyIHx8ICF0aGlzLmRpc3BsYXkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdG9wUmVuZGVyKCk7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgICAgY29uc3QgZGVsdGEgPSBub3cgLSB0aGlzLmxhc3RSZW5kZXJBdDtcclxuICAgICAgaWYgKGRlbHRhID4gdGhpcy51cGRhdGVGcmVxdWVuY3kpIHtcclxuICAgICAgICB0aGlzLmJlaGF2aW9yLnVwZGF0ZURhdGEoKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmJlaGF2aW9yLnVwZGF0ZVBoeXNpY3MoZGVsdGEpO1xyXG4gICAgICB0aGlzLmJlaGF2aW9yLnJlbmRlcih0aGlzLmRpc3BsYXkpO1xyXG4gICAgICB0aGlzLmxhc3RSZW5kZXJBdCA9IG5vdztcclxuICAgICAgdGhpcy5mcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXJMb29wKTtcclxuICAgIH1cclxuICAgIHRoaXMuYmVoYXZpb3IudXBkYXRlRGF0YSgpO1xyXG4gICAgdGhpcy5sYXN0UmVuZGVyQXQgPSBEYXRlLm5vdygpO1xyXG4gICAgdGhpcy5mcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXJMb29wKTtcclxuICAgIHRoaXMuaXNSZW5kZXJpbmcgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgc3RvcFJlbmRlcigpIHtcclxuICAgIGlmICghdGhpcy5pc1JlbmRlcmluZykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmZyYW1lKTtcclxuICAgIHRoaXMuaXNSZW5kZXJpbmcgPSBmYWxzZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IFRldHJpcyBmcm9tIFwiLi9tZWRpYS9UZXRyaXNCZzEubXAzXCI7XHJcbmltcG9ydCB7IFZpc3VhbGl6ZXIgfSBmcm9tIFwiLi9WaXN1YWxpemVyXCI7XHJcblxyXG5jb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1jb250YWluZXInKTtcclxuXHJcbmxldCBzdGFydGVkID0gZmFsc2U7XHJcblxyXG5mdW5jdGlvbiBzdGFydCgpIHtcclxuICBpZiAoc3RhcnRlZCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBjb25zdCBzb25nID0gbmV3IEF1ZGlvKFRldHJpcyk7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rlc3QtY29udGFpbmVyJykuYXBwZW5kQ2hpbGQoc29uZyk7XHJcbiAgY29uc3QgdmlzdWFsaXplciA9IG5ldyBWaXN1YWxpemVyKGNvbnRhaW5lcik7XHJcbiAgdmlzdWFsaXplci5zZXRBdWRpb1NvdXJjZShzb25nKTtcclxuICBzb25nLnBsYXkoKTtcclxuICB2aXN1YWxpemVyLnN0YXJ0UmVuZGVyKCk7XHJcbiAgc3RhcnRlZCA9IHRydWU7XHJcbn1cclxuXHJcbmNvbnRhaW5lci5vbmNsaWNrID0gc3RhcnQ7XHJcbiIsImltcG9ydCB7IEJ1bXBCZWhhdmlvciB9IGZyb20gXCIuL2JlaGF2aW9ycy9CdW1wQmVoYXZpb3JcIjtcclxuaW1wb3J0IHsgUHJvZ3JhbSB9IGZyb20gXCIuL1Byb2dyYW1cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCYXJzUHJvZ3JhbSBleHRlbmRzIFByb2dyYW0ge1xyXG4gIGNvbnN0cnVjdG9yKGFuYWx5emVyKSB7XHJcbiAgICBzdXBlcihhbmFseXplcik7XHJcbiAgICB0aGlzLnN0cmVhbXMuZm9yRWFjaChzID0+IHtcclxuICAgICAgcy5iZWhhdmlvcnMucHVzaChuZXcgQnVtcEJlaGF2aW9yKHMpKTtcclxuICAgICAgcy5taW4gPSAxMDtcclxuICAgIH0pXHJcbiAgICB0aGlzLmNvbG9ycyA9IFtcInJlZFwiLCBcImJsdWVcIiwgXCJncmVlblwiLCBcIm9yYW5nZVwiLCBcInB1cnBsZVwiLCBcInRlYWxcIl1cclxuICB9XHJcblxyXG4gIHJlbmRlcihkaXNwbGF5KSB7XHJcbiAgICBjb25zdCBjdHggPSBkaXNwbGF5LmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgY29uc3QgbWF4UmFkaXVzID0gTWF0aC5taW4oZGlzcGxheS5jYW52YXMud2lkdGgsIGRpc3BsYXkuY2FudmFzLmhlaWdodCkgKiAuNTtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICBjdHguYXJjKGRpc3BsYXkuY2FudmFzLndpZHRoICogLjUsIGRpc3BsYXkuY2FudmFzLmhlaWdodCAqIC41LCBtYXhSYWRpdXMgKiAuMSwgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICAgIGN0eC5saW5lV2lkdGggPSBNYXRoLm1heChtYXhSYWRpdXMgKiAuMDUsIDIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0cmVhbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvcnNbaSAlIHRoaXMuY29sb3JzLmxlbmd0aF07XHJcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgY3R4LmFyYyhkaXNwbGF5LmNhbnZhcy53aWR0aCAqIC41LCBkaXNwbGF5LmNhbnZhcy5oZWlnaHQgKiAuNSwgbWF4UmFkaXVzICogdGhpcy5zdHJlYW1zW2ldLnZhbHVlIC8gMTAwLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgU3RyZWFtIH0gZnJvbSBcIi4vU3RyZWFtXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZ3JhbSB7XHJcbiAgY29uc3RydWN0b3IoYW5hbHl6ZXIpIHtcclxuICAgIHRoaXMuYW5hbHlzZXIgPSBhbmFseXplcjtcclxuICAgIHRoaXMuc3RyZWFtcyA9IFtdO1xyXG4gICAgdGhpcy5mcmVxdWVuY3lEYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5hbmFseXNlci5mcmVxdWVuY3lCaW5Db3VudCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xyXG4gICAgICB0aGlzLnN0cmVhbXMucHVzaChuZXcgU3RyZWFtKCkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlRGF0YSgpIHtcclxuICAgIHRoaXMuYW5hbHlzZXIuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEodGhpcy5mcmVxdWVuY3lEYXRhKTtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuZnJlcXVlbmN5RGF0YSk7XHJcbiAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8PSBzdHJlYW0ubGVuZ3RoOyBpKyspIHtcclxuICAgIC8vICAgc3RyZWFtW2ldLnVwZGF0ZURhdGEodGhpcy5mcmVxdWVuY3lEYXRhW2ldKTtcclxuICAgIC8vIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZVBoeXNpY3MoZGVsdGEpIHtcclxuICAgIHRoaXMuc3RyZWFtcy5mb3JFYWNoKHMgPT4gcy51cGRhdGVQaHlzaWNzKGRlbHRhKSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoX2Rpc3BsYXkpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIFwicmVuZGVyXCIgbm90IGltcGxlbWVudGVkJyk7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBTdHJlYW0ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy52YWx1ZSA9IDA7XHJcbiAgICB0aGlzLm1heCA9IDEwMDtcclxuICAgIHRoaXMubWluID0gMDtcclxuICAgIHRoaXMuYmVoYXZpb3JzID0gW107XHJcbiAgfVxyXG5cclxuICB1cGRhdGVEYXRhKHZhbHVlKSB7XHJcbiAgICB0aGlzLmJlaGF2aW9ycy5mb3JFYWNoKGEgPT4gYS51cGRhdGVEYXRhKHZhbHVlKSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVQaHlzaWNzKGRlbHRhKSB7XHJcbiAgICB0aGlzLmJlaGF2aW9ycy5mb3JFYWNoKGEgPT4gYS51cGRhdGVQaHlzaWNzKGRlbHRhKSk7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBCZWhhdmlvciB7XHJcbiAgY29uc3RydWN0b3IocGFyZW50KSB7XHJcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVBoeXNpY3MoKSB7fVxyXG5cclxuICB1cGRhdGVEYXRhKF92YWx1ZSkge31cclxufVxyXG4iLCJpbXBvcnQgeyBCZWhhdmlvciB9IGZyb20gXCIuL0JlaGF2aW9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQnVtcEJlaGF2aW9yIGV4dGVuZHMgQmVoYXZpb3Ige1xyXG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgcGFyYW1zID0ge30pIHtcclxuICAgIHN1cGVyKHBhcmVudCk7XHJcbiAgICB0aGlzLmF0dGFjayA9IHBhcmFtcy5hdHRhY2sgfHwgMjAwO1xyXG4gICAgdGhpcy5kZWNheSA9IHBhcmFtcy5kZWNheSB8fCA1MDtcclxuICAgIHRoaXMuaG9sZCA9IHBhcmFtcy5ob2xkIHx8IC4xO1xyXG4gICAgdGhpcy5ob2xkRm9yID0gMDtcclxuICAgIHRoaXMuaXNSaXNpbmcgPSAwO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRGF0YShfdmFsdWUpIHtcclxuICAgIHRoaXMuaXNSaXNpbmcgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUGh5c2ljcyhkZWx0YSkge1xyXG4gICAgY29uc3Qgc2Vjb25kc1Bhc3NlZCA9IGRlbHRhIC8gMTAwMDtcclxuICAgIGlmICh0aGlzLmhvbGRGb3IgPiAwKSB7XHJcbiAgICAgIHRoaXMuaG9sZEZvciA9IE1hdGgubWF4KHRoaXMuaG9sZEZvciAtIHNlY29uZHNQYXNzZWQsIDApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmlzUmlzaW5nKSB7XHJcbiAgICAgIHRoaXMucGFyZW50LnZhbHVlID0gTWF0aC5taW4odGhpcy5wYXJlbnQubWF4LCB0aGlzLnBhcmVudC52YWx1ZSArIHRoaXMuYXR0YWNrICogc2Vjb25kc1Bhc3NlZCk7XHJcbiAgICAgIGlmICh0aGlzLnBhcmVudC52YWx1ZSA9PT0gdGhpcy5wYXJlbnQubWF4KSB7XHJcbiAgICAgICAgdGhpcy5pc1Jpc2luZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaG9sZEZvciA9IHRoaXMuaG9sZDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5wYXJlbnQudmFsdWUgPSBNYXRoLm1heCh0aGlzLnBhcmVudC52YWx1ZSAtIHRoaXMuZGVjYXkgKiBzZWNvbmRzUGFzc2VkLCB0aGlzLnBhcmVudC5taW4pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmNcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSBzY3JpcHRVcmwgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjXG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9