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

	draw(ctx) {
		ctx.save();

		ctx.translate(400, 200);
		ctx.scale(1, 1);

		// iterate the diagonal cross sections in case a tile extends outside of its boundaries
		// otherwise, we would have z issues
		for(let i = 0; i < 2*this.n-1; i++){
			for(let j = 0; j < Math.min(i+1,2*this.n-i-1); j++){
				let x = j - (Math.min(i+1,2*this.n-i-1)/2.0);
				let y = i/2.0;

				ctx.drawImage(this.tile_image, x*28, y*16);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFvRDs7QUFFckM7QUFDZjtBQUNBO0FBQ0Esd0JBQXdCLGtEQUFjO0FBQ3RDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsZ0JBQWdCO0FBQ2pDLGtCQUFrQixnQ0FBZ0M7QUFDbEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQzVCZTtBQUNmLHFCQUFxQixZQUFZOztBQUVqQyxXQUFXO0FBQ1gsZUFBZTtBQUNmLFlBQVk7O0FBRVosVUFBVTtBQUNWLFFBQVE7QUFDUjs7Ozs7Ozs7Ozs7Ozs7OztVQ1RBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7Ozs7Ozs7Ozs7O0FDZjRCO0FBQ0Y7OztBQUcxQjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZDQUE2QyxrQkFBa0I7QUFDL0QsNkNBQTZDLGtCQUFrQjtBQUMvRCwyQ0FBMkMsZ0JBQWdCO0FBQzNELDRDQUE0QyxpQkFBaUI7QUFDN0Q7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQiw0Q0FBTzs7QUFFeEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLDZDQUFJO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsNkNBQUk7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluLy4vc3JjL21hcC5qcyIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi8uL3NyYy92ZWMyLmpzIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vaXNvbWV0cmljLXRlcnJhaW4vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi8uL3NyYy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0aWxlX2ltYWdlX3NyYyBmcm9tIFwiLi9hc3NldHMvZ3Jhc3NUaWxlLnBuZ1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWxlTWFwIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy50aWxlX2ltYWdlID0gbmV3IEltYWdlKCk7XG5cdFx0dGhpcy50aWxlX2ltYWdlLnNyYyA9IHRpbGVfaW1hZ2Vfc3JjO1xuXHRcdHRoaXMubiA9IDI0O1xuXHR9XG5cblx0ZHJhdyhjdHgpIHtcblx0XHRjdHguc2F2ZSgpO1xuXG5cdFx0Y3R4LnRyYW5zbGF0ZSg0MDAsIDIwMCk7XG5cdFx0Y3R4LnNjYWxlKDEsIDEpO1xuXG5cdFx0Ly8gaXRlcmF0ZSB0aGUgZGlhZ29uYWwgY3Jvc3Mgc2VjdGlvbnMgaW4gY2FzZSBhIHRpbGUgZXh0ZW5kcyBvdXRzaWRlIG9mIGl0cyBib3VuZGFyaWVzXG5cdFx0Ly8gb3RoZXJ3aXNlLCB3ZSB3b3VsZCBoYXZlIHogaXNzdWVzXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IDIqdGhpcy5uLTE7IGkrKyl7XG5cdFx0XHRmb3IobGV0IGogPSAwOyBqIDwgTWF0aC5taW4oaSsxLDIqdGhpcy5uLWktMSk7IGorKyl7XG5cdFx0XHRcdGxldCB4ID0gaiAtIChNYXRoLm1pbihpKzEsMip0aGlzLm4taS0xKS8yLjApO1xuXHRcdFx0XHRsZXQgeSA9IGkvMi4wO1xuXG5cdFx0XHRcdGN0eC5kcmF3SW1hZ2UodGhpcy50aWxlX2ltYWdlLCB4KjI4LCB5KjE2KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjdHgucmVzdG9yZSgpO1xuXHR9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVjMiB7XG5cdGNvbnN0cnVjdG9yKHgsIHkpIHsgdGhpcy54ID0geDsgdGhpcy55ID0geTt9XG5cblx0cGx1cyh2KSB7IHJldHVybiBuZXcgVmVjMih0aGlzLngrdi54LCB0aGlzLnkrdi55KTsgfVxuXHRzY2FsZWRCeShmKSB7IHJldHVybiBuZXcgVmVjMihmKnRoaXMueCwgZip0aGlzLnkpOyB9XG5cdG1pbnVzKHYpIHsgcmV0dXJuIHRoaXMucGx1cyh2LnNjYWxlZEJ5KC0xLjApKTsgfVxuXG5cdGRvdCh2KSB7IHJldHVybiB0aGlzLngqdi54ICsgdGhpcy55KnYueTsgfVxuXHRkMigpIHsgcmV0dXJuIHRoaXMuZG90KHRoaXMpOyB9XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiaW1wb3J0IFRpbGVNYXAgZnJvbSBcIi4vbWFwXCI7XG5pbXBvcnQgVmVjMiBmcm9tIFwiLi92ZWMyXCI7XG5cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpPT57XG5cdG5ldyBNYWluKCk7XG59KTtcblxuY2xhc3MgTWFpbiB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdC8vIHRpbWUgc3R1ZmZcblx0XHR0aGlzLmN1cnJlbnRfdGltZSA9IERhdGUubm93KCk7XG5cdFx0dGhpcy5vbGRfdGltZSA9IHRoaXMuY3VycmVudF90aW1lO1xuXHRcdHRoaXMuZHQgPSAwO1xuXG5cdFx0Ly8gZXZlbnRzXG5cdFx0dGhpcy5ldmVudF9xdWV1ZSA9IFtdO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKT0+e3RoaXMubW91c2Vkb3duKGUpfSk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGUpPT57dGhpcy5tb3VzZW1vdmUoZSl9KTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgKGUpPT57dGhpcy5tb3VzZXVwKGUpfSk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkYmxjbGlja1wiLCAoZSk9Pnt0aGlzLmRibGNsaWNrKGUpfSk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKT0+e1xuXHRcdFx0ZS5jaGFuZ2VTdGF0ZSA9IHRydWU7XG5cdFx0XHR0aGlzLmV2ZW50X3F1ZXVlLnB1c2goW2UsXCJidXR0b25cIl0pO1xuXHRcdH0pO1xuXG5cdFx0Ly8gY2FudmFzIHN0dWZmXG5cdFx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKTtcblx0XHR0aGlzLmNhbnZhcy53aWR0aCA9IDgwMDtcblx0XHR0aGlzLmNhbnZhcy5oZWlnaHQ9IDgwMDtcblx0XHR0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblx0XHR0aGlzLmN0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQ9IGZhbHNlO1xuXHRcdHRoaXMubWF0ID0gdGhpcy5jdHguZ2V0VHJhbnNmb3JtKCk7XG5cblx0XHQvLyBnYW1lIHN0dWZmXG5cdFx0dGhpcy5tYXAgPSBuZXcgVGlsZU1hcCgpO1xuXG5cdFx0dGhpcy5zdGVwKCk7XG5cdH1cblxuXHRzdGVwKCkge1xuXHRcdHRoaXMuY3VycmVudF90aW1lID0gRGF0ZS5ub3coKS8xMDAwLjA7XG5cdFx0dGhpcy5kdCA9IHRoaXMuY3VycmVudF90aW1lIC0gdGhpcy5vbGRfdGltZTtcblx0XHR0aGlzLm9sZF90aW1lID0gdGhpcy5jdXJyZW50X3RpbWU7XG5cblx0XHR0aGlzLmRyYXcoKTtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdC8vIHJlc3RvcmUgdG8gZGVmYXVsdCB0cmFuc2Zvcm1hdGlvbnMgKEkgZG8gdGhpcyBub3cgc28gdGhhdCB0aGUgbWF0cml4IGZvciB0aGUgY2FudmFzIGlzIGdvb2QpXG5cdFx0dGhpcy5jdHgucmVzdG9yZSgpO1xuXG5cdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+dGhpcy5zdGVwKCkpO1xuXHR9XG5cblx0dXBkYXRlKCkge1xuXHRcdFxuXG5cdFx0Ly8gZXZlbiB0aG91Z2ggd2UgY2xlYXIgdGhlIGV2ZW50IHF1ZXVlIGhlcmUgYW55d2F5cywgZG8gbWFrZSBhbiBlZmZvcnQgdG8gcG9wIGV2ZW50c1xuXHRcdC8vIG9mZiB3aGVuIHJlYWN0aW5nIHRvIHRoZW0sIHNvIHRoYXQgZXZlbnRzIGFyZW4ndCBhY2NlcHRlZCBieSBtdWx0aXBsZSB0aGluZ3Ncblx0XHQvLyB1bmludGVudGlvbmFsbHkuXG5cdFx0dGhpcy5ldmVudF9xdWV1ZS5sZW5ndGggPSAwO1xuXHR9XG5cblx0ZHJhdygpIHtcblx0XHQvLyByZXNldCBjYW52YXNcblx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG5cdFx0dGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG5cblx0XHQvLyBzZXR1cCBpbml0aWFsIHRyYW5zZm9ybWF0aW9uc1xuXHRcdHRoaXMuY3R4LnNhdmUoKTtcblx0XHQvLyB0aGlzLmN0eC50cmFuc2xhdGUoMCwtMTc1KTtcblx0XHQvLyB0aGlzLmN0eC5zY2FsZSgxLjUsMS41KTtcblxuXHRcdHRoaXMubWF0ID0gdGhpcy5jdHguZ2V0VHJhbnNmb3JtKCk7XG5cblx0XHQvLyBkcmF3IHRoaW5nc1xuXHRcdHRoaXMubWFwLmRyYXcodGhpcy5jdHgpO1xuXHR9XG5cblx0bW91c2Vkb3duKGUpe1xuXHRcdGUucG9zID0gdGhpcy5nZXRDdXJzb3JQb3NpdGlvbihlKTtcblx0XHR0aGlzLmV2ZW50X3F1ZXVlLnB1c2goW2UsXCJtb3VzZWRvd25cIl0pO1xuXHR9XG5cblx0bW91c2V1cChlKXtcblx0XHRlLnBvcyA9IHRoaXMuZ2V0Q3Vyc29yUG9zaXRpb24oZSk7XG5cdFx0dGhpcy5ldmVudF9xdWV1ZS5wdXNoKFtlLFwibW91c2V1cFwiXSk7XG5cdH1cblxuXHRtb3VzZW1vdmUoZSl7XG5cdFx0ZS5wb3MgPSB0aGlzLmdldEN1cnNvclBvc2l0aW9uKGUpO1xuXHRcdHRoaXMuZXZlbnRfcXVldWUucHVzaChbZSxcIm1vdXNlbW92ZVwiXSk7XG5cdH1cblxuXHRkYmxjbGljayhlKXtcblx0XHRlLnBvcyA9IHRoaXMuZ2V0Q3Vyc29yUG9zaXRpb24oZSk7XG5cdFx0dGhpcy5ldmVudF9xdWV1ZS5wdXNoKFtlLFwiZGJsY2xpY2tcIl0pO1xuXHR9XG5cblx0Z2V0Q3Vyc29yUG9zaXRpb25SYXcoZSkge1xuXHRcdGxldCByZWN0ID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0bGV0IHggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG5cdFx0bGV0IHkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcblx0XHRyZXR1cm4gbmV3IFZlYzIoeCx5KTtcblx0fVxuXG5cdGdldEN1cnNvclBvc2l0aW9uKGUpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRUcmFuc2Zvcm1lZCh0aGlzLmdldEN1cnNvclBvc2l0aW9uUmF3KGUpKTtcblx0fVxuXG5cdGdldFRyYW5zZm9ybWVkKHYpIHtcblx0XHRsZXQgbSA9IHRoaXMubWF0O1xuXHRcdGxldCBkZXRfaW52ID0gMS4wLyhtLmEqbS5kIC0gbS5iKm0uYyk7XG5cdFx0Ly8gd2UgbmVlZCB0byBkbyBpbnZlcnNlIG9mIG0sIHdoaWNoIGkndmUgZG9uZSBieSBoYW5kXG5cdFx0cmV0dXJuIG5ldyBWZWMyKFxuXHRcdFx0KG0uZCAqICh2LnggLSBtLmUpIC0gbS5jICogKHYueSAtIG0uZikpICogZGV0X2ludixcblx0XHRcdCgtbS5iICogKHYueCAtIG0uZSkgKyBtLmEgKiAodi55IC0gbS5mKSkgKiBkZXRfaW52XG5cdFx0KTtcblx0fVxufVxuXG5jbGFzcyBCYWNrZ3JvdW5kIHtcblx0Y29uc3RydWN0b3Ioc3JjKXtcblx0XHR0aGlzLmltZyA9IG5ldyBJbWFnZSgpO1xuXHRcdHRoaXMuaW1nLnNyYyA9IHNyYztcblx0fVxuXG5cdGRyYXcoY3R4KSB7XG5cdFx0Y3R4LnNhdmUoKTtcblxuXHRcdGN0eC5zY2FsZSgwLjIsIDAuMik7XG5cdFx0Y3R4LmRyYXdJbWFnZSh0aGlzLmltZywgMCwgMCk7XG5cblx0XHRjdHgucmVzdG9yZSgpO1xuXHR9XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9