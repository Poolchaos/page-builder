import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher, handle} from 'aurelia-flux';
import {DialogController} from 'aurelia-dialog';
import {UserSession} from '../../../_common/stores/user.session';
import {MailboxService} from './mailbox.service';
import {MailboxStore} from './mailbox.store';

const logger = LogManager.getLogger('MailboxMessagesPlayback');

@inject(DialogController, Dispatcher, UserSession, MailboxService, MailboxStore)
export class MailboxMessagesPlayback {

  constructor(dialogController, dispatcher, userSession, mailboxService, mailboxStore) {
    
    this.controller = dialogController;
    this.userSession = userSession;
    this.dispatcher = dispatcher;
    this.mailboxService = mailboxService;
    this.mailboxStore = mailboxStore;
  }

  activate(mailboxMessagesPlayback) {
    
    let ownerIdCheck = this.userSession.loggedInUser.userAccessRoles[0].ownerId;
    let ownerId = ownerIdCheck ? ownerIdCheck : this.userSession.loggedInUser.userAccessRoles[1].ownerId;
    var organisationId = ownerId;
    var organisationId = this.userSession.organisationId;
    var mailboxId = mailboxMessagesPlayback.mailboxId;
    this.mailboxService.selectMessage(mailboxMessagesPlayback, mailboxId, organisationId);
    
    this.dispatcher.dispatch('blur.event');
    this.controller.settings.lock = false;
    
  }

  close() {
    
    this.controller.cancel();
    this.dispatcher.dispatch('remove.blur.event');
    let recipientId = this.userSession.loggedInUser.recipientId;
    this.mailboxService.retrieveMailboxNewMessageCount(recipientId);
  }

  dial() {
    
    this.mailboxService.dial(this.userSession.loggedInUser.email, this.mailboxStore.selectedMessage.from);
  }

}

