import {customElement, inject} from 'aurelia-framework';
import {CustomerStore} from '../hud.customer.store';

@inject(CustomerStore)
@customElement('preview-panel')
export class PreviewPanel {
  
  // TODO bind type
  // TODO bind initial title

  constructor(customerStore) {

    this.previewPanelStore = new PreviewPanelStore(customerStore.fingerTypes); // TODO bind type
  }

  preview(document) {

    if (document.isRejected === undefined) {
      document.isRejected = true;
    }

    this.previewPanelStore.document = document;
  }

  accept() {

    this.previewPanelStore.document.isRejected = false;
  }

  close() {

  }
}

class PreviewPanelStore {

  documents;
  document;
  
  instructions;
  actions;

  constructor(documents) {

    this.documents = documents;

    this.document = {
      title: 'Select something', // TODO bind initial title
      data: null,
      isRejected: false,
    };
  }
}
