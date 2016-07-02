import {handle} from 'aurelia-flux';
import {MAILBOX_ACTIONS} from './mailbox.actions';

export class MailboxStore {

  selectedMessage;
  unplayedCount = 0;
  mailbox = [];
  error;

 @handle(MAILBOX_ACTIONS.MAILBOX_RETRIEVED)
  handleMailboxRetrieved(message, unplayedCount) {
    this.unplayedCount = unplayedCount;
  }

@handle(MAILBOX_ACTIONS.MAILBOX_COUNT_RETRIEVED)
  handleMailboxCountRetrieved(message, messageCount) {
    this.unplayedCount = messageCount;
  }

 @handle(MAILBOX_ACTIONS.MAILBOX_FAILED)
  handleMailboxFailed(message, errorMessage) {
    this.error = errorMessage;
  }

 @handle(MAILBOX_ACTIONS.MAILBOX_MESSAGES_RETRIEVED)
  handleMailboxMessagesRetrieved(message, messages) {
    this.mailbox = messages;
  }

 @handle(MAILBOX_ACTIONS.MAILBOX_MESSAGES_FAILED)
  handleMailboxMessagesFailed(message, error) {
  }

 @handle(MAILBOX_ACTIONS.MAILBOX_MESSAGE_URL_RETRIEVED)
  handleMailboxMessageURLRetrieved(event, message) {
    this.selectedMessage = message;
    let uri = message.messageURL;
    this.selectedMessage.audioElement = '<audio media-player=\'audio1\' data-playlist=\'playlist1\' controls=\'controls\' ><source src=' + uri + ' type=\'audio/wav\'></audio>';
  }

 @handle(MAILBOX_ACTIONS.MESSAGE_SELECTED)
  handleMessageSelect(event, message) {
    for (var i = 0; this.mailbox.length > i ; i++) {
      this.mailbox[i].selected = false;
    }
    message.selected = true;
  }

}
