
import EventEmitter from 'eventemitter3';
import { channelNames, EEGReading, MuseClient } from 'muse-js';

export default class Muse extends EventEmitter{
	constructor() {
		super();
		this.client = new MuseClient();
		this.client.connectionStatus.subscribe((status) => {
			console.log(status ? 'Connected!' : 'Disconnected');
		});
	}	
	connect(){
		this.client.enableAux = true;
		Promise.resolve()
		.then(()=> this.client.connect() )
		.catch(e => {
			console.log(e);
		})
		.then(()=> this.client.start() )
		.then(()=> {

			rawControlData

			this.client.rawControlData.subscribe((reading) => {
				console.log(reading);
			});

			this.client.eegReadings.subscribe((reading) => {
				// this.emit('muse-data', reading);
			});
		} )
	}
}


