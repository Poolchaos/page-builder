import {EDIT_CONVERSATION_ACTIONS}  from './editcontact.actions';
import {UserSession, ApplicationService}  from 'zailab.common';
/*
 aurelia
 */
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
 Logger
 */
const logger = LogManager.getLogger('EditContactService');

@inject(UserSession, ApplicationService, Dispatcher)
export class EditContactService {

  constructor(userSession, applicationService, dispatcher) {

    this.userSession = userSession;
    this.applicationService = applicationService;
    this.dispatcher = dispatcher;

  }

  retrieveConversationAttributes(conversationId) {

    let organisationId = this.userSession.organisationId;

    this.applicationService.displayConversationAttributesSearch(organisationId, conversationId).then(response=> {
      if (response.conversationContactsView && response.conversationContactsView[0]) {
        this.dispatcher.dispatch(EDIT_CONVERSATION_ACTIONS.RETRIEVE_CONTACT_ATTRIBUTES, response.conversationContactsView);
        return;
      }

      this.dispatcher.dispatch(EDIT_CONVERSATION_ACTIONS.RETRIEVE_CONTACT_ATTRIBUTES, {});

    });

  }
}


