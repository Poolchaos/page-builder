import {inject, LogManager} from 'aurelia-framework';
import {Router, Redirect} from 'aurelia-router';
import {DialogService} from 'aurelia-dialog';
import {Dispatcher, handle, waitFor} from 'aurelia-flux';
import {HttpClient} from 'aurelia-http-client';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
import {UserSession, PeerService, PEER_SERVICE_EVENTS, InteractionService} from 'zailab.common';
import {PromptFactory, PromptService} from 'zailab.framework';
/*
*/
import {HeadsUpDisplayService} from './hud.service';
import {HeadsUpDisplayStore} from './hud.store';
import {HeadsUpDisplayAnimator} from './hud.animator.service';
import {AnimatorStore} from './hud.animator.store';
import {ConversationStore} from './conversation/conversation.store';
import {HUD_ACTIONS} from './hud.actions';
import {MESSAGE_EVENTS} from '../_common/services/display.message.service.events';
import {WrapUpPrompt} from './prompts/wrapup/wrapup.prompt';
/*
*/
const logger = LogManager.getLogger('HeadsUpDisplay');
/*
*/
@inject(Router, ConversationStore, EventAggregator, HeadsUpDisplayService, HeadsUpDisplayStore, HeadsUpDisplayAnimator, AnimatorStore, Dispatcher, HttpClient, UserSession, DialogService, PeerService, PromptFactory, PromptService, InteractionService)
export class HeadsUpDisplay {

  inWrapUpState;
  isTwelveColumnRoute;
  isWingsHidden;
  isLoaderHidden;
  isLogoutDisabled;
  isContentHidden;

  constructor(router, conversationStore, eventAggregator, headsUpDisplayService, headsUpDisplayStore, headsUpDisplayAnimator, animatorStore, dispatcher, httpClient, userSession, dialogService, peerService, promptFactory, promptService, interactionService) {

    this.router = router;
    this.eventAggregator = eventAggregator;
    this.headsUpDisplayService = headsUpDisplayService;
    this.headsUpDisplayStore = headsUpDisplayStore;
    this.conversationStore = conversationStore;
    this.animatorStore = animatorStore;
    this.headsUpDisplayAnimator = headsUpDisplayAnimator;
    this.dialogService = dialogService;
    this.dispatcher = dispatcher;
    this.http = httpClient;
    this.userSession = userSession;
    this.peerService = peerService;
    this.promptFactory = promptFactory; 
    this.promptService = promptService;
    this.interactionService = interactionService;

    this.headsUpDisplayStore.showContent = true;
    this.init();
  }

  activate() {

    if (this.headsUpDisplayStore.showWidgets && this.userSession.isTeamLeaderRole) {
      return;
    }
    this.headsUpDisplayService.registerEvents();
  }

  deactivate() {

    if (this.headsUpDisplayStore.showWidgets && this.userSession.isTeamLeaderRole) {
      return;
    }
    this.headsUpDisplayService.deregisterEvents();
  }

  configureRouter(config, router) {

    config.map([

      {route: '', redirect: 'dashboard'},
      {route: 'dashboard',       name: 'dashboard',       moduleId: 'hud/dashboard/dashboard',            nav: false, title: 'Dashboard'},
      {route: 'conversation',    name: 'conversation',    moduleId: 'hud/conversation/conversation',      nav: false, title: 'Conversation', isTwelveColumnRoute: true, isWingsHidden: true, isLoaderHidden: true, isLogoutDisabled: true},
      {route: 'interactionlog',  name: 'interactionlog',  moduleId: 'hud/interactionlog/interactionlog',  nav: false, title: 'Interaction Log'}

    ]);

    this.router = router;
  }

  init() {

    this.http.configure(req => {
      req.withHeader('Authorization', this.userSession.authorization);
    });

    this.headsUpDisplayStore.currentStatus = null;
    this.headsUpDisplayService.retrieveCurrentAgentStatus();
    this.headsUpDisplayService.retrieveUserRole();

    this.eventAggregator.subscribe('view.change', view => this.slideOpen(view));

    this.eventAggregator.subscribe('router:navigation:complete', data => this.navigationSuccess(data));
    this.eventAggregator.subscribe('router:navigation:processing', data => {
      logger.debug('navigation > processing');
      this.isNavigationProcessing = true;
    });
    
    this.headsUpDisplayService.registerCallEvents();

    toastr.options = {
      'positionClass': 'toast-top-center',
      'progressBar': true
    };
    
    if (this.userSession.isAgentRole) {

      this.interactionService.subscribe();
      this.eventAggregator.subscribe(PEER_SERVICE_EVENTS.PEER_CALL_RECEIVED, () => {

        logger.debug(' open prompt ');
        this.headsUpDisplayService.incomingCall();
        let incomingCallPrompt = this.promptFactory.buildCallPrompt('', '');
        incomingCallPrompt.backgroundClick = { enabled: false };
        this.promptService.onAttached(controller => {

          controller.settings.lock = true;
        });
        
        setTimeout(() => {
          this.promptService.openPrompt(incomingCallPrompt);
        }, 300);
      });

      this.eventAggregator.subscribe(PEER_SERVICE_EVENTS.PEER_CALL_ANSWER_ACCEPT, () => this.conversation());

      this.eventAggregator.subscribe(MESSAGE_EVENTS.NOTIFICATION, () => this.conversation());

      this.eventAggregator.subscribe(PEER_SERVICE_EVENTS.PEER_CALL_ANSWER_REJECT, () => {

        logger.debug(' call rejected ');
        this.headsUpDisplayService.callRejected();
      });

      this.peerService.registerPeer();
    }

  }
  
  conversation() {
      
    if(this.router.history.location.pathname.indexOf('conversation') === -1) {

      this.router.navigate('conversation');
    }
  }
  
  endCall() {
    
    this.headsUpDisplayService.disconnectVideoCall();
  }
  
  navigationSuccess(data){
    
    this.isNavigationProcessing = false;
    
    let navigationInstruction = data.instruction;

    this.isTwelveColumnRoute = navigationInstruction.getAllInstructions().some(i => i.config.isTwelveColumnRoute);
    this.isWingsHidden = navigationInstruction.getAllInstructions().some(i => i.config.isWingsHidden);
    this.isLoaderHidden = navigationInstruction.getAllInstructions().some(i => i.config.isLoaderHidden);
    this.isLogoutDisabled = navigationInstruction.getAllInstructions().some(i => i.config.isLogoutDisabled);

  }

  get showLoader(){
    
    if(this.isLoaderHidden || (!this.isNavigationProcessing && !this.animatorStore.showLoader)){
      
      return false;
    }
    
    return true;
  }
  
  get showContent() {

    if (!this.isLoaderHidden && (this.isNavigationProcessing || this.animatorStore.showLoader)) {

      return false; 
    }
    
    return true;
  }

//TODO: remove when integrating into admin setup
  goToTeams() {

    this.dispatcher.dispatch(HUD_ACTIONS.ACCEPT_VIDEO_CALL);
    this.router.navigate('teams');
  }

  //TODO: remove when integrating into admin setup
  @handle('leave.team')
  handleLeaveTeam() {

    this.dispatcher.dispatch('wrapup.complete');

    setTimeout(() => {
      this.router.navigate('videocall');
    }, 1000);
  }

  slideOpen(view) {

    logger.debug('slideOpen >>> ', view);

    this.headsUpDisplayStore.videoSize = view === 'video' ? 'video_large' : 'video_small';

    if (view === 'video') {
      setTimeout(() => {
        this.headsUpDisplayStore.activeView = view;
      }, 1000);
    } else {
      this.headsUpDisplayStore.activeView = view;
    }
  }

  changeStatus(selectedAgentStatus) {

    if (selectedAgentStatus === this.headsUpDisplayStore.currentStatus) {
      return;
    }
    logger.debug('selectedAgentStatus.statusId', selectedAgentStatus);
    this.headsUpDisplayService.changeSystemAgentStatus(selectedAgentStatus);
    this.inWrapUpState = false;
  }

  showWings() {
    this.headsUpDisplayAnimator.showWings();
  }

  hideWings() {
    this.headsUpDisplayAnimator.hideWings();
  }

  navHome() {

    this.headsUpDisplayService.navHome();
  }

  logout() {

    this.headsUpDisplayService.reportLogout();
    this.dispatcher.dispatch('logout');
    this.router.parent.navigate('logout');
  }

  @handle(HUD_ACTIONS.NAV_HOME)
  @waitFor(HeadsUpDisplayStore)
  handleDisplayHome(action, val) {
    setTimeout(() => {
      if (this.userSession.isTeamLeaderRole) {

        this.router.navigate('dashboard/teamleader');
      } else if (this.userSession.isAgentRole) {
        
        this.router.navigate('dashboard/agent');
      } else if (this.userSession.isOfficeEmployeeRole) {
        
        this.router.navigate('dashboard/members');
      }else if (this.userSession.isAdminRole) {

        this.router.navigate('dashboard/organisation');
      }else if (this.userSession.isQAManagerRole || this.userSession.isQARole) {

        this.router.navigate('dashboard/qualityassessor/teams');
      } else {

        this.router.navigate('');
      }
    }, 53);
  }


}