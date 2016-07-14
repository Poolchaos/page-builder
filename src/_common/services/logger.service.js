let styles = {
  debug: 'color:#4D5BFF; padding:3px 10px;',
  error: 'color:#FF4D4D; padding:3px 10px;',
  warn: 'color:#FFBB4D; padding:3px 10px; font-weight: bold;',
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
  
  console.log('debug >>>> ', content);
  
  console.log('%c' + view + ': ', styles.debug, content);
}
/*
*/
function warn(content, view) {
  
  console.log('%c' + view + ': ', styles.warn, content);
}
/*
*/
function error(content, view) {
  
  console.log('%c' + view + ': ', styles.error, content);
}
/*
*/
function logger(view) {
  
  return {
    debug: function() { // es5 to get arguments
      
      debug(createList(arguments), view);
    },
    warn: function() { // es5 to get arguments
      
//      let data = [];
//      
//      for(let arg of arguments) {
//        
//        data.push(arg);
//      }
      warn(createList(arguments), view);
//      warn(data, view);
    },
    error: function() { // es5 to get arguments
      
      error(createList(arguments), view);
//      error(data, view);
    }
  };
}
/*
*/
function createList(args) {
  
  let data = [];
  
  for(let arg of args) {

    data.push(arg);
  }
  
  return args;
}