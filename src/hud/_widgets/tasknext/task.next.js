import {DialogService} from 'aurelia-dialog';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {NoDataPrompt} from '../../prompts/nodata/no.data.prompt';

@inject(DialogService, EventAggregator)
export class agentTaskNext {
  
  constructor(dialogService, eventAggregator) {
    this.dialogService = dialogService;
    this.eventAggregator = eventAggregator;
  }
  
    openNoData() {
    this.dialogService.open({
      viewModel: NoDataPrompt,
      model: this
    }).then(response => {
      if (!response.wasCancelled) {
        // TODO handle OK
      } else {
        // TODO handle Cancel
      }

      this.eventAggregator.publish('hud.animator.blur.event.focus');
    })
    ;
    
    this.eventAggregator.publish('hud.animator.blur.event');
  }

} 