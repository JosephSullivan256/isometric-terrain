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
/* harmony import */ var _assets_grassTileTall_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets/grassTileTall.png */ "./src/assets/grassTileTall.png");
/* harmony import */ var _assets_treeTileTall_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets/treeTileTall.png */ "./src/assets/treeTileTall.png");
/* harmony import */ var _num__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./num */ "./src/num.js");




function choose_random_index(frequencies, total){
	let ran = Math.floor(Math.random()*total)+1;
	let i = 0;

	while(ran>0){
		ran-=frequencies[i];
		i++;
	}

	return i-1;
}

class TileMap {
	constructor() {
		this.n = 24;

		this.init_height_map();
		this.init_tile_map();
	}

	init_height_map(){
		this.height_map = this.empty_array();
		for(let r = 0; r < this.n; r++){ for(let c = 0; c < this.n; c++){
			this.height_map[r][c] = 240.0*Math.random();
		}}
		this.height_map = (0,_num__WEBPACK_IMPORTED_MODULE_2__.blur)(this.height_map, this.n, this.n, 5);
	}

	init_tile_map(){
		let grass_tile = new Image();
		grass_tile.src = _assets_grassTileTall_png__WEBPACK_IMPORTED_MODULE_0__;

		let tree_tile = new Image();
		tree_tile.src = _assets_treeTileTall_png__WEBPACK_IMPORTED_MODULE_1__;

		this.tiles = [
			{
				image: grass_tile,
				offset: [0, 0]
			},
			{
				image: tree_tile,
				offset: [-14,-36]
			}
		];

		let frequencies = [60, 1];
		let total = frequencies.reduce((prev, val)=>prev+val, 0);

		this.tile_map = this.empty_array();
		for(let r = 0; r < this.n; r++){ for(let c = 0; c < this.n; c++){
			this.tile_map[r][c] = choose_random_index(frequencies, total);
		}}
	}

	empty_array(){
		return [...Array(this.n)].map(e => Array(this.n));
	}

	rc(x,y){
		return [-x+y, x+y];
	}

	xy(r,c){
		return [r+c, -r+c];
	}

	*z_depth(z){
		for(let j = 0; j < Math.min(z+1,2*this.n-z-1); j++){
			let x = j - (Math.min(z+1,2*this.n-z-1)/2.0) + 0.5;
			let y = z/2.0;

			yield [this.tile_image, x, y]
		}
	}

	draw(ctx) {
		ctx.save();

		ctx.translate(400, 0);
		ctx.scale(1, 1);

		// iterate the diagonal cross sections in case a tile extends outside of its boundaries
		// otherwise, we would have z issues
		for(let i = 0; i < 2*this.n-1; i++){
			for(let [tile, x, y, r, c] of this.z_depth(i)){
				let [r,c] = this.rc(x,y);
				let tile = this.tiles[this.tile_map[r][c]];
				ctx.drawImage(tile.image, x*28 + tile.offset[0], y*16 + tile.offset[1] + this.height_map[r][c]);
			}
		}

		ctx.restore();
	}
}

/***/ }),

/***/ "./src/num.js":
/*!********************!*\
  !*** ./src/num.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "blur": () => (/* binding */ blur)
/* harmony export */ });

function get(array, r,c, rs,cs){
	return array[Math.min(Math.max(r,0),rs-1)][Math.min(Math.max(c,0),cs-1)];
}

function* box_iter(r0, c0, radius){
	for(let rl=0; rl<2*radius+1; rl++){
		for(let cl=0; cl<2*radius+1; cl++){
			yield [r0+rl-radius, c0+cl-radius, rl, cl];
		}
	}
}

function blur(array, rs, cs, kernel_rad){
	return convolve(array, rs, cs, guassian_kernel(kernel_rad));
}

function convolve(array, rs, cs, kernel){
	let radius = (kernel.length-1)/2;
	let array2 = [...Array(rs)].map(e => Array(cs));

	for(let r=0; r<rs; r++){
		for(let c=0; c<cs; c++){
			array2[r][c] = [...box_iter(r,c, radius)].reduce((partialSum, [rb, cb, rl, cl]) => partialSum + get(array, rb,cb, rs,cs)*kernel[rl][cl], 0);
		}
	}

	return array2;
}

// give odd radius
function guassian_kernel(radius){
	let n = 2*radius;
	let kernel = [...Array(n+1)].map(e => Array(n+1).fill(0.0));
	for(let r=0; r<=n; r++){
		for(let c=0; c<=n; c++){
			kernel[r][c] = choose(n,r) * choose(n,c) * Math.pow(0.5, 2*n);
		}
	}
	return kernel;
}

function choose(n, r){
	if(r==n || r==0) return 1;
	return choose(n-1, r) + choose(n-1, r-1)
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

/***/ "./src/assets/grassTileTall.png":
/*!**************************************!*\
  !*** ./src/assets/grassTileTall.png ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "a74dcaf4f76b2e8db1b2.png";

/***/ }),

/***/ "./src/assets/treeTileTall.png":
/*!*************************************!*\
  !*** ./src/assets/treeTileTall.png ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "27ebbad1de8c1ec72517.png";

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

		//window.requestAnimationFrame(()=>this.step());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsNkNBQUk7QUFDakI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSw2Q0FBSTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaXNvbWV0cmljLXRlcnJhaW4vLi9zcmMvbWFwLmpzIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluLy4vc3JjL251bS5qcyIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi8uL3NyYy92ZWMyLmpzIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vaXNvbWV0cmljLXRlcnJhaW4vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi8uL3NyYy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBncmFzc190aWxlX3NyYyBmcm9tIFwiLi9hc3NldHMvZ3Jhc3NUaWxlVGFsbC5wbmdcIjtcbmltcG9ydCB0cmVlX3RpbGVfc3JjIGZyb20gXCIuL2Fzc2V0cy90cmVlVGlsZVRhbGwucG5nXCI7XG5pbXBvcnQgeyBibHVyIH0gZnJvbSBcIi4vbnVtXCI7XG5cbmZ1bmN0aW9uIGNob29zZV9yYW5kb21faW5kZXgoZnJlcXVlbmNpZXMsIHRvdGFsKXtcblx0bGV0IHJhbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSp0b3RhbCkrMTtcblx0bGV0IGkgPSAwO1xuXG5cdHdoaWxlKHJhbj4wKXtcblx0XHRyYW4tPWZyZXF1ZW5jaWVzW2ldO1xuXHRcdGkrKztcblx0fVxuXG5cdHJldHVybiBpLTE7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbGVNYXAge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLm4gPSAyNDtcblxuXHRcdHRoaXMuaW5pdF9oZWlnaHRfbWFwKCk7XG5cdFx0dGhpcy5pbml0X3RpbGVfbWFwKCk7XG5cdH1cblxuXHRpbml0X2hlaWdodF9tYXAoKXtcblx0XHR0aGlzLmhlaWdodF9tYXAgPSB0aGlzLmVtcHR5X2FycmF5KCk7XG5cdFx0Zm9yKGxldCByID0gMDsgciA8IHRoaXMubjsgcisrKXsgZm9yKGxldCBjID0gMDsgYyA8IHRoaXMubjsgYysrKXtcblx0XHRcdHRoaXMuaGVpZ2h0X21hcFtyXVtjXSA9IDI0MC4wKk1hdGgucmFuZG9tKCk7XG5cdFx0fX1cblx0XHR0aGlzLmhlaWdodF9tYXAgPSBibHVyKHRoaXMuaGVpZ2h0X21hcCwgdGhpcy5uLCB0aGlzLm4sIDUpO1xuXHR9XG5cblx0aW5pdF90aWxlX21hcCgpe1xuXHRcdGxldCBncmFzc190aWxlID0gbmV3IEltYWdlKCk7XG5cdFx0Z3Jhc3NfdGlsZS5zcmMgPSBncmFzc190aWxlX3NyYztcblxuXHRcdGxldCB0cmVlX3RpbGUgPSBuZXcgSW1hZ2UoKTtcblx0XHR0cmVlX3RpbGUuc3JjID0gdHJlZV90aWxlX3NyYztcblxuXHRcdHRoaXMudGlsZXMgPSBbXG5cdFx0XHR7XG5cdFx0XHRcdGltYWdlOiBncmFzc190aWxlLFxuXHRcdFx0XHRvZmZzZXQ6IFswLCAwXVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0aW1hZ2U6IHRyZWVfdGlsZSxcblx0XHRcdFx0b2Zmc2V0OiBbLTE0LC0zNl1cblx0XHRcdH1cblx0XHRdO1xuXG5cdFx0bGV0IGZyZXF1ZW5jaWVzID0gWzYwLCAxXTtcblx0XHRsZXQgdG90YWwgPSBmcmVxdWVuY2llcy5yZWR1Y2UoKHByZXYsIHZhbCk9PnByZXYrdmFsLCAwKTtcblxuXHRcdHRoaXMudGlsZV9tYXAgPSB0aGlzLmVtcHR5X2FycmF5KCk7XG5cdFx0Zm9yKGxldCByID0gMDsgciA8IHRoaXMubjsgcisrKXsgZm9yKGxldCBjID0gMDsgYyA8IHRoaXMubjsgYysrKXtcblx0XHRcdHRoaXMudGlsZV9tYXBbcl1bY10gPSBjaG9vc2VfcmFuZG9tX2luZGV4KGZyZXF1ZW5jaWVzLCB0b3RhbCk7XG5cdFx0fX1cblx0fVxuXG5cdGVtcHR5X2FycmF5KCl7XG5cdFx0cmV0dXJuIFsuLi5BcnJheSh0aGlzLm4pXS5tYXAoZSA9PiBBcnJheSh0aGlzLm4pKTtcblx0fVxuXG5cdHJjKHgseSl7XG5cdFx0cmV0dXJuIFsteCt5LCB4K3ldO1xuXHR9XG5cblx0eHkocixjKXtcblx0XHRyZXR1cm4gW3IrYywgLXIrY107XG5cdH1cblxuXHQqel9kZXB0aCh6KXtcblx0XHRmb3IobGV0IGogPSAwOyBqIDwgTWF0aC5taW4oeisxLDIqdGhpcy5uLXotMSk7IGorKyl7XG5cdFx0XHRsZXQgeCA9IGogLSAoTWF0aC5taW4oeisxLDIqdGhpcy5uLXotMSkvMi4wKSArIDAuNTtcblx0XHRcdGxldCB5ID0gei8yLjA7XG5cblx0XHRcdHlpZWxkIFt0aGlzLnRpbGVfaW1hZ2UsIHgsIHldXG5cdFx0fVxuXHR9XG5cblx0ZHJhdyhjdHgpIHtcblx0XHRjdHguc2F2ZSgpO1xuXG5cdFx0Y3R4LnRyYW5zbGF0ZSg0MDAsIDApO1xuXHRcdGN0eC5zY2FsZSgxLCAxKTtcblxuXHRcdC8vIGl0ZXJhdGUgdGhlIGRpYWdvbmFsIGNyb3NzIHNlY3Rpb25zIGluIGNhc2UgYSB0aWxlIGV4dGVuZHMgb3V0c2lkZSBvZiBpdHMgYm91bmRhcmllc1xuXHRcdC8vIG90aGVyd2lzZSwgd2Ugd291bGQgaGF2ZSB6IGlzc3Vlc1xuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCAyKnRoaXMubi0xOyBpKyspe1xuXHRcdFx0Zm9yKGxldCBbdGlsZSwgeCwgeSwgciwgY10gb2YgdGhpcy56X2RlcHRoKGkpKXtcblx0XHRcdFx0bGV0IFtyLGNdID0gdGhpcy5yYyh4LHkpO1xuXHRcdFx0XHRsZXQgdGlsZSA9IHRoaXMudGlsZXNbdGhpcy50aWxlX21hcFtyXVtjXV07XG5cdFx0XHRcdGN0eC5kcmF3SW1hZ2UodGlsZS5pbWFnZSwgeCoyOCArIHRpbGUub2Zmc2V0WzBdLCB5KjE2ICsgdGlsZS5vZmZzZXRbMV0gKyB0aGlzLmhlaWdodF9tYXBbcl1bY10pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGN0eC5yZXN0b3JlKCk7XG5cdH1cbn0iLCJcbmZ1bmN0aW9uIGdldChhcnJheSwgcixjLCBycyxjcyl7XG5cdHJldHVybiBhcnJheVtNYXRoLm1pbihNYXRoLm1heChyLDApLHJzLTEpXVtNYXRoLm1pbihNYXRoLm1heChjLDApLGNzLTEpXTtcbn1cblxuZnVuY3Rpb24qIGJveF9pdGVyKHIwLCBjMCwgcmFkaXVzKXtcblx0Zm9yKGxldCBybD0wOyBybDwyKnJhZGl1cysxOyBybCsrKXtcblx0XHRmb3IobGV0IGNsPTA7IGNsPDIqcmFkaXVzKzE7IGNsKyspe1xuXHRcdFx0eWllbGQgW3IwK3JsLXJhZGl1cywgYzArY2wtcmFkaXVzLCBybCwgY2xdO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYmx1cihhcnJheSwgcnMsIGNzLCBrZXJuZWxfcmFkKXtcblx0cmV0dXJuIGNvbnZvbHZlKGFycmF5LCBycywgY3MsIGd1YXNzaWFuX2tlcm5lbChrZXJuZWxfcmFkKSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZvbHZlKGFycmF5LCBycywgY3MsIGtlcm5lbCl7XG5cdGxldCByYWRpdXMgPSAoa2VybmVsLmxlbmd0aC0xKS8yO1xuXHRsZXQgYXJyYXkyID0gWy4uLkFycmF5KHJzKV0ubWFwKGUgPT4gQXJyYXkoY3MpKTtcblxuXHRmb3IobGV0IHI9MDsgcjxyczsgcisrKXtcblx0XHRmb3IobGV0IGM9MDsgYzxjczsgYysrKXtcblx0XHRcdGFycmF5MltyXVtjXSA9IFsuLi5ib3hfaXRlcihyLGMsIHJhZGl1cyldLnJlZHVjZSgocGFydGlhbFN1bSwgW3JiLCBjYiwgcmwsIGNsXSkgPT4gcGFydGlhbFN1bSArIGdldChhcnJheSwgcmIsY2IsIHJzLGNzKSprZXJuZWxbcmxdW2NsXSwgMCk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGFycmF5Mjtcbn1cblxuLy8gZ2l2ZSBvZGQgcmFkaXVzXG5mdW5jdGlvbiBndWFzc2lhbl9rZXJuZWwocmFkaXVzKXtcblx0bGV0IG4gPSAyKnJhZGl1cztcblx0bGV0IGtlcm5lbCA9IFsuLi5BcnJheShuKzEpXS5tYXAoZSA9PiBBcnJheShuKzEpLmZpbGwoMC4wKSk7XG5cdGZvcihsZXQgcj0wOyByPD1uOyByKyspe1xuXHRcdGZvcihsZXQgYz0wOyBjPD1uOyBjKyspe1xuXHRcdFx0a2VybmVsW3JdW2NdID0gY2hvb3NlKG4scikgKiBjaG9vc2UobixjKSAqIE1hdGgucG93KDAuNSwgMipuKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGtlcm5lbDtcbn1cblxuZnVuY3Rpb24gY2hvb3NlKG4sIHIpe1xuXHRpZihyPT1uIHx8IHI9PTApIHJldHVybiAxO1xuXHRyZXR1cm4gY2hvb3NlKG4tMSwgcikgKyBjaG9vc2Uobi0xLCByLTEpXG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBWZWMyIHtcblx0Y29uc3RydWN0b3IoeCwgeSkgeyB0aGlzLnggPSB4OyB0aGlzLnkgPSB5O31cblxuXHRwbHVzKHYpIHsgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCt2LngsIHRoaXMueSt2LnkpOyB9XG5cdHNjYWxlZEJ5KGYpIHsgcmV0dXJuIG5ldyBWZWMyKGYqdGhpcy54LCBmKnRoaXMueSk7IH1cblx0bWludXModikgeyByZXR1cm4gdGhpcy5wbHVzKHYuc2NhbGVkQnkoLTEuMCkpOyB9XG5cblx0ZG90KHYpIHsgcmV0dXJuIHRoaXMueCp2LnggKyB0aGlzLnkqdi55OyB9XG5cdGQyKCkgeyByZXR1cm4gdGhpcy5kb3QodGhpcyk7IH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjXG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkgc2NyaXB0VXJsID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyY1xuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJpbXBvcnQgVGlsZU1hcCBmcm9tIFwiLi9tYXBcIjtcbmltcG9ydCBWZWMyIGZyb20gXCIuL3ZlYzJcIjtcblxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCk9Pntcblx0bmV3IE1haW4oKTtcbn0pO1xuXG5jbGFzcyBNYWluIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0Ly8gdGltZSBzdHVmZlxuXHRcdHRoaXMuY3VycmVudF90aW1lID0gRGF0ZS5ub3coKTtcblx0XHR0aGlzLm9sZF90aW1lID0gdGhpcy5jdXJyZW50X3RpbWU7XG5cdFx0dGhpcy5kdCA9IDA7XG5cblx0XHQvLyBldmVudHNcblx0XHR0aGlzLmV2ZW50X3F1ZXVlID0gW107XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpPT57dGhpcy5tb3VzZWRvd24oZSl9KTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSk9Pnt0aGlzLm1vdXNlbW92ZShlKX0pO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCAoZSk9Pnt0aGlzLm1vdXNldXAoZSl9KTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRibGNsaWNrXCIsIChlKT0+e3RoaXMuZGJsY2xpY2soZSl9KTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpPT57XG5cdFx0XHRlLmNoYW5nZVN0YXRlID0gdHJ1ZTtcblx0XHRcdHRoaXMuZXZlbnRfcXVldWUucHVzaChbZSxcImJ1dHRvblwiXSk7XG5cdFx0fSk7XG5cblx0XHQvLyBjYW52YXMgc3R1ZmZcblx0XHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xuXHRcdHRoaXMuY2FudmFzLndpZHRoID0gODAwO1xuXHRcdHRoaXMuY2FudmFzLmhlaWdodD0gODAwO1xuXHRcdHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHRcdHRoaXMuY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZD0gZmFsc2U7XG5cdFx0dGhpcy5tYXQgPSB0aGlzLmN0eC5nZXRUcmFuc2Zvcm0oKTtcblxuXHRcdC8vIGdhbWUgc3R1ZmZcblx0XHR0aGlzLm1hcCA9IG5ldyBUaWxlTWFwKCk7XG5cblx0XHR0aGlzLnN0ZXAoKTtcblx0fVxuXG5cdHN0ZXAoKSB7XG5cdFx0dGhpcy5jdXJyZW50X3RpbWUgPSBEYXRlLm5vdygpLzEwMDAuMDtcblx0XHR0aGlzLmR0ID0gdGhpcy5jdXJyZW50X3RpbWUgLSB0aGlzLm9sZF90aW1lO1xuXHRcdHRoaXMub2xkX3RpbWUgPSB0aGlzLmN1cnJlbnRfdGltZTtcblxuXHRcdHRoaXMuZHJhdygpO1xuXHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0Ly8gcmVzdG9yZSB0byBkZWZhdWx0IHRyYW5zZm9ybWF0aW9ucyAoSSBkbyB0aGlzIG5vdyBzbyB0aGF0IHRoZSBtYXRyaXggZm9yIHRoZSBjYW52YXMgaXMgZ29vZClcblx0XHR0aGlzLmN0eC5yZXN0b3JlKCk7XG5cblx0XHQvL3dpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCk9PnRoaXMuc3RlcCgpKTtcblx0fVxuXG5cdHVwZGF0ZSgpIHtcblx0XHRcblxuXHRcdC8vIGV2ZW4gdGhvdWdoIHdlIGNsZWFyIHRoZSBldmVudCBxdWV1ZSBoZXJlIGFueXdheXMsIGRvIG1ha2UgYW4gZWZmb3J0IHRvIHBvcCBldmVudHNcblx0XHQvLyBvZmYgd2hlbiByZWFjdGluZyB0byB0aGVtLCBzbyB0aGF0IGV2ZW50cyBhcmVuJ3QgYWNjZXB0ZWQgYnkgbXVsdGlwbGUgdGhpbmdzXG5cdFx0Ly8gdW5pbnRlbnRpb25hbGx5LlxuXHRcdHRoaXMuZXZlbnRfcXVldWUubGVuZ3RoID0gMDtcblx0fVxuXG5cdGRyYXcoKSB7XG5cdFx0Ly8gcmVzZXQgY2FudmFzXG5cdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xuXHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXG5cdFx0Ly8gc2V0dXAgaW5pdGlhbCB0cmFuc2Zvcm1hdGlvbnNcblx0XHR0aGlzLmN0eC5zYXZlKCk7XG5cdFx0Ly8gdGhpcy5jdHgudHJhbnNsYXRlKDAsLTE3NSk7XG5cdFx0Ly8gdGhpcy5jdHguc2NhbGUoMS41LDEuNSk7XG5cblx0XHR0aGlzLm1hdCA9IHRoaXMuY3R4LmdldFRyYW5zZm9ybSgpO1xuXG5cdFx0Ly8gZHJhdyB0aGluZ3Ncblx0XHR0aGlzLm1hcC5kcmF3KHRoaXMuY3R4KTtcblx0fVxuXG5cdG1vdXNlZG93bihlKXtcblx0XHRlLnBvcyA9IHRoaXMuZ2V0Q3Vyc29yUG9zaXRpb24oZSk7XG5cdFx0dGhpcy5ldmVudF9xdWV1ZS5wdXNoKFtlLFwibW91c2Vkb3duXCJdKTtcblx0fVxuXG5cdG1vdXNldXAoZSl7XG5cdFx0ZS5wb3MgPSB0aGlzLmdldEN1cnNvclBvc2l0aW9uKGUpO1xuXHRcdHRoaXMuZXZlbnRfcXVldWUucHVzaChbZSxcIm1vdXNldXBcIl0pO1xuXHR9XG5cblx0bW91c2Vtb3ZlKGUpe1xuXHRcdGUucG9zID0gdGhpcy5nZXRDdXJzb3JQb3NpdGlvbihlKTtcblx0XHR0aGlzLmV2ZW50X3F1ZXVlLnB1c2goW2UsXCJtb3VzZW1vdmVcIl0pO1xuXHR9XG5cblx0ZGJsY2xpY2soZSl7XG5cdFx0ZS5wb3MgPSB0aGlzLmdldEN1cnNvclBvc2l0aW9uKGUpO1xuXHRcdHRoaXMuZXZlbnRfcXVldWUucHVzaChbZSxcImRibGNsaWNrXCJdKTtcblx0fVxuXG5cdGdldEN1cnNvclBvc2l0aW9uUmF3KGUpIHtcblx0XHRsZXQgcmVjdCA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdGxldCB4ID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuXHRcdGxldCB5ID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG5cdFx0cmV0dXJuIG5ldyBWZWMyKHgseSk7XG5cdH1cblxuXHRnZXRDdXJzb3JQb3NpdGlvbihlKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VHJhbnNmb3JtZWQodGhpcy5nZXRDdXJzb3JQb3NpdGlvblJhdyhlKSk7XG5cdH1cblxuXHRnZXRUcmFuc2Zvcm1lZCh2KSB7XG5cdFx0bGV0IG0gPSB0aGlzLm1hdDtcblx0XHRsZXQgZGV0X2ludiA9IDEuMC8obS5hKm0uZCAtIG0uYiptLmMpO1xuXHRcdC8vIHdlIG5lZWQgdG8gZG8gaW52ZXJzZSBvZiBtLCB3aGljaCBpJ3ZlIGRvbmUgYnkgaGFuZFxuXHRcdHJldHVybiBuZXcgVmVjMihcblx0XHRcdChtLmQgKiAodi54IC0gbS5lKSAtIG0uYyAqICh2LnkgLSBtLmYpKSAqIGRldF9pbnYsXG5cdFx0XHQoLW0uYiAqICh2LnggLSBtLmUpICsgbS5hICogKHYueSAtIG0uZikpICogZGV0X2ludlxuXHRcdCk7XG5cdH1cbn1cblxuY2xhc3MgQmFja2dyb3VuZCB7XG5cdGNvbnN0cnVjdG9yKHNyYyl7XG5cdFx0dGhpcy5pbWcgPSBuZXcgSW1hZ2UoKTtcblx0XHR0aGlzLmltZy5zcmMgPSBzcmM7XG5cdH1cblxuXHRkcmF3KGN0eCkge1xuXHRcdGN0eC5zYXZlKCk7XG5cblx0XHRjdHguc2NhbGUoMC4yLCAwLjIpO1xuXHRcdGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIDAsIDApO1xuXG5cdFx0Y3R4LnJlc3RvcmUoKTtcblx0fVxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==