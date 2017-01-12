
export function generateLog(eventType, details) {
    return {
        timestamp: new Date(),
        eventType,
        details
    };
}

export const Logger = class {
    constructor() {
        this.logs = [];
        this.metadata = {
            tabId: null,
            startUrl: ''
        };
    }

    static eventTypes = ['urlChange', 'click', 'change'];

    log(eventType, details) {
        // logging event details
        this.logs.push({
            timestamp: new Date(),
            eventType: eventType,
            details: Object.assign({}, details)
        });
    }

    printLog(format = false) {
        if (format) {
            return this.logs.map((log) => {
                const {timestamp, eventType, details} = log;
                return `[${timestamp.toDateString()}]: ${eventType} - ${JSON.stringify(details)}`;
            }).join('\n');
        }
        return this.logs;
    }

    insertURLChangeLog(tabId, changeInfo, tab) {
        console.log('inserted change log ... ');
        this.log('urlChange', {
            tabId: tabId,
            changeInfo: changeInfo
        });
    }
};