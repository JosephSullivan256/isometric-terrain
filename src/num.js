
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

export function blur(array, rs, cs, kernel_rad){
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
