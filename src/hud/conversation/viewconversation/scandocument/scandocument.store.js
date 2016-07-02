import {handle} from 'aurelia-flux';
/*
*/
import {SCAN_DOCUMENT_ACTIONS} from './scandocument.actions';
import {VIEW_CONVERSATION_ACTIONS} from '../viewconversation.actions';
/*
*/
let STATE = {
  instruction: null,
  scanPreview: null
};
export class ScanDocumentStore {

  instruction = 'request';
  canClose = true;
  scanType;
  isPreviewSelected = false;

  isScanning = false;

  get showInstructions() {

    //    return this.instruction === 'request' && this.isPreviewSelected === false;
    //    return this.showActions === false;
    return this.isScanning === false;
  }

  get showMessage() {

    return this.showInstructions && this.showPreview === false;
  }

  get showActions() {

    return this.showPreview && this.isPreviewSelected === false;
  }

  get showScan() {

    return STATE.instruction === 'scan';
  }

  get showDocument() {

    return STATE.instruction === 'request';
  }

  get showInstructions() {

    return !STATE.instruction;
  }

  get showWaiting() {

    return STATE.instruction === 'waiting';
  }

  get showPreview() {

    return STATE.scanPreview === null ? false : STATE.scanPreview.content !== null;
  }

  get scanPreview() {

    return STATE.scanPreview;
  }

  @handle(SCAN_DOCUMENT_ACTIONS.COMPLETE_WRAP_UP) 
  handleCompleteWrapUp() {
    STATE.scanPreview = null;
  }

  @handle(SCAN_DOCUMENT_ACTIONS.REQUEST_SCAN)
  handleRequestScan(action, type) {

    this.isScanning = true;
    STATE.scanPreview = null;
    STATE.instruction = 'scan';
    this.scanType = type;
    this.canClose = false;
  }

  @handle(SCAN_DOCUMENT_ACTIONS.SCAN_FAILED)
  handleScanFailed() {
    STATE.instruction = null;
    alert(' An error has occurred - Scanner not found! ');
  }

  @handle(SCAN_DOCUMENT_ACTIONS.INITIATE_SCAN)
  handleInitiateScan(action, type) {

    STATE.instruction = 'waiting';
  }

  @handle(SCAN_DOCUMENT_ACTIONS.PROCESS_SCAN)
  handleProcessScan(action, content) {

    this.isPreviewSelected = false;
    STATE.scanPreview = {};

    STATE.instruction = 'request';
    STATE.scanPreview.content = content ? 'data:image/jpeg;charset=utf-16le;base64,' + content : null;
    STATE.scanPreview.documentName = this.scanType;
  }

  @handle(SCAN_DOCUMENT_ACTIONS.PREVIEW_DOCUMENT)
  handlePreviewDocument(action, document) {

    logger.debug(' PREVIEW_DOCUMENT >>> ', document);
    
    this.isPreviewSelected = true;
    STATE.scanPreview = {
      content: document.content.indexOf('base64') !== -1 ? document.content : 'data:image/jpeg;charset=utf-16le;base64,' + document.content,
      documentName: document.name
    };
  }

  @handle(SCAN_DOCUMENT_ACTIONS.ACCEPT_DOCUMENT)
  handleAcceptDocument(action, document) {

    if(!document.isNext) {
      
      this.isScanning = false;
      STATE.instruction = null;
      STATE.scanPreview = null;
      this.canClose = true;
    }
  }

  @handle(SCAN_DOCUMENT_ACTIONS.RESET_DOCUMENT)
  handleResetDocument(action) {

    this.isScanning = false;

    STATE.scanPreview = null;
    this.canClose = false;
  }

  @handle(SCAN_DOCUMENT_ACTIONS.CANCEL_DOCUMENT)
  handleDocumentCancel(action) {

    this.isScanning = false;
    STATE.instruction = null;
    STATE.scanPreview = null;
    this.canClose = true;
  }

  @handle(VIEW_CONVERSATION_ACTIONS.DISCONNECT_VIDEO_CALL) 
  handleVideoCallCallDisconected() {
    
    STATE.instruction = null;
    STATE.scanPreview = null;
  }
}
