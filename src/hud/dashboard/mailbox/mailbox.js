/*
zailab
*/
import {MailboxMessages}        from './mailbox.messages';
import {MailboxService}       from './mailbox.service';
import {UserSession}          from '../../../_common/stores/user.session';
import {MailboxStore}         from './mailbox.store';
import {HUD_ANIMATOR_EVENTS}  from '../../hud.animator.events';
import {Router} from 'aurelia-router';
/*
aurelia
*/
import {inject}               from 'aurelia-framework';
import {handle}               from 'aurelia-flux';
import {EventAggregator}      from 'aurelia-event-aggregator';

@inject(EventAggregator, MailboxService, UserSession, MailboxStore, Router)
export class Mailbox {

  constructor(eventAggregator, mailboxService, userSession, mailboxStore, router) {
    this.eventAggregator = eventAggregator;
    this.mailboxService = mailboxService;
    this.userSession = userSession;
    this.mailboxStore = mailboxStore;
    this.router = router;
  }

  activate() {
    let recipientId = this.userSession.loggedInUser.recipientId;
    this.mailboxService.registerNewMessages(recipientId);
    this.mailboxService.retrieveMailboxNewMessageCount(recipientId);
  }

  viewMessages() {
    this.router.navigate('dashboard/mailbox');
  }
  
}