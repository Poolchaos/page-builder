// Last time updated at Sep 07, 2014, 08:32:23

// Latest file can be found here: https://cdn.webrtc-experiment.com/getScreenId.js

// Muaz Khan         - www.MuazKhan.com
// MIT License       - www.WebRTC-Experiment.com/licence
// Documentation     - https://github.com/muaz-khan/WebRTC-Experiment/tree/master/getScreenId.js

// ______________
// getScreenId.js

/*
getScreenId(function (error, sourceId, screen_constraints) {
    // error    === null || 'permission-denied' || 'not-installed' || 'installed-disabled' || 'not-chrome'
    // sourceId === null || 'string' || 'firefox'
    
    if(sourceId === 'firefox') {
        navigator.mozGetUserMedia(screen_constraints, onSuccess, onFailure);
    }
    else navigator.webkitGetUserMedia(screen_constraints, onSuccess, onFailure);
});
*/

(function () {
  window.getScreenId = function (callback) {
    // for Firefox:
    // sourceId === 'firefox'
    // screen_constraints = {...}
    if (!!navigator.mozGetUserMedia) {
      callback(null, 'firefox', {
        video: {
          mozMediaSource: 'window',
          mediaSource: 'window'
        }
      });
      return;
    }

    postMessage();

    window.addEventListener('message', onIFrameCallback);

    function onIFrameCallback(event) {
      if (!event.data) return;

      console.log('1', event);

      if (event.data.chromeMediaSourceId) {
        if (event.data.chromeMediaSourceId === 'PermissionDeniedError') {
          console.log('2');
          callback('permission-denied');
        } else callback(null, event.data.chromeMediaSourceId, getScreenConstraints(null, event.data.chromeMediaSourceId));
      }

      console.log('3', event.data);
      if (event.data.chromeExtensionStatus) {
        console.log('4', getScreenConstraints(event.data.chromeExtensionStatus));
        callback(event.data.chromeExtensionStatus, null, getScreenConstraints(event.data.chromeExtensionStatus));
      }

      // this event listener is no more needed
      window.removeEventListener('message', onIFrameCallback);
    }
  };

  function getScreenConstraints(error, sourceId) {
    var screen_constraints = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: error ? 'screen' : 'desktop',
          maxWidth: window.screen.width > 1920 ? window.screen.width : 1920,
          maxHeight: window.screen.height > 1080 ? window.screen.height : 1080
        },
        optional: []
      }
    };

    if (sourceId) {
      screen_constraints.video.mandatory.chromeMediaSourceId = sourceId;
    }

    return screen_constraints;
  }

  var iframe = false;
  
  function postMessage() {
    
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.onload = function () {
        iframe.isLoaded = true;
      };
      iframe.src = 'https://aiva.zailab.com/getSourceId/';
      iframe.style.display = 'none';
    }
    
    (document.body || document.documentElement).appendChild(iframe);
    
    if (!iframe.isLoaded) {
      setTimeout(postMessage, 100);
      return;
    }

    iframe.contentWindow.postMessage({
      captureSourceId: true
    }, '*');
  }
})();