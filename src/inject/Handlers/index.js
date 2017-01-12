import moment from 'moment';

export function handleDownloadLog(logs, document) {
    let link = document.createElement('a');
    logs = JSON.stringify(logs);
    link.download = `Mneminic_${moment(new Date()).format('YYYY-MMM-DD_LTS')}`;
    link.href = 'data:text/plain;' + logs;
    link.click();
}