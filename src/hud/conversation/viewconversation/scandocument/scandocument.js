import {handle, waitFor} from 'aurelia-flux';
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
/*
*/
import {ScanDocumentService} from './scandocument.service';
import {ViewConversationService} from '../viewconversation.service';
import {ScanDocumentStore} from './scandocument.store';
import {ConversationStore} from '../../conversation.store';
import {SCAN_DOCUMENT_ACTIONS} from './scandocument.actions';
import {ViewConversationStore} from '../viewconversation.store';
/*
*/
const logger = LogManager.getLogger('ScanDocument');
/*
*/
const CROPPIE_SCREEN_SIZES = {
  '1920': {
    croppieWidth: 482,
    croppieHeight: 387
  },
  '1366': {
    croppieWidth: 340,
    croppieHeight: 272
  },
  '1280': {
    croppieWidth: 300,
    croppieHeight: 240
  },
  '1024': {
    croppieWidth: 253,
    croppieHeight: 202
  }
};
/*
*/
@inject(Router, ScanDocumentService, ViewConversationService, ScanDocumentStore, ConversationStore, ViewConversationStore)
export class ScanDocument {
  
  hasZoom = false;

  constructor(router, scanDocumentService, viewConversationService, scanDocumentStore, conversationStore, viewConversationStore) {

    this.router = router;
    this.scanDocumentService = scanDocumentService;
    this.viewConversationService = viewConversationService;
    this.scanDocumentStore = scanDocumentStore;
    this.conversationStore = conversationStore;
    this.viewConversationStore = viewConversationStore;
    
    this.viewConversationService.view('scan');
  }

  conversation() {

    this.router.navigate('view');
    this.viewConversationService.toggleVideoMode(false);
    this.cancelScan();
  }

  requestScan(type) {

    this.scanDocumentService.requestScan(type);
  }

  initiateScan() {

    this.scanDocumentService.initiateScan();
  }

  cancelScan() {

    this.scanDocumentService.cancelScan();
  }

  discardScan() {

    this.scanDocumentService.discardScan();
  }

  accept() {

    this.router.navigate('scandocument');
    this.scanDocumentService.acceptDocument(this.scanDocumentStore.scanPreview);
  }

  next() {

    this.accept(this.scanDocumentStore.scanPreview);
    this.requestScan(this.scanDocumentStore.scanType);
  }

  redo() {

    this.requestScan(this.scanDocumentStore.scanType);
  }

  cancel() {

    this.scanDocumentService.cancelDocument();
  }

  previewDocument(document) {

    this.scanDocumentService.previewDocument(document);
  }


  @handle(SCAN_DOCUMENT_ACTIONS.SCAN_FAILED)
  handleScanFailed() {
    //    this.router.navigate('videocall');
    this.viewConversationService.toggleVideoMode(false);
    alert(' An error has occurred - Scanner not found! ');
  }

  @handle(SCAN_DOCUMENT_ACTIONS.PROCESS_SCAN)
  @waitFor(ScanDocumentStore)
  handleProcessScan(action, content) {
    
    if(this.hasZoom) return;
    this.hasZoom = true;
    
    var interval = setInterval(() =>  {

      let elements = document.getElementsByClassName('scan-prvw');

      if (elements && elements.length) {

        clearInterval(interval);
        interval = null;
        wheelzoom(elements, false);
      }
    }, 100);
  }

}
/*
*/
window.wheelzoom = (function(){
	var defaults = {
		zoom: 0.1,
    fp: false
	};

	var canvas = document.createElement('canvas');

	var main = function(img, options){
		if (!img || !img.nodeName || img.nodeName !== 'IMG') { return; }

		var settings = {};
		var width;
		var height;
		var bgWidth;
		var bgHeight;
		var bgPosX;
		var bgPosY;
		var previousEvent;
		var cachedDataUrl;

		function setSrcToBackground(img) {
			img.style.backgroundImage = 'url("'+img.src+'")';
			img.style.backgroundRepeat = 'no-repeat';
      
      logger.debug(' img.naturalWidth >>>> ', img.naturalWidth);
      logger.debug(' img.naturalHeight >>>> ', img.naturalHeight);
      
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			cachedDataUrl = canvas.toDataURL();
			img.src = cachedDataUrl;
		}

		function updateBgStyle() {
			if (bgPosX > 0) {
				bgPosX = 0;
			} else if (bgPosX < width - bgWidth) {
				bgPosX = width - bgWidth;
			}

			if (bgPosY > 0) {
				bgPosY = 0;
			} else if (bgPosY < height - bgHeight) {
				bgPosY = height - bgHeight;
			}

			img.style.backgroundSize = bgWidth + 'px ' + bgHeight + 'px';
			img.style.backgroundPosition = bgPosX + 'px ' + bgPosY + 'px';
		}

		function reset() {
			bgWidth = width;
			bgHeight = height;
			bgPosX = bgPosY = 0;
			updateBgStyle();
		}

		function onwheel(e) {
			var deltaY = 0;

			e.preventDefault();

			if (e.deltaY) { // FireFox 17+ (IE9+, Chrome 31+?)
				deltaY = e.deltaY;
			} else if (e.wheelDelta) {
				deltaY = -e.wheelDelta;
			}

			// As far as I know, there is no good cross-browser way to get the cursor position relative to the event target.
			// We have to calculate the target element's position relative to the document, and subtrack that from the
			// cursor's position relative to the document.
			var rect = img.getBoundingClientRect();
			var offsetX = e.pageX - rect.left - window.pageXOffset;
			var offsetY = e.pageY - rect.top - window.pageYOffset;

			// Record the offset between the bg edge and cursor:
			var bgCursorX = offsetX - bgPosX;
			var bgCursorY = offsetY - bgPosY;
			
			// Use the previous offset to get the percent offset between the bg edge and cursor:
			var bgRatioX = bgCursorX/bgWidth;
			var bgRatioY = bgCursorY/bgHeight;

			// Update the bg size:
			if (deltaY < 0) {
				bgWidth += bgWidth*settings.zoom;
				bgHeight += bgHeight*settings.zoom;
			} else {
				bgWidth -= bgWidth*settings.zoom;
				bgHeight -= bgHeight*settings.zoom;
			}

			// Take the percent offset and apply it to the new size:
			bgPosX = offsetX - (bgWidth * bgRatioX);
			bgPosY = offsetY - (bgHeight * bgRatioY);

			// Prevent zooming out beyond the starting size
			if (bgWidth <= width || bgHeight <= height) {
				reset();
			} else {
				updateBgStyle();
			}
		}

		function drag(e) {
			e.preventDefault();
			bgPosX += (e.pageX - previousEvent.pageX);
			bgPosY += (e.pageY - previousEvent.pageY);
			previousEvent = e;
			updateBgStyle();
		}

		function removeDrag() {
			document.removeEventListener('mouseup', removeDrag);
			document.removeEventListener('mousemove', drag);
		}

		// Make the background draggable
		function draggable(e) {
			e.preventDefault();
			previousEvent = e;
			document.addEventListener('mousemove', drag);
			document.addEventListener('mouseup', removeDrag);
		}

		function load() {
			if (img.src === cachedDataUrl) return;

			var computedStyle = window.getComputedStyle(img, null);

			width = parseInt(computedStyle.width, 10);
			height = parseInt(computedStyle.height, 10);
			bgWidth = width;
			bgHeight = height;
			bgPosX = 0;
			bgPosY = 0;

			setSrcToBackground(img);

			img.style.backgroundSize =  (defaults.fp ? width : (width + 1)) + 'px ' + (height + 1) + 'px';
			img.style.backgroundPosition = '0 0';
			img.addEventListener('wheelzoom.reset', reset);

			img.addEventListener('wheel', onwheel);
			img.addEventListener('mousedown', draggable);
		}

		var destroy = function (originalProperties) {
			img.removeEventListener('wheelzoom.destroy', destroy);
			img.removeEventListener('wheelzoom.reset', reset);
			img.removeEventListener('load', load);
			img.removeEventListener('mouseup', removeDrag);
			img.removeEventListener('mousemove', drag);
			img.removeEventListener('mousedown', draggable);
			img.removeEventListener('wheel', onwheel);

			img.style.backgroundImage = originalProperties.backgroundImage;
			img.style.backgroundRepeat = originalProperties.backgroundRepeat;
			img.src = originalProperties.src;
		}.bind(null, {
			backgroundImage: img.style.backgroundImage,
			backgroundRepeat: img.style.backgroundRepeat,
			src: img.src
		});

		img.addEventListener('wheelzoom.destroy', destroy);

		options = options || {};

		Object.keys(defaults).forEach(function(key){
			settings[key] = options[key] !== undefined ? options[key] : defaults[key];
		});

		if (img.complete) {
			load();
		}

		img.addEventListener('load', load);
	};

	// Do nothing in IE8
	if (typeof window.getComputedStyle !== 'function') {
		return function(elements, isFp) {
      defaults.fp = isFp;
			return elements;
		};
	} else {
		return function(elements, options) {
      
			if (elements && elements.length) {
				Array.prototype.forEach.call(elements, main, options);
			} else if (elements && elements.nodeName) {
				main(elements, options);
			}
			return elements;
		};
	}
}());
