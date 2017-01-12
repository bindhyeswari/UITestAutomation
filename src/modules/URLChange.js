
/**
 * Function that adds a listener to url changes
 * */
export function addListenerToUrlChanges(callback) {
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        callback(tabId, changeInfo, tab);
        chrome.tabs.onUpdated.removeListener(callback);
    });

    chrome.tabs.onCreated.addListener(function(tab) {
        callback(tabId, changeInfo, tab);
        chrome.tabs.onCreated.removeListener(callback);
    });
}

/**
 * Function that removes a listener from the url changes
 * */
export function removeListenerFromUrlChanges(callback) {
    chrome.tabs.onUpdated.removeListener(function(tabId, changeInfo, tab) {
        callback(tabId, changeInfo, tab);
    });

    chrome.tabs.onCreated.addListener(function(tab) {
        callback(tabId, changeInfo, tab);
    });
}