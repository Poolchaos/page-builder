import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {WebSocketKiosk} from '../../_common/services/websocket.kiosk';
import {PeerService} from '../../_common/services/peer.service';
import {SCAN_FINGERPRINT_ACTIONS} from './scan.fp.actions';

const logger = LogManager.getLogger('ScanFingerprintService');

@inject(WebSocketKiosk, PeerService, Dispatcher)
export class ScanFingerprintService {

  constructor(webSocketKiosk, peerService, dispatcher) {

    this.socket = webSocketKiosk;
    this.peerService = peerService;
    this.dispatcher = dispatcher;

    this.socket.subscribe('FP_SCANNED', (message) => {

      if (!message.data || !message.data.payload) {

        logger.error('FP_SCANNED > returned because the message data or message data payload is invalid');
        return;
      }

      this.dispatcher.dispatch(SCAN_FINGERPRINT_ACTIONS.PROCESS_SCANNED_FP, message.data.payload);
    });
  }

  scanThumbsFingerprints() {

    let envelope = {
      dst: this.peerService.remotePeerId,
      type: 'SCAN_FP',
      payload: 'SCAN_FP_THUMBS'
    };

    this.socket.direct(envelope);

    this.dispatcher.dispatch(SCAN_FINGERPRINT_ACTIONS.SCAN_THUMBS);
  }

  scanHandsFingerprints(finger) {

    let envelope = {
      dst: this.peerService.remotePeerId,
      type: 'SCAN_FP',
      payload: finger
    };

    this.socket.direct(envelope);

    this.dispatcher.dispatch(SCAN_FINGERPRINT_ACTIONS.SCAN_HANDS);
  }

  scanNextFingerprint(finger) {

    let envelope = {
      dst: this.peerService.remotePeerId,
      type: 'SCAN_FP',
      payload: finger
    };

    this.socket.direct(envelope);

    this.dispatcher.dispatch(SCAN_FINGERPRINT_ACTIONS.SCAN_NEXT_FP);
  }

  redoScanFingerprint(fingerprintType, finger) {

    this.dispatcher.dispatch(SCAN_FINGERPRINT_ACTIONS.REDO_SCAN_FP);

    if (fingerprintType === 'thumbs') {
      this.scanThumbsFingerprints();
    } else {
      this.scanHandsFingerprints(finger);
    }
  }

  skipScanFingerprint(nextFinger) {

    this.scanNextFingerprint(nextFinger);
  }

  acceptFingerprint(fingerprint) {

    this.dispatcher.dispatch(SCAN_FINGERPRINT_ACTIONS.ACCEPT_SCANNED_FP, fingerprint);
  }

  cancelFingerprint() {

    this.dispatcher.dispatch(SCAN_FINGERPRINT_ACTIONS.CANCEL_SCANNED_FP);
  }

  stopFingerprint() {
    
    let envelope = {
      dst: this.peerService.remotePeerId,
      type: 'SCAN_FP',
      payload: 'CANCEL_SCAN_FP'
    };

    this.socket.direct(envelope);
    this.cancelFingerprint();
    
  }

  previewFingerprint(fingerprint) {
    
    this.dispatcher.dispatch(SCAN_FINGERPRINT_ACTIONS.PREVIEW_SCANNED_FP, fingerprint);
  }
  
  closeScanFingerprint() {
    
    this.dispatcher.dispatch(SCAN_FINGERPRINT_ACTIONS.CLOSE_SCAN_FP);
  }
}
