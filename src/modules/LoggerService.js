/**
 * Created by bmishra on 8/5/16.
 */
import uuid from 'uuid';
import Logger from './Logger';

let loggers = new Map();

export function createLogger(tabId) {
    let logger = new Logger();
    logger.metadata.tabId = tabId;
    logger.metadata.timeStarted = new Date();
    logger.metadata.id = uuid.v4();
    logger.metadata.status = 'active';
    loggers.set(logger.metadata.id, logger);
    return logger;
}

export function getLogger(loggerId) {
    return loggers[loggerId];
}

export function getLastLogger() {
    let valueIterator = loggers.values();
    if (loggers.size === 0) return undefined;
    for (let i = 0, len = loggers.size - 1; i < len; i++) {
        valueIterator.next();
    }
    return valueIterator.next().value;
}

export function getAllLogs(n) {
    return Array.from(loggers).map(() => {  });
}


