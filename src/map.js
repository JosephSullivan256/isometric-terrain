import grass_tile_src from "./assets/grassTileTall.png";
import tree_tile_src from "./assets/treeTileTall.png";
import { blur } from "./num";

function choose_random_index(frequencies, total){
	let ran = Math.floor(Math.random()*total)+1;
	let i = 0;

	while(ran>0){
		ran-=frequencies[i];
		i++;
	}

	return i-1;
}

export default class TileMap {
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
		this.height_map = blur(this.height_map, this.n, this.n, 5);
	}

	init_tile_map(){
		let grass_tile = new Image();
		grass_tile.src = grass_tile_src;

		let tree_tile = new Image();
		tree_tile.src = tree_tile_src;

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