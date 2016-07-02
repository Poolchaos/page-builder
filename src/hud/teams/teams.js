import {inject, LogManager} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Dispatcher} from 'aurelia-flux';
import {AddTeam} from './addteam/add.team';
import {RenameTeam} from './renameteam/rename.team';
import {TeamsStore} from './teams.store';
import {TeamsService} from './teams.service';
import {TEAMS_ACTIONS} from './teams.actions';

const logger = LogManager.getLogger('Teams');

@inject(DialogService, Dispatcher, TeamsStore, TeamsService)
export class Teams {

  constructor(dialogService, dispatcher, teamsStore, teamsService) {
    
    this.dialogService = dialogService;
    this.dispatcher = dispatcher;
    this.teamsStore = teamsStore;
    this.teamsService = teamsService;
  }
  
  activate() {
    
    this.teamsService.retrieveTeams();
    
  }
  
  //TODO: remove when integrated into admin setup
  leaveTeams() {
    this.dispatcher.dispatch('leave.team');
  }

  displayAddTeam() {
    
    this.dialogService.open({
      viewModel: AddTeam,
      model: this
    }).then(response => {
      
      
      if (!response.wasCancelled) {
        // TODO handle OK
      } else {
        // TODO handle Cancel
      }
    
//        this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.CLOSE_POPUP);
      })
    ;
    
//    this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.OPEN_POPUP);
  }

  displayRenameTeam() {
    
    this.dialogService.open({
      viewModel: RenameTeam,
      model: this
    }).then(response => {
      if (!response.wasCancelled) {
        // TODO handle OK
      } else {
        // TODO handle Cancel
      }
    
//        this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.CLOSE_POPUP);
      })
    ;
    
//    this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.OPEN_POPUP);
  }

  viewTeam(team) {
    
    this.dispatcher.dispatch(TEAMS_ACTIONS.TEAM_SELECTED, team);
  }

//  removeTeam() {
//    this.router.navigate('removeTeam');
//  }

}