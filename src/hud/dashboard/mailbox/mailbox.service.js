import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {HttpClient} from 'aurelia-http-client';
/*
 */
import {ApplicationProperties} from '../../../_config/application.properties';
/*
*/
import {MAILBOX_ACTIONS} from './mailbox.actions';
/*
*/
import {ApplicationService, DatabaseService, UserSession, DateTimeTools, UrlFactory} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('MailboxService');

@inject(ApplicationService, Dispatcher, DatabaseService, UserSession, DateTimeTools, HttpClient, ApplicationProperties, UrlFactory)
export class MailboxService {

  constructor(applicationService, dispatcher, databaseService, userSession, dateTimeTools, httpClient, applicationProperties, urlFactory) {
    this.applicationService = applicationService;
    this.databaseService = databaseService;
    this.dispatcher = dispatcher;
    this.userSession = userSession;
    this.dateTimeTools = dateTimeTools;
    this.httpClient = httpClient;
    this.applicationProperties = applicationProperties;
    this.urlFactory = urlFactory;
    
    logger.debug(' this.httpClient >>>> ', this.httpClient);
  }

  retrieveMailboxNewMessageCount(recipientId) {
    this.applicationService.displayOrganisationMailboxUnplayedMessageCount(recipientId)
      .then(
        response => {
          if (response.displayUnplayedMessageCountView && response.displayUnplayedMessageCountView[0] && response.displayUnplayedMessageCountView[0].unplayedCount) {
            this.unplayedCount = response.displayUnplayedMessageCountView[0].unplayedCount;
            this.dispatcher.dispatch(MAILBOX_ACTIONS.MAILBOX_RETRIEVED, this.unplayedCount);
          }

        },
        error => {
          this.dispatcher.dispatch(MAILBOX_ACTIONS.MAILBOX_FAILED, error);
        });
  }

  retrieveMailboxMessages(recipientId) {
    this.applicationService.retrieveMailboxMessagesSearch(recipientId)
      .then(
        response => {
          if (response) {
            for (var i = 0 ; i < response.length; i++) {

              let formattedDateTime = this.dateTimeTools.convertToLocalTime(response[i].date, 'UTC');
                            
              response[i].date = formattedDateTime.date;
              response[i].time = formattedDateTime.time;
            }

            this.dispatcher.dispatch(MAILBOX_ACTIONS.MAILBOX_MESSAGES_RETRIEVED, response);
          }
        },
        error => {
          this.dispatcher.dispatch(MAILBOX_ACTIONS.MAILBOX_MESSAGES_FAILED, error);
        });
  }

	registerNewMessages(recipientId) {
  this.databaseService.onMailboxMessageIncrement(recipientId, data => {
    this.retrieveMailboxMessages(recipientId);
    this.dispatcher.dispatch(MAILBOX_ACTIONS.MAILBOX_COUNT_RETRIEVED, data.unplayedCount);
  });
}

  selectMessage(message, mailboxId, organisationId) {
    var mailboxMessageId = message.mailboxMessageId;
    this.dispatcher.dispatch(MAILBOX_ACTIONS.MESSAGE_SELECTED, message);

    // Update message count
    this.applicationService.playMailboxMessage(mailboxId, mailboxMessageId);

    // Retrieve URL
    if (mailboxMessageId === null) {
      return;
    } else {
      this.applicationService.playVoicemailSearch(organisationId, mailboxId, mailboxMessageId).then(
        result => {
          message.messageURL = result.url;
          this.dispatcher.dispatch(MAILBOX_ACTIONS.MAILBOX_MESSAGE_URL_RETRIEVED, message);
        },
        error => {
          this.dispatcher.dispatch(MAILBOX_ACTIONS.MAILBOX_MESSAGE_URL_FAILED, message);
        }
      );
    }
  }

  dial(source, destination) {
    
    let host = this.applicationProperties.apiRouterEndpoint;
    let url = this.urlFactory.buildUrl(host, `telephony/${source}/makecall/${destination}`);
    this.httpClient.post(url, {}).then(
      (response) => {
        logger.debug(response);
      },
      (error) => {
        logger.debug(error);
      }
    );
  }
}
