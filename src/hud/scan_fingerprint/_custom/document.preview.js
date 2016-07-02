import {inject} from 'aurelia-framework';
import {ScanFingerprintStore} from '../scan.fp.store';

@inject(ScanFingerprintStore)
export class DocumentPreview {

  constructor(scanFingerprintStore) {
    this.scanFingerprintStore = scanFingerprintStore;
  }
  

}