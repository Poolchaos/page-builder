import {inject} from 'aurelia-framework';
import {ScanFingerprintStore} from '../scan.fp.store';
import {ScanFingerprintService} from '../scan.fp.service';

@inject(ScanFingerprintStore, ScanFingerprintService)
export class DocumentReceived {

  constructor(scanFingerprintStore, scanFingerprintService) {
    
    this.scanFingerprintStore = scanFingerprintStore;
    this.scanFingerprintService = scanFingerprintService;
  }
  
  ok() {

    this.scanFingerprintService.acceptFingerprint(this.scanFingerprintStore.document);
  }

  redo() {
    
    this.scanFingerprintService.redoScanFingerprint(this.scanFingerprintStore.instruction, this.scanFingerprintStore.currentFinger);
  }

  cancel() {

    this.scanFingerprintService.cancelFingerprint();
  }
  
}