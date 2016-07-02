import {handle} from 'aurelia-flux';
import {WRAP_UP_ACTIONS} from './wrapup.actions';

export class WrapUpStore {

  teamLeaderHudStats = ['Error'];
  error;

	 constructor(eventAggregator) {

  }

    views = {
    showNavButtons: true,
    showScannedDocs: false,
    showFingerprints: false,
    showSignedDocs: false
  };
  
  @handle('view.change')
    handleViewChange(message, view) {
    this.views.showNavButtons = false;
    this.views.showScannedDocs = false;
    this.views.showFingerprints = false;
    this.views.showSignedDocs = false;
    this.views[view] = true;
  };

}