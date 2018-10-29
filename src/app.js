/**
 * Created by glenn on 29.02.16.
 * Last updated on 17.10.18.
 */

import $ from 'jquery';
import { identity } from 'lodash';
import './styles.css';

import Visualiser from './visualiser/Visualiser';
import Muse from './input/Muse';
import MuseData from './input/MuseData';
import Stats from 'stats.js';

import io from 'socket.io-client';


window.requestInterval = function(fn, delay) {


  if( !window.requestAnimationFrame       && 
    !window.webkitRequestAnimationFrame && 
    !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
    !window.oRequestAnimationFrame      && 
    !window.msRequestAnimationFrame)
      return window.setInterval(fn, delay);
      
  var start = new Date().getTime(),
    handle = new Object();
    
  function loop() {
    var current = new Date().getTime(),
      delta = current - start;
      
    if(delta >= delay) {
      fn.call();
      start = new Date().getTime();
    }

    handle.value = requestAnimFrame(loop);
  }
}


$(() => {
  var muse = new Muse();
  var museData = new MuseData();
  
  var visualiser = new Visualiser();
  visualiser.addInputData('eegReadings', museData);

  visualiser.on('connect-muse', ()=>{
    muse.connect();
  });

  visualiser.on('rendered', (data)=>{
    socket.emit('vis-data', data);
  });

  const socket = io('http://localhost:3000');

  socket.on('osc', (data) => {
    // console.log('osc data', data);
    
    visualiser.parseInputData(data);
  });

  socket.on('transport', (data) => {
    console.log('transport datda', data);
    // visualiser.parseInputData(data);
  });

  
  // this.socket = io('http://localhost:3000');
  //   this.socket.on('connect', this.onConnected.bind(this));
  //   this.socket.on('disconnect', this.onDisconnect.bind(this));

  // $('.connect').on('click', ()=>{
    
  // })
 
});

/*

(window as any).connect = async () => {
    const graphTitles = Array.from(document.querySelectorAll('.electrode-item h3'));
    const canvases = Array.from(document.querySelectorAll('.electrode-item canvas')) as HTMLCanvasElement[];
    const canvasCtx = canvases.map((canvas) => canvas.getContext('2d'));

    graphTitles.forEach((item, index) => {
        item.textContent = channelNames[index];
    });

    function plot(reading: EEGReading) {
        const canvas = canvases[reading.electrode];
        const context = canvasCtx[reading.electrode];
        if (!context) {
            return;
        }
        const width = canvas.width / 12.0;
        const height = canvas.height / 2.0;
        context.fillStyle = 'green';
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < reading.samples.length; i++) {
            const sample = reading.samples[i] / 15.;
            if (sample > 0) {
                context.fillRect(i * 25, height - sample, width, sample);
            } else {
                context.fillRect(i * 25, height, width, -sample);
            }
        }
    }

    const client = new MuseClient();
    client.connectionStatus.subscribe((status) => {
        console.log(status ? 'Connected!' : 'Disconnected');
    });

    try {
        client.enableAux = true;
        await client.connect();
        await client.start();
        document.getElementById('headset-name')!.innerText = client.deviceName;
        client.eegReadings.subscribe((reading) => {
            plot(reading);
        });
        client.telemetryData.subscribe((reading) => {
            document.getElementById('temperature')!.innerText = reading.temperature.toString() + '℃';
            document.getElementById('batteryLevel')!.innerText = reading.batteryLevel.toFixed(2) + '%';
        });
        client.accelerometerData.subscribe((accel) => {
            const normalize = (v: number) => (v / 16384.).toFixed(2) + 'g';
            document.getElementById('accelerometer-x')!.innerText = normalize(accel.samples[2].x);
            document.getElementById('accelerometer-y')!.innerText = normalize(accel.samples[2].y);
            document.getElementById('accelerometer-z')!.innerText = normalize(accel.samples[2].z);
        });
        await client.deviceInfo().then((deviceInfo) => {
            document.getElementById('hardware-version')!.innerText = deviceInfo.hw;
            document.getElementById('firmware-version')!.innerText = deviceInfo.fw;
        });
    } catch (err) {
        console.error('Connection failed', err);
    }
};*/