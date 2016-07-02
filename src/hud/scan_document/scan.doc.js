import {handle} from 'aurelia-flux';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {ScanDocumentService} from './scan.doc.service';
import {ScanDocumentStore} from './scan.doc.store';
import {CustomerStore} from '../hud.customer.store';
import {SCAN_DOCUMENT_ACTIONS} from './scan.doc.actions';

@inject(Router, ScanDocumentService, ScanDocumentStore, CustomerStore)
export class ScanDocument {

  constructor(router, scanDocumentService, scanDocumentStore, customerStore) {

    this.router = router;
    this.scanDocumentService = scanDocumentService;
    this.scanDocumentStore = scanDocumentStore;
    this.customerStore = customerStore;
  }

  requestScan(type) {

    this.scanDocumentService.requestScan(type);
  }

  initiateScan() {

    this.scanDocumentService.initiateScan();
  }

  cancelScan() {

    this.scanDocumentService.cancelScan();
  }

  acceptDocument() {

    this.scanDocumentService.acceptDocument(this.scanDocumentStore.scanPreview);
  }

  next() {

    this.acceptDocument(this.scanDocumentStore.scanPreview);
    this.requestScan(this.scanDocumentStore.scanType);
  }

  redo() {

    this.scanDocumentService.resetDocument();
    this.requestScan(this.scanDocumentStore.scanType);
  }

  cancel() {

    this.scanDocumentService.cancelDocument();
  }

  previewDocument(document) {

    this.scanDocumentService.previewDocument(document);
  }

  closeInstruction() {

    if (this.customerStore.isWrappingUp) {

      this.router.navigate('wrapup');
    } else {
      
      this.router.navigate('videocall');
    }
  }
  

  @handle(SCAN_DOCUMENT_ACTIONS.SCAN_FAILED)
  handleScanFailed() {
    this.router.navigate('videocall');
    alert(' An error has occurred - Scanner not found! ');
  }
   
}
