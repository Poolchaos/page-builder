/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Configure} from 'aurelia-configuration';
/*
*/
import {MESSAGE_EVENTS} from 'zailab.common';
import {WebSocket} from './websocket';
/*
*/
import toastr from 'toastr';
/*
*/
const logger = LogManager.getLogger('DisplayMessageService');
/*
*/

let messagesMap = {
  'last.organisation.admin': {
    message: 'You cannot remove this member. You must have at least one administrator.'
  },
  'member.no.service': {
    message: 'You must have at least one service allocated.'
  },
  'member.only.service': {
    message: 'You must have at least one service allocated.'
  },
  'site.is.last.site': {
    message: 'Unable to remove last site.'
  },
  'site.allocated.to.members': {
    message: 'Unable to remove a site allocated to a member.'
  },
  'site.allocated.to.invitations': {
    message: 'Unable to remove a site allocated to an invitation.'
  },
  'site.allocated.to.flows': {
    message: 'Unable to remove a site allocated to a task.'
  },
  'skillgroup.assigned.skills': {
    message: 'Unable to remove a skill group with allocated skills.'
  },
  'skill.assigned.invitations': {
    message: 'Unable to remove a skill allocated to an invitation.'
  },
  'skillgroup.no.skills': {
    message: 'No skills for this skill group.'
  },
  'skill.assigned.members': {
    message: 'Unable to remove a skill allocated to a member.'
  },
  'skill.assigned.flows': {
    message: 'Unable to remove a skill allocated to a task.'
  },
  'service.allocated.to.members': {
    message: 'Unable to remove a service allocated to a member.'
  },
  'service.allocated.to.flow': {
    message: 'Unable to remove a service allocated to a task.'
  },
  'service.allocated.to.invitations': {
    message: 'Unable to remove a service allocated to an invitation.'
  },
  'service.is.selected': {
    message: 'Unable to remove an active service.'
  },
  'invitation.revoke.accepted': {
    message: 'Unable to remove invitation. Member has already accepted.'
  },
  'invitation.revoke.revoked': {
    message: 'This invitation has already been removed.'
  },
  'member.rolechange.lastadmin': {
    message: 'Unable to change role. At least one member must be an administrator.'
  },
  'passport.password.not.correct': {
    message: 'Unable to reset password. You entered your current password incorrectly.'
  },
  'passport.password.cannot.be.same.as.current.password': {
    message: 'Unable to reset password. Your new password cannot match your current password.'
  },
  'duplicate.invitation.email': {
    message: 'Could not invite member as they already belong to an organisation.'
  },
  'invitation.site.invalid': {
    message: 'Could not invite member as service was blank.'
  },
  'invitation.classofservice.invalid': {
    message: 'Could not invite member as service was blank.'
  },
  'invitation.service.invalid': {
    message: 'Could not invite member as class of service was blank.'
  },
  'invitation.cannot.invite.self': {
    message: 'You cannot invite yourself.'
  }

};

@inject(EventAggregator, WebSocket, Configure)
export class DisplayMessageService {

  constructor(eventAggregator, webSocket, configure) {
    this.eventAggregator =  eventAggregator;
    this.webSocket = webSocket;
    this.configure = configure;
    this.registerEvents();
  }

  registerEvents() {
    
    this.webSocket.subscribe({
      name: 'com.zailab.common.validation.ValidationErrors',
      callback: response => {

        this.showErrorMessage(response);
        this.eventAggregator.publish('ValidationErrorsReceived', response);
      }
    });
    
    this.eventAggregator.subscribe(MESSAGE_EVENTS.ERROR_UNHANDLED, (message) => { // UNCOMMENT TO DISPLAT UNHANDLED ERRORS AS TOASTS
      
      if (this.configure.environment === 'prod') {
        return;
      }

      toastr.error(message, 'Error (see console): <br/> <a href="/logout">LOGOUT IF THIS IS BUGGING YOU</a>');
    });
    
    this.eventAggregator.subscribe(MESSAGE_EVENTS.NOTIFICATION, () => {
      this.showCustomMessage();
    });

    toastr.options = {
      'positionClass': 'toast-top-center',
      'preventDuplicates': true,
      'progressBar': true
    };
  }

  showErrorMessage(error) {
    let validationErrorMessages = error.state.allErrors;
    let formattedValidationMessage;
    for (let validationErrorMessage of validationErrorMessages) {
      if (messagesMap[validationErrorMessage.code]) {
        formattedValidationMessage = messagesMap[validationErrorMessage.code].message;
      } else {
        formattedValidationMessage = validationErrorMessage.defaultMessage;
      }

      toastr.error(formattedValidationMessage, 'Error');
    }
  }
  
  showCustomMessage() {
    
    toastr.info('You have received 1 new sms.', 'Incoming Message');
  }
}
