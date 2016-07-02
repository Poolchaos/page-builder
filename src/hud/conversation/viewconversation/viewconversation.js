/*
 */
import {Validation} from 'aurelia-validation';
import {inject, LogManager, BindingEngine} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
import {PeerService, UserSession} from 'zailab.common';
/*
 */
import {SCAN_FINGERPRINT_ACTIONS} from './scanfingerprint/scanfingerprint.actions';
import {VIEW_CONVERSATION_ACTIONS} from './viewconversation.actions';
import {CONVERSATION_ACTIONS} from '../conversation.actions';
import {HUD_ACTIONS} from '../../hud.actions';
import {ConversationStore} from '../conversation.store';
import {ViewConversationStore} from './viewconversation.store';
import {ViewConversationService} from './viewconversation.service';
/*
 */
import {ScanDocumentService} from './scandocument/scandocument.service';
import {ScanDocumentStore} from './scandocument/scandocument.store';
/*
 */
import {SignDocumentService} from './signdocument/signdocument.service';
import {SignDocumentStore} from './signdocument/signdocument.store';
/*
 */
import {ScanFingerprintService} from './scanfingerprint/scanfingerprint.service';
import {ScanFingerprintStore} from './scanfingerprint/scanfingerprint.store';
/*
 */
import {DocumentHistoryService} from './documenthistory/documenthistory.service';
import {DocumentHistoryStore} from './documenthistory/documenthistory.store';
/*
 */
const logger = LogManager.getLogger('ViewConversation');
/*
 */
@inject(Validation, BindingEngine, PeerService, Router, ConversationStore, ViewConversationStore, ViewConversationService, ScanDocumentService, ScanDocumentStore, SignDocumentService, SignDocumentStore, ScanFingerprintService, ScanFingerprintStore, DocumentHistoryService, DocumentHistoryStore, UserSession)
export class ViewConversation {

    //  resolve;
    oldConversationName = '';
    conversationName = '';
    conversationId;
    noNumbers = false;
    fingerprintDisabled = false;
    view = {
        none: true,
        channels: false,
        numbers: false,
        respond: false
    };

    constructor(validation, bindingEngine, peerService, router, conversationStore, viewConversationStore, viewConversationService, scanDocumentService, scanDocumentStore, signDocumentService, signDocumentStore, scanFingerprintService, scanFingerprintStore, documentHistoryService, documentHistoryStore, userSession) {

        this.router = router;
        this.validation = validation;
        this.bindingEngine = bindingEngine;
        this.peerService = peerService;
        this.userSession = userSession;
        this.conversationStore = conversationStore;
        this.viewConversationStore = viewConversationStore;
        this.viewConversationService = viewConversationService;

        this.scanDocumentService = scanDocumentService;
        this.scanDocumentStore = scanDocumentStore;

        this.signDocumentService = signDocumentService;
        this.signDocumentStore = signDocumentStore;

        this.scanFingerprintService = scanFingerprintService;
        this.scanFingerprintStore = scanFingerprintStore;

        this.documentHistoryService = documentHistoryService;
        this.documentHistoryStore = documentHistoryStore;

        this.viewConversationService.view(null);

        this.validation = this.validation.on(this)
            .ensure('conversationName').isNotEmpty().withMessage('Please do not leave this blank.').hasLengthBetween(2, 140);
    }

    configureRouter(config, router) {

        config.map([

            { route: 'call', name: 'call', moduleId: './callview/callview', nav: false, title: 'View Conversation' },
            { route: 'scandocument', name: 'scandocument', moduleId: './scandocument/scandocument', nav: false, title: 'Scan Document' },
            { route: 'signdocument', name: 'signdocument', moduleId: './signdocument/signdocument', nav: false, title: 'Sign Document' },
            { route: 'scanfingerprint', name: 'scanfingerprint', moduleId: './scanfingerprint/scanfingerprint', nav: false, title: 'Scan Fingerprint' },
            { route: 'documenthistory', name: 'documenthistory', moduleId: './documenthistory/documenthistory', nav: false, title: 'Document History' }
        ]);

        this.router = router;
    }

    //  canActivate(params) {
    //
    //    this.conversationId = params.conversationId;
    //
    //    this.viewConversationService.registerConversationJourneyOplog(this.conversationId);
    //    this.viewConversationService.retrieveConversationAttributes(this.conversationId);
    //    this.viewConversationService.retrieveConversationCardView(this.conversationId);
    //
    //    return new Promise((resolve) => this.resolve = resolve);
    //
    //  }


    activate(params) {
      logger.debug('start params', params);
      this.conversationId = params.conversationId;
      this.viewConversationService.activateVideoCall();

      this.conversationId = params.conversationId;

      this.viewConversationService.registerConversationJourneyOplog(this.conversationId);
      this.viewConversationService.retrieveConversationAttributes(this.conversationId);
      this.viewConversationService.retrieveConversationCardView(this.conversationId);
      this.viewConversationService.retrieveChannels();
    }

    setScroll() {


      let element = document.getElementById('wrapper');
      logger.debug(' setScroll >>>> ', element);

      if (!element) {

        setTimeout(() => {

            this.setScroll();
        }, 50);

        return;
      }

      element.scrollTop = element.scrollHeight;
      
//      setTimeout(() => {
//        detectScroll(this.viewConversationStore, this.viewConversationService);
//      }, 200);
    }

    get sidePanelTitle() {

        if (!this.viewConversationStore.conversationAttributes) {
            return;
        }

        let maxChar = 14;
        let title = this.viewConversationStore.conversationAttributes[0].firstName ? this.viewConversationStore.conversationAttributes[0].firstName + ' ' : ''
        title += this.viewConversationStore.conversationAttributes[0].surname ? this.viewConversationStore.conversationAttributes[0].surname : '';
      
        title = !this.viewConversationStore.conversationAttributes[0].firstName && !this.viewConversationStore.conversationAttributes[0].surname ? '...' : title;

        return title && title.length > maxChar ? title.substr(0, maxChar) + '...' : title;
    }

    get sidePanelConversation() {

        if (!this.conversationName) {
            return;
        }

        let maxChar = 14;
        let sideConversationName = this.conversationName;

        return sideConversationName.length > maxChar ? sideConversationName.substr(0, maxChar) + '...' : sideConversationName;
    }

    createContact() {

        this.router.navigate('contact/create');
        this.viewConversationService.toggleVideoMode(true);
    }

    linkInteraction() {

        this.router.parent.navigate(`interaction/link/${this.conversationId}?routedFrom=viewConversation`);
        this.viewConversationService.toggleVideoMode(true);
    }

    unlinkInteraction() {

        this.router.parent.navigate(`interaction/unlink/${this.conversationId}`);
        this.viewConversationService.toggleVideoMode(true);
    }

    tagConversation() {

        logger.warn('unimplemented...');
    }

    addNote() {

        logger.warn('unimplemented...');
    }

    createConversation() {

        logger.warn('unimplemented...');
    }

    /* Navigation Start */
    conversation() {

        this.viewConversationService.view(null);
        this.router.navigate('call');
        this.viewConversationService.toggleVideoMode(false);
    }

    scanDocument() {

        logger.debug(' scan document selected...');
        this.viewConversationService.view('scan');
        this.router.navigate('scandocument');
        this.viewConversationService.toggleVideoMode(true);
    }

    signDocument() {

        logger.debug(' sign document selected...');
        this.viewConversationService.view('sign');
        this.router.navigate('signdocument');
        this.viewConversationService.toggleVideoMode(true);
    }

    scanFingerprint() {

        logger.debug(' scan document selected...');
        this.viewConversationService.view('fingerprint');
        this.router.navigate('scanfingerprint');
        this.viewConversationService.toggleVideoMode(true);
    }

    documentHistory() {

        this.viewConversationService.view('history');
        this.router.navigate('documenthistory');
        this.viewConversationService.toggleVideoMode(true);
    }
    /* Navigation End */

    /* Scan Document Instructions Start */

    initiateScanDocument() {

        this.viewConversationService.view('scan_scanning');
        this.scanDocumentService.initiateScan();
    }

    cancelScanDocument() {

        this.scanDocumentService.cancelScan();
        this.viewConversationService.view('scan');
    }

    discardScanDocument() {

        this.scanDocumentService.discardScan();
        this.viewConversationService.view('scan');
    }

    acceptScanDocument(isNext) {

        this.scanDocumentService.acceptDocument(this.scanDocumentStore.scanPreview, isNext);

        if (!isNext) {

            this.router.navigate('scandocument');
            this.viewConversationService.view('scan');
        }
    }

    nextScanDocument() {

        this.acceptScanDocument(true);
        this.requestScan(this.scanDocumentStore.scanType);
        this.viewConversationService.view('scan_request');
    }

    redoScanDocument() {

        this.scanDocumentService.resetDocument();
        this.requestScan(this.scanDocumentStore.scanType);
    }

    requestScan(type) {

        this.scanDocumentService.requestScan(type);
    }
    /* Scan Document Instructions end */

    /* Sign Document Instructions start */
    cancelSignature() {

        this.signDocumentService.cancelSignature();
        this.viewConversationService.view('sign');
    }

    acceptSignature() {

        this.router.navigate('signdocument');
        this.signDocumentService.acceptSignedDocument(this.signDocumentStore.document);
        this.viewConversationService.view('sign');
    }

    redoSignature() {

        this.signDocumentService.redoSignedDocument(this.signDocumentStore.file, this.signDocumentStore.multiple);
        this.viewConversationService.view('sign_request');
    }

    discardSignature() {

        this.signDocumentService.cancelSignedDocument();
        this.viewConversationService.view('sign');
    }
    /* Sign Document Instructions end */

    /* Scan Fingerprint Instructions start */
    instructThumbs() {

        this.scanFingerprintService.scanThumbsFingerprints();
    }

    instructFingers() {

        this.scanFingerprintService.scanHandsFingerprints(this.scanFingerprintStore.firstFinger);
    }

    nextFinger() {

        this.scanFingerprintService.scanNextFingerprint(this.scanFingerprintStore.nextFinger);
    }

    skipFinger() {

        this.scanFingerprintService.skipScanFingerprint(this.scanFingerprintStore.nextFinger);
    }

    accept() {

        if (!this.fingerprintDisabled) {

            logger.debug(' ---------------- accept ----------------- ', this.fingerprintDisabled);

            this.fingerprintDisabled = true;


            this.router.navigate('scanfingerprint');
            this.scanFingerprintService.acceptFingerprint(this.scanFingerprintStore.document);
            this.viewConversationService.view('fingerprint');
        }
    }

    redo() {

        this.scanFingerprintService.redoScanFingerprint(this.scanFingerprintStore.instruction, this.scanFingerprintStore.currentFinger);
    }

    cancelFingerprint() {

        this.scanFingerprintService.stopFingerprint();
        this.viewConversationService.view('fingerprint');
    }

    discardFingerprint() {
        this.scanFingerprintService.cancelFingerprint();
        this.viewConversationService.view('fingerprint');
    }
    /* Scan Fingerprint Instructions end */

    /* Document History start */
    scannedDocuments() {
        this.documentHistoryService.view('scan');
    }

    signedDocuments() {
        this.documentHistoryService.view('sign');
    }

    scannedFingerprints() {
        this.documentHistoryService.view('fp');
    }
    /* Document History end */

    viewContact(contact) {

        for (let item of this.viewConversationStore.conversationAttributes) {

            if (item.closing) {
                item.closing = false;
            }

            if (item.selected) {
                item.closing = true;
            }

            item.selected = false;
        }

        contact.selected = true;
    }

    downloadZip() {
        this.viewConversationService.downloadZip();
    }

    editContact(contact) {

        this.viewConversationService.toggleVideoMode(true);

        let contactId = contact.contactId;
        let conversationId = this.conversationId;

        this.router.parent.navigate(`contact/edit/${contactId}?conversationId=${conversationId}`);
    }

    changeName() {

        this.validation.validate()
            .then(() => {
                this.oldConversationName = this.conversationName;
                this.viewConversationService.changeConversationName(this.conversationName, this.conversationId);
                this.toggleChangeName(false);
            })
            .catch(error => {
                logger.warn('changeName > validation error > ', error);
            });

    }

    toggleChangeName(isEdit) {

        this.editConversationName = isEdit;

        setTimeout(() => {
            setFocus('conversationName');
        }, 100);
    }

    cancelChangeName() {

        this.toggleChangeName(false);
        this.conversationName = this.oldConversationName;
    }

    conversationStatus() {

        let interactionId = (this.viewConversationStore.conversationJourney && this.viewConversationStore.conversationJourney[0]) ? this.viewConversationStore.conversationJourney[0].interactionId : '';

        this.router.parent.navigate(`status/${this.conversationId}?interactionId=${interactionId}`);
    }

    reply() {

        let el = document.getElementById('replyText');

        if (!el) {

            setTimeout(() => {
                this.reply();
            }, 10);

            return;
        }

        el.focus();
    }

    send() {

        this.view.none = true;
        this.view.channels = false;
        this.view.numbers = false;
        this.view.respond = false;

        this.viewConversationService.replyToMessage(this.replyMessage, this.selectedTelephoneNumber);
        this.replyMessage = '';
    }

    clearState() {

        for (var i in this.view) {

            this.view[i] = false;
        }
      this.replyMessage = '';
      this.selectedTelephoneNumber = null;
      this.noNumbers = false;
      logger.debug('clearingstate >>>>>');
    }

    newInteraction() {

        this.clearState();
        this.view.channels = true;
    }

    cancelInteraction() {

        this.clearState();
        this.view.none = true;
    }

    selectChannel(channelName) {

      this.clearState();
      this.selectedChannel = channelName;
        
      if(channelName === 'SMS') {

        if (this.viewConversationStore.smsNumbers.length === 1) {

          this.selectedTelephoneNumber = this.viewConversationStore.smsNumbers[0];
          this.replyToText();
          return;
        } else if (this.viewConversationStore.smsNumbers.length === 0) {
          this.noNumbers = true;
          logger.debug(this.noNumbers + ' noNumbers >>>>>>>')

          return;
        }

      } else if(channelName === 'CALL') {

        if (this.viewConversationStore.contactNumbers.length === 1) {

          this.selectedTelephoneNumber = this.viewConversationStore.contactNumbers[0];
          this.dial();
          this.cancelInteraction();
          return;
        }
      }

      this.view.numbers = true;
    }

    selectNumber(telephoneNumber) {

        this.clearState();
        this.selectedTelephoneNumber = telephoneNumber;
      
        if(this.selectedChannel === 'SMS') {
          this.replyToText();
        } else if(this.selectedChannel === 'CALL') {
          this.dial();
          this.cancelInteraction();
          return;
        }
    }

    replyToText() {

        this.view.respond = true;

        let text = document.getElementById('replyText');

        if (!text) {

            setTimeout(() => {

                this.replyToText();
            }, 50);

            return;
        }

        text.maxLength = smsCount().maxLength;
        text.focus();
    }

    get countRemaining() {

      return smsCount(this.replyMessage).numberOfCharactersLeft();
    }

    get countSms() {

      return smsCount(this.replyMessage).getSmsCount();
    }

    dial() {

      this.viewConversationService.dial(this.userSession.loggedInUser.email, this.selectedTelephoneNumber);
    }

    @handle(VIEW_CONVERSATION_ACTIONS.RETRIEVE_CONVERSATION_CARD_ATTRIBUTES)
    @waitFor(ViewConversationStore)
    handleRetrieveConversationCardAttributes(event, conversation) {

        this.conversationName = conversation.conversationName;
        this.oldConversationName = conversation.conversationName;
    }

    @handle(HUD_ACTIONS.AGENT_STATUS_LOGGED)
    @waitFor(ConversationStore)
    handleAgentStatusChanged(action, status) {

        logger.debug(' applicationService >>> handleAgentStatusChanged >>> ', status);

        setTimeout(() => {

            if (status === 'WRAP_UP' && this.viewConversationStore.isVideoCallConnected) {
                logger.debug('This is the ROUTER >>>>', this.router);
                this.router.navigate('documenthistory');
            }
        }, 200);
    }

    @handle(SCAN_FINGERPRINT_ACTIONS.ACCEPT_SCANNED_FP)
    @waitFor(ScanFingerprintStore)
    handleAcceptScannedFingerprint() {

        logger.debug(' SCAN_FINGERPRINT_ACTIONS.ACCEPT_SCANNED_FP >>>> ', this.fingerprintDisabled);

        this.fingerprintDisabled = false;
    }

    @handle(VIEW_CONVERSATION_ACTIONS.RETRIEVE_CONVERSATION_JOURNEY)
    @waitFor(ViewConversationStore)
    handleRetrieveConversationJourney() {

        setTimeout(() => {

            this.setScroll();
        }, 300);
    }

  @handle(VIEW_CONVERSATION_ACTIONS.VIEW_INTERACTION)
  @waitFor(ViewConversationStore)
  handleViewInteraction(action, data) {
    
    let el = document.getElementsByClassName('message-wrapper_pos_' + data.index)[0];
    let element = document.getElementById('wrapper');
    let elemTop = el.offsetTop;

    element.scrollTop = elemTop - 60;
    
    
  }
}
/*
*/
function setFocus(field) {

    let firstElement = document.getElementById(field);
    if (firstElement !== null) {
        firstElement.focus();
    } else {

        setTimeout(() => {

            setFocus(field);
        }, 100);
    }
}
/*
*/
function smsCount(text) {
  
  let smsSize = {
    1: {
      gsm: 160,
      uni: 70
    }, 
    2: {
      gsm: 306,
      uni: 134
    }, 
    3: {
      gsm: 459,
      uni: 201
    }, 
    4: {
      gsm: 612,
      uni: 268
    }
  };
  
  let length = text ? text.length : 0;
  
  let getCount = function(index1, index2) {
    
    if(!index2) {
      return length < smsSize[index1].gsm;
    } else {
      return length > smsSize[index1].gsm && length <= smsSize[index2].gsm;
    }
  }
  
  let checkCount = function() {
    
    let count = 1;
    
    if(getCount('1')) {
      count = 1;
    } else if(getCount('1', '2')) {
      count = 2;
    } else if(getCount('2', '3')) {
      count = 3;
    } else if(getCount('3', '4')) {
      count = 4;
    }

    return count;
  };

  let numberOfCharactersLeft = function() {
  
    return smsSize[checkCount()].gsm - length;
  };
  
  return {
    getSmsCount: checkCount,
    numberOfCharactersLeft: numberOfCharactersLeft,
    maxLength: smsSize['4'].gsm
  };
}
/*
*/
function detectScroll(viewConversationStore, viewConversationService) {
  
  let element = document.getElementById('wrapper');

  if (!element) {

    setTimeout(() => {

        this.detectScroll(viewConversationStore, viewConversationService);
    }, 50);

    return;
  }
  
  element.onscroll = function (e) {  
  
    
    if(this.disabled) return;
    
    this.disabled = true;
    findElement(viewConversationStore, false, viewConversationService);
    
    setTimeout(() => {
      this.disabled = false;
    }, 100);
  } 
}
/*
*/
function scrollIntoView(el) {
  
  let element = document.getElementById('conversation_jouney_wrapper');
  
//  let currentScroll = element.scrollTop;
  
  let elemTop = el.offsetTop;
  console.log(' elemTop >>>> ', elemTop);
  
  
  element.scrollTop = elemTop;
  
}
/*
*/
function findElement(viewConversationStore, lookForBigger, viewConversationService) {

  for(let waypoint of viewConversationStore.conversationJourneyReversed) {
    
    waypoint.found = isScrolledIntoView(waypoint.loc, lookForBigger);
  }
  
  for(let waypoint of viewConversationStore.conversationJourneyReversed) {
    
    if(waypoint.found) {
      
      waypoint.found = false;
      viewConversationService.viewInteraction(null, waypoint.loc);
      
      let els = document.getElementsByClassName('js-' + waypoint.loc);
    
      for(let el of els) {

        scrollIntoView(el);
//        el.scrollIntoView(true);
      }
      
      let element = document.getElementById('conversation_jouney_wrapper');
      element.scrollTop = element.scrollTop - 20;
      return;
    }
  }
  
  setTimeout(() => {
    
    findElement(viewConversationStore, true, viewConversationService);
  }, 100);
}
/*
*/
function isScrolledIntoView(element, lookForBigger) {
  
  let wrapperHeight = $('#wrapper').height();
  let docViewTop = $('#wrapper').scrollTop();
  let docViewBottom = docViewTop + wrapperHeight;
  
  let el = $('.message-wrapper_' + element)[0];
  let elemTop = el.offsetTop;
  let elemBottom = elemTop + el.offsetHeight;
  
  if(lookForBigger && el.offsetHeight >= wrapperHeight) {
  
    let topSize = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320];

    for(let value of topSize) {

      if(elemTop >= docViewTop - value) {

        return (elemTop >= docViewTop - value);
      }
    }
  }
  
  return ((elemBottom <= docViewBottom + 20) && (elemTop >= docViewTop - 3)); // for items smaller thank content area 
}