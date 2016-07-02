import {inject, LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import {TASK_HISTORY_ACTIONS} from './task.history.actions';
import {UserSession} from '../../../_common/stores/user.session';
/*
 */
import {DateTimeTools} from 'zailab.common';
/*
 */
const logger = LogManager.getLogger('TaskHistoryStore');
/*
 */
@inject(UserSession, DateTimeTools)
export class TaskHistoryStore {

  taskHistory = [];
  activeClass = '';
  error;

  constructor(userSession, dateTimeTools) {

    this.userSession = userSession;
    this.dateTimeTools = dateTimeTools;
  }

  formatData(data) {

    let convertedData = [];

    for (let item of data) {
      convertedData.push(this.formatItem(item));
    }
    return convertedData;
  }

  formatItem(item) {
    let convertedItem = {};

    convertedItem.typeIcon = item.channel ? item.channel.toLowerCase() : item.type.toLowerCase();
    if(convertedItem.typeIcon === 'kiosk call'){
      convertedItem.typeIcon = 'kiosk';
    }
    if (convertedItem.typeIcon === 'internal'){
      convertedItem.typeIcon = 'internal';
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

      convertedItem.description1 = 'Me';
      convertedItem.description2 = item.toNumber;
    } else if (item.type === 'Inbound' || item.channel === 'Inbound Call') {

      convertedItem.description1 = item.fromNumber;
      convertedItem.description2 =  'Me';

    } else if (item.type === 'Internal') {

      let memberId = this.userSession.memberId;

      convertedItem.description1 = item.members && item.members[0] && item.members[0].memberId !== memberId ? item.members[0].fullName : item.fromNumber;
      convertedItem.description2 =  item.members && item.members[1]  && item.members[1].memberId !== memberId ? item.members[1].fullName : item.toNumber;

      if (item.members && item.members[0] && item.members[0].memberId === memberId) {
        convertedItem.description1 = 'Me';
      }
      if (item.members && item.members[1] && item.members[1].memberId === memberId) {
        convertedItem.description2 = 'Me';
      }

    }else if (item.channel === 'Kiosk Call') {
      convertedItem.description1 = item.fromNumber;
      convertedItem.description2 =  'Me';
    }

    let formattedDateTime = this.dateTimeTools.convertToLocalTime(item.startTimestamp, 'UTC');

    convertedItem.outcome = item.callOutcome.toLowerCase();
    convertedItem.duration = item.duration;
    convertedItem.date = formattedDateTime.date;
    convertedItem.startTime = formattedDateTime.time;

    convertedItem.recordingId = item.recordingId;
    convertedItem.members = item.members;
    convertedItem.type = item.type;
    convertedItem.isKiosk = item.channel === 'Kiosk Call';

    return convertedItem;
  }

  @handle(TASK_HISTORY_ACTIONS.TASK_HISTORY_RETRIEVED)
  handleTaskHistoryRetrieved(message, taskHistory) {
    let formattedData = this.formatData(taskHistory);
    logger.debug('formattedData >>>', formattedData);
    this.taskHistory = formattedData;
  }

  @handle(TASK_HISTORY_ACTIONS.TASK_HISTORY_UPDATED)
  handleTaskHistoryUpdated(message, taskHistory) {
    let formattedItem = this.formatItem(taskHistory);
    this.taskHistory.unshift(formattedItem);
  }

  @handle(TASK_HISTORY_ACTIONS.TASK_HISTORY_FAILED)
  handleTaskHistoryFailed(message, errorMessage) {
    this.error = errorMessage;
  }

  @handle(TASK_HISTORY_ACTIONS.SELECT_TASK)
  handleViewTask(action, message) {

    for (let member of message.members) {

      member.pictureId = member.personId;
      member.defaultPicture = 'target/_assets/img/profile_pic-holder.png';
    }

    this.selectedTask = message;
  }

  @handle(TASK_HISTORY_ACTIONS.URL_RETRIEVED)
  handleURLRetrieved(action, message) {

    let uri = message.recordingURL;
    if (message.isKiosk && uri) {
      this.selectedTask.audioElement = '<video class=\'o-video-recording\' media-player=\'audio1\' data-playlist=\'playlist1\' controls=\'controls\' ><source src=' + uri + ' type=\'video/webm\'></video>';
      this.selectedTask.videoDiv = 'video_record_wrap';
    } else {
      this.selectedTask.audioElement = '<audio class=\'recording\' media-player=\'audio1\' data-playlist=\'playlist1\' controls=\'controls\' ><source src=' + uri + ' type=\'audio/wav\'></audio>';
      this.selectedTask.videoDiv = 'call_record_wrap';
    }
  }

  // TODO CLEANUP
  @handle('logout')
  handleLogout() {
    this.taskHistory = [];
    this.activeClass = '';
  }

}
