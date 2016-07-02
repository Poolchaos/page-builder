import {EDIT_CONTACT_ACTIONS} from './editcontact.actions';


import {handle} from 'aurelia-flux';
import {inject, LogManager} from 'aurelia-framework';
/*
 Logger
 */
const logger = LogManager.getLogger('EditContactStore');

let STATE = {
  conversationAttributes: null,
};


export class EditContactStore {

  get conversationAttributes() {

    return STATE.conversationAttributes;
  }

  @handle(EDIT_CONTACT_ACTIONS.RETRIEVE_CONTACT_ATTRIBUTES)
  handleRetrieveContactAttributes(event, conversation) {
    logger.debug('conversation >>>>', conversation);
    if(!conversation || !conversation[0]){
      return;
    }
    STATE.conversationAttributes = conversation;
  }


}
