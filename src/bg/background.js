import {Logger} from '../modules/Logger';
import {addListenerToUrlChanges, removeListenerFromUrlChanges} from '../modules/URLChange';
import {broadcast, listen} from '../modules/chromeUtilities';
import {recordStartHandler, printEventLog, downloadEventLog} from './contextMenuClickHandlers';

console.log('Hello world from UI Test Automation');
const loggerQueue = []; // An array of loggers


const CONTEXT_MENU_ITEM_ID = 'e0022ca2-5f1a-40e5-80f3-2ebf425fafaf';
let recording = false;
let logger;
let ports = [];
let callbacks = [];

/*//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });*/

chrome.contextMenus.create({
    "id": CONTEXT_MENU_ITEM_ID,
    "title": "Start Recording",
    "contexts": ["page", "selection", "image", "link"],
    "onclick" : recordStartHandler
});

chrome.contextMenus.create({
    "id": 'Print Logs',
    "title": "Print Logs",
    "contexts": ["page", "selection", "image", "link"],
    "onclick" : printEventLog
});

chrome.contextMenus.create({
    "id": 'Download Event Logs',
    "title": "Download Logs",
    "contexts": ["page", "selection", "image", "link"],
    "onclick" : downloadEventLog
});



function clickHandler(e, tab) {


    alert(JSON.stringify(e));


    // toggle text for recording

    chrome.contextMenus.update(CONTEXT_MENU_ITEM_ID, {
        'title': recording ? 'Start Recording' : 'Stop Recording'
    });
    recording = !recording;


    // create a new logger if recording
    if (recording) {
        logger = new Logger();
        // listen to url changes
    }
    let url = e.pageUrl;

    if (e.selectionText) {
        // The user selected some text, put this in the message.
        console.log('Selected Text: ', e.selectionText);
    }

    if (e.mediaType === "image") {
        console.log('Selected Image', e);
    }

    if (e.linkUrl) {
        // The user wants to buzz a link.
        console.log('Selected Link', e);
    }

    /*chrome.tabs.sendMessage(tab.id, {
        eventType: 'CSSPathGeneration',
        extensionClickEvent: e,
        recording: recording
    }, function(clickedEl) {
        elt.value = clickedEl.value;
    });*/
}

function getLogger() {
    return logger;
}

// START - add handler for incoming port connections
chrome.runtime.onConnect.addListener(function(port) {
    // alert(port.name);

    port.onMessage.addListener(function(msg) {

        switch (msg.event) {
            case 'input':
                console.log('received an input event: ', msg.event);
                port.postMessage({
                    id: msg.id,
                    status: 'SUCCESS'
                });
                break;
        }
        
        
        if (msg.action === 'getLogs') {
            
        } else if (msg.action === 'setLogs') {
            
        }
        
        if (msg.joke == "Knock knock")
            port.postMessage({question: "Who's there?"});
        else if (msg.answer == "Madame")
            port.postMessage({question: "Madame who?"});
        else if (msg.answer == "Madame... Bolety")
            port.postMessage({question: "I don't get it."});
    });
});
// END - add handler for incoming port connections




