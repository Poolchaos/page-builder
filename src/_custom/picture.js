/*
*/
import {LogManager, inject, customElement, bindable} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
import {PictureService, PictureStore} from 'zailab.common';
/*
*/
import {EventAggregator}from 'aurelia-event-aggregator';
/*
*/
const logger = LogManager.getLogger('Picture');
/*
*/
@customElement('picture')
@inject(PictureService, PictureStore, EventAggregator)
export class Picture {

  @bindable id;
  @bindable picturestyle;
  @bindable defaultpicture;
  @bindable url; // optional

  constructor(pictureService, pictureStore, eventAggregator) {
    this.pictureService = pictureService;
    this.pictureStore = pictureStore;
    this.eventAggregator = eventAggregator;
        
    this.eventAggregator.subscribe('change.picture', payload => this.updateCache(payload));
    
  }

   bind() {

    if (this.isPictureRetrievable() && this.id && !this.url) {
      this.pictureService.retrievePicture(this.id, this.defaultpicture);
    }
  }
   
  get pictureSource() {
    
    if(this.url){
      
      return this.url;
    }
    
    let pictures = this.pictureStore.pictures;
    
    let src = pictures[this.id];
    
    return src;
  }
   
  isPictureRetrievable() {
    
    return !this.pictureSource;
    // return !this.pictureSource || this.defaultpicture === this.pictureSource;
  }
   
  updateCache(payload){
    
    let id = payload.id;
    let data = payload.data;
    
    this.pictureStore.pictures[id] = data;
  }
   
}
