import {inject} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {SCAN_DOCUMENT_ACTIONS} from './scan.doc.actions';
import {WebSocketKiosk} from '../../_common/services/websocket.kiosk';
import {PeerService} from '../../_common/services/peer.service';

@inject(WebSocketKiosk, PeerService, Dispatcher)
export class ScanDocumentService {

  constructor(webSocketKiosk, peerService, dispatcher) {
    
    this.socket = webSocketKiosk;
    this.peerService = peerService;
    this.dispatcher = dispatcher;
    
    this.socket.subscribe('DOC_SCANNED', (message) => {
      
      if(message.data.payload === 'FAILED') {
        this.dispatcher.dispatch(SCAN_DOCUMENT_ACTIONS.SCAN_FAILED);
        return;
      }
      
      this.dispatcher.dispatch(SCAN_DOCUMENT_ACTIONS.PROCESS_SCAN, message.data.payload);
    });
  }
  
  requestScan(type) {
    
    this.socket.direct({
      dst: this.peerService.remotePeerId,
      payload: {
        scanType: type
      },
      type: 'AGENT_INFO'
    });
    
    let envelope = {
      dst: this.peerService.remotePeerId,
      type: 'SCAN_DOC',
      payload: 'START_PREVIEW'
    };
    
    this.socket.direct(envelope);
    this.dispatcher.dispatch(SCAN_DOCUMENT_ACTIONS.REQUEST_SCAN, type);
  }
  
  initiateScan() {
    
    let envelope = {
      dst: this.peerService.remotePeerId,
      type: 'SCAN_DOC',
      payload: 'CAPTURE'
    };
    
    this.socket.direct(envelope);
    this.dispatcher.dispatch(SCAN_DOCUMENT_ACTIONS.INITIATE_SCAN);
  }
  
  cancelScan() {
    
    let envelope = {
      dst: this.peerService.remotePeerId,
      type: 'SCAN_DOC',
      payload: 'CANCEL_SCAN'
    };
    
    this.socket.direct(envelope);
    this.dispatcher.dispatch(SCAN_DOCUMENT_ACTIONS.CANCEL_DOCUMENT);
  }

  previewDocument(document) {
    
    this.dispatcher.dispatch(SCAN_DOCUMENT_ACTIONS.PREVIEW_DOCUMENT, document);
  }
  
  acceptDocument(document) {
    
    this.dispatcher.dispatch(SCAN_DOCUMENT_ACTIONS.ACCEPT_DOCUMENT, document); 
  }
  
  resetDocument() {
    
    this.dispatcher.dispatch(SCAN_DOCUMENT_ACTIONS.RESET_DOCUMENT);
  }
  
  cancelDocument() {
    
    this.dispatcher.dispatch(SCAN_DOCUMENT_ACTIONS.CANCEL_DOCUMENT);
  }
}
