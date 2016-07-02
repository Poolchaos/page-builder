/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle} from 'aurelia-flux';
/*
*/
import {InteractionService} from 'zailab.common';
import {VIEW_CONVERSATION_ACTIONS} from '../viewconversation.actions';
import {ViewConversationStore} from '../viewconversation.store';
import {ViewConversationService} from '../viewconversation.service';
import {UpdateConversationStatusService} from './updateconversationstatus.service';
import {UPDATE_CONVERSATION_ACTIONS} from './updateconversationstatus.actions';
/*
*/
const logger = LogManager.getLogger('UpdateConversationStatus');
/*
*/
@inject(Router, ViewConversationStore, ViewConversationService, UpdateConversationStatusService, InteractionService)
export class UpdateConversationStatus{

  conversationId;
  interactionId;
  
  constructor(router, viewConversationStore, viewConversationService, updateConversationStatusService, interactionService) {

    this.router = router;
    this.viewConversationStore = viewConversationStore;
    this.viewConversationService = viewConversationService;
    this.updateConversationStatusService = updateConversationStatusService;
    this.interactionService = interactionService;
  }

  activate(params){

    this.conversationId = params.conversationId;
    this.interactionId = params.interactionId;
    this.viewConversationService.retrieveConversationAttributes(this.conversationId);
    this.viewConversationService.retrieveConversationCardView(this.conversationId);
  }

  updateStatus(status){
    
    this.updateConversationStatusService.changeStatus(this.conversationId, this.interactionId, status);
  }

  back(){
    
    let conversationId = this.conversationId;
    this.router.navigate(`view/${conversationId}/call`);
  }

  get sidePanelTitle (){

    let maxChar = 14;

    if(this.viewConversationStore.conversationAttributes) {
      let title = this.viewConversationStore.conversationAttributes[0].firstName + ' ' + this.viewConversationStore.conversationAttributes[0].surname;

      return title.length > maxChar ? title.substr(0, maxChar) + '...' : title;
    }
  }
  get sidePanelConversation() {

    if(!this.viewConversationStore.conversationCard){
      return;
    }
    
    let maxChar = 14;
    let sideConversationName = this.viewConversationStore.conversationCard.conversationName;

    return sideConversationName.length > maxChar ? sideConversationName.substr(0, maxChar) + '...' : sideConversationName;
  }
  
  @handle(UPDATE_CONVERSATION_ACTIONS.UPDATE_CONVERSATION_STATUS)
  handleUpdateConversationStatus(){
    
    this.viewConversationService.finish();
    this.interactionService.endInteraction();
  }

}