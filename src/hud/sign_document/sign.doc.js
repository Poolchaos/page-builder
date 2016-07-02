import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {SignDocumentService} from './sign.doc.service';
import {SignDocumentStore} from './sign.doc.store';
import {CustomerStore} from '../hud.customer.store';
import {handle} from 'aurelia-flux';
import {SIGN_DOCUMENT_ACTIONS} from './sign.doc.actions';

const logger = LogManager.getLogger('SignDocument');

@inject(Router, SignDocumentService, SignDocumentStore, CustomerStore)
export class SignDocument {

  constructor(router, signDocumentService, signDocumentStore, customerStore) {

    this.router = router;
    this.signDocumentService = signDocumentService;
    this.signDocumentStore = signDocumentStore;
    this.customerStore = customerStore;
  }

  ok() {
    
    this.signDocumentService.acceptSignedDocument(this.signDocumentStore.document);
  }

  redo() {
    
    this.signDocumentService.redoSignedDocument(this.signDocumentStore.file, this.signDocumentStore.multiple);
  }

  cancel() {
    
    this.signDocumentService.cancelSignedDocument();
  }

  cancelSignature() {
    
    this.signDocumentService.cancelSignature();
  }

  previewDocument(document) {
    
    logger.debug('previewDocument > document = ', document);
    
    this.signDocumentService.previewSignedDocument(document);
  }

  uploadDocument(evt) {
    
    this.signDocumentService.uploadSelectedFile(evt);
    
    this.fileSelector.value = null;
  }

  requestSignature(multiple) {
    
    this.signDocumentService.signDocument(this.signDocumentStore.file, multiple);
  }

  closeInstruction() {
    
    this.signDocumentService.closeSignDocument();
  }

  @handle(SIGN_DOCUMENT_ACTIONS.CLOSE_SIGN_DOCUMENT)
  handleCloseSignDocument() {

    if (this.customerStore.isWrappingUp) {

      this.router.navigate('wrapup');
    } else {
      
      this.router.navigate('videocall');
    }
  }
}
