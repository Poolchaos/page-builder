import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import {SIGN_DOCUMENT_ACTIONS} from './sign.doc.actions';

const logger = LogManager.getLogger('SignDocumentStore');

let STATE = {

  instruction: null,
  signDocType: null,
  preview: null,
  canClose: null,
  documentSignatureIndex: null,
  documentSignatureRequested: null,
  documentSignatureReceived: null,
  signedDocument: null,
  document: null,
  file: null,
  documentSizeError: null,
  multiple: null
};

function setDefaultState() {

  STATE = {

    instruction: 'request',
    signDocType: null,
    preview: null,
    canClose: true,
    documentSignatureIndex: 0,
    documentSignatureRequested: false,
    documentSignatureReceived: false,
    signedDocument: null,
    document: null,
    file: null,
    documentSizeError: null,
    multiple: null
  };
}

export class SignDocumentStore {

  constructor() {

    setDefaultState();
  }

  get showUploadDocument() {

    return STATE.documentSignatureRequested === false && STATE.documentSignatureReceived === false;
  }

  get showDocumentOrPreview() {

    //    return (STATE.instruction === 'request') === true;
    return true;
  }

  get showMessageTitle() {

    return (!STATE.document && !STATE.preview && !STATE.documentSignatureRequested) === true;
  }

  get showDocumentTitle() {

    return (STATE.document !== null || STATE.preview !== null) === true;
  }

  get showDocument() {

    return (STATE.document && !STATE.preview) === true;
  }

  get showPreview() {

    return (STATE.preview && !STATE.document) === true;
  }

  get showSignTypes() {

    return (STATE.document && !STATE.documentSignatureReceived) === true;
  }

  get showWaiting() {

    return STATE.documentSignatureRequested === true;
  }

  get showClose() {

    return (!STATE.documentSignatureReceived && !STATE.documentSignatureRequested) === true;
  }

  get showDocumentActions() {

    return (STATE.document && STATE.documentSignatureReceived) === true;
  }

  get showNoClick() {

    return !STATE.canClose === true;
  }

  get documentTitle() {

    return STATE.preview ? STATE.preview.documentName : (STATE.document ? STATE.document.documentName : null);
  }

  get documentData() {

    return STATE.document ? STATE.document.documentTempURL : null;
  }

  get previewData() {

    return STATE.preview ? STATE.preview.url : null;
  }

  get document() {

    return STATE.document;
  }

  get file() {

    return STATE.file;
  }

  get multiple() {

    return STATE.multiple;
  }

  @handle(SIGN_DOCUMENT_ACTIONS.PROCESS_SIGNED_DOCUMENT)
  handleProcessSignedDocument(action, signedDocument) {

    STATE.signedDocument = signedDocument;
    STATE.documentSignatureRequested = false;
    STATE.documentSignatureReceived = false;
    STATE.documentSignatureIndex++;

    let document = {content: signedDocument};

    STATE.canClose = false;

    var docBlob = base64ToBlob(document.content.documentContent);
    var docURL = URL.createObjectURL(docBlob);

    document.documentContent = 'data:application/pdf;base64,' + document.content.documentContent;
    document.documentName = document.content.documentName;
    document.documentTempURL = docURL;

    STATE.documentSignatureReceived = true;
    STATE.document = document;
  }

  @handle(SIGN_DOCUMENT_ACTIONS.CANCEL_SIGNED_DOCUMENT)
  handleCancelSignedDocument() {

    // remote cancel
    STATE.document = null;

    STATE.signDocType = null;
    STATE.documentSignatureRequested = false;
    STATE.documentSignatureReceived = false;

    // local cancel
    STATE.document = null;

    STATE.signDocType = null;
    STATE.documentSignatureReceived = false;
    STATE.canClose = true;
  }

  @handle(SIGN_DOCUMENT_ACTIONS.ACCEPT_SIGNED_DOCUMENT)
  handleAcceptSignedDocument() {

    STATE.documentSignatureReceived = false;

    STATE.document = null;

    STATE.signDocType = null;
    STATE.canClose = true;

    //    setTimeout(() => {
    //      STATE.document = null;
    //      STATE.signDocType = null;
    //      STATE.canClose = true;
    //    }, 100);
  }

  @handle(SIGN_DOCUMENT_ACTIONS.REDO_SIGNED_DOCUMENT)
  handleRedoSignedDocument() {

    STATE.document = null;

    //    setTimeout(() => {
    //      STATE.document = null;
    //    }, 100);

    STATE.documentSignatureReceived = false;

    STATE.signDocType = null;
    STATE.canClose = false;
  }

  @handle(SIGN_DOCUMENT_ACTIONS.PREVIEW_SIGNED_DOCUMENT)
  handlePreviewSignedDocument(actions, document) {

    logger.debug('handlePreviewSignedDocument > document = ', document);

    STATE.preview = null;

    setTimeout(() => { // NEEDS THIS TIMEOUT TO REFRESH THE DOCUMENT CONTENT ON THE VIEW

      STATE.preview = {
        documentName: document.documentName,
        content: document.documentContent,
        url: document.documentTempURL
      };
    }, 100);

    logger.debug('handlePreviewSignedDocument > STATE.preview = ', STATE.preview);
  }

  @handle(SIGN_DOCUMENT_ACTIONS.UPLOAD_SELECTED_FILE)
  handleUploadSelectedFile(action, evt) {

    STATE.preview = null;
    var file = evt.target.files[0];
    let maxSize = 10000000; //10mb

    if (file.size > maxSize) {
      STATE.documentSizeError = 'Maximum file size exceeded. File size cannot exceed 1mb.';
      logger.error('handleUploadSelectedFile > STATE.documentSizeError = ', STATE.documentSizeError);
      return;
    }

    // convert file to Base64 before continueing
    blobToBase64(file, base64 => {

      STATE.canClose = false;
      STATE.documentSizeError = null;
      STATE.signDocType = 'Upload';

      var binaryString = evt.target.result;
      var convertedFile = base64;
      var docURL = URL.createObjectURL(file);

      STATE.file = {
        documentId: '',
        documentType: 'pdf',
        documentName: file.name,
        documentContent: convertedFile,
        documentTempURL: docURL
      };

      STATE.document = cloneObject(STATE.file);
      STATE.document.documentContent = 'data:application/pdf;base64,' + STATE.document.documentContent;
    });
  }

  @handle(SIGN_DOCUMENT_ACTIONS.SIGN_DOCUMENT)
  handleSignDocument(action, multiple) {

    STATE.multiple = multiple;

    STATE.documentSignatureRequested = true;

    STATE.document = null;

    STATE.canClose = false;

    //    document.forms[0].elements[0].value = '';
  }

  @handle(SIGN_DOCUMENT_ACTIONS.CLOSE_SIGN_DOCUMENT)
  handleCloseSignDocument() {

    setDefaultState();
  }
}

function blobToBase64(blob, callback) {

  var reader = new FileReader();
  reader.onload = function() {
    var dataUrl = reader.result;
    var base64 = dataUrl.split(',')[1];
    callback(base64);
  };

  reader.readAsDataURL(blob);
};

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

function cloneObject(obj) {

  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  var temp = obj.constructor(); // give temp the original obj's constructor
  for (var key in obj) {
    temp[key] = cloneObject(obj[key]);
  }

  return temp;
}
