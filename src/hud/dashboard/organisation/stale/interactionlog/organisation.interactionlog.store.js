/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
*/
import {CALL_HISTORY_ACTIONS} from './organisation.interactionlog.actions';
import {UserSession} from 'zailab.common';
/*
*/
import {DateTimeTools} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('CallHistoryStore');
/*
*/
let STATE = {
  interactionCards: []
};

@inject(UserSession, DateTimeTools)
export class CallHistoryStore {

  views = {
    showNavButtons: true,
  };

  searchParams = {
    fromDate: '',
    toDate: '',
    callType: '',
    channelType: '',
    memberName: '',
    fromNumber: '',
    toNumber: '',
    size: 12
  };

  error;
  totalPages;
  currentPage = 0;

	constructor(userSession, dateTimeTools) {

  this.userSession = userSession;
  this.dateTimeTools = dateTimeTools;
}

formatData(data) {

  let convertedData = [];

  for (let item of data) {

    let convertedItem = {};

    convertedItem.typeIcon = item.channel ? item.channel.toLowerCase() : item.type.toLowerCase();
    if(convertedItem.typeIcon === 'kiosk call'){
      convertedItem.typeIcon = 'kiosk_call';
    }

    if (item.flowName) {

      convertedItem.title1 = item.flowName;

      if (item.taskName) {
        convertedItem.title2 = item.taskName;
      }else if (item.callOutcome === 'mailbox') {

        convertedItem.title2 = 'Mailbox';

      }else {

        convertedItem.title2 = '-';

      }

    }else {
      convertedItem.title1 = item.type; // Speak to a backend dev
      convertedItem.title2 = '-';
    }
    if (item.type === 'Outbound' || item.channel === 'Outbound Call') {

      convertedItem.description1 = item.members[0].fullName;
      convertedItem.description2 = item.toNumber;
    } else if (item.type === 'Inbound' || item.channel === 'Inbound Call') {

      convertedItem.description1 = item.fromNumber;
      convertedItem.description2 =  item.members && item.members[0] ? item.members[0].fullName : item.toNumber;

    } else if (item.type === 'Internal') {

      convertedItem.description1 = item.members && item.members[0] ? item.members[0].fullName : item.fromNumber;
      convertedItem.description2 =  item.members && item.members[1] ? item.members[1].fullName : item.toNumber;
    } else if (item.channel === 'Kiosk Call') {
      convertedItem.description1 = (item.fromNumber ? item.fromNumber : '-');
      convertedItem.description2 =  item.members && item.members[0] ? item.members[0].fullName : (item.toNumber ? item.toNumber : '-');
    }

    let formattedDateTime = this.dateTimeTools.convertToLocalTime(item.startTimestamp, 'UTC');
    
    convertedItem.outcome = item.callOutcome.toLowerCase();
    convertedItem.date = formattedDateTime.date;
    convertedItem.startTime = formattedDateTime.time;
    convertedItem.duration = item.duration;
    convertedItem.recordingId = item.recordingId;
    convertedItem.members = item.members;
    convertedItem.type = item.type;
    convertedItem.isKiosk = item.channel === 'Kiosk Call';

    convertedData.push(convertedItem);

  }

  return convertedData;

}

@handle(CALL_HISTORY_ACTIONS.CALL_HISTORY_RETRIEVED)
  handleCallHistoryRetrieved(message, callHistory) {

    let formattedData = this.formatData(callHistory.displayCallLogView);

    if (!this.searchResults) {
      this.searchResults = this.callHistory && this.callHistory.length > 0 ? true : false;
    }

    this.callHistory = formattedData;//callLogs;
    this.searchCallHistory = callHistory.accountInteractionLog;
    this.totalPages = callHistory.page.totalPages;
    this.currentPage = callHistory.page.number;
    this.moreThanFivePages = this.totalPages - this.currentPage - 1;
    this.moveForward = this.currentPage + 1;
    this.videoDiv = '';

  }

  @handle(CALL_HISTORY_ACTIONS.CALL_HISTORY_FAILED)
  handleCallHistoryFailed(message, errorMessage) {
    this.error = errorMessage;
  }

@handle(CALL_HISTORY_ACTIONS.SELECT_CALL_TYPE)
  handleSelectCallType(message, callType) {
    this.searchParams.callType = callType;
  }

@handle(CALL_HISTORY_ACTIONS.SELECT_CHANNEL_TYPE)
  handleSelectChannelType(message, channelType) {
    this.searchParams.channelType = channelType;
  }

  @handle(CALL_HISTORY_ACTIONS.SELECT_CALL)
  handleViewCall(action, message) {
    if (message.members && message.members.length > 0) {
      for (let member of message.members) {

        member.pictureId = member.personId;
        member.defaultPicture = 'target/_assets/img/profile_pic-holder.png';
      }
    }

    this.selectedCall = message;
  }

  @handle(CALL_HISTORY_ACTIONS.URL_RETRIEVED)
  handleURLRetrieved(action, message) {
    
    let uri = message.recordingURL;
    
    logger.debug('handleURLRetrieved > message = ', message);
    
    if (message.isKiosk && uri) {
      this.selectedCall.audioElement = '<video class=\'video_recording\' media-player=\'audio1\' data-playlist=\'playlist1\' controls=\'controls\' ><source src=' + uri + ' type=\'video/webm\'></video>';
      this.selectedCall.videoDiv = 'video_record_wrap';
    } else {
      this.selectedCall.audioElement = '<audio class=\'recording\' media-player=\'audio1\' data-playlist=\'playlist1\' controls=\'controls\' ><source src=' + uri + ' type=\'audio/wav\'></audio>';
      this.selectedCall.videoDiv = 'call_record_wrap';
    }
    
    logger.debug('handleURLRetrieved > this.selectedCall = ', this.selectedCall);
  }

  @handle(CALL_HISTORY_ACTIONS.URL_FAILED)
  handleURLFailed(action) {
    this.selectedCall.audioElement = 'Recording currently unavailable, please try again in a moment';

  }

  @handle('view.change')
  handleViewChange(message, view) {
    this.views.showNavButtons = false;
    this.views[view] = true;
  }

}

