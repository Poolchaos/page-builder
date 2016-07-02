/*
*/
import {HUD_ANIMATOR_EVENTS} from '../../../hud.animator.events';
import {PROMPT_ACTIONS} from '../prompt.actions';
/*
*/
import {Dispatcher} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogController} from 'aurelia-dialog';
/*
*/
import {PromptStore} from '../prompt.store';
import {PromptService} from '../prompt.service';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('PicturePrompt');
/*
*/
@inject(PromptStore, PromptService, Dispatcher, EventAggregator, DialogController)
export class PicturePrompt {

  hasImage;

  constructor(promptStore, promptService, dispatcher, eventAggregator, dialogController) {

    this.promptStore = promptStore;
    this.promptService = promptService;
    this.dispatcher = dispatcher;
    this.eventAggregator = eventAggregator;
    this.dialogController = dialogController;
  }

  attached() {

    this.imageCropper = new Croppie(this.filePreview, {
      viewport: {
      width: 210,
      height: 210,
      type: 'square' //default 'square'
    },
      boundary: {
      width: 210,
      height: 210
    },
      customClass: '', //imageCropper
      enableZoom: true, //default true // previously showZoom
      showZoomer: true, //default true
      mouseWheelZoom: true, //default true
      update: function(cropper) { }
    });

    this.imageCropper.setZoom(0);
    
  }

  selectPicture(evt) {

    let file = evt.target.files[0];
    let reader = new FileReader();
    
    if(!file){
      return;
    }

    reader.onload = event => {
      this.imageCropper.bind(event.target.result); 
      this.hasImage = true;
    };

    reader.readAsDataURL(file);
  }

  accept() {

    this.imageCropper.result('canvas').then(imgBase64 => {

      let rawBase64 = imgBase64;//imgBase64.split('base64,')[1];

      this.promptService.actionItem(this.promptStore.acceptAction, rawBase64);
      this.dialogController.close();
      this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.PROMPT_CLOSED);

    });

  }

}
