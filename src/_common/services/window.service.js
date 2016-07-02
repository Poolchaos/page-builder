/*
*/
import {WINDOW_EVENTS} from './window.service.events';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
import key from 'keymaster';
import BeforeUnload from 'before-unload';
import $ from 'jquery';
import 'oncapslock';
/*
*/
const logger = LogManager.getLogger('WindowService');
/*
*/
@inject(EventAggregator)
export class WindowService {

  beforeUnload;

  constructor(eventAggregator) {

    this.eventAggregator = eventAggregator;
    init();
  }

  disableRefresh() {

    key.setScope('');
  }

  disableUnload() {

    this.beforeUnload = new BeforeUnload(
      'Unloading this page may lose data. What do you want to do...',
      function() {
        return true;  // TODO use this to check if the url matches a defined redirect url from application properties of configuration
      }
    );
  }

  enableRefresh() {

    key.setScope('enabled');
  }

  enableUnload() {

    if (!this.beforeUnload) {
      return;
    }

    this.beforeUnload.unregister();
  }

  disableDoubleClick() {

    setTimeout(() => {
      
      let buttons = $('button');

//      logger.debug('disableDoubleClick > buttons = ', buttons);

      buttons.click((e) => { // TODO maybe <a> (anchors) also?

//        logger.debug('disableDoubleClick > click > e = ', e);
        
        if (e.currentTarget.form === null && e.currentTarget.id !== 'acceptBtn') {
          
          e.currentTarget.disabled = true;
        } else {

          setTimeout(() => { // TODO investigate why the validation does not work unless there's this timeout - only form targets?
            e.currentTarget.disabled = true;
          }, 100);
        }
        
        setTimeout(() => {
          e.currentTarget.disabled = false;
        }, 1000);
      });
    }, 500);
  }

  enableCapslockDetection(settings) {

    settings = settings || {
      message: 'Caps Lock is on.'
    };

    let isCapslockOn = false;
    let debounce = true;

    setTimeout(() => { // TODO timeout not really needed but just in case?

      let el = $('input');

      for (let i = 0; i < el.length; i++) {

        let e = el[i];

        if (e.type === 'password') {

          e.oncapslock = (e) => {

            isCapslockOn = true;
          };

          key('a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z', (event) => {

            if (debounce) {

              setTimeout(() => {

                if (isCapslockOn) {

                  this.eventAggregator.publish(WINDOW_EVENTS.ON_CAPSLOCK_DETECTED, {
                    event: event,
                    settings: settings
                  });
                } else {

                  this.eventAggregator.publish(WINDOW_EVENTS.OFF_CAPSLOCK_DETECTED, {
                    event: event,
                    settings: settings
                  });
                }

                isCapslockOn = false;
              }, 100);
              
              debounce = false;
              setTimeout(() => debounce = true, 200);
            }
          });
        }
      }
    }, 500);
  }
}
/*
*/
function init() {

  key.filter = () => { // always filter even if an input is active
    return true;
  };

  // refresh control currently disabled
  //  key('⌘+r, ctrl+r, ctrl+shift+r, f5, shift+f5', () => { return false; });
  //  key('⌘+r, ctrl+r, ctrl+shift+r, f5, shift+f5', 'enabled', () => { return true; });
}
 