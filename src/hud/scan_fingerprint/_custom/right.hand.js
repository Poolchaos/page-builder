import {inject} from 'aurelia-framework';
import {ScanFingerprintStore} from '../scan.fp.store';
import {ScanFingerprintService} from '../scan.fp.service';

@inject(ScanFingerprintStore, ScanFingerprintService)
export class RightHand {

  constructor(scanFingerprintStore, scanFingerprintService) {
    this.scanFingerprintStore = scanFingerprintStore;
    this.scanFingerprintService = scanFingerprintService;
  }
  
  
  cancelScan() {
    this.scanFingerprintService.stopFingerprint();
  }

}