/*
zailab
*/
import {ShareScreenService} from './share.screen.service';
import {ShareScreenStore} from './share.screen.store';
import {SHARE_SCREEN_ACTIONS} from './share.screen.actions';
/*
aurelia
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';

const logger = LogManager.getLogger('ShareScreen');

@inject(Router, ShareScreenService, ShareScreenStore)
export class ShareScreen {

  constructor(router, shareScreenService, shareScreenStore) {
    
    this.router = router;
    this.shareScreenService = shareScreenService;
    this.shareScreenStore = shareScreenStore;
  }

  activate() {
    
    if (this.shareScreenStore.isSharingScreen === false) {
      this.startScreenShare();
    }
  }

//  canDeactivate() {
//    
//    logger.debug('canDeactivate > this.shareScreenStore.isSharingScreen = ', this.shareScreenStore.isSharingScreen);
//
//    return this.shareScreenStore.isSharingScreen === false;
//  }

  startScreenShare() {

    this.shareScreenService.startScreenShare();
  }

  stopScreenShare() {

    this.shareScreenService.stopScreenShare();
  }

  @handle(SHARE_SCREEN_ACTIONS.STOP_SCREEN_SHARE)
  @waitFor(ShareScreenStore)
  handleStopScreenShare(actions, remoteCallDisconnected) {

    logger.debug('handleStopScreenShare > remoteCallDisconnected = ', remoteCallDisconnected);
    if(remoteCallDisconnected) {
      return;
    }
    this.router.navigate('videocall');
  }
}
