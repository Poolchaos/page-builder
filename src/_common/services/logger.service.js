let styles = {
  debug: 'color:#4DACFF; padding:3px 10px; font-weight: bold;',
  error: 'color:#FF4D4D; padding:3px 10px; font-weight: bold;',
  warn: 'color:#FFBB4D; padding:3px 10px; font-weight: bold;',
  view: 'color:#4D5BFF; padding:3px 10px;'
};
/*
*/
let logStyleTypes = {
  string: '',
  integer: '%i',
  float: '%f',
  object: '%O',
  default: '%c'
};

export class LoggerManager {
  
  createInstance(view) {
    
    return logger(view);
  }
}
/*
*/
function debug(content, view) {
  
  console.log('%c' + view + ': ' + '%c' + content.string, styles.debug, styles.view, content.obj ? content.obj : '');
}
/*
*/
function warn(content, view) {
  
  console.log('%c' + view + ': ' + '%c' + content.string, styles.warn, styles.view, content.obj ? content.obj : '');
}
/*
*/
function error(content, view) {
  
  console.log('%c' + view + ': ' + '%c' + content.string, styles.error, styles.view, content.obj ? content.obj : '');
}
/*
*/
function logger(view) {
  
  return {
    debug: function() { // es5 to get arguments
      
      debug(createList(arguments), view);
    },
    warn: function() { // es5 to get arguments
      
      warn(createList(arguments), view);
    },
    error: function() { // es5 to get arguments
      
      error(createList(arguments), view);
    }
  };
}
/*
*/
function createList(args) {
  
  let string = '';
  let obj = null;
  
  for(let arg of args) {

    if(typeof arg !== 'object') {
      
      string += arg + ' ';
    } else {
    
      obj = arg;
    }
  }
  
  return {
    obj: obj,
    string: string
  };
}