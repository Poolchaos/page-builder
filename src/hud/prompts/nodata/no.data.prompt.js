/*
zailab
*/
/*
aurelia
*/
import {DialogController}        from 'aurelia-dialog';
import {inject}               from 'aurelia-framework';
/*
No Data Prompt - Show no data dialog box
*/
@inject(DialogController)
export class NoDataPrompt {
  
  constructor(controller) {
    this.controller = controller;
    this.controller.settings.lock = false;
  }
  
  close() {
    this.controller.cancel();
  }

}