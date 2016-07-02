import {customElement, inject} from 'aurelia-framework';
import {CustomerStore} from '../hud.customer.store';

@inject(CustomerStore)
@customElement('preview-fingerprint-panel')
export class PreviewFingerprintHistoryPanel {
  
  constructor(customerStore) {
    
    this.customerStore = customerStore;
    this.previewFingerprintPanelStore = new PreviewFingerprintPanelStore();
  }
  
  preview(document) {
    
    this.previewFingerprintPanelStore.title = document.title;
    this.previewFingerprintPanelStore.preview = document.data;
  }
  
  accept() {
    
    this.previewFingerprintPanelStore.preview.isRejected = false;
  }
  
  close() {
    
  }
}

class PreviewFingerprintPanelStore {
  
  title = 'Select something';
  preview = null;
  isRejected = true;
}