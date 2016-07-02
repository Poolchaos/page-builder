import {inject} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import {DOCUMENT_HISTORY} from './documenthistory.actions';
import {ConversationStore} from '../../conversation.store';
/*
*/
@inject(Dispatcher, ConversationStore)
export class DocumentHistoryService {

  constructor(dispatcher, conversationStore) {
    
    this.dispatcher = dispatcher;
    this.conversationStore = conversationStore;
  }
  
  retrieveDocumentHistory() {
    
    this.dispatcher.dispatch(DOCUMENT_HISTORY.RETRIEVE_DOCUMENT_HISTORY, this.conversationStore.documents);
  }
  
  view(tab) {
    this.dispatcher.dispatch(DOCUMENT_HISTORY.TAB_NAVIGATE, tab);
  }
  
  viewScan(scan) {
    this.dispatcher.dispatch(DOCUMENT_HISTORY.PREVIEW_SCAN, scan);
  }
  
  viewPdf(document) {
    this.dispatcher.dispatch(DOCUMENT_HISTORY.PREVIEW_SIGN, document);
  }
  
  clearStore() {
    this.dispatcher.dispatch('document.history.clear', document);
  }
}