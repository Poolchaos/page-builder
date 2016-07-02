/*
*/
import 'bootstrap';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import {Redirect} from 'aurelia-router';
import {ValidationGroup} from 'aurelia-validation';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-http-client';
/*
*/
import {Particleground} from './_common/animations/particleground';
import {WebSocket} from './_common/services/websocket';
import {ApplicationProperties} from './_config/application.properties';
import {UserSession} from './_common/stores/user.session';
import {DisplayMessageService} from './_common/services/display.message.service';
/*
*/
import {LoginService} from './onboarding/login/login.service';
import {LOGIN_ACTIONS} from './onboarding/login/login.actions';
/*
*/
import {MESSAGE_EVENTS} from 'zailab.common';
/*
*/
import {LogAppender} from './_common/services/unhandled.error.service';
/*
*/
import {HUD_ANIMATOR_EVENTS} from './hud/hud.animator.events';
import {AnimatorStore} from './hud/hud.animator.store';
import {WindowService} from './_common/services/window.service';
/*
*/
const logger = LogManager.getLogger('App');
/*
*/
@inject(ApplicationProperties, HttpClient, Particleground, UserSession, EventAggregator, WebSocket, DisplayMessageService, LoginService, WindowService, LogAppender, AnimatorStore)
export class App {

  showLoader;

  constructor(applicationProperties, httpClient, particles, userSession, eventAggregator, webSocket, displayMessageService, loginService, windowService, logAppender, animatorStore) {

    this.applicationProperties = applicationProperties;
    this.http = httpClient;
    this.particles = particles;
    this.userSession = userSession;
    this.eventAggregator = eventAggregator;
    this.webSocket  = webSocket;
    this.displayMessageService = displayMessageService;
    this.loginService = loginService;
    this.windowService = windowService;
    this.animatorStore = animatorStore;

    logAppender.registerHandlers();
    LogManager.addAppender(logAppender); // added here instead of main.js because of event aggregator

    this.subscribeEvents();

    ValidationGroup.prototype.isEmail = function(message) {
      this
      	.matches(/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/)
        .withMessage((newValue, threshold) => {return message || 'Please enter a valid email';});
      return this;
    };
  }

  subscribeEvents() {

    this.eventAggregator.subscribe('application.update.token', userData=> {
      logger.debug('eventAggregator > application.update.token > userData ', userData);
      this.userSession.loggedInUser = userData;

      this.http.configure(req => {
        req.withInterceptor(this);
        req.withBaseUrl(this.applicationProperties.apiQueryEndpoint);
        req.withHeader('Authorization', this.userSession.authorization);
      });
    });

    this.eventAggregator.subscribe('router:navigation:error', (data) => logger.debug('router:navigation:error > data = ', data));
    this.eventAggregator.subscribe('router:navigation:canceled', (data) => logger.debug('router:navigation:canceled > data = ', data));
    this.eventAggregator.subscribe('router:navigation:success', (data) => logger.debug('router:navigation:success > data = ', data));

    this.eventAggregator.subscribe('router:navigation:processing', (data, event) => {

      logger.debug('router:navigation:processing > data = ', data);

      if (this.animatorStore.isReady) {
        return;
      }

      this.showLoader = true;
    });

    this.eventAggregator.subscribe('router:navigation:complete', (data, event) => {

      logger.debug('router:navigation:complete > data = ', data);

      this.windowService.disableDoubleClick();
      this.windowService.enableCapslockDetection();

      if (!this.showLoader) {
        return;
      }

      setTimeout(() => this.showLoader = false, 250);
    });

    this.eventAggregator.subscribe('router:navigation:error', (data, event) => {

      logger.debug('router:navigation:error > data = ', data);
      this.router.navigateToRoute('error', {code: 2});
    });

    this.eventAggregator.subscribe(MESSAGE_EVENTS.ERROR_UNHANDLED, (message) => { // catch the root router error

      logger.debug(MESSAGE_EVENTS.ERROR_UNHANDLED + ' > message = ', message);

      if (message === 'Router navigation failed, and no previous location could be restored.') {
        this.router.navigateToRoute('error', {code: 2});
      }
    });
  }

  initAnimation(el) {
    this.particles.initiate(el);
  }

  response(message) {

    if (!message.response) {
      return message;
    }

    logger.debug('raw response > ', message);

    message.response = message.response.length > 0 ? message.response : {};
    var msg;

    try {
      msg = JSON.parse(message.response);
    }catch (e) {
      msg = message.response;
    }

    var formattedResponse = msg._embedded ? msg._embedded : msg;

    if (msg instanceof Object && msg.page) {
      formattedResponse.page = msg.page;
    }

    return formattedResponse;
  }

  activate() {

    this.http.configure(req => {
      req.withInterceptor(this);
      req.withBaseUrl(this.applicationProperties.apiQueryEndpoint);
      req.withHeader('Authorization', this.userSession.authorization);
    });
    
    let organisationId = this.userSession.organisationId;
    
    if(organisationId){
      this.loginService.retrieveOrganisationChannels(organisationId);
      this.loginService.retrieveOrganisationInfo(organisationId);
    }
    
  }

  @handle(LOGIN_ACTIONS.LOGIN_PASSED)
  handleLoginPassed(message) {
    
    this.http.configure(req => {
      req.withInterceptor(this);
      req.withBaseUrl(this.applicationProperties.apiQueryEndpoint);
      req.withHeader('Authorization', this.userSession.authorization);
    });
    
    let organisationId = this.userSession.organisationId;
    
    if(organisationId){
      this.loginService.retrieveOrganisationChannels(organisationId);
      this.loginService.retrieveOrganisationInfo(organisationId);
    }
  }
  
  configureRouter(config, router) {

    config.title = 'ZaiConversations';
    config.options.pushState = true;
    config.addPipelineStep('authorize', AuthStep);
    config.map([
      {route: ['', 'login'],                name: 'login',                moduleId: 'onboarding/login/login',                                                    nav: false, title: 'Sign In',               auth: false},
      {route: 'logout',                     name: 'logout',               moduleId: 'logout/logout',                                                             nav: false, title: 'Log out',               auth: true},
      {route: 'join',                       name: 'join',                 moduleId: 'onboarding/registration/join/join',                                         nav: false, title: 'Join',                  auth: false},
      {route: 'emailsubmitted',             name: 'emailsubmitted',       moduleId: 'onboarding/registration/join/emailsubmitted',                               nav: false, title: 'Email Submitted',       auth: false},
      {route: 'completeregistration',       name: 'completeregistration', moduleId: 'onboarding/registration/completeregistration/complete.registration',        nav: false, title: 'Complete Registration', auth: false},
      {route: 'verify',                     name: 'verify',               moduleId: 'onboarding/registration/completeregistration/verify.complete.registration', nav: false, title: 'Verification',          auth: false},
      {route: 'acceptinvitation',           name: 'acceptinvitation',     moduleId: 'onboarding/registration/acceptinvitation/accept.invitation',                nav: false, title: 'Accept Invitation',     auth: false},
      {route: 'invitationerror',            name: 'invitationerror',      moduleId: 'onboarding/registration/acceptinvitation/accept.invitation.error',          nav: false, title: 'Invitation Error',      auth: false},
      {route: 'registrationerror',          name: 'registrationerror',    moduleId: 'onboarding/registration/completeregistration/complete.registration.error',  nav: false, title: 'Registration Error',    auth: false},
      {route: 'hud',                        name: 'hud',                  moduleId: 'hud/hud',                                                                   nav: false, title: 'HUD',                   auth: true}

      ,
      {route: 'password',                   name: 'password',             moduleId: 'onboarding/password/password',                                              nav: false, title: 'Password',              auth: false},
//      {route: 'forgot/password',            name: 'forgotpassword',       moduleId: 'onboarding/password/forgotpassword',                                        nav: false, title: 'Forgot Password',       auth: false},
      {route: 'reset/password/:passportId', name: 'resetpassword',        moduleId: 'onboarding/password/resetpassword/resetpassword',                           nav: false, title: 'Reset Password' ,       auth: false},
      {route: 'error/:code',                name: 'error',                moduleId: 'error/error',                                                               nav: false, title: 'Error' ,                auth: false}
    ]);

    this.router = router;
  }
}

@inject(UserSession, EventAggregator)
class AuthStep {

  _showLoader;

  constructor(userSession, eventAggregator) {

    this.userSession = userSession;
    this.eventAggregator = eventAggregator;
  }

  run(navigationInstruction, next) {

    /*
    AUTH
    */

    let isAuthRoute = navigationInstruction.getAllInstructions().some(i => i.config.auth);
    if (isAuthRoute) {

      var isLoggedIn = this.userSession.isLoggedIn;
      if (!isLoggedIn) {

        return next.cancel(new Redirect('/login'));
      }
    }

    /*
    BLOCKED
    */

    let isBlocked = navigationInstruction.getAllInstructions().some(i => i.config.isBlocked);
    if (isBlocked) {

      return next.cancel(new Redirect('/error/1'));
    }

    /*
    WINGS
    */

    let isShowWingsRoute = navigationInstruction.getAllInstructions().some(i => i.config.showWings);
    if (isShowWingsRoute) {
      this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.SHOW_WINGS_ROUTE_NAVIGATED);
    } else {
      this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.HIDE_WINGS_ROUTE_NAVIGATED);
    }

    return next();
  }
}
