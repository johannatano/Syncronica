
export default class Planet{
	constructor(data) {
		this.gfx = new PIXI.Container();
		var dot = new PIXI.Graphics();
	 	dot.beginFill(data.index == 2 ? 0xff0000 : 0xffffff);
	 	dot.drawCircle(10, 10, 10);
	 	dot.endFill();
	 	// this.gfx.addChild(dot);
	 	this.data = data;
	}	


	draw(){
		var pos = this.calcPosAt(this.data.angle);
		this.gfx.x = pos.x;
		this.gfx.y = pos.y;
	}


	reset(){
		this.data.angle = 0;
	}
	normalize(ref){
		this.data.normalizedSpeed = ( ref.data.speed / this.data.speed  );
		this.data.zoom = 1;//( this.data.radius / ref.data.radius );
	}
	render(delta, silent){
		var angle = this.data.angle + (delta * this.data.normalizedSpeed);
		var pos = this.calcPosAt(angle);
		if(!silent){
			this.data.angle = angle;
		}
		return pos;
	}


	calcPosAt(angle){
		var degToRad = Math.PI / 180;
		var scale = 0.0000019;
		var x = Math.cos(angle * degToRad) * Math.max((this.data.radius * scale * this.data.zoom), 0);
		var y = Math.sin(angle * degToRad) * Math.max( (this.data.radius * scale * this.data.zoom), 0);
		return {x: x, y: y};
	}
}