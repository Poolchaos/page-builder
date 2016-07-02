/*
 */
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
/*
 */
import {ConversationService} from './conversation.service';
import {ConversationStore} from './conversation.store';
import {ViewConversationStore} from './viewconversation/viewconversation.store';
import {CONVERSATION_ACTIONS} from './conversation.actions';
import {VIEW_CONVERSATION_ACTIONS} from './viewconversation/viewconversation.actions';
import {EDIT_CONTACT_ACTIONS} from './editcontact/editcontact.actions';
import {PEER_SERVICE_EVENTS} from 'zailab.common';
import {MESSAGE_EVENTS} from '../../_common/services/display.message.service.events';
/*
 */
const logger = LogManager.getLogger('Conversation');
/*
 */
@inject(EventAggregator, Router, ConversationService, ViewConversationStore, ConversationStore)
export class Conversation {

  viewLoaded = false;

  constructor(eventAggregator, router, conversationService, viewConversationStore, conversationStore) {

    this.eventAggregator = eventAggregator;
    this.router = router;
    this.conversationService = conversationService;
    this.conversationStore = conversationStore;

    this.init();
  }

  init() {
    
    this.eventAggregator.publish('router:navigation:processing', {instruction: {fragment: 'hud/conversation'}});
  }

  configureRouter(config, router) {

    config.map([

        {route: ['', 'contact'],                        redirect: 'contact/search'},
        {route: 'contact/search',                       name: 'contact/search',       moduleId: './searchcontact/searchcontact',            nav: false, title: 'Search Contact'},
        {route: 'contact/create',                       name: 'contact/create',       moduleId: './createcontact/createcontact',            nav: false, title: 'Create Contact'},
        {route: 'contact/edit/:contactId',                         name: 'contact/edit',         moduleId: './editcontact/editcontact',                nav: false, title: 'Edit Contact'},
        {route: 'interaction/link/:conversationId',     name: 'interaction/link',     moduleId: './linkinteraction/linkinteraction',        nav: false, title: 'Link Interaction'},
        {route: 'interaction/unlink/:conversationId',   name: 'interaction/unlink',   moduleId: './unlinkinteraction/unlinkinteraction',    nav: false, title: 'Unlink Interaction'},
        {route: 'view/:conversationId',                 name: 'view',                 moduleId: './viewconversation/viewconversation',      nav: false, title: 'View Conversation'},
        {route: 'search',                               name: 'search',               moduleId: './searchconversation/searchconversation',  nav: false, title: 'Search Conversation'},
        {route: 'create',                               name: 'create',               moduleId: './createconversation/createconversation',  nav: false, title: 'Create Conversation'},
        {route: 'status/:conversationId',               name: 'status',               moduleId: './viewconversation/updateconversationstatus/updateconversationstatus', nav: false, title: 'Conversation Status'}
    ]);

    this.router = router;
  }

  activate() {

    this.eventAggregator.publish('router:navigation:processing', {instruction: {fragment: 'hud/conversation'}});

    this.eventAggregator.subscribe(PEER_SERVICE_EVENTS.PEER_CALL_ANSWER_ACCEPT, () => this.conversation());

    this.eventAggregator.subscribe(MESSAGE_EVENTS.NOTIFICATION, () => this.conversation());
  }

  deactivate(){

    this.conversationService.clearStore();
  }

  attached(){

    setTimeout(()=>{
      this.viewLoaded = true;
    }, 800);
  }


  conversation() {
    
    if(this.router.history.location.pathname.indexOf('contact/search') === -1) {

      this.router.navigate('contact/search');
    }
  }
}
