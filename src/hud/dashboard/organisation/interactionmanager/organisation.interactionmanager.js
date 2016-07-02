/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
import {Router} from 'aurelia-router';
/*
*/
import {OrganisationInteractionManagerService} from './organisation.interactionmanager.service';
import {OrganisationInteractionManagerStore} from './organisation.interactionmanager.store';
import {ORGANISATION_INTERACTION_MANAGER_ACTIONS} from './organisation.interactionmanager.actions';
/*
*/
const logger = LogManager.getLogger('OrganisationInteractionManager');
/*
*/
@inject(Router, OrganisationInteractionManagerService, OrganisationInteractionManagerStore)
export class OrganisationInteractionManager {

  constructor(router, organisationInteractionManagerService, organisationInteractionManagerStore) {

    this.router = router;
    this.interactionService = organisationInteractionManagerService;
    this.interactionStore = organisationInteractionManagerStore;
  }

  settings = {
    add: {enabled: true},
    delete: {enabled: true},
    select: {enabled: false},
    edit: {enabled: true},
    labels: {enabled: true}
  };

  options = {
    add: () => this.add(),
    change: (item) => this.change(item),
    remove: (items) => this.remove(items)
  };

  display = 'text';

  resolve = null;

  guide = 'This is a list of the interaction flows in your organisation. An interaction flow defines the steps an interaction follows to facilitate conversation between your organisation and your customer.';

  canActivate() {

    this.interactionService.retrieveInteractions();

    return new Promise((resolve) => this.resolve = resolve);
  }

  get itemcount() {
    return this.interactionStore.interactions.length;
  }

  add() {

    if (!this.interactionStore.channels || !this.interactionStore.channels.length || this.interactionStore.channels.length === 0) {
      
      this.interactionService.retrieveFlowSettings();
    } else {

      this.interactionService.openAddFlowPrompt(this.interactionStore);
    }
  }

  change(item) {    
    
    this.interactionService.viewInteractionFlow(item);
  }

  remove(items) {
    
    this.interactionService.removeInteractionFlow(items);
  }

  @handle(ORGANISATION_INTERACTION_MANAGER_ACTIONS.RETRIEVE_FLOW_OPTIONS)
  @waitFor(OrganisationInteractionManagerStore)
  handleRetreiveOptions() {

    this.interactionService.openAddFlowPrompt(this.interactionStore);
  }

  @handle(ORGANISATION_INTERACTION_MANAGER_ACTIONS.ORGANISATION_INTERACTIONS_RETRIEVED)
  @waitFor(OrganisationInteractionManagerStore)
  handleInteractionsRetrieved() {

    if (this.resolve !== null) {
      this.resolve(true);
      this.resolve = null;
    }
  }

  @handle(ORGANISATION_INTERACTION_MANAGER_ACTIONS.ACCEPT_SELECT_FLOW_CHANNEL)
  @waitFor(OrganisationInteractionManagerStore)
  handleAcceptSelectFlowChannel() {

    this.interactionService.addInteraction(this.interactionStore.flow);
  }

}
