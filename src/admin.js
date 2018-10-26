/**
 * Created by glenn on 29.02.16.
 * Last updated on 17.10.18.
 */

import $ from 'jquery';
import { identity } from 'lodash';
import './styles.css';
import { channelNames, EEGReading, MuseClient } from 'muse-js';
import Muse from './input/Muse';
import io from 'socket.io-client';

$(() => {
	var muse = new Muse();
	muse.on('muse-data', (data)=>{
		// muse.parseReading(data);
		socket.emit('transport', {eegReadings: data});
	});

	$('.connect').on('click', ()=>{
		muse.connect();
	})
	const socket = io('http://localhost:3000');
	socket.on('connect', () => {
	});
  	socket.on('disconnect', function(){});

});
