import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import {SIGN_DOCUMENT_ACTIONS} from './signdocument.actions';
/*
*/
import {WebSocketKiosk, PeerService} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('SignDocumentService');
/*
*/
@inject(WebSocketKiosk, PeerService, Dispatcher)
export class SignDocumentService {

  constructor(webSocketKiosk, peerService, dispatcher) {

    this.peerService = peerService;

    this.socket = webSocketKiosk;
    this.dispatcher = dispatcher;

    doEventSubcriptions(webSocketKiosk, dispatcher);
  }

  acceptSignedDocument(document) {

    this.dispatcher.dispatch(SIGN_DOCUMENT_ACTIONS.ACCEPT_SIGNED_DOCUMENT, document);
  }

  redoSignedDocument(document, multiple) {

//    this.dispatcher.dispatch(SIGN_DOCUMENT_ACTIONS.REDO_SIGNED_DOCUMENT);

    this.signDocument(document, multiple);
  }

  cancelSignedDocument() {

    this.dispatcher.dispatch(SIGN_DOCUMENT_ACTIONS.CANCEL_SIGNED_DOCUMENT);
  }

  previewSignedDocument(document) {

    logger.debug('previewSignedDocument > document = ', document);

    this.dispatcher.dispatch(SIGN_DOCUMENT_ACTIONS.PREVIEW_SIGNED_DOCUMENT, document);
  }

  uploadSelectedFile(evt) {

    this.dispatcher.dispatch(SIGN_DOCUMENT_ACTIONS.UPLOAD_SELECTED_FILE, evt);
  }

  signDocument(document, multiple) {

    this.socket.direct({
      dst: this.peerService.remotePeerId,
      type: 'SIGN_DOC',
      payload: {
        document: document,
        multiple: multiple
      }
    });
    
    this.dispatcher.dispatch(SIGN_DOCUMENT_ACTIONS.SIGN_DOCUMENT, multiple);
  }

  cancelSignature() {

    let envelope = {
      dst: this.peerService.remotePeerId,
      type: 'SIGN_DOC',
      payload: 'CANCEL_SIGN'
    };
    
    this.socket.direct(envelope);
    
    this.dispatcher.dispatch(SIGN_DOCUMENT_ACTIONS.CANCEL_SIGNED_DOCUMENT);
  }

  discardSignature() {

    this.dispatcher.dispatch(SIGN_DOCUMENT_ACTIONS.CANCEL_SIGNED_DOCUMENT);
  }

  closeSignDocument() {

    this.dispatcher.dispatch(SIGN_DOCUMENT_ACTIONS.CLOSE_SIGN_DOCUMENT);
  }
  
  selectFile() {
    this.dispatcher.dispatch(SIGN_DOCUMENT_ACTIONS.SELECT_FILE);
  }
  
  clearSelectedFile() {
    this.dispatcher.dispatch(SIGN_DOCUMENT_ACTIONS.CLEAR_FILE);
  }
}
// do subscriptions privately to prevent it being done outside the lifecycle if the service
function doEventSubcriptions(socket, dispatcher) {

  function handleDocumentSigned(message) {
    
    logger.debug(' handleDocumentSigned >>>> ', message);

    if (!message.data || !message.data.payload) {

      logger.error('DOC_SIGNED > returned because the message data or message data payload is invalid');
      return;
    }

    dispatcher.dispatch(SIGN_DOCUMENT_ACTIONS.PROCESS_SIGNED_DOCUMENT, message.data.payload);
  }

  function handleSignCanceled(message) {

    dispatcher.dispatch(SIGN_DOCUMENT_ACTIONS.CANCEL_SIGNED_DOCUMENT);
  }

  // A document is signed
  socket.subscribe('DOC_SIGNED', (message) => handleDocumentSigned(message));

  // A document is canceled
  socket.subscribe('CANCEL_SIGN', (message) => handleSignCanceled(message));
}
