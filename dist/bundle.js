/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/map.js":
/*!********************!*\
  !*** ./src/map.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TileMap)
/* harmony export */ });
/* harmony import */ var _assets_grassTile_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets/grassTile.png */ "./src/assets/grassTile.png");


class TileMap {
	constructor() {
		this.tile_image = new Image();
		this.tile_image.src = _assets_grassTile_png__WEBPACK_IMPORTED_MODULE_0__;
		this.n = 24;
	}

	*z_depth(z){
		for(let j = 0; j < Math.min(z+1,2*this.n-z-1); j++){
			let x = j - (Math.min(z+1,2*this.n-z-1)/2.0);
			let y = z/2.0;

			yield [this.tile_image, x, y]
		}
	}

	draw(ctx) {
		ctx.save();

		ctx.translate(400, 200);
		ctx.scale(1, 1);

		// iterate the diagonal cross sections in case a tile extends outside of its boundaries
		// otherwise, we would have z issues
		for(let i = 0; i < 2*this.n-1; i++){
			for(let [tile, x, y] of this.z_depth(i)){
				ctx.drawImage(tile, x*28, y*16);
			}
		}

		ctx.restore();
	}
}

/***/ }),

/***/ "./src/vec2.js":
/*!*********************!*\
  !*** ./src/vec2.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Vec2)
/* harmony export */ });
class Vec2 {
	constructor(x, y) { this.x = x; this.y = y;}

	plus(v) { return new Vec2(this.x+v.x, this.y+v.y); }
	scaledBy(f) { return new Vec2(f*this.x, f*this.y); }
	minus(v) { return this.plus(v.scaledBy(-1.0)); }

	dot(v) { return this.x*v.x + this.y*v.y; }
	d2() { return this.dot(this); }
}

/***/ }),

/***/ "./src/assets/grassTile.png":
/*!**********************************!*\
  !*** ./src/assets/grassTile.png ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "e389d31327cf035c78b1.png";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
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
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./map */ "./src/map.js");
/* harmony import */ var _vec2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vec2 */ "./src/vec2.js");




window.addEventListener("load", ()=>{
	new Main();
});

class Main {
	constructor() {
		// time stuff
		this.current_time = Date.now();
		this.old_time = this.current_time;
		this.dt = 0;

		// events
		this.event_queue = [];
		window.addEventListener("mousedown", (e)=>{this.mousedown(e)});
		window.addEventListener("mousemove", (e)=>{this.mousemove(e)});
		window.addEventListener("mouseup", (e)=>{this.mouseup(e)});
		window.addEventListener("dblclick", (e)=>{this.dblclick(e)});
		document.getElementById("button").addEventListener("click", (e)=>{
			e.changeState = true;
			this.event_queue.push([e,"button"]);
		});

		// canvas stuff
		this.canvas = document.getElementById("canvas");
		this.canvas.width = 800;
		this.canvas.height= 800;
		this.ctx = this.canvas.getContext("2d");
		this.ctx.imageSmoothingEnabled= false;
		this.mat = this.ctx.getTransform();

		// game stuff
		this.map = new _map__WEBPACK_IMPORTED_MODULE_0__["default"]();

		this.step();
	}

	step() {
		this.current_time = Date.now()/1000.0;
		this.dt = this.current_time - this.old_time;
		this.old_time = this.current_time;

		this.draw();
		this.update();
		// restore to default transformations (I do this now so that the matrix for the canvas is good)
		this.ctx.restore();

		window.requestAnimationFrame(()=>this.step());
	}

	update() {
		

		// even though we clear the event queue here anyways, do make an effort to pop events
		// off when reacting to them, so that events aren't accepted by multiple things
		// unintentionally.
		this.event_queue.length = 0;
	}

	draw() {
		// reset canvas
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// setup initial transformations
		this.ctx.save();
		// this.ctx.translate(0,-175);
		// this.ctx.scale(1.5,1.5);

		this.mat = this.ctx.getTransform();

		// draw things
		this.map.draw(this.ctx);
	}

	mousedown(e){
		e.pos = this.getCursorPosition(e);
		this.event_queue.push([e,"mousedown"]);
	}

	mouseup(e){
		e.pos = this.getCursorPosition(e);
		this.event_queue.push([e,"mouseup"]);
	}

	mousemove(e){
		e.pos = this.getCursorPosition(e);
		this.event_queue.push([e,"mousemove"]);
	}

	dblclick(e){
		e.pos = this.getCursorPosition(e);
		this.event_queue.push([e,"dblclick"]);
	}

	getCursorPositionRaw(e) {
		let rect = this.canvas.getBoundingClientRect();
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;
		return new _vec2__WEBPACK_IMPORTED_MODULE_1__["default"](x,y);
	}

	getCursorPosition(e) {
		return this.getTransformed(this.getCursorPositionRaw(e));
	}

	getTransformed(v) {
		let m = this.mat;
		let det_inv = 1.0/(m.a*m.d - m.b*m.c);
		// we need to do inverse of m, which i've done by hand
		return new _vec2__WEBPACK_IMPORTED_MODULE_1__["default"](
			(m.d * (v.x - m.e) - m.c * (v.y - m.f)) * det_inv,
			(-m.b * (v.x - m.e) + m.a * (v.y - m.f)) * det_inv
		);
	}
}

class Background {
	constructor(src){
		this.img = new Image();
		this.img.src = src;
	}

	draw(ctx) {
		ctx.save();

		ctx.scale(0.2, 0.2);
		ctx.drawImage(this.img, 0, 0);

		ctx.restore();
	}
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFvRDs7QUFFckM7QUFDZjtBQUNBO0FBQ0Esd0JBQXdCLGtEQUFjO0FBQ3RDO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsZ0NBQWdDO0FBQ2pEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLGdCQUFnQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDbENlO0FBQ2YscUJBQXFCLFlBQVk7O0FBRWpDLFdBQVc7QUFDWCxlQUFlO0FBQ2YsWUFBWTs7QUFFWixVQUFVO0FBQ1YsUUFBUTtBQUNSOzs7Ozs7Ozs7Ozs7Ozs7O1VDVEE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7Ozs7Ozs7Ozs7QUNmNEI7QUFDRjs7O0FBRzFCO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkNBQTZDLGtCQUFrQjtBQUMvRCw2Q0FBNkMsa0JBQWtCO0FBQy9ELDJDQUEyQyxnQkFBZ0I7QUFDM0QsNENBQTRDLGlCQUFpQjtBQUM3RDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLDRDQUFPOztBQUV4QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsNkNBQUk7QUFDakI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSw2Q0FBSTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaXNvbWV0cmljLXRlcnJhaW4vLi9zcmMvbWFwLmpzIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluLy4vc3JjL3ZlYzIuanMiLCJ3ZWJwYWNrOi8vaXNvbWV0cmljLXRlcnJhaW4vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vaXNvbWV0cmljLXRlcnJhaW4vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vaXNvbWV0cmljLXRlcnJhaW4vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluLy4vc3JjL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRpbGVfaW1hZ2Vfc3JjIGZyb20gXCIuL2Fzc2V0cy9ncmFzc1RpbGUucG5nXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbGVNYXAge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLnRpbGVfaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblx0XHR0aGlzLnRpbGVfaW1hZ2Uuc3JjID0gdGlsZV9pbWFnZV9zcmM7XG5cdFx0dGhpcy5uID0gMjQ7XG5cdH1cblxuXHQqel9kZXB0aCh6KXtcblx0XHRmb3IobGV0IGogPSAwOyBqIDwgTWF0aC5taW4oeisxLDIqdGhpcy5uLXotMSk7IGorKyl7XG5cdFx0XHRsZXQgeCA9IGogLSAoTWF0aC5taW4oeisxLDIqdGhpcy5uLXotMSkvMi4wKTtcblx0XHRcdGxldCB5ID0gei8yLjA7XG5cblx0XHRcdHlpZWxkIFt0aGlzLnRpbGVfaW1hZ2UsIHgsIHldXG5cdFx0fVxuXHR9XG5cblx0ZHJhdyhjdHgpIHtcblx0XHRjdHguc2F2ZSgpO1xuXG5cdFx0Y3R4LnRyYW5zbGF0ZSg0MDAsIDIwMCk7XG5cdFx0Y3R4LnNjYWxlKDEsIDEpO1xuXG5cdFx0Ly8gaXRlcmF0ZSB0aGUgZGlhZ29uYWwgY3Jvc3Mgc2VjdGlvbnMgaW4gY2FzZSBhIHRpbGUgZXh0ZW5kcyBvdXRzaWRlIG9mIGl0cyBib3VuZGFyaWVzXG5cdFx0Ly8gb3RoZXJ3aXNlLCB3ZSB3b3VsZCBoYXZlIHogaXNzdWVzXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IDIqdGhpcy5uLTE7IGkrKyl7XG5cdFx0XHRmb3IobGV0IFt0aWxlLCB4LCB5XSBvZiB0aGlzLnpfZGVwdGgoaSkpe1xuXHRcdFx0XHRjdHguZHJhd0ltYWdlKHRpbGUsIHgqMjgsIHkqMTYpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGN0eC5yZXN0b3JlKCk7XG5cdH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBWZWMyIHtcblx0Y29uc3RydWN0b3IoeCwgeSkgeyB0aGlzLnggPSB4OyB0aGlzLnkgPSB5O31cblxuXHRwbHVzKHYpIHsgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCt2LngsIHRoaXMueSt2LnkpOyB9XG5cdHNjYWxlZEJ5KGYpIHsgcmV0dXJuIG5ldyBWZWMyKGYqdGhpcy54LCBmKnRoaXMueSk7IH1cblx0bWludXModikgeyByZXR1cm4gdGhpcy5wbHVzKHYuc2NhbGVkQnkoLTEuMCkpOyB9XG5cblx0ZG90KHYpIHsgcmV0dXJuIHRoaXMueCp2LnggKyB0aGlzLnkqdi55OyB9XG5cdGQyKCkgeyByZXR1cm4gdGhpcy5kb3QodGhpcyk7IH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjXG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkgc2NyaXB0VXJsID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyY1xuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJpbXBvcnQgVGlsZU1hcCBmcm9tIFwiLi9tYXBcIjtcbmltcG9ydCBWZWMyIGZyb20gXCIuL3ZlYzJcIjtcblxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCk9Pntcblx0bmV3IE1haW4oKTtcbn0pO1xuXG5jbGFzcyBNYWluIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0Ly8gdGltZSBzdHVmZlxuXHRcdHRoaXMuY3VycmVudF90aW1lID0gRGF0ZS5ub3coKTtcblx0XHR0aGlzLm9sZF90aW1lID0gdGhpcy5jdXJyZW50X3RpbWU7XG5cdFx0dGhpcy5kdCA9IDA7XG5cblx0XHQvLyBldmVudHNcblx0XHR0aGlzLmV2ZW50X3F1ZXVlID0gW107XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpPT57dGhpcy5tb3VzZWRvd24oZSl9KTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSk9Pnt0aGlzLm1vdXNlbW92ZShlKX0pO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCAoZSk9Pnt0aGlzLm1vdXNldXAoZSl9KTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRibGNsaWNrXCIsIChlKT0+e3RoaXMuZGJsY2xpY2soZSl9KTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpPT57XG5cdFx0XHRlLmNoYW5nZVN0YXRlID0gdHJ1ZTtcblx0XHRcdHRoaXMuZXZlbnRfcXVldWUucHVzaChbZSxcImJ1dHRvblwiXSk7XG5cdFx0fSk7XG5cblx0XHQvLyBjYW52YXMgc3R1ZmZcblx0XHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xuXHRcdHRoaXMuY2FudmFzLndpZHRoID0gODAwO1xuXHRcdHRoaXMuY2FudmFzLmhlaWdodD0gODAwO1xuXHRcdHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHRcdHRoaXMuY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZD0gZmFsc2U7XG5cdFx0dGhpcy5tYXQgPSB0aGlzLmN0eC5nZXRUcmFuc2Zvcm0oKTtcblxuXHRcdC8vIGdhbWUgc3R1ZmZcblx0XHR0aGlzLm1hcCA9IG5ldyBUaWxlTWFwKCk7XG5cblx0XHR0aGlzLnN0ZXAoKTtcblx0fVxuXG5cdHN0ZXAoKSB7XG5cdFx0dGhpcy5jdXJyZW50X3RpbWUgPSBEYXRlLm5vdygpLzEwMDAuMDtcblx0XHR0aGlzLmR0ID0gdGhpcy5jdXJyZW50X3RpbWUgLSB0aGlzLm9sZF90aW1lO1xuXHRcdHRoaXMub2xkX3RpbWUgPSB0aGlzLmN1cnJlbnRfdGltZTtcblxuXHRcdHRoaXMuZHJhdygpO1xuXHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0Ly8gcmVzdG9yZSB0byBkZWZhdWx0IHRyYW5zZm9ybWF0aW9ucyAoSSBkbyB0aGlzIG5vdyBzbyB0aGF0IHRoZSBtYXRyaXggZm9yIHRoZSBjYW52YXMgaXMgZ29vZClcblx0XHR0aGlzLmN0eC5yZXN0b3JlKCk7XG5cblx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT50aGlzLnN0ZXAoKSk7XG5cdH1cblxuXHR1cGRhdGUoKSB7XG5cdFx0XG5cblx0XHQvLyBldmVuIHRob3VnaCB3ZSBjbGVhciB0aGUgZXZlbnQgcXVldWUgaGVyZSBhbnl3YXlzLCBkbyBtYWtlIGFuIGVmZm9ydCB0byBwb3AgZXZlbnRzXG5cdFx0Ly8gb2ZmIHdoZW4gcmVhY3RpbmcgdG8gdGhlbSwgc28gdGhhdCBldmVudHMgYXJlbid0IGFjY2VwdGVkIGJ5IG11bHRpcGxlIHRoaW5nc1xuXHRcdC8vIHVuaW50ZW50aW9uYWxseS5cblx0XHR0aGlzLmV2ZW50X3F1ZXVlLmxlbmd0aCA9IDA7XG5cdH1cblxuXHRkcmF3KCkge1xuXHRcdC8vIHJlc2V0IGNhbnZhc1xuXHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcblx0XHR0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblxuXHRcdC8vIHNldHVwIGluaXRpYWwgdHJhbnNmb3JtYXRpb25zXG5cdFx0dGhpcy5jdHguc2F2ZSgpO1xuXHRcdC8vIHRoaXMuY3R4LnRyYW5zbGF0ZSgwLC0xNzUpO1xuXHRcdC8vIHRoaXMuY3R4LnNjYWxlKDEuNSwxLjUpO1xuXG5cdFx0dGhpcy5tYXQgPSB0aGlzLmN0eC5nZXRUcmFuc2Zvcm0oKTtcblxuXHRcdC8vIGRyYXcgdGhpbmdzXG5cdFx0dGhpcy5tYXAuZHJhdyh0aGlzLmN0eCk7XG5cdH1cblxuXHRtb3VzZWRvd24oZSl7XG5cdFx0ZS5wb3MgPSB0aGlzLmdldEN1cnNvclBvc2l0aW9uKGUpO1xuXHRcdHRoaXMuZXZlbnRfcXVldWUucHVzaChbZSxcIm1vdXNlZG93blwiXSk7XG5cdH1cblxuXHRtb3VzZXVwKGUpe1xuXHRcdGUucG9zID0gdGhpcy5nZXRDdXJzb3JQb3NpdGlvbihlKTtcblx0XHR0aGlzLmV2ZW50X3F1ZXVlLnB1c2goW2UsXCJtb3VzZXVwXCJdKTtcblx0fVxuXG5cdG1vdXNlbW92ZShlKXtcblx0XHRlLnBvcyA9IHRoaXMuZ2V0Q3Vyc29yUG9zaXRpb24oZSk7XG5cdFx0dGhpcy5ldmVudF9xdWV1ZS5wdXNoKFtlLFwibW91c2Vtb3ZlXCJdKTtcblx0fVxuXG5cdGRibGNsaWNrKGUpe1xuXHRcdGUucG9zID0gdGhpcy5nZXRDdXJzb3JQb3NpdGlvbihlKTtcblx0XHR0aGlzLmV2ZW50X3F1ZXVlLnB1c2goW2UsXCJkYmxjbGlja1wiXSk7XG5cdH1cblxuXHRnZXRDdXJzb3JQb3NpdGlvblJhdyhlKSB7XG5cdFx0bGV0IHJlY3QgPSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRsZXQgeCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcblx0XHRsZXQgeSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuXHRcdHJldHVybiBuZXcgVmVjMih4LHkpO1xuXHR9XG5cblx0Z2V0Q3Vyc29yUG9zaXRpb24oZSkge1xuXHRcdHJldHVybiB0aGlzLmdldFRyYW5zZm9ybWVkKHRoaXMuZ2V0Q3Vyc29yUG9zaXRpb25SYXcoZSkpO1xuXHR9XG5cblx0Z2V0VHJhbnNmb3JtZWQodikge1xuXHRcdGxldCBtID0gdGhpcy5tYXQ7XG5cdFx0bGV0IGRldF9pbnYgPSAxLjAvKG0uYSptLmQgLSBtLmIqbS5jKTtcblx0XHQvLyB3ZSBuZWVkIHRvIGRvIGludmVyc2Ugb2YgbSwgd2hpY2ggaSd2ZSBkb25lIGJ5IGhhbmRcblx0XHRyZXR1cm4gbmV3IFZlYzIoXG5cdFx0XHQobS5kICogKHYueCAtIG0uZSkgLSBtLmMgKiAodi55IC0gbS5mKSkgKiBkZXRfaW52LFxuXHRcdFx0KC1tLmIgKiAodi54IC0gbS5lKSArIG0uYSAqICh2LnkgLSBtLmYpKSAqIGRldF9pbnZcblx0XHQpO1xuXHR9XG59XG5cbmNsYXNzIEJhY2tncm91bmQge1xuXHRjb25zdHJ1Y3RvcihzcmMpe1xuXHRcdHRoaXMuaW1nID0gbmV3IEltYWdlKCk7XG5cdFx0dGhpcy5pbWcuc3JjID0gc3JjO1xuXHR9XG5cblx0ZHJhdyhjdHgpIHtcblx0XHRjdHguc2F2ZSgpO1xuXG5cdFx0Y3R4LnNjYWxlKDAuMiwgMC4yKTtcblx0XHRjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCAwLCAwKTtcblxuXHRcdGN0eC5yZXN0b3JlKCk7XG5cdH1cbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=