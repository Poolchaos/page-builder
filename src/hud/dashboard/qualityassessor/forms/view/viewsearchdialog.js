import {inject} from 'aurelia-framework';
import {Dispatcher, handle} from 'aurelia-flux';
import {DialogController} from 'aurelia-dialog';
import {UserSession} from 'zailab.common';
import {ViewService} from './view.service.js';
import {ViewStore} from './view.store.js';

@inject(DialogController, Dispatcher, UserSession, ViewService, ViewStore)
export class ViewSearchDialog {

  constructor(controller, dispatcher, userSession, viewService, viewStore) {
    this.controller = controller;
    this.controller.settings.lock = false;
    this.dispatcher = dispatcher;
    this.userSession = userSession;
    this.viewService = viewService;
    this.viewStore = viewStore;
    this.dispatcher.dispatch('blur.event');
  }

  activate(viewFormViewModel) {
    this.controller.settings.lock = false;
    this.dispatcher.dispatch('blur.event');
  }


  close() {
    this.controller.cancel();
    this.dispatcher.dispatch('remove.blur.event');
  }

  search_field(){
    var organisationId = this.userSession.organisationId;

    var fromDate = '';
    var toDate = '';
    var formName = '';
    var performedByFirstName = '';
    var performedBySurname = '';
    var channel = '';
    var assessorName = {performedByFirstName:performedByFirstName,performedBySurname:performedBySurname};


    this.viewStore.forms.accessedForms = {
      fromDate: fromDate,
      toDate: toDate,
      organisationId: organisationId,
      formName: formName,
      channel:channel,
      assessorName: assessorName
    };

    this.viewService.searchPerformedAssessments(fromDate, toDate, organisationId, formName, assessorName);
    this.close();

  }

}