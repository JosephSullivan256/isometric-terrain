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
		this.register();
	}

	unregister(){
		this.drawer.remove_drawable(this.map.z(this.r, this.c));
	}

	register(){
		this.drawer.add_drawable(
			this.map.z(this.r, this.c),
			{
				draw: (ctx)=>this.draw(ctx)
			}
		);
	}

	update(){

	}

	move_to(r,c){
		this.unregister();
		this.r = r;
		this.c = c;
		this.register();
	}

	draw(ctx){
		let [x, y] = this.map.xy(this.r, this.c);
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
/* harmony import */ var _assets_waterTileTall_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assets/waterTileTall.png */ "./src/assets/waterTileTall.png");
/* harmony import */ var _num__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./num */ "./src/num.js");





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

		this.genereate_terrain();
	}

	update(event_queue){
		let i = event_queue.length;
		while(i--){
			let [e, name] = event_queue[i];
			if(name === "generate"){
				this.genereate_terrain();
				event_queue.splice(i, 1);
			}
		}
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

	genereate_terrain(){
		this.init_tile_map();
		this.init_height_map();
	}

	init_height_map(){
		// set random heights
		this.height_map = this.empty_array();
		for(let r = 0; r < this.n; r++){ for(let c = 0; c < this.n; c++){
			let range = 480.0;
			this.height_map[r][c] = range*(Math.random()-0.5);
		}}
		// blur the noise
		//this.height_map = blur(this.height_map, this.n, this.n, 9);
		this.height_map = (0,_num__WEBPACK_IMPORTED_MODULE_3__.blur)(this.height_map, this.n, this.n, 3);
		this.height_map = (0,_num__WEBPACK_IMPORTED_MODULE_3__.blur)(this.height_map, this.n, this.n, 3);
		this.height_map = (0,_num__WEBPACK_IMPORTED_MODULE_3__.blur)(this.height_map, this.n, this.n, 3);

		// set water level
		let water_level = 20.0;
		for(let r = 0; r < this.n; r++){ for(let c = 0; c < this.n; c++){
			if(this.height_map[r][c] > water_level){
				this.height_map[r][c] = water_level;
				this.tile_map[r][c] = 2;
			}
		}}
	}

	init_tile_map(){
		let grass_tile = new Image();
		grass_tile.src = _assets_grassTileTall_png__WEBPACK_IMPORTED_MODULE_0__;

		let tree_tile = new Image();
		tree_tile.src = _assets_treeTileTall_png__WEBPACK_IMPORTED_MODULE_1__;

		let water_tile = new Image();
		water_tile.src = _assets_waterTileTall_png__WEBPACK_IMPORTED_MODULE_2__;

		this.tiles = [
			{
				image: grass_tile,
				offset: [0, 0]
			},
			{
				image: tree_tile,
				offset: [-14,-36]
			},
			{
				image: water_tile,
				offset: [0, 0]
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

/***/ }),

/***/ "./src/assets/waterTileTall.png":
/*!**************************************!*\
  !*** ./src/assets/waterTileTall.png ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "b25ce746790d4d70d368.png";

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
		window.main = this;

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
		document.getElementById("generate").addEventListener("click", (e)=>{
			this.event_queue.push([e,"generate"]);
		});

		// canvas stuff
		this.canvas = document.getElementById("canvas");
		this.canvas.width = 1600;
		this.canvas.height= 1200;
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

		window.requestAnimationFrame(()=>this.step());
	}

	update() {
		this.map.update(this.event_queue);

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

		this.ctx.translate(800, 150);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsNkNBQUk7QUFDakI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSw2Q0FBSTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaXNvbWV0cmljLXRlcnJhaW4vLi9zcmMvZHJhd2VyLmpzIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluLy4vc3JjL2dvYXQuanMiLCJ3ZWJwYWNrOi8vaXNvbWV0cmljLXRlcnJhaW4vLi9zcmMvbWFwLmpzIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluLy4vc3JjL251bS5qcyIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi8uL3NyYy92ZWMyLmpzIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2lzb21ldHJpYy10ZXJyYWluL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vaXNvbWV0cmljLXRlcnJhaW4vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9pc29tZXRyaWMtdGVycmFpbi8uL3NyYy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJhd2Vye1xuXHRjb25zdHJ1Y3RvcihuKXtcblx0XHR0aGlzLmxheWVycyA9IFsuLi5BcnJheShuKV0ubWFwKGUgPT4gQXJyYXkoKSk7XG5cdH1cblxuXHRhZGRfZHJhd2FibGUobGF5ZXIsIGRyYXdhYmxlKXtcblx0XHR0aGlzLmxheWVyc1tsYXllcl0ucHVzaChkcmF3YWJsZSk7XG5cdH1cblxuXHRyZW1vdmVfZHJhd2FibGUobGF5ZXIsIGRyYXdhYmxlKXtcblx0XHRsZXQgYXJyYXkgPSB0aGlzLmxheWVyc1tsYXllcl07XG5cdFx0bGV0IGluZGV4ID0gYXJyYXkuaW5kZXhPZihkcmF3YWJsZSk7XG5cdFx0aWYgKGluZGV4ID4gLTEpIHsgLy8gb25seSBzcGxpY2UgYXJyYXkgd2hlbiBpdGVtIGlzIGZvdW5kXG5cdFx0XHRhcnJheS5zcGxpY2UoaW5kZXgsIDEpOyAvLyAybmQgcGFyYW1ldGVyIG1lYW5zIHJlbW92ZSBvbmUgaXRlbSBvbmx5XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0YXJyYXkuc3BsaWNlKCk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cmVtb3ZlX2RyYXdhYmxlX2FsbChkcmF3YWJsZSl7XG5cdFx0Zm9yKGxldCBsYXllciBvZiB0aGlzLmxheWVycyl7XG5cdFx0XHR0aGlzLnJlbW92ZV9kcmF3YWJsZShkcmF3YWJsZSk7XG5cdFx0fVxuXHR9XG5cblx0ZHJhdyhjdHgpe1xuXHRcdGZvcihsZXQgbGF5ZXIgb2YgdGhpcy5sYXllcnMpe1xuXHRcdFx0Zm9yKGxldCBkcmF3YWJsZSBvZiBsYXllcil7XG5cdFx0XHRcdGRyYXdhYmxlLmRyYXcoY3R4KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn0iLCJpbXBvcnQgZ29hdF9zcmMgZnJvbSBcIi4vYXNzZXRzL2dvYXQucG5nXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdvYXR7XG5cdGNvbnN0cnVjdG9yKHIsYywgbWFwLCBkcmF3ZXIpe1xuXHRcdHRoaXMuciA9IHI7XG5cdFx0dGhpcy5jID0gYztcblx0XHR0aGlzLm1hcCA9IG1hcDtcblxuXHRcdHRoaXMuZ29hdCA9IG5ldyBJbWFnZSgpO1xuXHRcdHRoaXMuZ29hdC5zcmMgPSBnb2F0X3NyYztcblx0XHRcblx0XHR0aGlzLmRyYXdlciA9IGRyYXdlcjtcblx0XHR0aGlzLnJlZ2lzdGVyKCk7XG5cdH1cblxuXHR1bnJlZ2lzdGVyKCl7XG5cdFx0dGhpcy5kcmF3ZXIucmVtb3ZlX2RyYXdhYmxlKHRoaXMubWFwLnoodGhpcy5yLCB0aGlzLmMpKTtcblx0fVxuXG5cdHJlZ2lzdGVyKCl7XG5cdFx0dGhpcy5kcmF3ZXIuYWRkX2RyYXdhYmxlKFxuXHRcdFx0dGhpcy5tYXAueih0aGlzLnIsIHRoaXMuYyksXG5cdFx0XHR7XG5cdFx0XHRcdGRyYXc6IChjdHgpPT50aGlzLmRyYXcoY3R4KVxuXHRcdFx0fVxuXHRcdCk7XG5cdH1cblxuXHR1cGRhdGUoKXtcblxuXHR9XG5cblx0bW92ZV90byhyLGMpe1xuXHRcdHRoaXMudW5yZWdpc3RlcigpO1xuXHRcdHRoaXMuciA9IHI7XG5cdFx0dGhpcy5jID0gYztcblx0XHR0aGlzLnJlZ2lzdGVyKCk7XG5cdH1cblxuXHRkcmF3KGN0eCl7XG5cdFx0bGV0IFt4LCB5XSA9IHRoaXMubWFwLnh5KHRoaXMuciwgdGhpcy5jKTtcblx0XHRjdHguZHJhd0ltYWdlKHRoaXMuZ29hdCwgeCoyOCwgeSoxNiAtIDE5ICsgdGhpcy5tYXAuZ2V0X2hlaWdodCh0aGlzLnIsIHRoaXMuYykpO1xuXHR9XG59IiwiaW1wb3J0IGdyYXNzX3RpbGVfc3JjIGZyb20gXCIuL2Fzc2V0cy9ncmFzc1RpbGVUYWxsLnBuZ1wiO1xuaW1wb3J0IHRyZWVfdGlsZV9zcmMgZnJvbSBcIi4vYXNzZXRzL3RyZWVUaWxlVGFsbC5wbmdcIjtcbmltcG9ydCB3YXRlcl90aWxlX3NyYyBmcm9tIFwiLi9hc3NldHMvd2F0ZXJUaWxlVGFsbC5wbmdcIjtcbmltcG9ydCB7IGJsdXIgfSBmcm9tIFwiLi9udW1cIjtcblxuZnVuY3Rpb24gY2hvb3NlX3JhbmRvbV9pbmRleChmcmVxdWVuY2llcywgdG90YWwpe1xuXHRsZXQgcmFuID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnRvdGFsKSsxO1xuXHRsZXQgaSA9IDA7XG5cblx0d2hpbGUocmFuPjApe1xuXHRcdHJhbi09ZnJlcXVlbmNpZXNbaV07XG5cdFx0aSsrO1xuXHR9XG5cblx0cmV0dXJuIGktMTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlsZU1hcCB7XG5cdGNvbnN0cnVjdG9yKG4pIHtcblx0XHR0aGlzLm4gPSBuO1xuXG5cdFx0dGhpcy5nZW5lcmVhdGVfdGVycmFpbigpO1xuXHR9XG5cblx0dXBkYXRlKGV2ZW50X3F1ZXVlKXtcblx0XHRsZXQgaSA9IGV2ZW50X3F1ZXVlLmxlbmd0aDtcblx0XHR3aGlsZShpLS0pe1xuXHRcdFx0bGV0IFtlLCBuYW1lXSA9IGV2ZW50X3F1ZXVlW2ldO1xuXHRcdFx0aWYobmFtZSA9PT0gXCJnZW5lcmF0ZVwiKXtcblx0XHRcdFx0dGhpcy5nZW5lcmVhdGVfdGVycmFpbigpO1xuXHRcdFx0XHRldmVudF9xdWV1ZS5zcGxpY2UoaSwgMSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmVnaXN0ZXJfd2l0aF9kcmF3ZXIocmVuZGVyZXIpe1xuXHRcdHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcblxuXHRcdC8vIGl0ZXJhdGUgdGhlIGRpYWdvbmFsIGNyb3NzIHNlY3Rpb25zIGluIGNhc2UgYSB0aWxlIGV4dGVuZHMgb3V0c2lkZSBvZiBpdHMgYm91bmRhcmllc1xuXHRcdC8vIG90aGVyd2lzZSwgd2Ugd291bGQgaGF2ZSB6IGlzc3Vlc1xuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCAyKnRoaXMubi0xOyBpKyspe1xuXHRcdFx0dGhpcy5yZW5kZXJlci5hZGRfZHJhd2FibGUoaSwge1xuXHRcdFx0XHRkcmF3OiAoY3R4KT0+e3RoaXMuZHJhd196KGksIGN0eCl9XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG5cdGdlbmVyZWF0ZV90ZXJyYWluKCl7XG5cdFx0dGhpcy5pbml0X3RpbGVfbWFwKCk7XG5cdFx0dGhpcy5pbml0X2hlaWdodF9tYXAoKTtcblx0fVxuXG5cdGluaXRfaGVpZ2h0X21hcCgpe1xuXHRcdC8vIHNldCByYW5kb20gaGVpZ2h0c1xuXHRcdHRoaXMuaGVpZ2h0X21hcCA9IHRoaXMuZW1wdHlfYXJyYXkoKTtcblx0XHRmb3IobGV0IHIgPSAwOyByIDwgdGhpcy5uOyByKyspeyBmb3IobGV0IGMgPSAwOyBjIDwgdGhpcy5uOyBjKyspe1xuXHRcdFx0bGV0IHJhbmdlID0gNDgwLjA7XG5cdFx0XHR0aGlzLmhlaWdodF9tYXBbcl1bY10gPSByYW5nZSooTWF0aC5yYW5kb20oKS0wLjUpO1xuXHRcdH19XG5cdFx0Ly8gYmx1ciB0aGUgbm9pc2Vcblx0XHQvL3RoaXMuaGVpZ2h0X21hcCA9IGJsdXIodGhpcy5oZWlnaHRfbWFwLCB0aGlzLm4sIHRoaXMubiwgOSk7XG5cdFx0dGhpcy5oZWlnaHRfbWFwID0gYmx1cih0aGlzLmhlaWdodF9tYXAsIHRoaXMubiwgdGhpcy5uLCAzKTtcblx0XHR0aGlzLmhlaWdodF9tYXAgPSBibHVyKHRoaXMuaGVpZ2h0X21hcCwgdGhpcy5uLCB0aGlzLm4sIDMpO1xuXHRcdHRoaXMuaGVpZ2h0X21hcCA9IGJsdXIodGhpcy5oZWlnaHRfbWFwLCB0aGlzLm4sIHRoaXMubiwgMyk7XG5cblx0XHQvLyBzZXQgd2F0ZXIgbGV2ZWxcblx0XHRsZXQgd2F0ZXJfbGV2ZWwgPSAyMC4wO1xuXHRcdGZvcihsZXQgciA9IDA7IHIgPCB0aGlzLm47IHIrKyl7IGZvcihsZXQgYyA9IDA7IGMgPCB0aGlzLm47IGMrKyl7XG5cdFx0XHRpZih0aGlzLmhlaWdodF9tYXBbcl1bY10gPiB3YXRlcl9sZXZlbCl7XG5cdFx0XHRcdHRoaXMuaGVpZ2h0X21hcFtyXVtjXSA9IHdhdGVyX2xldmVsO1xuXHRcdFx0XHR0aGlzLnRpbGVfbWFwW3JdW2NdID0gMjtcblx0XHRcdH1cblx0XHR9fVxuXHR9XG5cblx0aW5pdF90aWxlX21hcCgpe1xuXHRcdGxldCBncmFzc190aWxlID0gbmV3IEltYWdlKCk7XG5cdFx0Z3Jhc3NfdGlsZS5zcmMgPSBncmFzc190aWxlX3NyYztcblxuXHRcdGxldCB0cmVlX3RpbGUgPSBuZXcgSW1hZ2UoKTtcblx0XHR0cmVlX3RpbGUuc3JjID0gdHJlZV90aWxlX3NyYztcblxuXHRcdGxldCB3YXRlcl90aWxlID0gbmV3IEltYWdlKCk7XG5cdFx0d2F0ZXJfdGlsZS5zcmMgPSB3YXRlcl90aWxlX3NyYztcblxuXHRcdHRoaXMudGlsZXMgPSBbXG5cdFx0XHR7XG5cdFx0XHRcdGltYWdlOiBncmFzc190aWxlLFxuXHRcdFx0XHRvZmZzZXQ6IFswLCAwXVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0aW1hZ2U6IHRyZWVfdGlsZSxcblx0XHRcdFx0b2Zmc2V0OiBbLTE0LC0zNl1cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGltYWdlOiB3YXRlcl90aWxlLFxuXHRcdFx0XHRvZmZzZXQ6IFswLCAwXVxuXHRcdFx0fVxuXHRcdF07XG5cblx0XHRsZXQgZnJlcXVlbmNpZXMgPSBbNjAsIDFdO1xuXHRcdGxldCB0b3RhbCA9IGZyZXF1ZW5jaWVzLnJlZHVjZSgocHJldiwgdmFsKT0+cHJldit2YWwsIDApO1xuXG5cdFx0dGhpcy50aWxlX21hcCA9IHRoaXMuZW1wdHlfYXJyYXkoKTtcblx0XHRmb3IobGV0IHIgPSAwOyByIDwgdGhpcy5uOyByKyspeyBmb3IobGV0IGMgPSAwOyBjIDwgdGhpcy5uOyBjKyspe1xuXHRcdFx0dGhpcy50aWxlX21hcFtyXVtjXSA9IGNob29zZV9yYW5kb21faW5kZXgoZnJlcXVlbmNpZXMsIHRvdGFsKTtcblx0XHR9fVxuXHR9XG5cblx0ZW1wdHlfYXJyYXkoKXtcblx0XHRyZXR1cm4gWy4uLkFycmF5KHRoaXMubildLm1hcChlID0+IEFycmF5KHRoaXMubikpO1xuXHR9XG5cblx0cmMoeCx5KXtcblx0XHRyZXR1cm4gWy14K3ksIHgreV07XG5cdH1cblxuXHR6KHIsYyl7XG5cdFx0cmV0dXJuIChyK2MpOyAvLyB4eShyLGMpWzFdKjI7XG5cdH1cblxuXHR4eShyLGMpe1xuXHRcdHJldHVybiBbKC1yK2MpLzIuMCwgKHIrYykvMi4wXTtcblx0fVxuXG5cdGdldF9oZWlnaHQocixjKXtcblx0XHRyZXR1cm4gdGhpcy5oZWlnaHRfbWFwW3JdW2NdO1xuXHR9XG5cblx0KnpfZGVwdGgoeil7XG5cdFx0Zm9yKGxldCBqID0gMDsgaiA8IE1hdGgubWluKHorMSwyKnRoaXMubi16LTEpOyBqKyspe1xuXHRcdFx0bGV0IHggPSBqIC0gKE1hdGgubWluKHorMSwyKnRoaXMubi16LTEpLzIuMCkgKyAwLjU7XG5cdFx0XHRsZXQgeSA9IHovMi4wO1xuXG5cdFx0XHR5aWVsZCBbeCwgeV1cblx0XHR9XG5cdH1cblxuXHRkcmF3X3ooeiwgY3R4KXtcblx0XHRmb3IobGV0IFt4LCB5XSBvZiB0aGlzLnpfZGVwdGgoeikpe1xuXHRcdFx0bGV0IFtyLGNdID0gdGhpcy5yYyh4LHkpO1xuXHRcdFx0bGV0IHRpbGUgPSB0aGlzLnRpbGVzW3RoaXMudGlsZV9tYXBbcl1bY11dO1xuXHRcdFx0Y3R4LmRyYXdJbWFnZSh0aWxlLmltYWdlLCB4KjI4ICsgdGlsZS5vZmZzZXRbMF0sIHkqMTYgKyB0aWxlLm9mZnNldFsxXSArIHRoaXMuaGVpZ2h0X21hcFtyXVtjXSk7XG5cdFx0fVxuXHR9XG59IiwiXG5mdW5jdGlvbiBnZXQoYXJyYXksIHIsYywgcnMsY3Mpe1xuXHRyZXR1cm4gYXJyYXlbTWF0aC5taW4oTWF0aC5tYXgociwwKSxycy0xKV1bTWF0aC5taW4oTWF0aC5tYXgoYywwKSxjcy0xKV07XG59XG5cbmZ1bmN0aW9uKiBib3hfaXRlcihyMCwgYzAsIHJhZGl1cyl7XG5cdGZvcihsZXQgcmw9MDsgcmw8MipyYWRpdXMrMTsgcmwrKyl7XG5cdFx0Zm9yKGxldCBjbD0wOyBjbDwyKnJhZGl1cysxOyBjbCsrKXtcblx0XHRcdHlpZWxkIFtyMCtybC1yYWRpdXMsIGMwK2NsLXJhZGl1cywgcmwsIGNsXTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJsdXIoYXJyYXksIHJzLCBjcywga2VybmVsX3JhZCl7XG5cdHJldHVybiBjb252b2x2ZShhcnJheSwgcnMsIGNzLCBndWFzc2lhbl9rZXJuZWwoa2VybmVsX3JhZCkpO1xufVxuXG5mdW5jdGlvbiBjb252b2x2ZShhcnJheSwgcnMsIGNzLCBrZXJuZWwpe1xuXHRsZXQgcmFkaXVzID0gKGtlcm5lbC5sZW5ndGgtMSkvMjtcblx0bGV0IGFycmF5MiA9IFsuLi5BcnJheShycyldLm1hcChlID0+IEFycmF5KGNzKSk7XG5cblx0Zm9yKGxldCByPTA7IHI8cnM7IHIrKyl7XG5cdFx0Zm9yKGxldCBjPTA7IGM8Y3M7IGMrKyl7XG5cdFx0XHRhcnJheTJbcl1bY10gPSBbLi4uYm94X2l0ZXIocixjLCByYWRpdXMpXS5yZWR1Y2UoKHBhcnRpYWxTdW0sIFtyYiwgY2IsIHJsLCBjbF0pID0+IHBhcnRpYWxTdW0gKyBnZXQoYXJyYXksIHJiLGNiLCBycyxjcykqa2VybmVsW3JsXVtjbF0sIDApO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBhcnJheTI7XG59XG5cbi8vIGdpdmUgb2RkIHJhZGl1c1xuZnVuY3Rpb24gZ3Vhc3NpYW5fa2VybmVsKHJhZGl1cyl7XG5cdGxldCBuID0gMipyYWRpdXM7XG5cdGxldCBrZXJuZWwgPSBbLi4uQXJyYXkobisxKV0ubWFwKGUgPT4gQXJyYXkobisxKS5maWxsKDAuMCkpO1xuXHRmb3IobGV0IHI9MDsgcjw9bjsgcisrKXtcblx0XHRmb3IobGV0IGM9MDsgYzw9bjsgYysrKXtcblx0XHRcdGtlcm5lbFtyXVtjXSA9IGNob29zZShuLHIpICogY2hvb3NlKG4sYykgKiBNYXRoLnBvdygwLjUsIDIqbik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBrZXJuZWw7XG59XG5cbmZ1bmN0aW9uIGNob29zZShuLCByKXtcblx0aWYocj09biB8fCByPT0wKSByZXR1cm4gMTtcblx0cmV0dXJuIGNob29zZShuLTEsIHIpICsgY2hvb3NlKG4tMSwgci0xKVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVjMiB7XG5cdGNvbnN0cnVjdG9yKHgsIHkpIHsgdGhpcy54ID0geDsgdGhpcy55ID0geTt9XG5cblx0cGx1cyh2KSB7IHJldHVybiBuZXcgVmVjMih0aGlzLngrdi54LCB0aGlzLnkrdi55KTsgfVxuXHRzY2FsZWRCeShmKSB7IHJldHVybiBuZXcgVmVjMihmKnRoaXMueCwgZip0aGlzLnkpOyB9XG5cdG1pbnVzKHYpIHsgcmV0dXJuIHRoaXMucGx1cyh2LnNjYWxlZEJ5KC0xLjApKTsgfVxuXG5cdGRvdCh2KSB7IHJldHVybiB0aGlzLngqdi54ICsgdGhpcy55KnYueTsgfVxuXHRkMigpIHsgcmV0dXJuIHRoaXMuZG90KHRoaXMpOyB9XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiaW1wb3J0IERyYXdlciBmcm9tIFwiLi9kcmF3ZXJcIjtcbmltcG9ydCBHb2F0IGZyb20gXCIuL2dvYXRcIjtcbmltcG9ydCBUaWxlTWFwIGZyb20gXCIuL21hcFwiO1xuaW1wb3J0IFZlYzIgZnJvbSBcIi4vdmVjMlwiO1xuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKT0+e1xuXHRuZXcgTWFpbigpO1xufSk7XG5cbmNsYXNzIE1haW4ge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR3aW5kb3cubWFpbiA9IHRoaXM7XG5cblx0XHQvLyB0aW1lIHN0dWZmXG5cdFx0dGhpcy5jdXJyZW50X3RpbWUgPSBEYXRlLm5vdygpO1xuXHRcdHRoaXMub2xkX3RpbWUgPSB0aGlzLmN1cnJlbnRfdGltZTtcblx0XHR0aGlzLmR0ID0gMDtcblxuXHRcdC8vIGV2ZW50c1xuXHRcdHRoaXMuZXZlbnRfcXVldWUgPSBbXTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZSk9Pnt0aGlzLm1vdXNlZG93bihlKX0pO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIChlKT0+e3RoaXMubW91c2Vtb3ZlKGUpfSk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIChlKT0+e3RoaXMubW91c2V1cChlKX0pO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGJsY2xpY2tcIiwgKGUpPT57dGhpcy5kYmxjbGljayhlKX0pO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2VuZXJhdGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKT0+e1xuXHRcdFx0dGhpcy5ldmVudF9xdWV1ZS5wdXNoKFtlLFwiZ2VuZXJhdGVcIl0pO1xuXHRcdH0pO1xuXG5cdFx0Ly8gY2FudmFzIHN0dWZmXG5cdFx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKTtcblx0XHR0aGlzLmNhbnZhcy53aWR0aCA9IDE2MDA7XG5cdFx0dGhpcy5jYW52YXMuaGVpZ2h0PSAxMjAwO1xuXHRcdHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHRcdHRoaXMuY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZD0gZmFsc2U7XG5cdFx0dGhpcy5tYXQgPSB0aGlzLmN0eC5nZXRUcmFuc2Zvcm0oKTtcblxuXHRcdC8vIGdhbWUgc3R1ZmZcblx0XHRsZXQgbiA9IDI0O1xuXHRcdHRoaXMuZHJhd2VyID0gbmV3IERyYXdlcigyNCoyLTEpO1xuXG5cdFx0dGhpcy5tYXAgPSBuZXcgVGlsZU1hcCgyNCk7XG5cdFx0dGhpcy5tYXAucmVnaXN0ZXJfd2l0aF9kcmF3ZXIodGhpcy5kcmF3ZXIpO1xuXG5cdFx0dGhpcy5nb2F0ID0gbmV3IEdvYXQoMTAsIDEwLCB0aGlzLm1hcCwgdGhpcy5kcmF3ZXIpO1xuXG5cdFx0dGhpcy5zdGVwKCk7XG5cdH1cblxuXHRzdGVwKCkge1xuXHRcdHRoaXMuY3VycmVudF90aW1lID0gRGF0ZS5ub3coKS8xMDAwLjA7XG5cdFx0dGhpcy5kdCA9IHRoaXMuY3VycmVudF90aW1lIC0gdGhpcy5vbGRfdGltZTtcblx0XHR0aGlzLm9sZF90aW1lID0gdGhpcy5jdXJyZW50X3RpbWU7XG5cblx0XHR0aGlzLmRyYXcoKTtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdC8vIHJlc3RvcmUgdG8gZGVmYXVsdCB0cmFuc2Zvcm1hdGlvbnMgKEkgZG8gdGhpcyBub3cgc28gdGhhdCB0aGUgbWF0cml4IGZvciB0aGUgY2FudmFzIGlzIGdvb2QpXG5cdFx0dGhpcy5jdHgucmVzdG9yZSgpO1xuXG5cdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+dGhpcy5zdGVwKCkpO1xuXHR9XG5cblx0dXBkYXRlKCkge1xuXHRcdHRoaXMubWFwLnVwZGF0ZSh0aGlzLmV2ZW50X3F1ZXVlKTtcblxuXHRcdC8vIGV2ZW4gdGhvdWdoIHdlIGNsZWFyIHRoZSBldmVudCBxdWV1ZSBoZXJlIGFueXdheXMsIGRvIG1ha2UgYW4gZWZmb3J0IHRvIHBvcCBldmVudHNcblx0XHQvLyBvZmYgd2hlbiByZWFjdGluZyB0byB0aGVtLCBzbyB0aGF0IGV2ZW50cyBhcmVuJ3QgYWNjZXB0ZWQgYnkgbXVsdGlwbGUgdGhpbmdzXG5cdFx0Ly8gdW5pbnRlbnRpb25hbGx5LlxuXHRcdHRoaXMuZXZlbnRfcXVldWUubGVuZ3RoID0gMDtcblx0fVxuXG5cdGRyYXcoKSB7XG5cdFx0Ly8gcmVzZXQgY2FudmFzXG5cdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xuXHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXG5cdFx0Ly8gc2V0dXAgaW5pdGlhbCB0cmFuc2Zvcm1hdGlvbnNcblx0XHR0aGlzLmN0eC5zYXZlKCk7XG5cdFx0Ly8gdGhpcy5jdHgudHJhbnNsYXRlKDAsLTE3NSk7XG5cdFx0Ly8gdGhpcy5jdHguc2NhbGUoMS41LDEuNSk7XG5cblx0XHR0aGlzLm1hdCA9IHRoaXMuY3R4LmdldFRyYW5zZm9ybSgpO1xuXG5cdFx0dGhpcy5jdHgudHJhbnNsYXRlKDgwMCwgMTUwKTtcblx0XHR0aGlzLmN0eC5zY2FsZSgyLjAsMi4wKTtcblxuXHRcdC8vIGRyYXcgdGhpbmdzXG5cdFx0dGhpcy5kcmF3ZXIuZHJhdyh0aGlzLmN0eCk7XG5cdH1cblxuXHRtb3VzZWRvd24oZSl7XG5cdFx0ZS5wb3MgPSB0aGlzLmdldEN1cnNvclBvc2l0aW9uKGUpO1xuXHRcdHRoaXMuZXZlbnRfcXVldWUucHVzaChbZSxcIm1vdXNlZG93blwiXSk7XG5cdH1cblxuXHRtb3VzZXVwKGUpe1xuXHRcdGUucG9zID0gdGhpcy5nZXRDdXJzb3JQb3NpdGlvbihlKTtcblx0XHR0aGlzLmV2ZW50X3F1ZXVlLnB1c2goW2UsXCJtb3VzZXVwXCJdKTtcblx0fVxuXG5cdG1vdXNlbW92ZShlKXtcblx0XHRlLnBvcyA9IHRoaXMuZ2V0Q3Vyc29yUG9zaXRpb24oZSk7XG5cdFx0dGhpcy5ldmVudF9xdWV1ZS5wdXNoKFtlLFwibW91c2Vtb3ZlXCJdKTtcblx0fVxuXG5cdGRibGNsaWNrKGUpe1xuXHRcdGUucG9zID0gdGhpcy5nZXRDdXJzb3JQb3NpdGlvbihlKTtcblx0XHR0aGlzLmV2ZW50X3F1ZXVlLnB1c2goW2UsXCJkYmxjbGlja1wiXSk7XG5cdH1cblxuXHRnZXRDdXJzb3JQb3NpdGlvblJhdyhlKSB7XG5cdFx0bGV0IHJlY3QgPSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRsZXQgeCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcblx0XHRsZXQgeSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuXHRcdHJldHVybiBuZXcgVmVjMih4LHkpO1xuXHR9XG5cblx0Z2V0Q3Vyc29yUG9zaXRpb24oZSkge1xuXHRcdHJldHVybiB0aGlzLmdldFRyYW5zZm9ybWVkKHRoaXMuZ2V0Q3Vyc29yUG9zaXRpb25SYXcoZSkpO1xuXHR9XG5cblx0Z2V0VHJhbnNmb3JtZWQodikge1xuXHRcdGxldCBtID0gdGhpcy5tYXQ7XG5cdFx0bGV0IGRldF9pbnYgPSAxLjAvKG0uYSptLmQgLSBtLmIqbS5jKTtcblx0XHQvLyB3ZSBuZWVkIHRvIGRvIGludmVyc2Ugb2YgbSwgd2hpY2ggaSd2ZSBkb25lIGJ5IGhhbmRcblx0XHRyZXR1cm4gbmV3IFZlYzIoXG5cdFx0XHQobS5kICogKHYueCAtIG0uZSkgLSBtLmMgKiAodi55IC0gbS5mKSkgKiBkZXRfaW52LFxuXHRcdFx0KC1tLmIgKiAodi54IC0gbS5lKSArIG0uYSAqICh2LnkgLSBtLmYpKSAqIGRldF9pbnZcblx0XHQpO1xuXHR9XG59XG5cbmNsYXNzIEJhY2tncm91bmQge1xuXHRjb25zdHJ1Y3RvcihzcmMpe1xuXHRcdHRoaXMuaW1nID0gbmV3IEltYWdlKCk7XG5cdFx0dGhpcy5pbWcuc3JjID0gc3JjO1xuXHR9XG5cblx0ZHJhdyhjdHgpIHtcblx0XHRjdHguc2F2ZSgpO1xuXG5cdFx0Y3R4LnNjYWxlKDAuMiwgMC4yKTtcblx0XHRjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCAwLCAwKTtcblxuXHRcdGN0eC5yZXN0b3JlKCk7XG5cdH1cbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=