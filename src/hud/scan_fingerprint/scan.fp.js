import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
import {Router} from 'aurelia-router';
import {ScanFingerprintService} from './scan.fp.service';
import {ScanFingerprintStore} from './scan.fp.store';
import {SCAN_FINGERPRINT_ACTIONS} from './scan.fp.actions';
import {CustomerStore} from '../hud.customer.store';

const logger = LogManager.getLogger('ScanFingerprint');

@inject(Router, ScanFingerprintService, ScanFingerprintStore, CustomerStore)
export class ScanFingerprint {

  constructor(router, scanFingerprintService, scanFingerprintStore, customerStore) {

    this.router = router;
    this.scanFingerprintService = scanFingerprintService;
    this.scanFingerprintStore = scanFingerprintStore;
    this.customerStore = customerStore;
  }

  instructThumbs() {

    this.scanFingerprintService.scanThumbsFingerprints();
  }

  instructFingers() {

    this.scanFingerprintService.scanHandsFingerprints(this.scanFingerprintStore.firstFinger);
  }

  nextFinger() {
    
    this.scanFingerprintService.scanNextFingerprint(this.scanFingerprintStore.nextFinger);
  }

  skipFinger() {
    
    this.scanFingerprintService.skipScanFingerprint(this.scanFingerprintStore.nextFinger);
  }

//  ok() {
//
//    this.scanFingerprintService.acceptFingerprint(this.scanFingerprintStore.document);
//  }
//
//  redo() {
//    
//    this.scanFingerprintService.redoScanFingerprint(this.scanFingerprintStore.instruction, this.scanFingerprintStore.currentFinger);
//  }
//
//  cancel() {
//
//    this.scanFingerprintService.cancelFingerprint();
//  }

  previewDocument(fingerprint) {

    this.scanFingerprintService.previewFingerprint(fingerprint);
  }

  closeInstruction() {

    this.scanFingerprintService.closeScanFingerprint();
  }
  
  @handle(SCAN_FINGERPRINT_ACTIONS.ACCEPT_SCANNED_FP)
  @waitFor(ScanFingerprintStore)
  handleAcceptScannedFingerprint() {
    
    if(this.scanFingerprintStore.isReadyToScanNextFinger) {
      this.nextFinger();
    }
  }

  @handle(SCAN_FINGERPRINT_ACTIONS.CLOSE_SCAN_FP)
  @waitFor(ScanFingerprintStore)
  handleCloseScanFingerprint() {

    if (this.customerStore.isWrappingUp) {

      this.router.navigate('wrapup');
    } else {
      
      this.router.navigate('videocall');
    }
  }
}
