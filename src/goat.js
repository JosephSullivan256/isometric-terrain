import goat_src from "./assets/goat.png";

export default class Goat{
	constructor(r,c, map, drawer){
		this.r = r;
		this.c = c;
		this.map = map;

		this.goat = new Image();
		this.goat.src = goat_src;
		
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