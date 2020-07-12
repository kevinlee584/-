function order(x) {
	if(x === 0) return 1;
	if(x === 1) return 1;
	else return x * order(x - 1);
}

class DataGenerator {
	constructor(XYBar, examF) {
		this["Lagrange"] = LagrangeMethod(XYBar);
		this["Newton"] = NewtonMethod(XYBar);
		this["Forward"] = ForwardMethod(XYBar);
		this["Backward"] = BackwardMethod(XYBar);
		if(examF === undefined)	this["Data"] = this.Lagrange;
		else this["Data"] = function(x_points) {return x_points.map(x => {return {x:x, y:examF(x)};});}; 
	}
	Gen(name, x_points) {
		return this[name](x_points)
	}

}

function LagrangeMethod(XYBar) {
	var method = function(x){
		let y = 0;

		for(let i = 0; i < XYBar.length; ++i) {
			let sum = XYBar[i].y;

			for(let j = 0; j < XYBar.length; ++j) {
				if(j === i) continue;
				sum *= (x - XYBar[j].x) / (XYBar[i].x - XYBar[j].x);
			}
			y += sum;
		}
		return y;
	}
	return function(x_points) {
		return x_points.map(x => {return {x: x, y:method(x)}});
	}
}

function NewtonMethod(XYBar) {
	let f_list = [];
	f_list.push(XYBar.map(m => {return m.y; }));

	for(let l = 1; l < XYBar.length; ++l) {
		let tmp = [];
		for(let i = 0; i < f_list[l-1].length - 1; ++i) {
			tmp.push((f_list[l - 1][i+1] - f_list[l-1][i]) / (XYBar[i+l].x - XYBar[i].x));
		}
		f_list.push(tmp);
	}
	console.log(f_list);

	var method = function(x) {
		let y = f_list[0][0]; 
		for(let i = 1; i < XYBar.length; ++i) {
			let sum = f_list[i][0];
			for(let j = 0; j < i; ++j) {
				sum *= (x - XYBar[j].x); 
			}
			y += sum;
		}
		return y;
	}

	return function(x_points) {
		return x_points.map(x => {return {x: x, y:method(x)}});
	}
}

function ForwardMethod(XYBar) {
	let f_list = [];
	f_list.push(XYBar.map(m => {return m.y; }));
	for(let i = 0; i < XYBar.length-1; ++i) {
		let tmp = [];
		for(let j = 0; j < f_list[i].length - 1; ++j) {
			tmp.push(f_list[i][j+1] - f_list[i][j]);
		}
		f_list.push(tmp);
	}

	var method = function(x) {
		let s = (x - XYBar[0].x) / (XYBar[1].x - XYBar[0].x);
		let y = f_list[0][0];
		for(let i = 1; i < XYBar.length; ++i) {
			let sum = f_list[i][0];
			for(let j = 0; j < i; ++j) {
				sum *= (s - j);
			}
			y += sum / order(i); 
		}
		return y;
	}

	return function(x_points) {
		return x_points.map(x => {return {x: x, y:method(x)}});
	}
}

function BackwardMethod(XYBar) {
	let f_list = [];

	f_list.push(XYBar.map(m => {return m.y; }));
	for(let i = 0; i < XYBar.length-1; ++i) {
		let tmp = [];
		for(let j = 0; j < f_list[i].length -1 ; ++j) {
			tmp.push(f_list[i][j+1] - f_list[i][j]);
		}
		f_list.push(tmp);
	}

	var method = function(x) {
		let s = (x - XYBar[XYBar.length-1].x) / (XYBar[1].x - XYBar[0].x);
		let t = XYBar.length - 1;
		let y = f_list[0][t--];

		for(let i = 1; i < XYBar.length; ++i) {
			let sum = f_list[i][t--];
			for(let j = 0; j < i; ++j) {
				sum *= (s + j);
			}
			y += sum / order(i);
		}
		return y;
	}

	return function(x_points) {
		return x_points.map(x => {return {x: x, y:method(x)}});
	}
}
