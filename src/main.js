import {LogManager} from 'aurelia-framework';
import {ConsoleAppender} from 'aurelia-logging-console';
import {Configure} from 'aurelia-configuration';
/*
*/
LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(LogManager.logLevel.none); // none < error < warn < info < debug
/*
*/
const logger = LogManager.getLogger('Main');
/*
*/
//console.log = function() { TODO: enable this to remove/prevent all console.log calls
//
//  throw new Error('console.log is not cool, rather use a logger... example:\r\n\r\nimport {LogManager} from \'aurelia-framework\';\r\n\r\nconst logger = LogManager.getLogger(\'Foo\');\r\n\r\nexport class Foo {\r\n\r\n\t...\r\n\r\n\tlogger.debug(\'make a DEBUG note of something\');\r\n\tlogger.info(\'make a INFO note of something\');\r\n\tlogger.warn(\'make a WARN note of something\');\r\n\tlogger.error(\'make a ERROR note of something\');\r\n\r\n\t...\r\n\r\n}');
//}
/*
*/
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin('aiva-common')
    //.plugin('aurelia-animator-css') // aurelia-animator-css="github:aurelia/animator-css@0.15.0"
//    .plugin('aurelia-animator-velocity', config => {
//
//      config.options.duration = 400;
//      config.options.easing = 'linear';
//      config.options.delay = 500;
//
//      config.enterAnimation = {properties: ':enter', options: {easing: 'ease-in', duration: 2000}};
//      config.leaveAnimation = {properties: ':leave', options: {easing: 'ease-in', duration: 2000}};
//
//      config.runSequence([config.leaveAnimation, config.enterAnimation]);
//    })
    .plugin('aurelia-flux')
    .plugin('aurelia-validation')
    .plugin('aurelia-dialog')
    .plugin('aurelia-configuration', config => {
      config.setEnvironments({
        local:       ['localhost'],
        vagrant:     ['192.168.33.10'],
        dev1:        ['localhost'],
        dev2:        ['dev2.zailab.com'],
        dev3:        ['dev3.zailab.com'],
        qa:          ['qa.zailab.com'],
        dev:         ['dev.zailab.com'],
        staging:     ['staging.zailab.com'],
        prod:        ['conversations.zailab.com']
      });
    });
//    .globalResources(
//      'hud/dashboard/_custom/dashboard.vessel',
//      'hud/dashboard/_custom/dashboard.vessel.header',
//      'hud/dashboard/_custom/dashboard.camp',
//      'hud/dashboard/_custom/dashboard.camp.title',
//      'hud/dashboard/_custom/dashboard.camp.header',
//      'hud/dashboard/_custom/dashboard.camp.body',
//      'hud/dashboard/_custom/dashboard.camp.label',
//      'hud/dashboard/_custom/dashboard.camp.footer',
//      'hud/dashboard/_custom/dashboard.camp.pager',
//      'hud/dashboard/_prompts/prompt.pager',
//      '_custom/crud',
//      '_custom/crud.header',
//      '_custom/crud.body',
//      '_custom/crud.footer',
//      '_custom/guide/guide',
//      '_custom/guide/guide.header',
//      '_custom/guide/guide.header',
//      '_custom/picture',
//      '_custom/steps',
//      '_custom/zai_footer/zai.footer',
//      '_custom/wizard'
//    '_custom/gem'

//    );
    
  let configure = aurelia.container.get(Configure);
  if (configure.environment !== 'prod') {
    LogManager.setLevel(LogManager.logLevel.debug); // none < error < warn < info < debug
  }

  aurelia.start().then(a => a.setRoot('app', document.body));
}
