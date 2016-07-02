/*
zailab
*/
import {SCAN_DOCUMENT_ACTIONS} from './scan_document/scan.doc.actions';
import {SCAN_FINGERPRINT_ACTIONS} from './scan_fingerprint/scan.fp.actions';
import {SIGN_DOCUMENT_ACTIONS} from './sign_document/sign.doc.actions';
import {WRAP_UP_ACTIONS} from './wrapup/wrapup.actions';
/*
aurelia
*/
import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
Logger
*/
const logger = LogManager.getLogger('CustomerStore');
/*
STATE
*/
let STATE = {
  
  isWrappingUp: null
};
let SCAN_DOCUMENT_STATE = {

  documentTypes: null
};
let SCAN_FINGERPRINT_STATE = {

  fingerTypes: null
};
let SIGN_DOCUMENT_STATE = {

  signTypes: null
};
/*
Customer Store - this store contains the shared state of the cumstomer information gethered during the agent video call with a kiosk
*/
export class CustomerStore {

  constructor() {

    setDefaultState();
  }

  get documentTypes() {

    return SCAN_DOCUMENT_STATE.documentTypes;
  }

  get fingerTypes() {

    return SCAN_FINGERPRINT_STATE.fingerTypes;
  }

  get signTypes() {

    return SIGN_DOCUMENT_STATE.signTypes;
  }
  
  get isWrappingUp() {
    
    return STATE.isWrappingUp;
  }

  @handle(SCAN_DOCUMENT_ACTIONS.ACCEPT_DOCUMENT)
  handleAcceptDocument(action, document) {

    let documents = findDocumentsByName(document.documentName);
    if (documents === null) {

      logger.error('No documents found for ', document.documentName, ' in ', SCAN_DOCUMENT_STATE.documentTypes);
    } else {

      documents.push({
        content: document.content,
        name: document.documentName
      });
    }
  }

  @handle(SCAN_FINGERPRINT_ACTIONS.ACCEPT_SCANNED_FP)
  handleAccpetScannedFingerprint(action, fingerprint) {

    logger.debug('handleAccpetScannedFingerprint > fingerprint = ', fingerprint);

    let fingerprints = findFingerprintsByName(fingerprint.documentName);
    if (fingerprints === null) {

      logger.error('No fingerprints found for ', fingerprint.documentName, ' in ', SCAN_FINGERPRINT_STATE.fingerTypes);
    } else {

      fingerprints.push({
        content: fingerprint.documentContent,
        name: fingerprint.documentName,
        title: fingerprint.title
      });

      logger.debug('handleAccpetScannedFingerprint > fingerprints = ', fingerprints);
    }
  }

  @handle(SIGN_DOCUMENT_ACTIONS.ACCEPT_SIGNED_DOCUMENT)
  handleAcceptSignedDocument(action, document) {

    let documentName = 'Upload';

    let documents = findSignedDocumentsByName(documentName);
    if (documents === null) {

      logger.error('No documents found for ', documentName, ' in ', SIGN_DOCUMENT_STATE.signTypes);
    } else {

      documents.push(document);
    }
  }

  @handle(WRAP_UP_ACTIONS.ACTIVATE_WRAP_UP)
  handleActivateWrapUp() {
    
    STATE.isWrappingUp = true;
  }

  @handle(WRAP_UP_ACTIONS.COMPLETE_WRAP_UP)
  handleCompleteWrapUp() {

    setDefaultState();
  }
  @handle(WRAP_UP_ACTIONS.ACCEPT_VIDEO_CALL)
  handleAcceptVideoCall() {
    STATE.isWrappingUp = false;
  }
}
/*
Set default STATE
*/
function setDefaultState() {

  STATE = {

    isWrappingUp: false
  };

  SCAN_DOCUMENT_STATE = {

    documentTypes: [{
      name: 'Bank Statement',
      documents: []
    }, {
      name: 'Proof of Address',
      documents: []
    }, {
      name: 'Payslip',
      documents: []
    }, {
      name: 'Identity Document',
      documents: []
    }]
  };

  SCAN_FINGERPRINT_STATE = {

    fingerTypes: [{
      name: 'Right Hand',
      documents: []
    },{
      name: 'Left Hand',
      documents: []
    },{
      name: 'Thumbs',
      documents: []
    }]
  };

  SIGN_DOCUMENT_STATE = {

    signTypes: [{
      name: 'Upload',
      documents: []
    }]
  };
}
/*
Find the documents by name
*/
function findDocumentsByName(documentName) {

  for (let documentType of SCAN_DOCUMENT_STATE.documentTypes) {

    if (documentType.name === documentName) {
      return documentType.documents;
    }
  }

  return null;
}
/*
Find the fingerprints by name
*/
function findFingerprintsByName(fingerprintName) {

  for (let fingerType of SCAN_FINGERPRINT_STATE.fingerTypes) {

    if (fingerType.name === fingerprintName) {
      return fingerType.documents;
    }
  }

  return null;
}
/*
Find the fingerprints by name
*/
function findSignedDocumentsByName(documentName) {

  for (let signType of SIGN_DOCUMENT_STATE.signTypes) {

    if (signType.name === documentName) {
      return signType.documents;
    }
  }

  return null;
}
