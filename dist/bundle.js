/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/drawer.js":
/*!***********************!*\
  !*** ./src/drawer.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Drawer)
/* harmony export */ });

class Drawer{
	constructor(n){
		this.layers = [...Array(n)].map(e => Array());
	}

	add_drawable(layer, drawable){
		this.layers[layer].push(drawable);
	}

	remove_drawable(layer, drawable){
		let array = this.layers[layer];
		let index = array.indexOf(drawable);
		if (index > -1) { // only splice array when item is found
			array.splice(index, 1); // 2nd parameter means remove one item only
			return true;
		}
		array.splice();
		return false;
	}

	remove_drawable_all(drawable){
		for(let layer of this.layers){
			this.remove_drawable(drawable);
		}
	}

	draw(ctx){
		for(let layer of this.layers){
			for(let drawable of layer){
				drawable.draw(ctx);
			}
		}
	}
}

/***/ }),

/***/ "./src/goat.js":
/*!*********************!*\
  !*** ./src/goat.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Goat)
/* harmony export */ });
/* harmony import */ var _assets_goat_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets/goat.png */ "./src/assets/goat.png");


class Goat{
	constructor(r,c, map, drawer){
		this.r = r;
		this.c = c;
		this.map = map;

		this.goat = new Image();
		this.goat.src = _assets_goat_png__WEBPACK_IMPORTED_MODULE_0__;
		
		this.drawer = drawer;
		console.log(this.map.z(this.r, this.c));
		this.drawer.add_drawable(
			this.map.z(this.r, this.c),
			{
				draw: (ctx)=>this.draw(ctx)
			}
		);
	}

	draw(ctx){
		let [x, y] = this.map.xy(this.r, this.c);
		console.log('goat: ' + x + ", " + y);
		ctx.drawImage(this.goat, x*28, y*16 - 19 + this.map.get_height(this.r, this.c));
	}
}

/***/ }),

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
	constructor(n) {
		this.n = n;

		this.init_height_map();
		this.init_tile_map();
	}

	register_with_drawer(renderer){
		this.renderer = renderer;

		// iterate the diagonal cross sections in case a tile extends outside of its boundaries
		// otherwise, we would have z issues
		for(let i = 0; i < 2*this.n-1; i++){
			this.renderer.add_drawable(i, {
				draw: (ctx)=>{this.draw_z(i, ctx)}
			})
		}
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

	z(r,c){
		return (r+c); // xy(r,c)[1]*2;
	}

	xy(r,c){
		return [(-r+c)/2.0, (r+c)/2.0];
	}

	get_height(r,c){
		return this.height_map[r][c];
	}

	*z_depth(z){
		for(let j = 0; j < Math.min(z+1,2*this.n-z-1); j++){
			let x = j - (Math.min(z+1,2*this.n-z-1)/2.0) + 0.5;
			let y = z/2.0;

			yield [x, y]
		}
	}

	draw_z(z, ctx){
		for(let [x, y] of this.z_depth(z)){
			let [r,c] = this.rc(x,y);
			let tile = this.tiles[this.tile_map[r][c]];
			ctx.drawImage(tile.image, x*28 + tile.offset[0], y*16 + tile.offset[1] + this.height_map[r][c]);
		}
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

/***/ "./src/assets/goat.png":
/*!*****************************!*\
  !*** ./src/assets/goat.png ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "5733f342de50bac469f0.png";

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
/* harmony import */ var _drawer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./drawer */ "./src/drawer.js");
/* harmony import */ var _goat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./goat */ "./src/goat.js");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./map */ "./src/map.js");
/* harmony import */ var _vec2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./vec2 */ "./src/vec2.js");






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
		this.canvas.width = 1600;
		this.canvas.height= 1000;
		this.ctx = this.canvas.getContext("2d");
		this.ctx.imageSmoothingEnabled= false;
		this.mat = this.ctx.getTransform();

		// game stuff
		let n = 24;
		this.drawer = new _drawer__WEBPACK_IMPORTED_MODULE_0__["default"](24*2-1);

		this.map = new _map__WEBPACK_IMPORTED_MODULE_2__["default"](24);
		this.map.register_with_drawer(this.drawer);

		this.goat = new _goat__WEBPACK_IMPORTED_MODULE_1__["default"](10, 10, this.map, this.drawer);

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

		this.ctx.translate(800, -200);
		this.ctx.scale(2.0,2.0);

		// draw things
		this.drawer.draw(this.ctx);
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
		return new _vec2__WEBPACK_IMPORTED_MODULE_3__["default"](x,y);
	}

	getCursorPosition(e) {
		return this.getTransformed(this.getCursorPositionRaw(e));
	}

	getTransformed(v) {
		let m = this.mat;
		let det_inv = 1.0/(m.a*m.d - m.b*m.c);
		// we need to do inverse of m, which i've done by hand
		return new _vec2__WEBPACK_IMPORTED_MODULE_3__["default"](
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7Ozs7Ozs7Ozs7OztBQ2Y4QjtBQUNKO0FBQ0U7QUFDRjs7O0FBRzFCO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkNBQTZDLGtCQUFrQjtBQUMvRCw2Q0FBNkMsa0JBQWtCO0FBQy9ELDJDQUEyQyxnQkFBZ0I7QUFDM0QsNENBQTRDLGlCQUFpQjtBQUM3RDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsK0NBQU07O0FBRTFCLGlCQUFpQiw0Q0FBTztBQUN4Qjs7QUFFQSxrQkFBa0IsNkNBQUk7O0FBRXRCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLDZDQUFJO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsNkNBQUk7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluLy4vc3JjL2RyYXdlci5qcyIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi8uL3NyYy9nb2F0LmpzIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluLy4vc3JjL21hcC5qcyIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi8uL3NyYy9udW0uanMiLCJ3ZWJwYWNrOi8vaXNvbWV0cmljLXRlcnJhaW4vLi9zcmMvdmVjMi5qcyIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vaXNvbWV0cmljLXRlcnJhaW4vd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vaXNvbWV0cmljLXRlcnJhaW4vd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vaXNvbWV0cmljLXRlcnJhaW4vLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyYXdlcntcblx0Y29uc3RydWN0b3Iobil7XG5cdFx0dGhpcy5sYXllcnMgPSBbLi4uQXJyYXkobildLm1hcChlID0+IEFycmF5KCkpO1xuXHR9XG5cblx0YWRkX2RyYXdhYmxlKGxheWVyLCBkcmF3YWJsZSl7XG5cdFx0dGhpcy5sYXllcnNbbGF5ZXJdLnB1c2goZHJhd2FibGUpO1xuXHR9XG5cblx0cmVtb3ZlX2RyYXdhYmxlKGxheWVyLCBkcmF3YWJsZSl7XG5cdFx0bGV0IGFycmF5ID0gdGhpcy5sYXllcnNbbGF5ZXJdO1xuXHRcdGxldCBpbmRleCA9IGFycmF5LmluZGV4T2YoZHJhd2FibGUpO1xuXHRcdGlmIChpbmRleCA+IC0xKSB7IC8vIG9ubHkgc3BsaWNlIGFycmF5IHdoZW4gaXRlbSBpcyBmb3VuZFxuXHRcdFx0YXJyYXkuc3BsaWNlKGluZGV4LCAxKTsgLy8gMm5kIHBhcmFtZXRlciBtZWFucyByZW1vdmUgb25lIGl0ZW0gb25seVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGFycmF5LnNwbGljZSgpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHJlbW92ZV9kcmF3YWJsZV9hbGwoZHJhd2FibGUpe1xuXHRcdGZvcihsZXQgbGF5ZXIgb2YgdGhpcy5sYXllcnMpe1xuXHRcdFx0dGhpcy5yZW1vdmVfZHJhd2FibGUoZHJhd2FibGUpO1xuXHRcdH1cblx0fVxuXG5cdGRyYXcoY3R4KXtcblx0XHRmb3IobGV0IGxheWVyIG9mIHRoaXMubGF5ZXJzKXtcblx0XHRcdGZvcihsZXQgZHJhd2FibGUgb2YgbGF5ZXIpe1xuXHRcdFx0XHRkcmF3YWJsZS5kcmF3KGN0eCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59IiwiaW1wb3J0IGdvYXRfc3JjIGZyb20gXCIuL2Fzc2V0cy9nb2F0LnBuZ1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHb2F0e1xuXHRjb25zdHJ1Y3RvcihyLGMsIG1hcCwgZHJhd2VyKXtcblx0XHR0aGlzLnIgPSByO1xuXHRcdHRoaXMuYyA9IGM7XG5cdFx0dGhpcy5tYXAgPSBtYXA7XG5cblx0XHR0aGlzLmdvYXQgPSBuZXcgSW1hZ2UoKTtcblx0XHR0aGlzLmdvYXQuc3JjID0gZ29hdF9zcmM7XG5cdFx0XG5cdFx0dGhpcy5kcmF3ZXIgPSBkcmF3ZXI7XG5cdFx0Y29uc29sZS5sb2codGhpcy5tYXAueih0aGlzLnIsIHRoaXMuYykpO1xuXHRcdHRoaXMuZHJhd2VyLmFkZF9kcmF3YWJsZShcblx0XHRcdHRoaXMubWFwLnoodGhpcy5yLCB0aGlzLmMpLFxuXHRcdFx0e1xuXHRcdFx0XHRkcmF3OiAoY3R4KT0+dGhpcy5kcmF3KGN0eClcblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0ZHJhdyhjdHgpe1xuXHRcdGxldCBbeCwgeV0gPSB0aGlzLm1hcC54eSh0aGlzLnIsIHRoaXMuYyk7XG5cdFx0Y29uc29sZS5sb2coJ2dvYXQ6ICcgKyB4ICsgXCIsIFwiICsgeSk7XG5cdFx0Y3R4LmRyYXdJbWFnZSh0aGlzLmdvYXQsIHgqMjgsIHkqMTYgLSAxOSArIHRoaXMubWFwLmdldF9oZWlnaHQodGhpcy5yLCB0aGlzLmMpKTtcblx0fVxufSIsImltcG9ydCBncmFzc190aWxlX3NyYyBmcm9tIFwiLi9hc3NldHMvZ3Jhc3NUaWxlVGFsbC5wbmdcIjtcbmltcG9ydCB0cmVlX3RpbGVfc3JjIGZyb20gXCIuL2Fzc2V0cy90cmVlVGlsZVRhbGwucG5nXCI7XG5pbXBvcnQgeyBibHVyIH0gZnJvbSBcIi4vbnVtXCI7XG5cbmZ1bmN0aW9uIGNob29zZV9yYW5kb21faW5kZXgoZnJlcXVlbmNpZXMsIHRvdGFsKXtcblx0bGV0IHJhbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSp0b3RhbCkrMTtcblx0bGV0IGkgPSAwO1xuXG5cdHdoaWxlKHJhbj4wKXtcblx0XHRyYW4tPWZyZXF1ZW5jaWVzW2ldO1xuXHRcdGkrKztcblx0fVxuXG5cdHJldHVybiBpLTE7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbGVNYXAge1xuXHRjb25zdHJ1Y3RvcihuKSB7XG5cdFx0dGhpcy5uID0gbjtcblxuXHRcdHRoaXMuaW5pdF9oZWlnaHRfbWFwKCk7XG5cdFx0dGhpcy5pbml0X3RpbGVfbWFwKCk7XG5cdH1cblxuXHRyZWdpc3Rlcl93aXRoX2RyYXdlcihyZW5kZXJlcil7XG5cdFx0dGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuXG5cdFx0Ly8gaXRlcmF0ZSB0aGUgZGlhZ29uYWwgY3Jvc3Mgc2VjdGlvbnMgaW4gY2FzZSBhIHRpbGUgZXh0ZW5kcyBvdXRzaWRlIG9mIGl0cyBib3VuZGFyaWVzXG5cdFx0Ly8gb3RoZXJ3aXNlLCB3ZSB3b3VsZCBoYXZlIHogaXNzdWVzXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IDIqdGhpcy5uLTE7IGkrKyl7XG5cdFx0XHR0aGlzLnJlbmRlcmVyLmFkZF9kcmF3YWJsZShpLCB7XG5cdFx0XHRcdGRyYXc6IChjdHgpPT57dGhpcy5kcmF3X3ooaSwgY3R4KX1cblx0XHRcdH0pXG5cdFx0fVxuXHR9XG5cblx0aW5pdF9oZWlnaHRfbWFwKCl7XG5cdFx0dGhpcy5oZWlnaHRfbWFwID0gdGhpcy5lbXB0eV9hcnJheSgpO1xuXHRcdGZvcihsZXQgciA9IDA7IHIgPCB0aGlzLm47IHIrKyl7IGZvcihsZXQgYyA9IDA7IGMgPCB0aGlzLm47IGMrKyl7XG5cdFx0XHR0aGlzLmhlaWdodF9tYXBbcl1bY10gPSAyNDAuMCpNYXRoLnJhbmRvbSgpO1xuXHRcdH19XG5cdFx0dGhpcy5oZWlnaHRfbWFwID0gYmx1cih0aGlzLmhlaWdodF9tYXAsIHRoaXMubiwgdGhpcy5uLCA1KTtcblx0fVxuXG5cdGluaXRfdGlsZV9tYXAoKXtcblx0XHRsZXQgZ3Jhc3NfdGlsZSA9IG5ldyBJbWFnZSgpO1xuXHRcdGdyYXNzX3RpbGUuc3JjID0gZ3Jhc3NfdGlsZV9zcmM7XG5cblx0XHRsZXQgdHJlZV90aWxlID0gbmV3IEltYWdlKCk7XG5cdFx0dHJlZV90aWxlLnNyYyA9IHRyZWVfdGlsZV9zcmM7XG5cblx0XHR0aGlzLnRpbGVzID0gW1xuXHRcdFx0e1xuXHRcdFx0XHRpbWFnZTogZ3Jhc3NfdGlsZSxcblx0XHRcdFx0b2Zmc2V0OiBbMCwgMF1cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGltYWdlOiB0cmVlX3RpbGUsXG5cdFx0XHRcdG9mZnNldDogWy0xNCwtMzZdXG5cdFx0XHR9XG5cdFx0XTtcblxuXHRcdGxldCBmcmVxdWVuY2llcyA9IFs2MCwgMV07XG5cdFx0bGV0IHRvdGFsID0gZnJlcXVlbmNpZXMucmVkdWNlKChwcmV2LCB2YWwpPT5wcmV2K3ZhbCwgMCk7XG5cblx0XHR0aGlzLnRpbGVfbWFwID0gdGhpcy5lbXB0eV9hcnJheSgpO1xuXHRcdGZvcihsZXQgciA9IDA7IHIgPCB0aGlzLm47IHIrKyl7IGZvcihsZXQgYyA9IDA7IGMgPCB0aGlzLm47IGMrKyl7XG5cdFx0XHR0aGlzLnRpbGVfbWFwW3JdW2NdID0gY2hvb3NlX3JhbmRvbV9pbmRleChmcmVxdWVuY2llcywgdG90YWwpO1xuXHRcdH19XG5cdH1cblxuXHRlbXB0eV9hcnJheSgpe1xuXHRcdHJldHVybiBbLi4uQXJyYXkodGhpcy5uKV0ubWFwKGUgPT4gQXJyYXkodGhpcy5uKSk7XG5cdH1cblxuXHRyYyh4LHkpe1xuXHRcdHJldHVybiBbLXgreSwgeCt5XTtcblx0fVxuXG5cdHoocixjKXtcblx0XHRyZXR1cm4gKHIrYyk7IC8vIHh5KHIsYylbMV0qMjtcblx0fVxuXG5cdHh5KHIsYyl7XG5cdFx0cmV0dXJuIFsoLXIrYykvMi4wLCAocitjKS8yLjBdO1xuXHR9XG5cblx0Z2V0X2hlaWdodChyLGMpe1xuXHRcdHJldHVybiB0aGlzLmhlaWdodF9tYXBbcl1bY107XG5cdH1cblxuXHQqel9kZXB0aCh6KXtcblx0XHRmb3IobGV0IGogPSAwOyBqIDwgTWF0aC5taW4oeisxLDIqdGhpcy5uLXotMSk7IGorKyl7XG5cdFx0XHRsZXQgeCA9IGogLSAoTWF0aC5taW4oeisxLDIqdGhpcy5uLXotMSkvMi4wKSArIDAuNTtcblx0XHRcdGxldCB5ID0gei8yLjA7XG5cblx0XHRcdHlpZWxkIFt4LCB5XVxuXHRcdH1cblx0fVxuXG5cdGRyYXdfeih6LCBjdHgpe1xuXHRcdGZvcihsZXQgW3gsIHldIG9mIHRoaXMuel9kZXB0aCh6KSl7XG5cdFx0XHRsZXQgW3IsY10gPSB0aGlzLnJjKHgseSk7XG5cdFx0XHRsZXQgdGlsZSA9IHRoaXMudGlsZXNbdGhpcy50aWxlX21hcFtyXVtjXV07XG5cdFx0XHRjdHguZHJhd0ltYWdlKHRpbGUuaW1hZ2UsIHgqMjggKyB0aWxlLm9mZnNldFswXSwgeSoxNiArIHRpbGUub2Zmc2V0WzFdICsgdGhpcy5oZWlnaHRfbWFwW3JdW2NdKTtcblx0XHR9XG5cdH1cbn0iLCJcbmZ1bmN0aW9uIGdldChhcnJheSwgcixjLCBycyxjcyl7XG5cdHJldHVybiBhcnJheVtNYXRoLm1pbihNYXRoLm1heChyLDApLHJzLTEpXVtNYXRoLm1pbihNYXRoLm1heChjLDApLGNzLTEpXTtcbn1cblxuZnVuY3Rpb24qIGJveF9pdGVyKHIwLCBjMCwgcmFkaXVzKXtcblx0Zm9yKGxldCBybD0wOyBybDwyKnJhZGl1cysxOyBybCsrKXtcblx0XHRmb3IobGV0IGNsPTA7IGNsPDIqcmFkaXVzKzE7IGNsKyspe1xuXHRcdFx0eWllbGQgW3IwK3JsLXJhZGl1cywgYzArY2wtcmFkaXVzLCBybCwgY2xdO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYmx1cihhcnJheSwgcnMsIGNzLCBrZXJuZWxfcmFkKXtcblx0cmV0dXJuIGNvbnZvbHZlKGFycmF5LCBycywgY3MsIGd1YXNzaWFuX2tlcm5lbChrZXJuZWxfcmFkKSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZvbHZlKGFycmF5LCBycywgY3MsIGtlcm5lbCl7XG5cdGxldCByYWRpdXMgPSAoa2VybmVsLmxlbmd0aC0xKS8yO1xuXHRsZXQgYXJyYXkyID0gWy4uLkFycmF5KHJzKV0ubWFwKGUgPT4gQXJyYXkoY3MpKTtcblxuXHRmb3IobGV0IHI9MDsgcjxyczsgcisrKXtcblx0XHRmb3IobGV0IGM9MDsgYzxjczsgYysrKXtcblx0XHRcdGFycmF5MltyXVtjXSA9IFsuLi5ib3hfaXRlcihyLGMsIHJhZGl1cyldLnJlZHVjZSgocGFydGlhbFN1bSwgW3JiLCBjYiwgcmwsIGNsXSkgPT4gcGFydGlhbFN1bSArIGdldChhcnJheSwgcmIsY2IsIHJzLGNzKSprZXJuZWxbcmxdW2NsXSwgMCk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGFycmF5Mjtcbn1cblxuLy8gZ2l2ZSBvZGQgcmFkaXVzXG5mdW5jdGlvbiBndWFzc2lhbl9rZXJuZWwocmFkaXVzKXtcblx0bGV0IG4gPSAyKnJhZGl1cztcblx0bGV0IGtlcm5lbCA9IFsuLi5BcnJheShuKzEpXS5tYXAoZSA9PiBBcnJheShuKzEpLmZpbGwoMC4wKSk7XG5cdGZvcihsZXQgcj0wOyByPD1uOyByKyspe1xuXHRcdGZvcihsZXQgYz0wOyBjPD1uOyBjKyspe1xuXHRcdFx0a2VybmVsW3JdW2NdID0gY2hvb3NlKG4scikgKiBjaG9vc2UobixjKSAqIE1hdGgucG93KDAuNSwgMipuKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGtlcm5lbDtcbn1cblxuZnVuY3Rpb24gY2hvb3NlKG4sIHIpe1xuXHRpZihyPT1uIHx8IHI9PTApIHJldHVybiAxO1xuXHRyZXR1cm4gY2hvb3NlKG4tMSwgcikgKyBjaG9vc2Uobi0xLCByLTEpXG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBWZWMyIHtcblx0Y29uc3RydWN0b3IoeCwgeSkgeyB0aGlzLnggPSB4OyB0aGlzLnkgPSB5O31cblxuXHRwbHVzKHYpIHsgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCt2LngsIHRoaXMueSt2LnkpOyB9XG5cdHNjYWxlZEJ5KGYpIHsgcmV0dXJuIG5ldyBWZWMyKGYqdGhpcy54LCBmKnRoaXMueSk7IH1cblx0bWludXModikgeyByZXR1cm4gdGhpcy5wbHVzKHYuc2NhbGVkQnkoLTEuMCkpOyB9XG5cblx0ZG90KHYpIHsgcmV0dXJuIHRoaXMueCp2LnggKyB0aGlzLnkqdi55OyB9XG5cdGQyKCkgeyByZXR1cm4gdGhpcy5kb3QodGhpcyk7IH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjXG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkgc2NyaXB0VXJsID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyY1xuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJpbXBvcnQgRHJhd2VyIGZyb20gXCIuL2RyYXdlclwiO1xuaW1wb3J0IEdvYXQgZnJvbSBcIi4vZ29hdFwiO1xuaW1wb3J0IFRpbGVNYXAgZnJvbSBcIi4vbWFwXCI7XG5pbXBvcnQgVmVjMiBmcm9tIFwiLi92ZWMyXCI7XG5cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpPT57XG5cdG5ldyBNYWluKCk7XG59KTtcblxuY2xhc3MgTWFpbiB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdC8vIHRpbWUgc3R1ZmZcblx0XHR0aGlzLmN1cnJlbnRfdGltZSA9IERhdGUubm93KCk7XG5cdFx0dGhpcy5vbGRfdGltZSA9IHRoaXMuY3VycmVudF90aW1lO1xuXHRcdHRoaXMuZHQgPSAwO1xuXG5cdFx0Ly8gZXZlbnRzXG5cdFx0dGhpcy5ldmVudF9xdWV1ZSA9IFtdO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKT0+e3RoaXMubW91c2Vkb3duKGUpfSk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGUpPT57dGhpcy5tb3VzZW1vdmUoZSl9KTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgKGUpPT57dGhpcy5tb3VzZXVwKGUpfSk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkYmxjbGlja1wiLCAoZSk9Pnt0aGlzLmRibGNsaWNrKGUpfSk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKT0+e1xuXHRcdFx0ZS5jaGFuZ2VTdGF0ZSA9IHRydWU7XG5cdFx0XHR0aGlzLmV2ZW50X3F1ZXVlLnB1c2goW2UsXCJidXR0b25cIl0pO1xuXHRcdH0pO1xuXG5cdFx0Ly8gY2FudmFzIHN0dWZmXG5cdFx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKTtcblx0XHR0aGlzLmNhbnZhcy53aWR0aCA9IDE2MDA7XG5cdFx0dGhpcy5jYW52YXMuaGVpZ2h0PSAxMDAwO1xuXHRcdHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHRcdHRoaXMuY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZD0gZmFsc2U7XG5cdFx0dGhpcy5tYXQgPSB0aGlzLmN0eC5nZXRUcmFuc2Zvcm0oKTtcblxuXHRcdC8vIGdhbWUgc3R1ZmZcblx0XHRsZXQgbiA9IDI0O1xuXHRcdHRoaXMuZHJhd2VyID0gbmV3IERyYXdlcigyNCoyLTEpO1xuXG5cdFx0dGhpcy5tYXAgPSBuZXcgVGlsZU1hcCgyNCk7XG5cdFx0dGhpcy5tYXAucmVnaXN0ZXJfd2l0aF9kcmF3ZXIodGhpcy5kcmF3ZXIpO1xuXG5cdFx0dGhpcy5nb2F0ID0gbmV3IEdvYXQoMTAsIDEwLCB0aGlzLm1hcCwgdGhpcy5kcmF3ZXIpO1xuXG5cdFx0dGhpcy5zdGVwKCk7XG5cdH1cblxuXHRzdGVwKCkge1xuXHRcdHRoaXMuY3VycmVudF90aW1lID0gRGF0ZS5ub3coKS8xMDAwLjA7XG5cdFx0dGhpcy5kdCA9IHRoaXMuY3VycmVudF90aW1lIC0gdGhpcy5vbGRfdGltZTtcblx0XHR0aGlzLm9sZF90aW1lID0gdGhpcy5jdXJyZW50X3RpbWU7XG5cblx0XHR0aGlzLmRyYXcoKTtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdC8vIHJlc3RvcmUgdG8gZGVmYXVsdCB0cmFuc2Zvcm1hdGlvbnMgKEkgZG8gdGhpcyBub3cgc28gdGhhdCB0aGUgbWF0cml4IGZvciB0aGUgY2FudmFzIGlzIGdvb2QpXG5cdFx0dGhpcy5jdHgucmVzdG9yZSgpO1xuXG5cdFx0Ly93aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT50aGlzLnN0ZXAoKSk7XG5cdH1cblxuXHR1cGRhdGUoKSB7XG5cdFx0XG5cblx0XHQvLyBldmVuIHRob3VnaCB3ZSBjbGVhciB0aGUgZXZlbnQgcXVldWUgaGVyZSBhbnl3YXlzLCBkbyBtYWtlIGFuIGVmZm9ydCB0byBwb3AgZXZlbnRzXG5cdFx0Ly8gb2ZmIHdoZW4gcmVhY3RpbmcgdG8gdGhlbSwgc28gdGhhdCBldmVudHMgYXJlbid0IGFjY2VwdGVkIGJ5IG11bHRpcGxlIHRoaW5nc1xuXHRcdC8vIHVuaW50ZW50aW9uYWxseS5cblx0XHR0aGlzLmV2ZW50X3F1ZXVlLmxlbmd0aCA9IDA7XG5cdH1cblxuXHRkcmF3KCkge1xuXHRcdC8vIHJlc2V0IGNhbnZhc1xuXHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcblx0XHR0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblxuXHRcdC8vIHNldHVwIGluaXRpYWwgdHJhbnNmb3JtYXRpb25zXG5cdFx0dGhpcy5jdHguc2F2ZSgpO1xuXHRcdC8vIHRoaXMuY3R4LnRyYW5zbGF0ZSgwLC0xNzUpO1xuXHRcdC8vIHRoaXMuY3R4LnNjYWxlKDEuNSwxLjUpO1xuXG5cdFx0dGhpcy5tYXQgPSB0aGlzLmN0eC5nZXRUcmFuc2Zvcm0oKTtcblxuXHRcdHRoaXMuY3R4LnRyYW5zbGF0ZSg4MDAsIC0yMDApO1xuXHRcdHRoaXMuY3R4LnNjYWxlKDIuMCwyLjApO1xuXG5cdFx0Ly8gZHJhdyB0aGluZ3Ncblx0XHR0aGlzLmRyYXdlci5kcmF3KHRoaXMuY3R4KTtcblx0fVxuXG5cdG1vdXNlZG93bihlKXtcblx0XHRlLnBvcyA9IHRoaXMuZ2V0Q3Vyc29yUG9zaXRpb24oZSk7XG5cdFx0dGhpcy5ldmVudF9xdWV1ZS5wdXNoKFtlLFwibW91c2Vkb3duXCJdKTtcblx0fVxuXG5cdG1vdXNldXAoZSl7XG5cdFx0ZS5wb3MgPSB0aGlzLmdldEN1cnNvclBvc2l0aW9uKGUpO1xuXHRcdHRoaXMuZXZlbnRfcXVldWUucHVzaChbZSxcIm1vdXNldXBcIl0pO1xuXHR9XG5cblx0bW91c2Vtb3ZlKGUpe1xuXHRcdGUucG9zID0gdGhpcy5nZXRDdXJzb3JQb3NpdGlvbihlKTtcblx0XHR0aGlzLmV2ZW50X3F1ZXVlLnB1c2goW2UsXCJtb3VzZW1vdmVcIl0pO1xuXHR9XG5cblx0ZGJsY2xpY2soZSl7XG5cdFx0ZS5wb3MgPSB0aGlzLmdldEN1cnNvclBvc2l0aW9uKGUpO1xuXHRcdHRoaXMuZXZlbnRfcXVldWUucHVzaChbZSxcImRibGNsaWNrXCJdKTtcblx0fVxuXG5cdGdldEN1cnNvclBvc2l0aW9uUmF3KGUpIHtcblx0XHRsZXQgcmVjdCA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdGxldCB4ID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuXHRcdGxldCB5ID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG5cdFx0cmV0dXJuIG5ldyBWZWMyKHgseSk7XG5cdH1cblxuXHRnZXRDdXJzb3JQb3NpdGlvbihlKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VHJhbnNmb3JtZWQodGhpcy5nZXRDdXJzb3JQb3NpdGlvblJhdyhlKSk7XG5cdH1cblxuXHRnZXRUcmFuc2Zvcm1lZCh2KSB7XG5cdFx0bGV0IG0gPSB0aGlzLm1hdDtcblx0XHRsZXQgZGV0X2ludiA9IDEuMC8obS5hKm0uZCAtIG0uYiptLmMpO1xuXHRcdC8vIHdlIG5lZWQgdG8gZG8gaW52ZXJzZSBvZiBtLCB3aGljaCBpJ3ZlIGRvbmUgYnkgaGFuZFxuXHRcdHJldHVybiBuZXcgVmVjMihcblx0XHRcdChtLmQgKiAodi54IC0gbS5lKSAtIG0uYyAqICh2LnkgLSBtLmYpKSAqIGRldF9pbnYsXG5cdFx0XHQoLW0uYiAqICh2LnggLSBtLmUpICsgbS5hICogKHYueSAtIG0uZikpICogZGV0X2ludlxuXHRcdCk7XG5cdH1cbn1cblxuY2xhc3MgQmFja2dyb3VuZCB7XG5cdGNvbnN0cnVjdG9yKHNyYyl7XG5cdFx0dGhpcy5pbWcgPSBuZXcgSW1hZ2UoKTtcblx0XHR0aGlzLmltZy5zcmMgPSBzcmM7XG5cdH1cblxuXHRkcmF3KGN0eCkge1xuXHRcdGN0eC5zYXZlKCk7XG5cblx0XHRjdHguc2NhbGUoMC4yLCAwLjIpO1xuXHRcdGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIDAsIDApO1xuXG5cdFx0Y3R4LnJlc3RvcmUoKTtcblx0fVxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==