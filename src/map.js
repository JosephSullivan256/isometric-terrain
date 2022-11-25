import tile_image_src from "./assets/grassTile.png";

export default class TileMap {
	constructor() {
		this.tile_image = new Image();
		this.tile_image.src = tile_image_src;
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