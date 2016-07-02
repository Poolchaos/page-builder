/*
 zailab
 */
import {SCAN_DOCUMENT_ACTIONS} from './scandocument/scandocument.actions';
import {SIGN_DOCUMENT_ACTIONS} from './signdocument/signdocument.actions';
import {SCAN_FINGERPRINT_ACTIONS} from './scanfingerprint/scanfingerprint.actions';
import {DOCUMENT_HISTORY} from './documenthistory/documenthistory.actions';
import {VIEW_CONVERSATION_ACTIONS} from './viewconversation.actions';
import {HUD_ACTIONS} from '../../hud.actions';
import {DateTimeTools, SortTools} from 'zailab.common';
/*
 aurelia
 */
import {handle} from 'aurelia-flux';
import {inject, LogManager} from 'aurelia-framework';
/*
 Logger
 */
const logger = LogManager.getLogger('ViewConversationStore');
/*
 the state is bound to the view via the store.
 */
let STATE = {

  isVideoCallConnected:    false,
  isVideoCallDisconnected: true,
  conversationAttributes: null,
  conversationJourney: null,
  interactionJourney: null,
  conversationCard: null,
  actionsToView: null,
  statusConversationId: null,
  canceledFp: false
};
/*
 the store wraps the state to control how it is changed.
 */
@inject(DateTimeTools)
export class ViewConversationStore {

  constructor(dateTimeTools) {

    this.dateTimeTools = dateTimeTools;
  }

  get allActions() {
    return STATE.actionsToView ? false : true;
  }

  /* scan getters start */
  get scanActions() {
    return STATE.actionsToView && STATE.actionsToView.indexOf('scan') !== -1;
  }

  get showScanInstructions() {
    return STATE.actionsToView === 'scan';
  }
  /* scan getters end */

  /* sign getters start */
  get signActions() {
    return STATE.actionsToView && STATE.actionsToView.indexOf('sign') !== -1;
  }

  get selectDocumentToSign() {
    return STATE.actionsToView === 'sign';
  }
  /* sign getters end */

  /* fingerprint getters start */
  get fingerprintActions() {
    return STATE.actionsToView && STATE.actionsToView.indexOf('fingerprint') !== -1;
  }

  get showFingerprintInstructions() {
    return STATE.actionsToView === 'fingerprint';
  }
  /* fingerprint getters end */

  /* document history start */
  get documentHistory() {
    return STATE.actionsToView && STATE.actionsToView.indexOf('history') !== -1;
  }
  /* document history end */

  /* common instructions getters start */
  get instructionRequestActions() {
    return STATE.actionsToView && STATE.actionsToView.indexOf('request') !== -1;
  }

  get showPreview() {
    return STATE.actionsToView && STATE.actionsToView.indexOf('preview') !== -1;
  }
  /* common instructions getters end */

  get isVideoCallDisconnected() {

    return STATE.isVideoCallDisconnected;
  }

  set isVideoCallDisconnected(isVideoCallDisconnected) {

    throw new Error(`Try dispatching ${VIEW_CONVERSATION_ACTIONS}`);
  }

  get isVideoCallConnected() {

    return STATE.isVideoCallConnected;
  }

  set isVideoCallConnected(isVideoCallConnected) {

    throw new Error(`Try dispatching ${VIEW_CONVERSATION_ACTIONS}`);
  }

  get conversationAttributes() {

    return STATE.conversationAttributes;
  }

  get conversationJourney() {

    return STATE.conversationJourney;
  }

  get conversationJourneyReversed() {

    return STATE.conversationJourneyReversed;
  }

  get interactionJourney() {

    return STATE.interactionJourney;
  }

  get conversationCard() {

    return STATE.conversationCard;
  }

  get statusConversationId() {

    return STATE.statusConversationId;
  }

  get canceledFp() {

    return STATE.canceledFp;
  }

  get channels() {

    return STATE.channels;
  }

  get contactNumbers() {

    return STATE.contactNumbers;
  }

  get smsNumbers() {

    return STATE.smsNumbers;
  }
  
  get conversationJourneyItemWidth() {
    
    let windowWidth = window.innerWidth;
    let setWidth = '178px'; // bigger than 1366
    
    if(windowWidth <= 1366 && windowWidth > 1280) {
      
      setWidth = '118px';
    } else if(windowWidth <= 1280) {
      
      setWidth = '100px';
    }
    
    return setWidth;
  }

  @handle(VIEW_CONVERSATION_ACTIONS.TAB_NAVIGATE)
  handleTabNavigate(action, tab) {

    logger.debug(' TAB_NAVIGATE >>> ', tab);

    STATE.actionsToView = tab;
  }

  @handle(VIEW_CONVERSATION_ACTIONS.CONNECT_VIDEO_CALL)
  handleStartVideo() {

    STATE.isVideoCallConnected = true;
    STATE.isVideoCallDisconnected = false;
  }

  @handle(VIEW_CONVERSATION_ACTIONS.RETRIEVE_ORGANISATION_CHANNELS)
  handleStartVideo(action, channels) {

    logger.debug('RETRIEVE_ORGANISATION_CHANNELS >>>> ', channels);

    STATE.channels = channels;
  }

  @handle(VIEW_CONVERSATION_ACTIONS.RETRIEVE_CONVERSATION_ATTRIBUTES)
  handleRetrieveConversationAttributes(event, conversation) {
    if(!conversation || !conversation[0]){
      return;
    }

    let numbers = [];
    let smsNumbers = [];
    let mobileCounter = 0;

    for(let contact of conversation) {

      for(let telephoneNumber of contact.telephoneNumbers) {

        numbers.push(telephoneNumber.number);
        
        if(telephoneNumber.type === 'MOBILE') {
          
          mobileCounter++;
          telephoneNumber.type = 'MOBILE ' + mobileCounter;
          
          smsNumbers.push(telephoneNumber.number);
        }
      }
    }

    conversation[0].selected = true;
    STATE.conversationAttributes = conversation;
    STATE.contactNumbers = numbers;
    STATE.smsNumbers = smsNumbers;
  }

  @handle(VIEW_CONVERSATION_ACTIONS.RETRIEVE_CONVERSATION_CARD_ATTRIBUTES)
  handleRetrieveConversationCardAttributes(event, card) {

    logger.debug('handleRetrieveConversationCardAttributes >> ');

    STATE.conversationCard = card;
  }

  @handle(VIEW_CONVERSATION_ACTIONS.CLEAR_STORE)
  handleClearStore(event, data) {

    STATE.conversationAttributes = null;
    STATE.conversationJourney = null;
    STATE.conversationCard = null;
  }

  @handle(VIEW_CONVERSATION_ACTIONS.VIEW_INTERACTION)
  handleViewInteraction(action, data) {
    
    if(!data.waypoint) {
      
      for(let pointCheck of this.conversationJourney) {
        
        if(pointCheck.loc === data.index) {
          
          data.waypoint = pointCheck;
        }
      }
    }
    
    //set conversation journey active state
    for(let point of this.conversationJourney) {
      
      point.active = false;
      
      if(point.interactionId === data.waypoint.interactionId) {
        
        point.active = true;
      }
    }
    
    //set interaction journey active state on right
    for(let pointRev of this.conversationJourneyReversed) {
      
      pointRev.active = false;
      
      if(pointRev.interactionId === data.waypoint.interactionId) {
        
        pointRev.active = true;
      }
    }
    
  }

  @handle(VIEW_CONVERSATION_ACTIONS.RETRIEVE_CONVERSATION_JOURNEY)
  handleRetrieveConversationJourney(event, conversationJourney) {
    
    logger.debug(' conversationJourney >>> ', conversationJourney);
    let conversationJourneyReversed = [];
    
    for (let wayPoint of conversationJourney) {
//      if (wayPoint.channel === 'Kiosk Call') {
//        wayPoint.from = 'Kiosk';
//      }
      
      wayPoint.from = wayPoint.type === 'Outbound' || (wayPoint.type === 'Private' && wayPoint.channel === 'Outbound Call') || wayPoint.channel === 'Outbound Call' ? (wayPoint.member ? wayPoint.member.firstName + ' ' + wayPoint.member.surname : (wayPoint.members && wayPoint.members.length > 0 ? wayPoint.members[0].firstName + ' ' + wayPoint.members[0].surname : wayPoint.from)) : wayPoint.from;
      
      wayPoint.to = (!wayPoint.to || wayPoint.type === 'Contact Centre Flow' && wayPoint.channel === 'SMS') || wayPoint.channel === 'Inbound Call' ? (wayPoint.member ? wayPoint.member.firstName + ' ' + wayPoint.member.surname : (wayPoint.members && wayPoint.members.length > 0 ? wayPoint.members[0].firstName + ' ' + wayPoint.members[0].surname : wayPoint.to)) : wayPoint.to;

      wayPoint.callOutcome = wayPoint.callOutcome ? wayPoint.callOutcome.toUpperCase() : '';
      wayPoint.startTime = wayPoint.timestamp === 0 ? '-' : this.dateTimeTools.convertToLocalTime(wayPoint.timestamp, 'UTC');
      wayPoint.endTime = wayPoint.timestamp === 0 ? '-' : this.dateTimeTools.convertToLocalTime(wayPoint.timestamp, 'UTC');
      wayPoint.duration = wayPoint.duration === 0 ? '-' : this.dateTimeTools.convertMillisecondsToTime(wayPoint.duration);
      
      var objDate = new Date(wayPoint.startTime.date),
      locale = "en-us",
      month = objDate.toLocaleString(locale, { month: "long" }),
      day = objDate.getDate();

      wayPoint.convertedDate = day + ' ' + month;
      
      conversationJourneyReversed.push(cloneObject(wayPoint));
    }
    
    if(conversationJourneyReversed[conversationJourneyReversed.length - 1]) {
      conversationJourneyReversed[conversationJourneyReversed.length - 1].active = true;
    }
    if(conversationJourney[conversationJourney.length - 1]) {
      conversationJourney[conversationJourney.length - 1].active = true;
    }
    
    conversationJourneyReversed.sort(SortTools.compareBy('timestamp'));
    STATE.conversationJourneyReversed = conversationJourneyReversed;
    STATE.conversationJourneyReversed;
    STATE.conversationJourney = conversationJourney;
    STATE.conversationJourney.sort(SortTools.compareBy('timestamp')).reverse();

    
    for(let i = 0; i < STATE.conversationJourneyReversed.length; i++) {
      
      STATE.conversationJourneyReversed[i].loc = 'pos_' + (STATE.conversationJourneyReversed.length - i - 1);
    }
    
    for(let s = 0; s < STATE.conversationJourney.length; s++) {
      
      STATE.conversationJourney[s].loc = 'pos_' + (STATE.conversationJourney.length - s - 1);
    }
  }

  @handle(VIEW_CONVERSATION_ACTIONS.RETRIEVE_INTERACTION_JOURNEY)
  handleRetrieveInteractionJourney(event, data) {
    let interactionJourney = [];

    if(!data || !data.wayPoints){
      STATE.interactionJourney = [];
      return;
    }

    for (let wayPoint of data.wayPoints) {

      let interaction = {};

      interaction.time = this.dateTimeTools.convertToLocalTime(wayPoint.timestamp, 'UTC').time;

      switch (wayPoint.type){

        case 'START':
          interaction.icon = 'started';
          interaction.label = 'Started';
          interaction.status = 'pending';
          interaction.description = 'Time';
          break;

        case 'WAIT':
          let time = this.dateTimeTools.convertMillisecondsToTime(wayPoint.duration);
          interaction.icon = 'waitTime';
          interaction.label = 'Wait Time';
          interaction.status = 'pending';
          interaction.description = 'Duration';
          interaction.time = time;
          break;

        case 'CONNECT':
          interaction.icon = 'member';
          interaction.label = wayPoint.member.firstName + ' ' + wayPoint.member.surname;
          interaction.status = 'connected';
          interaction.description = 'Time';
          break;

        case 'END':
          interaction.icon = 'ended';
          interaction.label = 'Ended';
          interaction.status = 'ended';
          interaction.description = 'Time';
          break;
      }

      interactionJourney.push(interaction);
    }

    STATE.interactionJourney = interactionJourney;
  }

  /* Scan Document Handlers Start */
  @handle(SCAN_DOCUMENT_ACTIONS.REQUEST_SCAN)
  handleInitiateScan(action, type) {

    STATE.actionsToView = 'scan_request';
  }

  @handle(SCAN_DOCUMENT_ACTIONS.PROCESS_SCAN)
  handleProcessScan(action, content) {

    STATE.actionsToView = 'scan_preview';
  }
  /* Scan Document Handlers End */

  /* Sign Document Handlers Start */
  @handle(SIGN_DOCUMENT_ACTIONS.SIGN_DOCUMENT)
  handleSignDocument(action, multiple) {

    STATE.actionsToView = 'sign_request';
  }

  @handle(SIGN_DOCUMENT_ACTIONS.PROCESS_SIGNED_DOCUMENT)
  handleProcessSignedDocument(action, signedDocument) {

    STATE.actionsToView = 'sign_preview';
  }
  /* Sign Document Handlers End */

  /* Scan Fingerprint Handlers Start */

  @handle(SCAN_FINGERPRINT_ACTIONS.SCAN_NEXT_FP)
  @handle(SCAN_FINGERPRINT_ACTIONS.SCAN_HANDS)
  @handle(SCAN_FINGERPRINT_ACTIONS.SCAN_THUMBS)
  handleScanThumbsFingerprints() {
    STATE.canceledFp = false;
    STATE.actionsToView = 'fingerprint_request';
  }

  @handle(SCAN_FINGERPRINT_ACTIONS.PROCESS_SCANNED_FP)
  handleProcessScannedFingerprint(action, fingerprint) {

    if(STATE.canceledFp) {
      logger.debug(" PROCESS_SCANNED_FP > Not showing finger print actions as processing finger print has already been closed");
      return;
    }

    STATE.actionsToView = 'fingerprint_preview';
    STATE.canceledFp = false;
  }
  /* Scan Fingerprint Handlers End */

  /* Document History Handlers Start */
  @handle(DOCUMENT_HISTORY.PREVIEW_SCAN)
  @handle(DOCUMENT_HISTORY.PREVIEW_SIGN)
  handlePreviewScan(action, scan) {

    STATE.actionsToView = 'history_preview';
  }
  /* Document History Handlers End */

  @handle(HUD_ACTIONS.AGENT_STATUS_LOGGED)
  handleAgentStatusChanged(action, status) {

    logger.debug(' applicationService >>> handleAgentStatusChanged >>> ', status);
    setTimeout(() => {

      if (status !== 'WRAP_UP') {
        STATE.isVideoCallConnected = false;
        STATE.isVideoCallDisconnected = true;
      }
    }, 200);
  }

  @handle(SCAN_FINGERPRINT_ACTIONS.CANCEL_SCANNED_FP)
  handleCancelScannedFingerprint() {

    STATE.canceledFp = true;
  }
}

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