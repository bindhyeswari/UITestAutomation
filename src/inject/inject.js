import CSSUtils from './css_path';
import {listen, broadcast} from '../modules/chromeUtilities';
import {listenToClickEvents} from './clickEvents';
import {generateLog} from '../modules/Logger';
import uuid from 'uuid';
import * as EventListeners from './EventListeners/index';
import * as Handlers from './Handlers';

let recentContextElement;

/**
 * Listen to incoming port connections
 * */

let _ref_messageBG;

chrome.runtime.onConnect.addListener(function(port) {
	console.log('Received connection request with details: ', port);
	_ref_messageBG = port.postMessage.bind(port);

	port.postMessage({
		message: 'Hello world from the inject.js script to background.js ...'
	});
	port.onMessage.addListener(function(msg) {
		console.log('This is the message coming from the backend... ', msg);
		switch(msg.event) {
			case 'downloadLogs':
				console.log('document is: ', document);
                Handlers.handleDownloadLog(msg, document);
		}
	});
});

function messageBG(callback, message) {
	if (_ref_messageBG) {
		_ref_messageBG(message);
		callback(null, true);
	} else {
		callback({
			message: 'Could not find a reference to _ref_message'
		}, false);
	}
}



console.log('Hello world from inject.js');

(function () {
	console.log("Hello. This message was sent from scripts/inject.js");

	// add handler for a click event
	document.addEventListener('click', (event) => {
		console.log(event.target);
		let path = CSSUtils.cssPath(event.target);
		console.log(path);

		
		// send information to the background js about the click
		messageBG((err) => {
			if (err) console.error('Could not find a reference to the port.');
		}, {
            event: 'input',
            data: {
                selector: path,
                type: 'click'
            }
		});
	});

	// binding the callback if the port is connected
	const boundMessageToBG = messageBG.bind(null, (err) => {
        if (err) console.error('Could not find a reference to the port.');
	});

	EventListeners.focusout(boundMessageToBG);
	EventListeners.keypress(boundMessageToBG);

}());

/*
chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
	/!*console.log('Context menu ui integration click: extension data', data);
	console.log('Context menu ui integration click: element');
	console.dir(recentContextElement);*!/
});*/
