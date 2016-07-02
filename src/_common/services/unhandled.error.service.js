/*
*/
import {MESSAGE_EVENTS} from 'zailab.common';
/*
*/
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject, LogManager} from 'aurelia-framework';
import AjaxInterceptor from 'ajax-interceptor';
/*
*/
const logger = LogManager.getLogger('LogAppender');
/*
Add errors here that can be ignored - the errors are only partially checked so that any error containing the text is ignored
*/
const IGNORED_ERRORS = [
  // The app is routed but the router still throws this error - aurelia-router
  'Error: Route not found'
];
/*
Add promise rejection reasons here that can be ignored
*/
const IGNORED_REASONS = [
  // The prompt is clicked open/close multiple times then this rejection reason happends
  'NotFoundError: Failed to execute \'removeChild\' on \'Node\': The node to be removed is not a child of this node.'
];
/*
Use this appender to control how errors are handled
*/
@inject(EventAggregator)
export class LogAppender {

  constructor(eventAggregator) {

    this.errorHandler = new ErrorHandler(eventAggregator);
    this.eventAggregator = eventAggregator;
  }
  
  registerHandlers() {
    
    registerWindowErrorHandler(this.eventAggregator);
    registerWindowPromiseRejectionHandler(this.eventAggregator);
    registerXhrErrorHandler(this.eventAggregator);
  }

  error(log, message, ...rest) {

    this.errorHandler.handleMessage(message);
  }

  debug(log, message, ...rest) {}

  info(log, message, ...rest) {}

  warn(log, message, ...rest) {}
}
/*
Ignore this error because it does not effect the stability of the app
*/
function ignore(message) {

  for (let error of IGNORED_ERRORS) {

    if (message.indexOf(error) !== -1) {

      logger.warn('ignore > error message = ', message);
      return true;
    }
  }

  for (let reason of IGNORED_REASONS) {

    if (message === reason) {

      logger.warn('ignore > reason message = ', message);
      return true;
    }
  }

  return false;
}
/*
Handle aurelia errors
LIMITATION: this handler cannot prevent the default behaviour therefor cannot prevent the error from showing in the log
*/
class ErrorHandler {

  constructor(eventAggregator) {

    this.eventAggregator = eventAggregator;
  }

  handleMessage(message) {

    if (ignore(message + '')) {
      return;
    }

    logger.warn('ErrorHandler > handleMessage > message = ', message);

    this.eventAggregator.publish(MESSAGE_EVENTS.ERROR_UNHANDLED, message);
  }
}
/*
Handle window errors
Not sure when this will be called - not seen yet
*/
function registerWindowErrorHandler(eventAggregator) {

  window.addEventListener('error', (errorEvent) => {

    logger.warn('registerWindowErrorHandler > errorEvent = ', errorEvent);
    
    eventAggregator.publish(MESSAGE_EVENTS.ERROR_UNHANDLED, `${errorEvent.error.message} -> ${errorEvent.error.stack}`);
  });
}
/*
Handle core-js promise rejection
*/
function registerWindowPromiseRejectionHandler(eventAggregator) {

  let baseOnunhandledrejection = window.onunhandledrejection;
  window.onunhandledrejection = (rejection) => {

    try {

      if (ignore(rejection.reason + '')) {

        rejection.preventDefault(); // prevent the original error from displaying in the console
        return;
      }

      logger.warn('registerWindowPromiseRejectionHandler > rejection = ', rejection);

      let msg = `Unhandled promise rejection : ${rejection.reason}`;
      if (rejection.reason.stack) {
        msg += ` -> ${rejection.reason.stack}`;
      }

      eventAggregator.publish(MESSAGE_EVENTS.ERROR_UNHANDLED, msg);
    } finally {

      if (baseOnunhandledrejection) {
        baseOnunhandledrejection(data);
      }
    }
  };
}
/*
Handle xhr errors
LIMITATION: this handler cannot prevent the default behaviour therefor cannot prevent the error from showing in the log
*/
function registerXhrErrorHandler(eventAggregator) {

  AjaxInterceptor.addResponseCallback((xhr) => {

    if (xhr.status === 500) {

      logger.warn('registerXhrErrorHandler > 500 > xhr = ', xhr);

      eventAggregator.publish(MESSAGE_EVENTS.ERROR_UNHANDLED, `${xhr.statusCode} - ${xhr.statusText} -> ${xhr.responseText}`);
    }

    if (xhr.status === 0) {

      logger.warn('registerXhrErrorHandler > 0 > xhr = ', xhr);

      // Do not publish any error
      // This happens when an unknown image is queried - which is handled actually by showing the default
      // This happens even if the error was handled actually in zailab class
      // eventAggregator.publish(MESSAGE_EVENTS.ERROR_UNHANDLED, `XMLHttpRequest request cancelled by browser (status code 0). See console for details.`); // UNCOMMENT TO PUBLISH UNHANDLED RESPONSE ERRORS
    }
  });
  AjaxInterceptor.wire();
}
