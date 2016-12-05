import {inject} from 'aurelia-framework';
/*
 */
import {LoggerManager} from 'zailab.common';
/*
 */
let logger;
/*
 */
@inject(LoggerManager)
export class DrawLineService {

  constructor(loggerManager) {

    logger = loggerManager.createInstance('Draw Line Service');

    return {
      draw: draw,
      resetConnectors: resetConnectors,
      hasConnectors: hasConnectors,
      reset: reset
    };
  }
}
/*
 */

var currentEvent, currentConnector, secondConnector, connectors = [];
function draw(e, connector, connector_two) {

  if(connector_two) {
    secondConnector = connector_two;
  }

  if(e) {
    currentEvent = e;
  }
  if(connector) {
    currentConnector = connector;
  }

  if(!currentConnector) return;

  var length = assessHeight();
  var angle = setRotation(length);
  var line = document.createElement('div');

  line.style.height = Math.round(length) + 'px';
  line.style['-webkit-transform'] = 'rotate(' + angle + 'deg)';
  line.style['-moz-transform'] = 'rotate(' + angle + 'deg)';
  line.style['-o-transform'] = 'rotate(' + angle + 'deg)';
  line.style['-ms-transform'] = 'rotate(' + angle + 'deg)';
  line.style['transform'] = 'rotate(' + angle + 'deg)';
  line.setAttribute('class', 'line');
  line.setAttribute('id', 'line');

  currentConnector.innerHTML = '';
  currentConnector.appendChild(line);

  if(secondConnector) {

    var idOut = currentConnector.id;
    var idIn = secondConnector.id;

    for(var conn = 0; conn < connectors.length; conn++) {
      if(connectors[conn].idOut === idOut) {
        connectors[conn] = {
          out: currentConnector,
          in: secondConnector,
          idIn: idIn,
          idOut: idOut
        };
        return;
      }
    }

    connectors.push({
      out: currentConnector,
      in: secondConnector,
      idIn: idIn,
      idOut: idOut
    });
  }
}
/*
 */
function assessHeight() {

  var pageX = secondConnector ? secondConnector.getBoundingClientRect().left: currentEvent.pageX;
  var pageY = secondConnector ? secondConnector.getBoundingClientRect().top: currentEvent.pageY;

  var originalY = currentConnector.getBoundingClientRect().top;
  var originalX = currentConnector.getBoundingClientRect().left;
  return Math.sqrt(
    (pageX - originalX)
    * (pageX - originalX)
    + (pageY - originalY)
    * (pageY - originalY));
}
/*
 */
function setRotation(length) {

  var pageX = secondConnector ? secondConnector.getBoundingClientRect().left: currentEvent.pageX;
  var pageY = secondConnector ? secondConnector.getBoundingClientRect().top: currentEvent.pageY;

  var angle = 180 / 3.14 * Math.acos((pageY - currentConnector.getBoundingClientRect().top) / length);
  if(pageX > currentConnector.getBoundingClientRect().left) angle *= -1;
  return angle;
}
/*
 */
var drawing = false;
function resetConnectors() {

  if(drawing) {
    return;
  }

  for(var i = 0; i < connectors.length; i++) {
    var conn = connectors[i];

      draw(null, conn.out, conn.in);
  }
}

function hasConnectors() {
  return connectors.length > 0
}

function reset() {
  currentConnector = null;
  secondConnector = null;
}