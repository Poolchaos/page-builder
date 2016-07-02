import {customElement, bindable, inject} from 'aurelia-framework';
import {PeerService} from '../../_common/services/peer.service';

@customElement('peer-video')
@inject(PeerService)
export class PeerVideo {
  
  constructor(peerService) {
    
    this.peerService = peerService;
  }

  bind() {
    
    this.agentRemoteVideo.src = this.peerService.remoteStreamURL;
  }
}