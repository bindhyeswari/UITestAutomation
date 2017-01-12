 import {broadcast} from '../modules/chromeUtilities';
 // listen to click events
 
 export function listenToClickEvents(document, globals) {
     document.addEventListener('click', (event) => { 
         console.log('Click Event: ', event, event.target);
         broadcast({
             eventType: 'clientActionEvent',
             event: event
         });
     });
 }