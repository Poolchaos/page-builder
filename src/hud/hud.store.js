import {handle} from 'aurelia-flux';
import {HUD_ACTIONS} from './hud.actions';
import {WRAP_UP_ACTIONS} from './wrapup/wrapup.actions';
import {COMMON_LEFT_WING_WIDGETS, COMMON_RIGHT_WING_WIDGETS} from './hud.widgets';
import {LogManager} from 'aurelia-framework';
import {PHONE_ACTIONS}       from './_widgets/phone/phone.actions';

const logger = LogManager.getLogger('HeadsUpDisplayStore');

const WIDGET_ROLES = ['AGENT'];

let STATE = {
  selectedInteractions: [],
  incomingCall: false
};

export class HeadsUpDisplayStore {
  
  widgets = [
//    {userRole: 'AGENT', section: 'LEFT_CONTENT', viewModel: 'hud/_widgets/agent/agent.header'},
    {userRole: 'AGENT', section: 'LEFT_CONTENT',  viewModel: 'hud/_widgets/tasknext/task.next'},
//    {userRole: 'AGENT', section: 'LEFT_CONTENT', viewModel: 'hud/_widgets/customers/customers'},
    {userRole: 'AGENT', section: 'LEFT_CONTENT',  viewModel: 'hud/_widgets/taskhistory/task.history'},
//    {userRole: 'AGENT', section: 'LEFT_CONTENT',  viewModel: 'hud/_widgets/performancestatistics/performance.statistics'},
    {userRole: 'AGENT', section: 'RIGHT_CONTENT',  viewModel: 'hud/_widgets/qascores/qa.scores'},
    {userRole: 'AGENT', section: 'RIGHT_CONTENT',  viewModel: 'hud/_widgets/trainingscores/training.scores'},
    {userRole: 'AGENT', section: 'RIGHT_CONTENT',  viewModel: 'hud/_widgets/calendar/calendar'},
    {userRole: 'AGENT', section: 'RIGHT_CONTENT',  viewModel: 'hud/_widgets/phone/phone'},
    
    //{userRole: 'TEAM_LEADER', section: 'LEFT_CONTENT',  viewModel: 'hud/_widgets/teamleaderhud/team.leader.hud'}
    //{userRole: 'TEAM_LEADER', section: 'LEFT_CONTENT',  viewModel: 'hud/_widgets/agent/agent'},
    //{userRole: 'TEAM_LEADER', section: 'LEFT_CONTENT',  viewModel: 'hud/_widgets/livedashboard/live.dashboard'},
      //{userRole: 'AGENT', section: 'RIGHT_CONTENT',  viewModel: 'hud/_widgets/livedashboard/live.dashboard'},
    //{userRole: 'TEAM_LEADER', section: 'RIGHT_CONTENT',  viewModel: 'hud/_widgets/callhistory/call.history'},
    //{userRole: 'TEAM_LEADER', section: 'RIGHT_CONTENT',  viewModel: 'hud/_widgets/livedashboard/live.dashboard'},
    //{userRole: 'TEAM_LEADER', section: 'RIGHT_CONTENT',  viewModel: 'hud/_widgets/trainingstats/training.stats'},
    //{userRole: 'TEAM_LEADER', section: 'RIGHT_CONTENT',  viewModel: 'hud/_widgets/qastats/qa.stats'}
  ];
  
  userRole;
  currentStatus;
  changeToStatus;
  error;
  statuses = [
    {statusId: 'AVAILABLE', name: 'Available', isSelectable: true},
    {statusId: 'AWAY',      name: 'Away',      isSelectable: true},
    {statusId: 'UNAVAILABLE',      name: 'Unavailable',      isSelectable: false},
    {statusId: 'DIALLING',  name: 'Dialling',  isSelectable: false},
//    {statusId: 'ON_CALL',   name: 'On Call',   isSelectable: false},
    {statusId: 'ON_CALL',   name: 'Busy',   isSelectable: false},
    {statusId: 'WRAP_UP',   name: 'Wrap Up',   isSelectable: false}
  ];
  callStatus = 'not_on_call';
  isOnCall;
  widgetsState = true;

  get showWidgets() {
    
    return WIDGET_ROLES.indexOf(this.userRole) !== -1;
//    return WIDGET_ROLES.indexOf(this.userRole) !== -1 && this.widgetsState; 
  }

  get selectedInteractions() {
    return STATE.selectedInteractions;
  }

  get incomingCall() {

    return STATE.incomingCall;
  }

  constructor() {
    
    this.initSections();
  }

  initSections() {
    
    this.leftWingWidgets = COMMON_LEFT_WING_WIDGETS;
    this.rightWingWidgets = COMMON_RIGHT_WING_WIDGETS;
    this.leftContentWidgets = [];
    this.rightContentWidgets = [];

    this.sections = {
      LEFT_WING: this.leftWingWidgets,
      LEFT_CONTENT: this.leftContentWidgets,
      RIGHT_CONTENT: this.rightContentWidgets,
      RIGHT_WING: this.rightWingWidgets
    };
  }

  setCurrentStatus(agentStatusId) {

    for (let status of this.statuses) {

      if (status.statusId === agentStatusId) {

        this.currentStatus = status.name;
        break;
      }
    }
  }

  statusReceived(agentStatusId) { // This toggles between selectable statuses - revise if more that two!
    
    for(var status of this.statuses) {
      
      if (status.isSelectable === false) {
        continue;
      }
      
      if (agentStatusId !== status.statusId) {
        this.changeToStatus = status;
        break;
      }
    }
  }
  
  @handle(HUD_ACTIONS.USER_ROLE_RETRIEVED)
  handleUserRoleRetrieved(action, userRole) {
    
    this.userRole = userRole;
    
    if(userRole === 'TEAM_LEADER') {
      this.contentColumn = 'one';
    } else {
      this.contentColumn = null;
    }
    
    this.initSections();
    
    for (let widget of this.widgets) {
      
      if (widget.userRole === userRole) {
        
        var found = false;
        
        for(var item in this.sections[widget.section]) {
         
          if(this.sections[widget.section][item].viewModel === widget.viewModel) {
            found = true;
          }
        }
            
        if(!found) {
          this.sections[widget.section].push(widget);
        }
      }
    }
  }
  
  @handle(HUD_ACTIONS.AGENT_STATUS_RETRIEVED)
  handleAgentStatusRetrieved(message, agentStatusId) {
      
    this.setCurrentStatus(agentStatusId);
    this.statusReceived(agentStatusId);
  }

  @handle(HUD_ACTIONS.AGENT_STATUS_CHANGED)
  handleAgentStatusChanged(message, agentStatusId) {
    
    logger.debug('AGENT_STATUS_CHANGED >>> handleAgentStatusChanged >>> ', agentStatusId);
    this.setCurrentStatus(agentStatusId);
    this.statusReceived(agentStatusId);
    STATE.incomingCall = false;
  }

  @handle(HUD_ACTIONS.AGENT_STATUS_LOGGED)
  handleAgentStatusLogged(message, loggedStatus) {
    
    logger.debug('AGENT_STATUS_LOGGED >>> handleAgentStatusLogged >>> ', loggedStatus);
    this.setCurrentStatus(loggedStatus);
    this.statusReceived(loggedStatus);
    STATE.incomingCall = false;
  }

  @handle(HUD_ACTIONS.AGENT_STATUS_FAILED)
  handleAgentStatusFailed(message, error) {
    
    this.error = error;    
  }

  @handle('leftwing.change')
  handleChangeLeftWing(action, payload) {
    this.leftWingWidgets = payload.widgets;
    this.activeView = payload.activeView;
  }

  @handle('leftwing.reset')
  handleChangeLeftWingReset(action, payload) {
    this.leftWingWidgets = COMMON_LEFT_WING_WIDGETS;
  }

  @handle(HUD_ACTIONS.ACCEPT_VIDEO_CALL)
  handleAcceptVideoCall() {
    this.isOnCall = true;
    this.callStatus = 'on_call';
    // this.activateSlide = 'animate_left_panel_open';
  }

  @handle(HUD_ACTIONS.DISCONNECT_VIDEO_CALL)
  handleDisconnectVideoCall() {
    
    this.activateSlide = 'animate_left_panel_close';
  }
  
  @handle(WRAP_UP_ACTIONS.ACTIVATE_WRAP_UP)
  handleActivateWrapUp() {
    
    this.isCallActive = false;
  }
  
  @handle(HUD_ACTIONS.NAV_HOME)
  handleDisplayHome(action, val) {
    this.widgetsState = val;
  }
  
  @handle(HUD_ACTIONS.SELECT_ORGANISATION_PROFILE)
  handleDisplayWidgetsDashboard(action, val) {
    logger.debug('handleDisplayWidgetsDashboard >>>>  navigate to members');
    this.widgetsState = val;
  }
  
  @handle('logout')
  handleLogout() {
    this.currentStatus = null;
    //this.currentStatus = 'UNAVAILABLE';
    logger.debug(' <<< handle logout >>> ', this.currentStatus);
  }
  
  @handle(WRAP_UP_ACTIONS.COMPLETE_WRAP_UP)
  handleCompleteWrapUp() {
    
    this.callStatus = 'call_ended';
    this.activateSlide = 'animate_left_panel_close';
    this.isOnCall = false;
    STATE.incomingCall = false;
    
    setTimeout(() => { // TODO why is the timeout here?
      this.callStatus = 'not_on_call';
      this.showContent = true;
    }, 1000);
  }

  @handle(HUD_ACTIONS.VIEW_CONVERSATION)
  handleViewConversation(action, selectedInteractions) {
    
    setTimeout(() => {
      STATE.selectedInteractions = selectedInteractions;
    }, 1000);
  }

  @handle(HUD_ACTIONS.INCOMING_VIDEO_CALL)
  handleIncomingVideoCall() {
    
    STATE.incomingCall = true;
  }

  @handle(HUD_ACTIONS.INCOMING_VIDEO_CALL_REJECTED)
  handleIncomingVideoCallRejected() {
    
    STATE.incomingCall = false;
  }
}

