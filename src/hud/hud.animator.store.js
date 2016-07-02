/*
zailab
*/
import {HUD_ANIMATOR_ACTIONS} from './hud.animator.actions';
import {HUD_ANIMATOR_EVENTS} from './hud.animator.events';
/*
aurelia
*/
import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('AnimatorStore');
/*
*/
let STATE = {
  isReady: false
};
/*
Animator Store - this store contains the shared state of the animations
*/
export class AnimatorStore {
  
  wingsOpen;
  wingsPinned;
  get isReady() {
    return STATE.isReady;
  }

  @handle(HUD_ANIMATOR_ACTIONS.ACTIVATE)
  handleActivate(event, isVisible){
    
    STATE.isReady = true;
  }  

  @handle(HUD_ANIMATOR_EVENTS.SHOW_LOADER)
  handleShowLoader(event, isVisible){

    this.showLoader = isVisible;
  }  

  @handle(HUD_ANIMATOR_EVENTS.SHOW_BLUR)
  handleBlurEvent(message){
    
    this.activeBlur = 'blur';
  }

  @handle(HUD_ANIMATOR_EVENTS.HIDE_BLUR)
  handleFocusBlurEvent(message){
    
    this.activeBlur = '';
  } 

  @handle(HUD_ANIMATOR_EVENTS.SHOW_WINGS)
  handleShowWingsEvent(message){

    this.wingsOpen = true;
  }  


  @handle(HUD_ANIMATOR_EVENTS.HIDE_WINGS)
  handleHideWingsEvent(message){

    if(!this.wingsPinned){
      this.wingsOpen = false;
    }
  }

  @handle(HUD_ANIMATOR_EVENTS.PIN_WINGS)
  handlePinWingsEvent(message, isPinned){

    this.wingsPinned = isPinned;
  }
}