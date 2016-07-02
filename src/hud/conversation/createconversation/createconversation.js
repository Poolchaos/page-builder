/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Validation} from 'aurelia-validation';
import {handle, waitFor} from 'aurelia-flux';
/*
 */
import {CONVERSATION_ACTIONS} from '../conversation.actions';
import {ConversationStore} from '../conversation.store';
import {ConversationService} from '../conversation.service';
/*
*/
import {PeerService} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('CreateConversation');
/*
*/
@inject(Router, ConversationStore, ConversationService, Validation, PeerService)
export class CreateConversation {

  conversationName;
  
  constructor(router, conversationStore, conversationService, validation, peerService) {

    this.router = router;
    this.conversationStore = conversationStore;
    this.conversationService = conversationService;
    this.validation = validation;
    this.peerService = peerService;

  }

  activate() {

    this.conversationName = '';//this.conversationStore.conversationName;
    
    this.validation = this.validation.on(this)
        .ensure('conversationName').isNotEmpty().withMessage('Please do not leave this blank.').hasLengthBetween(2,140);
  }

  attached() {

    if (!this.conversationStore.selectedContact || !this.conversationStore.selectedContact.contactId) {
      this.router.navigate('contact/search');
      return;
    }

    setTimeout(() => {

      this.setFocus('conversationName');
    }, 500);

  }

  setFocus(field) {

    let firstElement = document.getElementById(field);
    if (firstElement !== null) {
      firstElement.focus();
    } else {

      setTimeout(() => {

        this.setFocus(field);
      }, 100);
    }
  }

  createConversation() {
    
    if(this.peerService.remoteStream) {
      
      this.conversationService.setConversationType('video');
    }

    let info = {conversationName: this.conversationName, contactId: this.conversationStore.selectedContact.contactId};

    this.validation.validate()
        .then(() => this.conversationService.createConversation(info))
        .catch(error => {});
  }

  cancelCreateConversation() {

    this.router.navigateBack();

  }

  @handle(CONVERSATION_ACTIONS.CREATE_CONVERSATION)
  @waitFor(ConversationStore)
  handleCreateConversation(event, data) {
    let conversationId = data.conversationId;
    
    setTimeout(() => {
      this.router.navigate(`interaction/link/${conversationId}`);
//      this.router.navigate(`view/removeMe/call`);
    });
  }

}
