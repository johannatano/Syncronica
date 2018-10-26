
import {TweenLite, EasePack} from 'gsap';

export default class LineData{
	constructor() {

		this.p1 = {x: 0, y:0};
		this.p2 = {x: 0, y: 0};
		this.alpha = this.targetAlpha = 0;
		this.deactivate();
	}	
	set(p1, p2, delay, sequential){
		// if(delay == 10)console.log(p1, p2)
		this.p1_target = p1;
		this.p2_target = p2;



		sequential = true;

		if(!sequential){
			//hard set
			this.p1.x = this.p1_target.x;
			this.p1.y = this.p1_target.y;
			this.p2.x = this.p2_target.x;
			this.p2.y = this.p2_target.y;
		}

		// var step = 1/2000;
		// var Ease = Cubic;
		// if(!sequential){
		// 	delay = 0;
		// 	step = 1;
		// 	Ease = Sine;
		// }
		// TweenLite.killTweensOf(this.p1);
		// TweenLite.killTweensOf(this.p2);
		// TweenLite.to(this.p1, step/2, {
		// 	x: p1.x,
		// 	y: p1.y,
		// 	delay: delay*step,
		// 	ease: Ease.easeIn,
		// 	onComplete: function(){
		// 		TweenLite.to(this.p2, step/2, {
		// 			x: p2.x,
		// 			y: p2.y,
		// 			ease: Ease.easeOut
		// 		});
		// 	}.bind(this)});
		this.activate();
		
	}

	activate(){
		let useEase = false;
		if(this.active) return;
		this.active = true;
		this.targetAlpha = 1;
		this.initialRender = true;
		//hard set firs time
		// this.p1.x = this.p1_target.x;
		// this.p1.y = this.p1_target.y;

		// this.p2.x = this.p2_target.x;
		// this.p2.y = this.p2_target.y;

		// console.log('ACTIVATE');
		// this.p1.x = 0;//this.p1_target.x;
		// this.p1.y = 0;//this.p1_target.y;
		// this.p2.x = 0;//this.p2_target.x;
		// this.p2.y = 0;//this.p2_target.y;
	}

	deactivate(){
		this.active = false;
		this.targetAlpha = 0;
		this.p1 = {x: 0, y:0};
		this.p2 = {x: 0, y: 0};
		this.p1_target = null;
		this.p2_target = null;
	}

	tick(){
		const ease = .05;

		if(this.p1_target){
			this.p1.x += (this.p1_target.x - this.p1.x) * ease * 4;
			this.p1.y += (this.p1_target.y - this.p1.y) * ease * 4;
		}

		if(this.p2_target){
			this.p2.x += (this.p2_target.x - this.p2.x) * ease;
			this.p2.y += (this.p2_target.y - this.p2.y) * ease;
		}

		this.alpha += (this.targetAlpha - this.alpha) * ease;
		// if(this.active){
		// 	if(this.targetAlpha != this.minAlpha) this.alpha+=.1;
		// 	else this.alpha-=1;

		// 	if(Math.round(this.alpha*100)/100 == Math.round(this.targetAlpha*100)/100){
		// 		this.targetAlpha = this.targetAlpha != this.minAlpha ? this.minAlpha : 100;
		// 	}
		// 	// console.log(this.alpha, this.targetAlpha);
		// 	this.alpha += (this.targetAlpha - this.alpha) *.2;
		// 	this.alpha = 100;//(this.targetAlpha - this.alpha) *.2;
		// 	// this.alpha = Math.max(this.minAlpha, this.alpha);
		// 	if(this.p1_target){
		// 		this.p1.x += (this.p1_target.x - this.p1.x) *.2;
		// 		this.p1.y += (this.p1_target.y - this.p1.y) *.2;
		// 	}
		// 	if(this.p2_target){
		// 		this.p2.x += (this.p2_target.x - this.p2.x) *.2;
		// 		this.p2.y += (this.p2_target.y - this.p2.y) *.2;
		// 	}
		// 	// this.gfx.visible = true;
		// 	// this.gfx.clear();
		// 	// this.gfx.lineStyle(1, 0xffffff, this.lifetime/this.maxlifetime);
		// 	// // console.log('FADE', this.lifetime/this.maxlifetime);
		// 	// this.gfx.moveTo(this.p1.x, this.p1.y);
		// 	// this.gfx.lineTo(this.p2.x, this.p2.y);
		// }else{
		// 	this.active = false;
		// 	// this.targetAlpha = 0;
		// 	// this.gfx.visible = false;
		// }
		// return this.lifetime;
	}
}
