/*
*/
import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
*/
import {ORGANISATION_INTERACTION_MANAGER_ACTIONS} from './organisation.interactionmanager.actions';
/*
*/
const logger = LogManager.getLogger('OrganisationInteractionManagerStore');
/*
*/
let STATE = {
  
  interactions: [],
  
  channels: [],
  
  flow: {
    name: '',
    channel: '',
    type: ''
  }
}
/*
*/
export class OrganisationInteractionManagerStore {
  
  get allChannels() {
    
    return STATE.allChannels;
  }
  
  get channels() {
    
    return STATE.channels;
  }
  
  get types() {
    
    return STATE.types;
  }
  
  get flow() {
    
    return STATE.flow;
  }
  
  get interactions() {
    
    for (let interaction of STATE.interactions) {
      
      interaction.labelClassName = 'o-crud-list__icon--' + interaction.flowType.split(' ').join('-').toLowerCase();
      interaction.text = [interaction.flowName, interaction.channel];
      interaction.labelPosition = 'out';
      
    }
    
    return STATE.interactions;
  }

  @handle(ORGANISATION_INTERACTION_MANAGER_ACTIONS.ORGANISATION_INTERACTION_ADD_ACCEPT)
  handleInteractionAddAccept(action, model) {
    
    STATE.flow.name = model.item.flowName;
  }

  @handle(ORGANISATION_INTERACTION_MANAGER_ACTIONS.ACCEPT_SELECT_FLOW_TYPE)
  handleAcceptSelectFlowType(action, model) {
    
    for (let item of model.items) {
      
      if (item.isSelected) {
        
        STATE.flow.type = item.name;
        break;
      }
    }
    
    let officeChannels = [];
    
    if (STATE.flow.type === 'Office') {
      
      for (var channel of this.allChannels) {
        
        let name = channel.name.toLowerCase();
        
        if (name.indexOf('inbound') >= 0 || name.indexOf('outbound') >= 0) {
          
          officeChannels.push(channel);
        }
      }      
    } else if (STATE.flow.type === 'Contact Centre') {
      
      officeChannels = this.allChannels;
    }
    
    STATE.channels = officeChannels;
  }

  @handle(ORGANISATION_INTERACTION_MANAGER_ACTIONS.ACCEPT_SELECT_FLOW_CHANNEL)
  handleAcceptSelectFlowChannel(action, model) {
    
    for (let item of model.items) {
      
      if (item.isSelected) {
        
        STATE.flow.channel = item.name;
        break;
      }
    }
    
  }

  @handle(ORGANISATION_INTERACTION_MANAGER_ACTIONS.RETRIEVE_FLOW_OPTIONS)
  handleRetreiveOptions(action, options) {
    
    let convertedChannels = [];
    
    for (let channel of options.channels) {
      
      let disabled = false;

      let labelClassName = null;
      switch (channel.channelName) {
        case 'Inbound Call':
          labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-incoming';
          break;
        case 'Outbound Call':
          labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-outgoing';
          break;
        case 'Kiosk Call':
          labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-kiosk';
          break;
        case 'Website Call':
          labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-website';
          disabled = true;
          break;
        case 'SMS':
          labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-sms';
          break;
        default :
          labelClassName = '';
          break;
      }
      
      let item = {
        name: channel.channelName,
        labelClassName: labelClassName,
        isDisabled : disabled,
        clickable: !disabled
      };
      
      convertedChannels.push(item);
    }

    STATE.allChannels = convertedChannels;
    STATE.channels = convertedChannels;
    STATE.types = options.types;
  }

  @handle(ORGANISATION_INTERACTION_MANAGER_ACTIONS.ORGANISATION_INTERACTIONS_RETRIEVED)
  handleInteractionsRetrieved(action, interactions) {
    
    interactions.sort((o1, o2) => {
      
      let v1 = removeAll(o1.flowName.toLowerCase(), ' ');
      let v2 = removeAll(o2.flowName.toLowerCase(), ' ');
      
      if (v1 < v2) {
        return -1;
      }
      
      if (v1 > v2) {
        return 1;
      }
      
      return 0;
    });
    
    for(var index in interactions) {
      
      interactions[index].text = [interactions[index].flowName];
    }
  
    STATE.interactions = interactions;
  }
}
/*
*/
function removeAll(value, find) {
  
  let slices = value.split(find);
  let result = '';
  for (let slice of slices) {
    result += slice;
  }
  return result;
}