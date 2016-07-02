import {handle} from 'aurelia-flux';
import {SCAN_DOCUMENT_ACTIONS} from './scan.doc.actions';
import {WRAP_UP_ACTIONS} from '../wrapup/wrapup.actions';

export class ScanDocumentStore {

  instruction = 'request';
  canClose = true;
  scanPreview = null;
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

    return this.instruction === 'scan';
  }

  get showWaiting() {

    return this.instruction === 'waiting';
  }

  get showPreview() {

    return this.scanPreview === null ? false : this.scanPreview.content !== null;
  }

  @handle(SCAN_DOCUMENT_ACTIONS.COMPLETE_WRAP_UP) 
  handleCompleteWrapUp() {
    this.scanPreview = null;
  }

  @handle(SCAN_DOCUMENT_ACTIONS.REQUEST_SCAN)
  handleRequestScan(action, type) {

    this.isScanning = true;
    this.scanPreview = null;
    this.instruction = 'scan';
    this.scanType = type;
    this.canClose = false;
  }

  @handle(SCAN_DOCUMENT_ACTIONS.INITIATE_SCAN)
  handleInitiateScan(action, type) {

    this.instruction = 'waiting';
  }

  @handle(SCAN_DOCUMENT_ACTIONS.PROCESS_SCAN)
  handleProcessScan(action, content) {

    this.isPreviewSelected = false;
    this.scanPreview = {};

    this.instruction = 'request';
    this.scanPreview.content = content ? 'data:image/jpeg;charset=utf-16le;base64,' + content : null;
    this.scanPreview.documentName = this.scanType;
  }

  @handle(SCAN_DOCUMENT_ACTIONS.PREVIEW_DOCUMENT)
  handlePreviewDocument(action, document) {

    this.isPreviewSelected = true;
    this.scanPreview = {
      content: document.content,
      documentName: document.name
    };
  }

  @handle(SCAN_DOCUMENT_ACTIONS.ACCEPT_DOCUMENT)
  handleAcceptDocument() {

    this.isScanning = false;

    this.scanPreview = null;
    this.canClose = true;
  }

  @handle(SCAN_DOCUMENT_ACTIONS.RESET_DOCUMENT)
  handleResetDocument(action) {

    this.isScanning = false;

    this.scanPreview = null;
    this.canClose = false;
  }

  @handle(SCAN_DOCUMENT_ACTIONS.CANCEL_DOCUMENT)
  handleDocumentCancel(action) {

    this.isScanning = false;
    this.instruction = 'request';
    this.scanPreview = null;
    this.canClose = true;
  }
}
