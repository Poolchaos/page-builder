let styles = {
  debug: 'color:#4DACFF; padding:3px 10px;',
  error: 'color:#FF4D4D; padding:3px 10px;',
  view: 'color:#4D5BFF; padding:3px 10px; font-weight: bold;'
};

export class LoggerManager {
  
  createInstance(view) {
    
    return logger(view);
  }
}
/*
*/
function debug(content, view) {
  
  console.log('%c' + view + ': ' + '%c' + content, styles.view, styles.debug);
}
/*
*/
function error(content, view) {
  
  console.log('%c' + view + ': ' + '%c' + content, styles.view, styles.error);
}
/*
*/
function logger(view) {
  
  return {
    debug: content => {
      
      debug(content, view);
    },
    error: content => {
      
      error(content, view);
    }
  };
}