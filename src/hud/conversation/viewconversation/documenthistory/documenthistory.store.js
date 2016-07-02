import {handle} from 'aurelia-flux';
/*
*/
import {DOCUMENT_HISTORY} from './documenthistory.actions';
import {VIEW_CONVERSATION_ACTIONS} from '../viewconversation.actions';
/*
*/
let STATE = {
  documentHistory: {},
  viewToDisplay: 'history_scan',
  preview: null,
  currentTab: 'scan'
};
/*
*/
export class DocumentHistoryStore {

  get documentHistory() {
    return STATE.documentHistory;
  }
  
  get showHistory() {
    return STATE.viewToDisplay.indexOf('history') !== -1 ? true : false;
  }
  
  get showScannedDocuments() {
    return STATE.viewToDisplay.indexOf('scan') !== -1 ? true : false;
  }
  
  get showSignedDocuments() {
    return STATE.viewToDisplay.indexOf('sign') !== -1 ? true : false;
  }
  
  get showScannedFingerprints() {
    return STATE.viewToDisplay.indexOf('fp') !== -1 ? true : false;
  }
  
  get showPreview() {
    return STATE.viewToDisplay.indexOf('preview') !== -1 ? true : false;
  }
  
  get preview() {
    return STATE.preview;
  }
  
  get hasScannedDocument() {
    
    if(!this.documentHistory || !this.documentHistory.scannedDocuments) {
      
      return false;
    }
    
    for(var type of this.documentHistory.scannedDocuments) {
      
      if(type.scans.length > 0) {
        
        return true;
      }
    }
    
    return false;
  }
  
  get hasHistory() {
    
    if(!this.documentHistory || !this.documentHistory.scannedDocuments) {
      
      return false;
    }
    
    for(var type of this.documentHistory.scannedDocuments) {
      
      if(type.scans.length > 0) {
        
        return true;
      }
    }
    
    if(this.documentHistory && (this.documentHistory.signedDocuments.length > 0 || this.documentHistory.fingerprintDocuments.length > 0)) {
      return true;
    }
    
    return false;
  }
  
  @handle(DOCUMENT_HISTORY.RETRIEVE_DOCUMENT_HISTORY) 
  handleDocumentHistoryRetrieved(action, documentHistory) {
    
    logger.debug(' RETRIEVE_DOCUMENT_HISTORY >>> ', documentHistory);
    STATE.documentHistory = documentHistory;
  }
  
  @handle(DOCUMENT_HISTORY.TAB_NAVIGATE) 
  handleTabNavigate(action, tab) {
    
    STATE.viewToDisplay = 'history_' + tab;
    STATE.preview = null;
    STATE.currentTab = tab;
  }

  @handle(DOCUMENT_HISTORY.PREVIEW_SCAN)
  handlePreviewScan(action, scan) {
    logger.debug(' PREVIEW_SCAN >>> ', scan);
    
    STATE.viewToDisplay = 'preview_scan';
    STATE.preview = scan;
  }

  @handle(DOCUMENT_HISTORY.PREVIEW_SIGN)
  handlePreviewSign(action, document) {
    
    logger.debug(' PREVIEW_SIGN >>> ', document);
    
    STATE.viewToDisplay = 'preview_sign';
    
    var docBlob = base64ToBlob(document.content.documentContent);
    var docURL = URL.createObjectURL(docBlob);
    document.documentTempURL = docURL;
    
    STATE.preview = document;
  }

  @handle(VIEW_CONVERSATION_ACTIONS.TAB_NAVIGATE) 
  handleViewHistory() {
    STATE.viewToDisplay = 'history_' + STATE.currentTab;
  }

  @handle('document.history.clear')
  handleClearStore() {
    
    STATE = {
      documentHistory: {},
      viewToDisplay: 'history_scan',
      preview: null,
      currentTab: 'scan'
    };
  }
}
/*
*/
function base64ToBlob(base64) {

  var byteCharacters = atob(base64);
  var byteNumbers = new Array(byteCharacters.length);
  for (var i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  var byteArray = new Uint8Array(byteNumbers);
  var blob = new Blob([byteArray], {type: 'application/pdf'});

  return blob;
};