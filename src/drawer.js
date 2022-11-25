
export default class Drawer{
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