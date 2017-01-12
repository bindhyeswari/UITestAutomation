import uuid from 'uuid';

/**
 * @property {private} connectedPorts
 * @description Map of port names (arbit) to tab ids
 * */
let connectedPorts = {};
let logs = {};

/**
 * Handles the start recording
 * */
export function recordStartHandler(event, tab) {
    console.log('Started recording on tab: ' + tab.id + '. Will connect to tab now.');
    portConnectToTab(tab, (err, port, portName) => {
        // Handle incoming messages here
        port.onMessage.addListener((msg) => {
            console.log(msg, port);

            // handle data based on events

            switch (msg.event) {
                case 'input':
                    logs[portName] = logs[portName] || [];
                    logs[portName].push(msg);
            }
        });
    });
}

export function portConnectToTab(tab, callback) {
    // check if the port exists and is open
    // todo: is port open
    let connectedPort = connectedPorts[tab.id];
    if (connectedPort) {/*
        console.log('Port is already connected: ', connectedPort);
    } else {*/
        // create a new port for communications
        const portName = tab.id;
        let port = chrome.tabs.connect(tab.id, {
            name: portName
        });
        port.tab_id = tab.id;
        if (callback) {
            if (port) {
                callback(null, port, portName);
            } else {
                callback({
                    message: 'Port connection could not be established.'
                });
            }
        }
        connectedPorts[tab.id] = port;
        connectedPorts[portName] = port;

        console.log('connectedPorts: ', connectedPorts);
    }
}

export function printEventLog(event, tab) {
    if (connectedPorts[tab.id]) {
        let port = connectedPorts[tab.id];
        const logid = port.name;
        port.postMessage({
            event: 'printLogs',
            logs: logs[logid]
        });
        console.log(logs[logid]);
    }
}

export function downloadEventLog(event, tab) {
    if (connectedPorts[tab.id]) {
        let port = connectedPorts[tab.id];
        const logid = port.name;
        port.postMessage({
            event: 'downloadLogs',
            logs: logs[logid]
        });
        console.log(logs[logid]);
    }
}



