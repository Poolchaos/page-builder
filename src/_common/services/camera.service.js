import {inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {PHONE_ACTIONS} from './phone.api';

const logger = LogManager.getLogger('CameraService');

@inject(EventAggregator)
export class CameraService {

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;
  }

  getMediaStream(callback) {

    try {
      
      navigator.getMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);
    
      navigator.getMedia({
        video: {
          mandatory: {
            minWidth: 640,
            minHeight: 360,
            maxWidth: 640,
            maxHeight: 360
          }
        },
        audio: true
      }, stream => {
        
        callback(null, stream);
      }, error => {
        logger.debug(' :: error getting stream -> ', error);
      }); 

    } catch (exception) {

      callback(exception, null);
    }
  }
}
