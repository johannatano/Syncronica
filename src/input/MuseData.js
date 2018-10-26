
export default class MuseData {
	constructor() {
		this.alphaBins = [0];
		this.betaBins = [1,2];
		this.sensors = [];
		for(let i = 0; i < 4; i++){
			this.sensors[i] = {
				bands: {
					beta:[],
					alpha: []
				}
			};
		}
		this.SAMPLING_LEN = 10;
		this.values = {
			concentration: 0,
			excitement: 0
		}
	}	
	parseData(reading){
		// console.log('read', reading);
		let sensor = this.sensors[Number(reading.electrode)];
		if(!sensor) return;

		
		var betaTotal = this.getSumOfArr(reading.samples, this.betaBins);
		if(betaTotal) sensor.bands.beta.push(Math.log(betaTotal));
		while(sensor.bands.beta.length > this.SAMPLING_LEN) sensor.bands.beta.shift();
		this.values.concentration = this.calculateConcentration();

		var alphaTest = this.getSumOfArr(reading.samples, this.alphaBins);

		if(alphaTest) sensor.bands.alpha.push(Math.log(alphaTest));
		while(sensor.bands.alpha.length > this.SAMPLING_LEN) sensor.bands.alpha.shift();
		this.values.excitement = this.calculateExcitement();
	}
	calculateConcentration(){
		var val = 0;
		val += this.mean(this.sensors[1].bands.beta);
		val += this.mean(this.sensors[2].bands.beta);
		return val/2;
	}

	calculateExcitement(){
		var val1 = this.mean(this.sensors[1].bands.alpha);
		var val2 = this.mean(this.sensors[2].bands.alpha);
		return Math.abs(val1-val2)/2;
	}

	getSumOfArr(arr, indexes){
		var s = 0;
		for(var i = 0; i < arr.length; i++){
			if(indexes && indexes.indexOf(i) == -1) continue;
			var v = arr[i];
	      if(v) s += v;//sensors[reading.electrode].values[i];
	  }
	  return s;
	}
	mean(arr){
		var s = 0;
		for(var i = 0; i < arr.length; i++){
			var v = arr[i];
	      if(v) s += v;//sensors[reading.electrode].values[i];
	  }
	  return s/arr.length;
	}
}
