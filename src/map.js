import grass_tile_src from "./assets/grassTileTall.png";
import tree_tile_src from "./assets/treeTileTall.png";
import water_tile_src from "./assets/waterTileTall.png";
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
		this.height_map = blur(this.height_map, this.n, this.n, 3);
		this.height_map = blur(this.height_map, this.n, this.n, 3);
		this.height_map = blur(this.height_map, this.n, this.n, 3);

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
		grass_tile.src = grass_tile_src;

		let tree_tile = new Image();
		tree_tile.src = tree_tile_src;

		let water_tile = new Image();
		water_tile.src = water_tile_src;

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