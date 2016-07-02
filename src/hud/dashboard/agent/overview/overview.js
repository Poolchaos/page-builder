/*
*/
import {Router} from 'aurelia-router';
import {inject, LogManager} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
import {HeadsUpDisplayStore} from '../../../hud.store';
import {AGENT_ACTIONS} from '../agent.actions';
import {PhoneDialog} from '../../../_widgets/phone/phone.dialog';
import {HUD_ANIMATOR_EVENTS}  from '../../../hud.animator.events';
/*
*/
import {PromptFactory, PromptService} from 'zailab.framework';
/*
*/

const logger = LogManager.getLogger('AgentOverview');

@inject(Router, HeadsUpDisplayStore, PromptFactory, PromptService, DialogService, EventAggregator)
export class AgentOverview {

  viewActivated;
  
  constructor(router, headsUpDisplayStore, promptFactory, promptService, dialogService, eventAggregator) {

    this.router = router;
    this.headsUpDisplayStore = headsUpDisplayStore;
    this.promptFactory = promptFactory;
    this.promptService = promptService;
    this.dialogService = dialogService;
    this.eventAggregator = eventAggregator;
  }

  activate(){
    
    this.viewActivated = true;
  }
  
  openComingSoon(iconName, title) {

    let noDataMessagePrompt = this.promptFactory.buildMessagePrompt(title, AGENT_ACTIONS.DISPLAY_NO_MESSAGE);
    noDataMessagePrompt.promptModel.icon = iconName;
    this.promptService.openPrompt(noDataMessagePrompt);
  }

  startConversation(){
    
    this.viewActivated = false;
    this.router.parent.parent.navigate('conversation');  
  }
  
  incomingCall() {
    
    let noDataMessagePrompt = this.promptFactory.buildCallPrompt('', '');
    this.promptService.openPrompt(noDataMessagePrompt);
    
  }

  interactionHistory(){
    this.router.navigate('interactionhistory');
  }
  
}
