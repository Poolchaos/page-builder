/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {UserSession} from 'zailab.common';
/*
*/

@inject(UserSession)
export class OrganisationMenuHelm {
  
  constructor(userSession) {
    
    this.userSession = userSession;
  }
}