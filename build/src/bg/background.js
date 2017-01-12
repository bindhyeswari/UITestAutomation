/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Logger = __webpack_require__(1);

	var _URLChange = __webpack_require__(2);

	var _chromeUtilities = __webpack_require__(3);

	var _contextMenuClickHandlers = __webpack_require__(4);

	console.log('Hello world from UI Test Automation');
	var loggerQueue = []; // An array of loggers

	var CONTEXT_MENU_ITEM_ID = 'e0022ca2-5f1a-40e5-80f3-2ebf425fafaf';
	var recording = false;
	var logger = void 0;
	var ports = [];
	var callbacks = [];

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
	    "onclick": _contextMenuClickHandlers.recordStartHandler
	});

	chrome.contextMenus.create({
	    "id": 'Print Logs',
	    "title": "Print Logs",
	    "contexts": ["page", "selection", "image", "link"],
	    "onclick": _contextMenuClickHandlers.printEventLog
	});

	chrome.contextMenus.create({
	    "id": 'Download Event Logs',
	    "title": "Download Logs",
	    "contexts": ["page", "selection", "image", "link"],
	    "onclick": _contextMenuClickHandlers.downloadEventLog
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
	        logger = new _Logger.Logger();
	        // listen to url changes
	    }
	    var url = e.pageUrl;

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
	chrome.runtime.onConnect.addListener(function (port) {
	    // alert(port.name);

	    port.onMessage.addListener(function (msg) {

	        switch (msg.event) {
	            case 'input':
	                console.log('received an input event: ', msg.event);
	                port.postMessage({
	                    id: msg.id,
	                    status: 'SUCCESS'
	                });
	                break;
	        }

	        if (msg.action === 'getLogs') {} else if (msg.action === 'setLogs') {}

	        if (msg.joke == "Knock knock") port.postMessage({ question: "Who's there?" });else if (msg.answer == "Madame") port.postMessage({ question: "Madame who?" });else if (msg.answer == "Madame... Bolety") port.postMessage({ question: "I don't get it." });
	    });
	});
	// END - add handler for incoming port connections

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _class, _temp;

	exports.generateLog = generateLog;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function generateLog(eventType, details) {
	    return {
	        timestamp: new Date(),
	        eventType: eventType,
	        details: details
	    };
	}

	var Logger = exports.Logger = (_temp = _class = function () {
	    function _class() {
	        _classCallCheck(this, _class);

	        this.logs = [];
	        this.metadata = {
	            tabId: null,
	            startUrl: ''
	        };
	    }

	    _createClass(_class, [{
	        key: 'log',
	        value: function log(eventType, details) {
	            // logging event details
	            this.logs.push({
	                timestamp: new Date(),
	                eventType: eventType,
	                details: Object.assign({}, details)
	            });
	        }
	    }, {
	        key: 'printLog',
	        value: function printLog() {
	            var format = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

	            if (format) {
	                return this.logs.map(function (log) {
	                    var timestamp = log.timestamp;
	                    var eventType = log.eventType;
	                    var details = log.details;

	                    return '[' + timestamp.toDateString() + ']: ' + eventType + ' - ' + JSON.stringify(details);
	                }).join('\n');
	            }
	            return this.logs;
	        }
	    }, {
	        key: 'insertURLChangeLog',
	        value: function insertURLChangeLog(tabId, changeInfo, tab) {
	            console.log('inserted change log ... ');
	            this.log('urlChange', {
	                tabId: tabId,
	                changeInfo: changeInfo
	            });
	        }
	    }]);

	    return _class;
	}(), _class.eventTypes = ['urlChange', 'click', 'change'], _temp);

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.addListenerToUrlChanges = addListenerToUrlChanges;
	exports.removeListenerFromUrlChanges = removeListenerFromUrlChanges;

	/**
	 * Function that adds a listener to url changes
	 * */
	function addListenerToUrlChanges(callback) {
	    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	        callback(tabId, changeInfo, tab);
	        chrome.tabs.onUpdated.removeListener(callback);
	    });

	    chrome.tabs.onCreated.addListener(function (tab) {
	        callback(tabId, changeInfo, tab);
	        chrome.tabs.onCreated.removeListener(callback);
	    });
	}

	/**
	 * Function that removes a listener from the url changes
	 * */
	function removeListenerFromUrlChanges(callback) {
	    chrome.tabs.onUpdated.removeListener(function (tabId, changeInfo, tab) {
	        callback(tabId, changeInfo, tab);
	    });

	    chrome.tabs.onCreated.addListener(function (tab) {
	        callback(tabId, changeInfo, tab);
	    });
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.broadcast = broadcast;
	exports.listen = listen;
	function broadcast(obj, callback) {
	    chrome.runtime.sendMessage(obj, callback);
	}

	function listen(callback) {
	    chrome.runtime.onMessage.addListener(callback);
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.recordStartHandler = recordStartHandler;
	exports.portConnectToTab = portConnectToTab;
	exports.printEventLog = printEventLog;
	exports.downloadEventLog = downloadEventLog;

	var _uuid = __webpack_require__(5);

	var _uuid2 = _interopRequireDefault(_uuid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @property {private} connectedPorts
	 * @description Map of port names (arbit) to tab ids
	 * */
	var connectedPorts = {};
	var logs = {};

	/**
	 * Handles the start recording
	 * */
	function recordStartHandler(event, tab) {
	    console.log('Started recording on tab: ' + tab.id + '. Will connect to tab now.');
	    portConnectToTab(tab, function (err, port, portName) {
	        // Handle incoming messages here
	        port.onMessage.addListener(function (msg) {
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

	function portConnectToTab(tab, callback) {
	    // check if the port exists and is open
	    // todo: is port open
	    var connectedPort = connectedPorts[tab.id];
	    if (connectedPort) {
	        /*
	        console.log('Port is already connected: ', connectedPort);
	        } else {*/
	        // create a new port for communications
	        var portName = tab.id;
	        var port = chrome.tabs.connect(tab.id, {
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

	function printEventLog(event, tab) {
	    if (connectedPorts[tab.id]) {
	        var port = connectedPorts[tab.id];
	        var logid = port.name;
	        port.postMessage({
	            event: 'printLogs',
	            logs: logs[logid]
	        });
	        console.log(logs[logid]);
	    }
	}

	function downloadEventLog(event, tab) {
	    if (connectedPorts[tab.id]) {
	        var port = connectedPorts[tab.id];
	        var logid = port.name;
	        port.postMessage({
	            event: 'downloadLogs',
	            logs: logs[logid]
	        });
	        console.log(logs[logid]);
	    }
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	//     uuid.js
	//
	//     Copyright (c) 2010-2012 Robert Kieffer
	//     MIT License - http://opensource.org/licenses/mit-license.php

	// Unique ID creation requires a high quality random # generator.  We feature
	// detect to determine the best RNG source, normalizing to a function that
	// returns 128-bits of randomness, since that's what's usually required
	var _rng = __webpack_require__(6);

	// Maps for number <-> hex string conversion
	var _byteToHex = [];
	var _hexToByte = {};
	for (var i = 0; i < 256; i++) {
	  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
	  _hexToByte[_byteToHex[i]] = i;
	}

	// **`parse()` - Parse a UUID into it's component bytes**
	function parse(s, buf, offset) {
	  var i = (buf && offset) || 0, ii = 0;

	  buf = buf || [];
	  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
	    if (ii < 16) { // Don't overflow!
	      buf[i + ii++] = _hexToByte[oct];
	    }
	  });

	  // Zero out remaining bytes if string was short
	  while (ii < 16) {
	    buf[i + ii++] = 0;
	  }

	  return buf;
	}

	// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
	function unparse(buf, offset) {
	  var i = offset || 0, bth = _byteToHex;
	  return  bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]];
	}

	// **`v1()` - Generate time-based UUID**
	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html

	// random #'s we need to init node and clockseq
	var _seedBytes = _rng();

	// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	var _nodeId = [
	  _seedBytes[0] | 0x01,
	  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
	];

	// Per 4.2.2, randomize (14 bit) clockseq
	var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

	// Previous uuid creation time
	var _lastMSecs = 0, _lastNSecs = 0;

	// See https://github.com/broofa/node-uuid for API details
	function v1(options, buf, offset) {
	  var i = buf && offset || 0;
	  var b = buf || [];

	  options = options || {};

	  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

	  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

	  // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock
	  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

	  // Time since last uuid creation (in msecs)
	  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

	  // Per 4.2.1.2, Bump clockseq on clock regression
	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  }

	  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval
	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  }

	  // Per 4.2.1.2 Throw error if too many uuids are requested
	  if (nsecs >= 10000) {
	    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	  }

	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq;

	  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	  msecs += 12219292800000;

	  // `time_low`
	  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff;

	  // `time_mid`
	  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff;

	  // `time_high_and_version`
	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	  b[i++] = tmh >>> 16 & 0xff;

	  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	  b[i++] = clockseq >>> 8 | 0x80;

	  // `clock_seq_low`
	  b[i++] = clockseq & 0xff;

	  // `node`
	  var node = options.node || _nodeId;
	  for (var n = 0; n < 6; n++) {
	    b[i + n] = node[n];
	  }

	  return buf ? buf : unparse(b);
	}

	// **`v4()` - Generate random UUID**

	// See https://github.com/broofa/node-uuid for API details
	function v4(options, buf, offset) {
	  // Deprecated - 'format' argument, as supported in v1.2
	  var i = buf && offset || 0;

	  if (typeof(options) == 'string') {
	    buf = options == 'binary' ? new Array(16) : null;
	    options = null;
	  }
	  options = options || {};

	  var rnds = options.random || (options.rng || _rng)();

	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = (rnds[6] & 0x0f) | 0x40;
	  rnds[8] = (rnds[8] & 0x3f) | 0x80;

	  // Copy bytes to buffer, if provided
	  if (buf) {
	    for (var ii = 0; ii < 16; ii++) {
	      buf[i + ii] = rnds[ii];
	    }
	  }

	  return buf || unparse(rnds);
	}

	// Export public API
	var uuid = v4;
	uuid.v1 = v1;
	uuid.v4 = v4;
	uuid.parse = parse;
	uuid.unparse = unparse;

	module.exports = uuid;


/***/ },
/* 6 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	var rng;

	if (global.crypto && crypto.getRandomValues) {
	  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
	  // Moderately fast, high quality
	  var _rnds8 = new Uint8Array(16);
	  rng = function whatwgRNG() {
	    crypto.getRandomValues(_rnds8);
	    return _rnds8;
	  };
	}

	if (!rng) {
	  // Math.random()-based (RNG)
	  //
	  // If all else fails, use Math.random().  It's fast, but is of unspecified
	  // quality.
	  var  _rnds = new Array(16);
	  rng = function() {
	    for (var i = 0, r; i < 16; i++) {
	      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }

	    return _rnds;
	  };
	}

	module.exports = rng;


	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ]);