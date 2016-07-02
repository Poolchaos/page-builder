import {inject, LogManager} from 'aurelia-framework';
import uuid from 'node-uuid';
import {Configure} from 'aurelia-configuration';

const logger = LogManager.getLogger('ApplicationProperties');

@inject(Configure)
export class ApplicationProperties {

  constructor(config) {
    this.config = config;
  }

  get apiRedirectEndpoint() {
    return this.config.get('apiRedirectEndpoint');
  }

  get apiQueryEndpoint() {
    return this.config.get('apiQueryEndpoint');
  }

  get apiCommandEndpoint() {
    return this.config.get('apiCommandEndpoint');
  }

  get apiInteractionEndpoint() {
    return this.config.get('apiInteractionEndpoint');
  }  
  
  get apiRouterEndpoint() {
    return this.config.get('apiRouterEndpoint');
  }
}
