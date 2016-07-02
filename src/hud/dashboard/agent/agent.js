/*
*/
import {Router} from 'aurelia-router';
import {inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
import {HeadsUpDisplayStore} from '../../hud.store';
/*
*/
import {PeerService, InteractionService, PEER_SERVICE_EVENTS} from 'zailab.common';
import {PromptFactory, PromptService} from 'zailab.framework';
/*
*/
const logger = LogManager.getLogger('Agent');

@inject(Router, HeadsUpDisplayStore, PeerService, InteractionService, EventAggregator, PromptFactory, PromptService)
export class Agents {
  
  constructor(router, headsUpDisplayStore, peerService, interactionService, eventAggregator, promptFactory, promptService) {
    
    this.router = router;
    this.headsUpDisplayStore = headsUpDisplayStore;
    this.peerService = peerService;
    this.eventAggregator = eventAggregator;
    this.promptFactory = promptFactory;
    this.promptService = promptService;
    
//    this.init(); 
  }
  
  configureRouter(config, router) {

    let routeMap = [
      {route: '',              name: 'agent',          moduleId: 'hud/dashboard/agent/overview/overview',                  nav: false,     title: 'Conversation History'},
      {route: 'members',       name: 'members',        moduleId: 'hud/dashboard/agent/members/organisation.members',       nav: false,     title: 'Call Logs'},
      {route: 'interactionhistory',       name: 'interactionhistory',        moduleId: 'hud/_widgets/taskhistory/task.history',       nav: false,     title: 'Interaction History'}
    ];

    config.map(routeMap);
    this.router = router;

  }
  
  init() {
    
    this.eventAggregator.subscribe(PEER_SERVICE_EVENTS.PEER_CALL_RECEIVED, () => {

      let noDataMessagePrompt = this.promptFactory.buildCallPrompt('', '');
      this.promptService.openPrompt(noDataMessagePrompt);
    });
    
    this.eventAggregator.subscribe(PEER_SERVICE_EVENTS.PEER_CALL_ANSWER_ACCEPT, () => {

      this.router.parent.parent.navigate('conversation/videocall');
    });
    
    this.peerService.registerPeer();
  }
    
}