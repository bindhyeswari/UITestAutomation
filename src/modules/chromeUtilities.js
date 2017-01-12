export function broadcast(obj, callback) {
    chrome.runtime.sendMessage(obj, callback);
}

export function listen(callback) {
    chrome.runtime.onMessage.addListener(callback);
}