/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import {PromptFactory, PromptService} from 'zailab.framework';
import {UniqueValueValidationRule, ApplicationProperties, UrlFactory, ApplicationService, UserSession} from 'zailab.common';
import {ORGANISATION_INTERACTION_MANAGER_ACTIONS} from './organisation.interactionmanager.actions';
/*
*/
import uuid from 'node-uuid';
/*
*/
const logger = LogManager.getLogger('OrganisationInteractionManagerService');
/*
*/
@inject(ApplicationProperties, UrlFactory, PromptFactory, PromptService, Dispatcher, ApplicationService, UserSession)
export class OrganisationInteractionManagerService {

  constructor(applicationProperties, urlFactory, promptFactory, promptService, dispatcher, applicationService, userSession) {

    this.applicationProperties = applicationProperties;
    this.urlFactory = urlFactory;
    this.promptFactory = promptFactory;
    this.promptService = promptService;
    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.userSession = userSession;
  }

  retrieveInteractions() {

    let organisationId = this.userSession.organisationId;

    this.applicationService.organisationInteractionsSearch(organisationId)
    .then(response => {

      if (response.displayInteractionFlowsView) {

        this.dispatcher.dispatch(ORGANISATION_INTERACTION_MANAGER_ACTIONS.ORGANISATION_INTERACTIONS_RETRIEVED, response.displayInteractionFlowsView[0].interactionFlows);
      } else {

        this.dispatcher.dispatch(ORGANISATION_INTERACTION_MANAGER_ACTIONS.ORGANISATION_INTERACTIONS_RETRIEVED, []);
      }
    }, error => {

      this.dispatcher.dispatch(ORGANISATION_INTERACTION_MANAGER_ACTIONS.ORGANISATION_INTERACTIONS_RETRIEVED, []);
    });
  }

  retrieveFlowSettings() {

    let organisationId = this.userSession.organisationId;

    let retrieveChannels;
    let retrieveTypes;

    let channels;
    let types;

    retrieveChannels = () => {

      this.applicationService.displayOrganisationChannels(organisationId)
      .then((response) => {

        channels = resolveChannelsResponse(response);
        retrieveTypes();
      });
    };

    retrieveTypes = () => {

      types = [{name: 'Office', labelClassName: 'o-prompt-list__icon o-prompt-list__icon--office-flow'}, {name: 'Contact Centre' , labelClassName: 'o-prompt-list__icon o-prompt-list__icon--contact-centre-flow'}];

      this.dispatcher.dispatch(ORGANISATION_INTERACTION_MANAGER_ACTIONS.RETRIEVE_FLOW_OPTIONS, {
        channels: channels,
        types: types
      });
    };

    retrieveChannels();
  }

  openAddFlowPrompt(store) {

    let flowNamePrompt = () => {

      let interactionNameList = [];
      for (let interaction of store.interactions) {
        interactionNameList.push(interaction.flowName.toLowerCase());
      }

      let prompt = this.promptFactory.buildFormPrompt('Flow name', {flowName: store.flow.name}, ORGANISATION_INTERACTION_MANAGER_ACTIONS.ORGANISATION_INTERACTION_ADD_ACCEPT);
      prompt.promptModel.icon = 'interactionmanager';
      prompt.promptModel.rule = {
        flowName: new UniqueValueValidationRule(interactionNameList)
      };

      return prompt;
    };

    let flowTypePrompt = () => {

      let prompt = this.promptFactory.buildSingleSelectOnlyPrompt('Flow types', store.types, ORGANISATION_INTERACTION_MANAGER_ACTIONS.ACCEPT_SELECT_FLOW_TYPE);
      prompt.promptModel.icon = 'interactionmanager';
      return prompt;
    };

    let flowChannelPrompt = () => {

      let prompt = this.promptFactory.buildSingleSelectOnlyPrompt('Flow channels', store.channels, ORGANISATION_INTERACTION_MANAGER_ACTIONS.ACCEPT_SELECT_FLOW_CHANNEL);
      prompt.promptModel.icon = 'channels';
      return prompt;
    };

    this.promptService.openPrompt({prompts: [flowNamePrompt, flowTypePrompt, flowChannelPrompt]});
  }

  addInteraction(flow) {

    let interactionFlowId = uuid.v4();
    let organisationId = this.userSession.organisationId;
    let flowName = flow.name;
    let flowType = flow.type + ' Flow';
    let channel = flow.channel;
    let isCopiedFlow = false;

    this.applicationService.createInteractionFlow(interactionFlowId, organisationId, flowName, flowType, channel, isCopiedFlow);

    this.applicationService.accountRefreshAccessCode()
    .then(response => {

      let host = this.applicationProperties.apiRedirectEndpoint;
      let accessCode = response.accessCode;
      let url = this.urlFactory.buildUrl(host, 'signin', `accessCode=${accessCode}&organisationName=${organisationId}&interactionManagerId=${interactionFlowId}&flowType=${channel}&flowName=${flowName}`);
//       let url = this.urlFactory.buildUrl('http://localhost:8000', 'signin', `accessCode=${accessCode}&organisationName=${organisationId}&interactionManagerId=${interactionFlowId}&flowType=${channel}&flowName=${flowName}`);
      window.location = url;
    });
  }

  viewInteractionFlow(flow) {

    let interactionFlowId = flow.interactionFlowId;
    let organisationId = this.userSession.organisationId;
    let flowName = flow.flowName;
    let channel = flow.channel;

    this.applicationService.accountRefreshAccessCode()
    .then(response => {

      let host = this.applicationProperties.apiRedirectEndpoint;
      let accessCode = response.accessCode;
      let url = this.urlFactory.buildUrl(host, 'signin', `accessCode=${accessCode}&organisationName=${organisationId}&interactionManagerId=${interactionFlowId}&flowType=${channel}&flowName=${flowName}`);
//       let url = this.urlFactory.buildUrl('http://localhost:8000', 'signin', `accessCode=${accessCode}&organisationName=${organisationId}&interactionManagerId=${interactionFlowId}&flowType=${channel}&flowName=${flowName}`);
      window.location = url;
    });
  }

  removeInteractionFlow(flows) {

    for (let flow of flows) {
      this.applicationService.removeInteractionFlow(flow.interactionFlowId);
    }
  }
}
/*
*/
function resolveChannelsResponse(response) {

  let channels = [];

  if (response.displayChannelsView) {

    channels = response.displayChannelsView;
  }

  return channels;
}
