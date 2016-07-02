/*/
*/
import {Crud, PromptFactory, PromptService} from 'zailab.framework';
/*
*/
import {ORGANISATION_INVITATIONS_ACTIONS} from '../organisation.invitations.actions';
import {OrganisationInvitationsService} from '../organisation.invitations.service';
import {OrganisationInvitationsStore} from '../organisation.invitations.store';
import {UniqueEmailValidationRule} from './organisation.invitations.emails.validation';
import {OrganisationStore} from '../../organisation.store';
import {UserSession} from '../../../../../_common/stores/user.session';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor, Dispatcher} from 'aurelia-flux';
import {Router} from 'aurelia-router';
/*
 */
import uuid from 'node-uuid';
/*
*/
const logger = LogManager.getLogger('OrganisationInvitationsEmails');
/*
*/
@inject(OrganisationInvitationsService, OrganisationInvitationsStore, OrganisationStore, UserSession, PromptFactory, PromptService, Router, Dispatcher)
export class OrganisationInvitationsEmails {

  settings = {
    add: {enabled: true},
    delete: {enabled: true},
    select: {enabled: false},
    edit: {enabled: false},
    labels: {enabled: true}
  };

  options = {
    add: () => this.add()
  };
  //  compare: (item, searchText) => this.compare(item, searchText)

  guide = 'Please tell me the email of your new member.';

  intercept = {
    done: () => this.done()
  };

  resolve;

  constructor(organisationInvitationsService, organisationInvitationsStore, organisationStore, userSession, promptFactory, promptService, router, dispatcher) {

    this.organisationInvitationsService = organisationInvitationsService;
    this.organisationInvitationsStore = organisationInvitationsStore;
    this.organisationStore = organisationStore;
    this.userSession = userSession;

    this.promptFactory = promptFactory;
    this.promptService = promptService;

    this.router = router;
    this.dispatcher = dispatcher;
  }

  activate() {

    this.organisationInvitationsService.setCurrentStep('emails');
  }

  canActivate() {

    this.organisationInvitationsService.retrieveOrganisationMembers();

    return new Promise((resolve) => this.resolve = resolve);
  }

  compare(item, searchText) {

    if (item.address.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
      return true;
    }

    return false;
  }

  get display() {
    return 'text';
  }

  change(email) {

    let title = 'Change Email';
    let item = {address: email.address, id: email.id};
    let acceptAction = ORGANISATION_INVITATIONS_ACTIONS.CHANGE_INVITATION_EMAIL;

    let option = this.promptFactory.buildFormPrompt(title, item, acceptAction);
    option.promptModel.icon = 'email';

    this.promptService.openPrompt(option);
  }

  get itemcount() {
    return this.organisationInvitationsStore.invitation.emails.length;
  }

  add() {

    let invitationEmails = this.organisationInvitationsStore.invitation.emails;
    let pendingInvitations = this.organisationInvitationsStore.invitations;
    let organisationMembers = this.organisationInvitationsStore.members;

    let allEmails = {
      invitationEmails: invitationEmails,
      pendingInvitations: pendingInvitations,
      organisationMembers: organisationMembers
    };

    let domainsCount = {};
    for (let emailType in allEmails) {

      let emails = allEmails[emailType];
      for (let email of emails) {

        if(!email.email) {
          continue;
        }
        
        let split = email.email.split('@');

        if (!split || split.length !== 2) {
          continue;
        }

        let domain = split[1];

        if (!domainsCount[domain]) {
          domainsCount[domain] = 0;
        }
        domainsCount[domain]++;
      }
    }
    
    let max = 0;
    let maxDomain = '';
    for (let domain in domainsCount) {
      
      let domainCount = domainsCount[domain];
      
      if (domainCount > max) {
        max = domainCount;
        maxDomain = domain;
      }
    }
    
    let previousDomain = this.organisationInvitationsStore.previousDomain;
    if(previousDomain && previousDomain.indexOf('@') === -1) {
      previousDomain = '@' + previousDomain;
    }
    
    let domain = previousDomain ? previousDomain : (maxDomain ? `@${maxDomain}` : '');

    let title = 'Assign Email';
    
    let item = {
      email: domain,
      id: uuid.v4()
    };
    let acceptAction = ORGANISATION_INVITATIONS_ACTIONS.ADD_INVITATION_EMAIL;

    let option = this.promptFactory.buildFormPrompt(title, item, acceptAction);
    option.promptModel.icon = 'invitations';
    option.promptModel.type = {
      email: 'email'
    };
    option.promptModel.rule = {
      email: new UniqueEmailValidationRule(allEmails)
    };

    this.promptService.openPrompt(option);
  }

  back() {
    this.router.navigate('attributes');
    this.organisationInvitationsService.clearError();
  }

  done() {
    
    let selectedSite = this.organisationInvitationsStore.invitation.site;
    if(!selectedSite || !selectedSite.name){
      this.organisationInvitationsService.setError('Please select a site before continuing.');
      return false;
    }
    
    let selectedServices = this.organisationInvitationsStore.invitation.services;
    if(selectedServices.length === 0){
      this.organisationInvitationsService.setError('Please select at least one service before continuing.');
      return false;
    }
    
    if (this.organisationInvitationsStore.invitation.emails.length === 0) {
      this.organisationInvitationsService.setError('Please add at least one email address to continue.');
      return false;
    }
    
    this.organisationInvitationsService.setError('');
    let userEmail = this.userSession.user.email;

    for (let email of this.organisationInvitationsStore.invitation.emails) {
      let info = {
          invitationId: uuid.v4(),
          email: email.address,
          organisationName: this.organisationStore.organisation.organisationName || '',
          site: this.organisationInvitationsStore.invitation.site,
          skills: this.organisationInvitationsStore.invitation.skills,
          services: this.organisationInvitationsStore.invitation.services,
          role: this.organisationInvitationsStore.invitation.role,
          classOfService: this.organisationInvitationsStore.invitation.classOfService || '',
          channels: this.organisationInvitationsStore.invitation.channels || ''
        };
      this.organisationInvitationsService.completeInvitation(info.invitationId, info.email, info.organisationName, info.site, info.skills, info.services, info.role, info.classOfService, info.channels, userEmail);
    }

    this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.INVITATIONS_SENT);

    return false;
  }

  cancel() {
    this.router.navigate('');
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_MEMBERS)
  @waitFor(OrganisationInvitationsStore)
  handleRetrieveOrganisationMembers() {

    this.resolve(true);
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.ADD_INVITATION_EMAIL)
  @waitFor(OrganisationInvitationsStore)
  handleAddEmail() {

    this.organisationInvitationsService.setError('');
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.INVITATIONS_SENT)
  @waitFor(OrganisationInvitationsStore)
  handleInvitationsSent() {

    setTimeout(() => this.router.navigate(''), 55);
  }
}
