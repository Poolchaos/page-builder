import {handle} from 'aurelia-flux';
import {SHARE_SCREEN_ACTIONS} from './share.screen.actions';

let STATE = {
  
  isSharingScreen: false
}

export class ShareScreenStore {
  
  get isSharingScreen() {
    
    return STATE.isSharingScreen;
  }
  
  set isSharingScreen(isSharingScreen) {
  
    throw new Error(`Try dispatching ${SHARE_SCREEN_ACTIONS.START_SCREEN_SHARE} or ${SHARE_SCREEN_ACTIONS.STOP_SCREEN_SHARE}`);
  }

  @handle(SHARE_SCREEN_ACTIONS.START_SCREEN_SHARE)
  handleStartScreenShare() {
    
    STATE.isSharingScreen = true;
  }

  @handle(SHARE_SCREEN_ACTIONS.STOP_SCREEN_SHARE)
  handleStopScreenShare() {
    
    STATE.isSharingScreen = false;
  }
}