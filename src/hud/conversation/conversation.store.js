/*
 */
import {DateTimeTools, SortTools, MESSAGE_EVENTS} from 'zailab.common';
/*
 */
import {CONVERSATION_ACTIONS} from './conversation.actions';
import {LINK_INTERACTION_ACTIONS} from './linkinteraction/linkinteraction.actions';
import {VIEW_CONVERSATION_ACTIONS} from './viewconversation/viewconversation.actions';
import {SCAN_DOCUMENT_ACTIONS} from './viewconversation/scandocument/scandocument.actions';
import {SIGN_DOCUMENT_ACTIONS} from './viewconversation/signdocument/signdocument.actions';
import {SCAN_FINGERPRINT_ACTIONS} from './viewconversation/scanfingerprint/scanfingerprint.actions';
import {HUD_ACTIONS} from '../hud.actions';
/*
 */
import {LogManager, inject} from 'aurelia-framework';
import {handle} from 'aurelia-flux';

/*
 */

const logger = LogManager.getLogger('ConversationStore');
/*
 */
let STATE = {

  selectedContact: {},
  selectedInteractions: null,
  isVideoConversation: false,
  inWrapUpState: false,
  selectedConversation: {},
  searchContact: {},
  newConversation: null,
  contacts: null,
  conversations: [],
  hasSearched: null,
  contactToEdit: null,
  documents: {
    scannedDocuments: [{
      type: 'BANK STATEMENTS',
      scans: []
    }, {
      type: 'IDENTITY DOCUMENT',
      scans: []
    }, {
      type: 'PAYSLIP',
      scans: []
    }, {
      type: 'PROOF OF ADDRESS',
      scans: []
    }],
    fingerprintDocuments: [],
    signedDocuments: []
  },
  textMessages: [],
  titles: ['Mr', 'Mrs', 'Miss'],
  numberTypes: ['Cell number', 'Home Number', 'Work Number', 'Other']
};
/*
 */

@inject(DateTimeTools)
export class ConversationStore {
	
	constructor(dateTimeTools) {
		this.dateTimeTools = dateTimeTools;
	}

  get selectedContact() {

    return STATE.selectedContact;
  }

  get selectedInteractions() {

    return STATE.selectedInteractions;
  }
  get isVideoConversation() {

    return STATE.isVideoConversation;
  }

  get hasSearched() {

    return STATE.hasSearched;
  }

  get selectedConversation() {

    return STATE.selectedConversation;
  }
  get searchContact() {

    return STATE.searchContact;
  }

  get newConversation() {

    return STATE.newConversation;
  }

  get contacts() {

    return STATE.contactToEdit ? [STATE.contactToEdit] : STATE.contacts;
  }

  get conversations() {

    return STATE.conversations;
  }

  get documents() {

    return STATE.documents;
  }

  get scannedDocuments() {
    
    return STATE.documents.scannedDocuments;
  }

  get fingerprintDocuments() {

    return STATE.documents.fingerprintDocuments;
  }

  get signedDocuments() {

    return STATE.documents.signedDocuments;
  }

  get inWrapUpState() {

    return STATE.inWrapUpState;
  }

  get contactToEdit() {

    return STATE.contactToEdit;
  }

  get titles() {

    return STATE.titles;
  }

  get numberTypes() {

    return STATE.numberTypes;
  }
  
  get textMessages() {
    
    return STATE.textMessages;
  }

  clearState() {
    STATE = {

      selectedContact: {},
      selectedInteractions: null,
      inWrapUpState: false,
      selectedConversation: {},
      searchContact: {},
      newConversation: null,
      contacts: null,
      conversations: [],
      hasSearched: null,
      contactToEdit: null,
      documents: {
        scannedDocuments: [{
          type: 'BANK STATEMENTS',
          scans: []
        }, {
          type: 'IDENTITY DOCUMENT',
          scans: []
        }, {
          type: 'PAYSLIP',
          scans: []
        }, {
          type: 'PROOF OF ADDRESS',
          scans: []
        }],
        fingerprintDocuments: [],
        signedDocuments: []
      },
      textMessages: []
    };
  }

  @handle(CONVERSATION_ACTIONS.SEARCH_CONTACT)
  handleSearchContact(event, contacts) {

    STATE.hasSearched = true;
    STATE.contactToEdit = null;
    STATE.contacts = contacts;
    STATE.contacts.sort(SortTools.compareBy('firstName'));
  }

  @handle(CONVERSATION_ACTIONS.SELECT_CONTACT)
  handleSelectContact(event, contact) {

    STATE.selectedContact = contact;
  }

  @handle(CONVERSATION_ACTIONS.SELECT_CONVERSATION)
  handleSelectConversation(event, conversation) {

    STATE.selectedConversation = conversation;
  }

  @handle(CONVERSATION_ACTIONS.CREATE_CONTACT)
  handleCreateContact(event, contact) {

    STATE.selectedContact = contact;
  }

  @handle(CONVERSATION_ACTIONS.TELEPHONE_NUMBER_ADDED_TO_CONTACT)
  handleTelephoneNumberAddedToContact(event, number) {
    
    STATE.selectedContact[number.type.toLowerCase() === 'mobile' ? 'cellNumber' : number.type.toLowerCase() + 'Number'] = number.telephoneNumber;
  }

  @handle(CONVERSATION_ACTIONS.EMAIL_ADDED_TO_CONTACT)
  handleEmailAddedToContact(event, email) {
    
    STATE.selectedContact.email = email.email;
  }


  @handle(CONVERSATION_ACTIONS.UPDATE_CONTACT)
  handleUpdateContact(event, contact) {

    STATE.selectedContact = contact;
  }

  @handle(CONVERSATION_ACTIONS.CREATE_CONVERSATION)
  handleCreateConversation(event, conversation) {

    STATE.selectedConversation = conversation;
  }

  @handle(CONVERSATION_ACTIONS.SEARCH_CONVERSATION)
  handleSearchConversation(event, conversations) {
		
    for(let conversation of conversations) {
			
      if(conversation.latestInteraction){
       conversation.latestInteraction.time = this.dateTimeTools.convertToLocalTime(conversation.latestInteraction.timestamp, 'UTC');
       conversation.latestInteraction.duration = conversation.latestInteraction.duration === 0 ? '-' : this.dateTimeTools.convertMillisecondsToTime(conversation.latestInteraction.duration);
      }
      
    }
		
    STATE.conversations = conversations;
  }

  @handle(CONVERSATION_ACTIONS.CLEAR_STORE)
  handleClearStore(event, data) {

    STATE.selectedContact = {};
    STATE.searchContact = {};
    STATE.selectedConversation = {};
    STATE.newConversation = null;
    STATE.contacts = null;
    STATE.conversations = null;
    STATE.contactToEdit = null;
  }

  @handle(SCAN_DOCUMENT_ACTIONS.ACCEPT_DOCUMENT)
  handleAcceptDocument(action, document) {

    for(var item of STATE.documents.scannedDocuments) {

      if (item.type === document.documentName) {

        if(!item || !item.scans) continue;

        setTimeout(() => {
          
          document.documentName = document.documentName += '_' + (item.scans.length + 1 < 10 ? '0' + (item.scans.length + 1) : item.scans.length + 1);
          item.scans.push(document);
          item.scans.sort(SortTools.compareBy('documentName'));
        }, 200);
      }
    }
  }

  @handle(SCAN_FINGERPRINT_ACTIONS.ACCEPT_SCANNED_FP)
  handleFingerprintScanned(action, document) {

    if(!document) return;

    document.documentName = document.documentName += '_' + (STATE.documents.fingerprintDocuments.length + 1 < 10 ? '0' + (STATE.documents.fingerprintDocuments.length + 1) : STATE.documents.fingerprintDocuments.length + 1);
    STATE.documents.fingerprintDocuments.push(document);
  }

  @handle(SIGN_DOCUMENT_ACTIONS.ACCEPT_SIGNED_DOCUMENT)
  handleDocumentSigned(action, document) {

    document.documentName = document.documentName += '_' + (STATE.documents.signedDocuments.length + 1 < 10 ? '0' + (STATE.documents.signedDocuments.length + 1) : STATE.documents.signedDocuments.length + 1);
    STATE.documents.signedDocuments.push(document);
  }

  @handle(HUD_ACTIONS.AGENT_STATUS_LOGGED)
  handleAgentStatusChanged(action, status) {
    setTimeout(() => {

      if (status === 'WRAP_UP') { // && !this.inWrapUpState
        STATE.inWrapUpState = true;
      } else if (status !== 'ON_CALL') {
        STATE.inWrapUpState = false;
        STATE.isVideoConversation = false;
      }
    }, 200);
  }

  @handle(CONVERSATION_ACTIONS.CONVERSATION_WRAPUP)
  handleVideoConversationWrapup() {
    STATE.inWrapUpState = true;
  }

  @handle('document.history.clear')
  handleClearStore() {

    this.clearState();
  }

  @handle(CONVERSATION_ACTIONS.SET_CONVERSATION_TYPE)
  handleSetConversationType(action, type) {
    
    STATE.isVideoConversation = type === 'video';
  }

  @handle(LINK_INTERACTION_ACTIONS.SELECT_INTERACTION)
  handleSelectInteraction(action, updatedList) {
    
    STATE.selectedInteractions = updatedList;
  }

  @handle(MESSAGE_EVENTS.NOTIFICATION)
  handleMessageNotification(action, message) {
    
    this.clearState();
    
    STATE.searchContact.contactNumber = message.fromNumber;
    STATE.textMessages.push(message);
  }

  @handle(CONVERSATION_ACTIONS.REPLIED_TO_MESSAGE)
  handleRepliedToMessage(action, message) {
    
    STATE.textMessages.push(message);
  }
}
