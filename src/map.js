import tile_image_src from "./assets/grassTile.png";

export default class TileMap {
	constructor() {
		this.tile_image = new Image();
		this.tile_image.src = tile_image_src;
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