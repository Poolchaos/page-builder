import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
import {SignDocumentService} from './signdocument.service';
import {SignDocumentStore} from './signdocument.store';
import {SIGN_DOCUMENT_ACTIONS} from './signdocument.actions';
import {ViewConversationService} from '../viewconversation.service';
import {ConversationStore} from '../../conversation.store';
import {ViewConversationStore} from '../viewconversation.store';
/*
*/
const logger = LogManager.getLogger('SignDocument');
/*
*/
@inject(Router, SignDocumentService, SignDocumentStore, ViewConversationService, ConversationStore, ViewConversationStore)
export class SignDocument {

  constructor(router, signDocumentService, signDocumentStore, viewConversationService, conversationStore, viewConversationStore) {

    this.router = router;
    this.signDocumentService = signDocumentService;
    this.signDocumentStore = signDocumentStore;
//    this.customerStore = customerStore;
    this.viewConversationService = viewConversationService;
    this.conversationStore = conversationStore;
    this.viewConversationStore = viewConversationStore;
    
    this.viewConversationService.view('sign');
  }
  
  
  conversation() {
    
    this.signDocumentService.discardSignature();
    this.router.navigate('view');
    this.viewConversationService.toggleVideoMode(false);
  }
  
  deactivate() {
    
    this.signDocumentService.clearSelectedFile();
  }
  
  selectFile() {
    
    this.signDocumentService.selectFile();
  }

  accept() {
    
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

  discardSignature() {
    
    this.signDocumentService.discardSignature();
  }

  previewDocument(document) {
    
    logger.debug('previewDocument > document = ', document);
    
    this.signDocumentService.previewSignedDocument(document);
  }

  uploadDocument(evt) {
    
    
        
    this.signDocumentService.uploadSelectedFile(evt);
  }

  requestSignature(multiple, event) {
    
    if(event) {
      event.stopImmediatePropagation();
    }
    
    this.signDocumentService.signDocument(this.signDocumentStore.file, multiple);
  }

  closeInstruction() {
    
    this.signDocumentService.closeSignDocument();
  }

//  @handle(SIGN_DOCUMENT_ACTIONS.CLOSE_SIGN_DOCUMENT)
//  handleCloseSignDocument() {
//
//    if (this.customerStore.isWrappingUp) {
//
//      this.router.navigate('wrapup');
//    } else {
//      
//      this.router.navigate('videocall');
//    }
//  }

  @handle(SIGN_DOCUMENT_ACTIONS.UPLOAD_SELECTED_FILE)
  @waitFor(SignDocumentStore)
  handleUploadSelectedFile(action, evt) {
    
    let selector = document.getElementById('fileSelector');
    let selector2 = document.getElementById('fileSelector2');
    
    if(selector) {
      selector.value = '';
    }
    
    if(selector2) {
      selector2.value = '';
    }
  }
}
