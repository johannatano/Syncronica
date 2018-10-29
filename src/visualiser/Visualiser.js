
import EventEmitter from 'eventemitter3';

import dat from 'dat.gui';
import * as PIXI from 'pixi.js'

import PlanetData from './data';
import LineData from './LineData';
import Planet from './Planet';

import Stats from 'stats.js';

export default class Visualiser extends EventEmitter{
	constructor() {
		super();
		this.inputs = {};
		this.solfeggio = {'1': 174, '2': 285, '2': 396, '3': 417, '4': 528, '5': 639, '6': 741, '8': 852, '9': 963};
		this.init();
	}	

	init(){


		this.stats = new Stats();
  		this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  		// document.body.appendChild( this.stats.dom );

		this.initGraphics();
		this.initSettings();
		this.addEventListeners();
		this.fps = 60;  // User-configurable
		this.before = Date.now();
		this.scaleVal = 1;
		this.time = 0;
		this.rotationTime = 0.1;
		this.setCurrentPlanet(0);
		this.changeFrequency(this.settings.frequency);
		this.chakras = [];
		this.chakraIndex = 0;
		for(var i in this.solfeggio){
			this.chakras.push(i);
		}
		this.clear();
		this.tick();


		this.lastSampled = new Date().getTime();
		this.sampleInterval = 2000;
		
	}

	initSettings(){

		this.inputData = {
			excitement: 1,
			concentration: 1
		}

		this.settings = {
			lineOpacity: 0.75,
			years: 50,
			frequency: 147,
			heroplanet: 2,
			drawspeed: 10,
		}

		
		// var gui = new dat.gui.GUI();
		// var obj = {'Hero Planet': null, 'Connect Muse': ()=>{
		// 	this.emit('connect-muse');
		// }};
		// gui.add(obj, 'Connect Muse');
		// var planets = gui.add(obj, 'Hero Planet', { Choose:'', Mercury: 0, Venus: 1,  Earth: 2, Mars: 3, Jupiter: 4, Saturn: 5, Uranus: 6, Neptunus: 7, Pluto: 8 } );
		// planets.onChange(function(val){
		// 	this.settings.heroplanet = val;
		// 	this.setCurrentPlanet(this.currentPlanet);
		// }.bind(this));
		// var lineOpacity = gui.add(this.settings, 'lineOpacity').min(0.1).max(1).step(0.01);
		// var years = gui.add(this.settings, 'years').min(1).max(1000).step(1);
		// var frequency = gui.add(this.settings, 'frequency').min(1).max(1000).step(1);
		// var drawspeed = gui.add(this.settings, 'drawspeed').min(1).max(50).step(1);
		// years.onChange(function(val){
		// 	// this.changeFrequency(this.settings.frequency);
		// }.bind(this));
	}

	initGraphics(){
		this.viewport = {w: window.innerWidth, h: window.innerHeight};
		this.pixiApp = new PIXI.Application(window.innerWidth, window.innerHeight, { antialias: true, forceFXAA: true });
		document.body.appendChild(this.pixiApp.view);
		this.lines = [];
		this.lineIndex = 0;

		this.drawIndex = 0;
		this.MAX_LINES = 1000;
		for(var i = 0; i < this.MAX_LINES; i++){
			this.lines.push(new LineData(i));
		}
		this.gfx = new PIXI.Graphics();
		this.gfx.x = this.viewport.w*.5;
		this.gfx.y = this.viewport.h*.5;
		this.pixiApp.stage.addChild(this.gfx);
		this.planets = [];
		this.planetContainer = new PIXI.Container();
		for(var key in PlanetData){
			var planet = new Planet(PlanetData[key]);
			this.planetContainer.addChild(planet.gfx);
			this.planets.push(planet);
		}

		this.planetContainer.x = this.viewport.w*.5;
		this.planetContainer.y = this.viewport.h*.5;
		this.pixiApp.stage.addChild(this.planetContainer);
	}

	addEventListeners() {
		$(document).on('keydown', function(e){
			switch(e.which){
				case 77:
					this.setCurrentPlanet(0);
				break;
				case 38:
					if(e.shiftKey){
						if(this.chakraIndex < this.chakras.length - 1) this.chakraIndex++;
						else this.chakraIndex = 0;
						var chakra = this.chakras[this.chakraIndex];
						this.changeFrequency(this.solfeggio[chakra]);
					}else{
						this.changeFrequency(Number(this.settings.frequency)+1);
					}
				break;
				case 40:
				if(e.shiftKey){
						if(this.chakraIndex > 0) this.chakraIndex--;
						else this.chakraIndex = this.chakras.length - 1;
						var chakra = this.chakras[this.chakraIndex];
						this.changeFrequency(this.solfeggio[chakra]);
					}else{
						if(this.settings.frequency > 0) this.changeFrequency(Number(this.settings.frequency)-1);
					}
				break;
				case 39:
					if(this.currentPlanet < 8) this.setCurrentPlanet(this.currentPlanet+1);
					else this.setCurrentPlanet(0);
				break;
				case 37:
					if(this.currentPlanet > 0) this.setCurrentPlanet(this.currentPlanet-1);
					else this.setCurrentPlanet(8);
				break;
			}
		}.bind(this));
		
	}


	// input(data){
	// 	// console.log(val);
	// 	// this
	// 	var frequency = data.concentration * 100;
	// 	var diff = this.settings.frequency - frequency;

	// 	// console.log(frequency);

	// 	if(Math.abs(diff) > 100) this.changeFrequency(frequency);
		
	// }

	setCurrentPlanet(index){
		this.currentPlanet = index;
		var planet = this.planets[this.currentPlanet];
		var rel = this.planets[this.settings.heroplanet];//(this.currentPlanet);
		for(var i = 0; i < this.planets.length; i++){
			this.planets[i].normalize(rel);
		}
		$('h1').text(planet.data.name);

		// this.drawAll(this.currentPlanet, this.settings.heroplanet);
		this.draw(this.currentPlanet, this.settings.heroplanet, this.lines.length);
		// this.changeFrequency(this.settings.frequency)
	}

	changeFrequency(val){
		var fmax = 1000;
		this.settings.frequency = Math.max(Math.min(val, fmax - 1), 1);

		// var chakraStr = '';
		// for(var i in this.solfeggio){
		// 	var chakra = this.solfeggio[i]
		// 	if(val == chakra) chakraStr = ' (' + i + ')';
		// }
		$('.years').html('Years: <span>' + Math.floor(this.settings.years*(1 + this.inputData.concentration)) + '</span>');
		$('.frequency').html('Draw frequency: <span>' + Math.floor(this.settings.frequency) + 'Hz </span>');

		this.drawIndex = 0;
		this.draw(this.currentPlanet, this.settings.heroplanet, 1);
		
	}


	draw(planet1, planet2, s){
		var f = this.settings.frequency/100;//normalize to fit scale 0-1000
		var delta = 360/f;//2;//360/f;//360 degrees per year -> how many degrees incr per line

		// console.log(this.inputData.concentration);
		var numLines = Math.floor(Math.min((this.settings.years*f*(1 + this.inputData.concentration)), this.MAX_LINES));
		// let drawSequentially = true;
		// if(drawSequentially){
		// console.log(numLines);


		var speed = s ? s : Math.ceil((numLines/(this.lines.length-1)) * this.settings.drawspeed);
			// console.log(numLines, speed);
		// console.log(f, delta, numLines);
			// if(numLines == this.MAX_LINES) console.log('MAX LINES HIT');
		// console.log('DRAW', this.settings.drawspeed);
		for(var i = 0; i < speed; i++){
			// const index = 
			const line = this.lines[this.drawIndex];
			var p1 = this.planets[planet1].render(delta*this.drawIndex, true);
			var p2 = this.planets[planet2].render(delta*this.drawIndex, true);
			line.spawn(p1, p2);
			this.drawIndex++;
			if(this.drawIndex >= numLines){
				this.drawIndex = 0;
				for(var j = numLines; j < this.lines.length; j++){
					// console.log(j);
					this.lines[j].kill();
				}
			}
		}
			// console.log(this.drawIndex);
		// }
		
		// for(var i = 0; i < this.lines.length; i++){
		// 	if(i < numLines){
		// 		var p1 = this.planets[planet1].render(delta*i, true);
		// 		var p2 = this.planets[planet2].render(delta*i, true);
		// 		this.lines[i].set(p1, p2, i);
		// 	}else{
		// 		this.lines[i].deactivate();
		// 	}
		// }
		// if(numLines >= this.MAX_LINES) console.log('MAX LINES LENGTH!!!');
		this.renderLines();
	}

	drawAll(planet1, planet2){
		var f = this.settings.frequency/100;//normalize to fit scale 0-1000
		var delta = 360/f;//360 degrees per year -> how many degrees incr per line
		var numLines =  Math.min(f * this.settings.years * (1 + this.inputData.concentration), this.MAX_LINES);
		this.drawIndex = 0;
		// console.log('DRAW ALL', numLines);
		for(var i = 0; i < numLines; i++){
			if(!this.alpha) continue;
			var p1 = this.planets[planet1].render(delta*i, true);
			var p2 = this.planets[planet2].render(delta*i, true);
			this.lines[i].spawn(p1, p2, i);
		}
		this.renderLines();
	}


	// setLine(){

	// }

	clear(){
		for(var i = 0; i < this.planets.length; i++){
			this.planets[i].reset();
		}
	}


	

	tick(){

		this.stats.begin();

		var now = new Date().getTime();
      	var step = now - this.lastSampled;

      	for(var i in this.inputs){
			const {concentration, excitement} = this.inputs[i].values;
			if(excitement) this.inputData.excitement += (excitement - this.inputData.excitement) *.01;
			if(concentration) this.inputData.concentration += (concentration - this.inputData.concentration) *.01;
		}

		
		var frequency = this.inputData.concentration*1000;//Math.max((this.inputData.concentration * 50)/1000, 1);
		// console.log(frequency);

		if(Math.abs(frequency- this.settings.frequency) > 100) this.changeFrequency(frequency);

		// if(step >= this.sampleInterval) {
	 //      // fn.call();
	 //      // console.log('SHOULD SAMPLE');
	 //      	// console.log();
		// 	// var frequency = (Math.round(this.inputData.concentration*10)/10) * 1000;
		// 	var frequency = this.inputData.concentration * 1000;
		// 	// var diff = this.settings.frequency - frequency;
		// 	// this.settings.frequency = frequency;//Math.random()*1000;//frequency;
		// 	this.changeFrequency(frequency);

	 //      this.lastSampled = new Date().getTime();

	      
	      
	 //    }

	    $('.val').css('height', this.inputData.concentration*100 + '%');
	    // console.log(this.inputData.concentration);
		// console.log(this.settings.frequency);

		// this.settings.frequency = frequency;//Math.round(frequency/10)*10;
		// console.log(frequency);
		// console.log(this.inputData.concentration);

		this.draw(this.settings.heroplanet, this.currentPlanet);

		this.stats.end();
	    this.timer = requestAnimationFrame(this.tick.bind(this));
	}


	addInputData(id, input){
		this.inputs[id] = input;
	}

	parseInputData(data){

		// var data = 
		// console.log(this.inputs);
		this.inputs['eegReadings'].parseDataArray(data);

		// for(let key in data){
		// 	if(this.inputs[key]) this.inputs[key].parseData(data[key]);
		// }
	}

	renderLines(){
		var l = this.lines.length;
		var line;
		this.gfx.clear();

		var alphaConcentration = Math.max(this.inputData.concentration*.5, 0.1);
		var intensity = (this.settings.lineOpacity * (1-alphaConcentration));
		while(l > 0, l--){
				line = this.lines[l];
				line.tick();

				var max = 1;
				// line.alpha = this.settings.lineOpacity;
				var c = 0xffffff;//l < max ? 0xff0000 : 0xffffff;
				var d = 1;//l < max ? 10 : 1;
				if(line.alpha){
					
					var a = line.alpha*intensity;//Math.max(.2, (line.alpha/100)*.1);
					this.gfx.lineStyle(d, c, a);
					this.gfx.moveTo(line.p1.x, line.p1.y);
					this.gfx.lineTo(line.p2.x, line.p2.y);
				}
		}

		// console.log(intensity);
		this.emit('rendered', {intensity: intensity, freq: this.settings.frequency, years: this.settings.years*(1+this.inputData.concentration), planet: this.currentPlanet});
	}

}


