import {inject} from 'aurelia-framework';
import {Dispatcher, handle} from 'aurelia-flux';
import {DialogController} from 'aurelia-dialog';
import {UserSession} from 'zailab.common';

@inject(DialogController, Dispatcher, UserSession)
export class CallHistorySearchDialog {

  constructor(controller, dispatcher, userSession) {
    this.controller = controller;
    this.controller.settings.lock = false;
    this.dispatcher = dispatcher;
		this.userSession = userSession;
    this.dispatcher.dispatch('blur.event');	
  }

  activate(callHistoryViewModel) {
		
		this.callHistoryStore = callHistoryViewModel.callHistoryStore;
		this.agentCallHistoryService = callHistoryViewModel.agentCallHistoryService;
		this.agentCallHistoryService.selectCallType(this.callHistoryStore.searchParams.callType);
		this.agentCallHistoryService.selectChannelType(this.callHistoryStore.searchParams.channelType);
    this.controller.settings.lock = false;
    this.dispatcher.dispatch('blur.event');
    
    this.setSelectedType();
    this.setSelectedChannel();
  }
  
  setSelectedType() {
    
    let type = this.callHistoryStore.searchParams.callType ? this.callHistoryStore.searchParams.callType : '';
    let id = '';
    
    switch(type) {
      case '':
        id = 'allCalls';
        break;
      case 'Contact Centre Flow':
        id = 'contactCenterFlows';
        break;
      case 'Office Flow':
        id = 'officeFlows';
        break;
    }
    
    this.getElement(id);
  }
  
  setSelectedChannel() {
    
    let type = this.callHistoryStore.searchParams.channelType ? this.callHistoryStore.searchParams.channelType : '';
    let id = '';
    
    switch(type) {
      case '':
        id = 'all';
        break;
      case 'Inbound':
        id = 'flow';
        break;
      case 'Outbound':
        id = 'outbound_flow';
        break;
      case 'kiosk':
        id = 'kiosk';
        break;
      case 'website':
        id = 'website';
        break;
    }
    
    this.getElement(id);
  }
  
  getElement(id) {
    
    var firstElement = document.getElementById(id);
    if (firstElement !== null) {
      
      firstElement.checked = 'checked';
      } else {

        setTimeout(() => {

          this.getElement(id);
        }, 100);
      }
  }
  
  close() {
    this.controller.cancel();
    this.dispatcher.dispatch('remove.blur.event');
  }
	
	search_field(){
		let ownerIdCheck = this.userSession.loggedInUser.userAccessRoles[0].ownerId;
		let ownerId = ownerIdCheck ? ownerIdCheck : this.userSession.loggedInUser.userAccessRoles[1].ownerId;
		var organisationId = this.userSession.organisationId;

		var fromDate = this.callHistoryStore.searchParams.fromDate;	
		var toDate = this.callHistoryStore.searchParams.toDate;
		var callType = this.callHistoryStore.searchParams.callType;
    var channel = this.callHistoryStore.searchParams.channelType;
		var memberName = this.callHistoryStore.searchParams.memberName;
		var fromNumber = this.callHistoryStore.searchParams.fromNumber;
		var toNumber = this.callHistoryStore.searchParams.toNumber;
		var size = 12;
		var page = this.callHistoryStore.searchParams.page;
    
    this.callHistoryStore.searchCriteria = {
      fromDate: fromDate,
      toDate: toDate,
      organisationId: organisationId,
      callType: callType,
      channel: channel,
      memberName: memberName,
      fromNumber: fromNumber,
      toNumber: toNumber,
      size: size,
      page: page
    };
		
		this.agentCallHistoryService.accountInteractionLog(fromDate, toDate, organisationId, callType, channel, memberName, fromNumber, toNumber, size, page);
		this.close();
		
	}
	
	selectingCallType(callType){
		this.agentCallHistoryService.selectCallType(callType);
	}
  
  	selectingChannelType(channelType){
		this.agentCallHistoryService.selectChannelType(channelType);
	}
	   
}