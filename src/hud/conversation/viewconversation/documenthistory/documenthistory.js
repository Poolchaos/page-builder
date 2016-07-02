import {handle, waitFor} from 'aurelia-flux';
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
/*
*/
import {DocumentHistoryService} from './documenthistory.service';
import {DocumentHistoryStore} from './documenthistory.store';
import {ViewConversationService} from '../viewconversation.service';
import {ViewConversationStore} from '../viewconversation.store';
import {ConversationStore} from '../../conversation.store';
import {DOCUMENT_HISTORY} from './documenthistory.actions';
import {VIEW_CONVERSATION_ACTIONS} from '../viewconversation.actions';
import {HUD_ACTIONS} from '../../../hud.actions';
/*
*/
const logger = LogManager.getLogger('DocumentHistory');
/*
*/
@inject(DocumentHistoryService, DocumentHistoryStore, Router, ViewConversationService, ViewConversationStore, ConversationStore)
export class DocumentHistory {

  resolve;
  hasZoom = false;
  
  constructor(documentHistoryService, documentHistoryStore, router, viewConversationService, viewConversationStore, conversationStore) {
    
    this.documentHistoryService = documentHistoryService;
    this.documentHistoryStore = documentHistoryStore;
    this.router = router;
    this.viewConversationService = viewConversationService;
    this.viewConversationStore = viewConversationStore;
    this.conversationStore = conversationStore;
    this.viewConversationService.view('history');
    this.documentHistoryService.retrieveDocumentHistory();
  }
  
  previewScan(scan) {
    
    this.documentHistoryService.viewScan(scan);
  }
  
  previewPdf(document) {
    
    this.documentHistoryService.viewPdf(document);
  }
  
  makeBlob(doc, type) {
    
    let content = doc.content ? (doc.content.documentContent ? doc.content.documentContent : doc.content) : doc.documentContent;
    let name = doc.documentName;
    
    logger.debug(' makeBlob ', doc);
    
    let base64 = content.indexOf('base64') !== -1 ? content.split('base64,')[1] : content;
    
    return base64ToBlob(base64, type);
  }
  
  downloadScan(doc) {
    
    logger.debug(' downloadScan >>> ', doc);
    
    let name = doc.documentName;
    download(this.makeBlob(doc, 'image/jpeg'), 'scanned_' + name + '.png');
  }
  
  downloadFingerprint(doc) {
    
    logger.debug(' downloadFingerprint >>> ', doc);
    
    let name = doc.documentName;
    download(this.makeBlob(doc, 'image/jpeg'), 'fingerprint_' + name + '.png');
  }
  
  downloadPdf(doc) {
    
    logger.debug(' downloadPdf >>> ', doc);
    
    let name = doc.documentName.replace('.pdf', '');
    download(this.makeBlob(doc, 'application/pdf'), 'signed_' + name + '.pdf');
  }
  
  scannedDocuments() {
    
    let docs = [];
    
    for(let documentType of this.documentHistoryStore.documentHistory.scannedDocuments) {
      
      for(let scan of documentType.scans) {
        
        docs.push({blob: this.makeBlob(scan, 'image/jpeg'), name: 'scanned_' + scan.documentName + '.png'});
      }
    }
    
    logger.debug(' - scannedDocuments >>> ', docs);
    
    return docs;
  }
  
  signedDocuments() {
    
    let docs = [];
    
    for(let doc of this.documentHistoryStore.documentHistory.signedDocuments) {
        
      docs.push({blob: this.makeBlob(doc, 'application/pdf'), name: 'signed_' + doc.documentName + '.pdf'});
    }
    
    logger.debug(' - signedDocuments >>> ', docs);
    
    return docs;
  }
  
  scannedFingerprints() {
    
    let docs = [];
    
    for(let scan of this.documentHistoryStore.documentHistory.fingerprintDocuments) {
        
      docs.push({blob: this.makeBlob(scan, 'image/jpeg'), name: 'fingerprint_' + scan.documentName + '.png'});
    }
    
    logger.debug(' - scannedFingerprints >>> ', docs);
    
    return docs;
  }
  
  downloadZip() {
    
    let scannedDocuments = this.scannedDocuments();
    let signedDocuments = this.signedDocuments();
    let scannedFingerprints = this.scannedFingerprints();
              
    let contact = this.conversationStore.selectedContact.firstName + '_' + this.conversationStore.selectedContact.surname;
    let conversation = this.viewConversationStore.conversationCard.conversationName;
    let fileName = contact + '_' + conversation + '_documents';
  
    let allDocuments = scannedDocuments.concat(signedDocuments);
    allDocuments = allDocuments.concat(scannedFingerprints);
    
    var zip = new JSZip();
    
    for(var item of allDocuments) {
      
      zip.folder(fileName).file(item.name, item.blob);
    }
    
    zip.generateAsync({type:"blob"})
    .then((content) => {
      
      download(content, fileName + '.zip');
    });
  }
  
  @handle(DOCUMENT_HISTORY.PREVIEW_SCAN)
  handlePreviewScan(action, scan) {
    
    if(this.hasZoom) return;
    this.hasZoom = true;
    
    var interval = setInterval(() => {

      let elements = document.getElementsByClassName('scan-prvw');

      if (elements && elements.length) {

        clearInterval(interval);
        interval = null;
        wheelzoom(elements, (scan.title ? true : false));
      }
    }, 100);
  }


  @handle(VIEW_CONVERSATION_ACTIONS.DOWNLOAD_ZIP)
  handleDownloadZip() {
    
    this.downloadZip();
  }

  @handle(HUD_ACTIONS.AGENT_STATUS_LOGGED)
  @waitFor(ConversationStore)
  handleAgentStatusChanged(action, status) {

  logger.debug(' applicationService >>> handleAgentStatusChanged >>> ', status);
    setTimeout(() => {

      if (status !== 'WRAP_UP') {
        this.documentHistoryService.clearStore();
        this.router.parent.navigate('contact');
//        this.router.parent.parent.navigate('dashboard/agent');
      }
    }, 200);
  }
}
/*
*/
function base64ToBlob(base64, format) {

  var byteCharacters = atob(base64);
  var byteNumbers = new Array(byteCharacters.length);
  for (var i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  var byteArray = new Uint8Array(byteNumbers);
  var blob = new Blob([byteArray], {type: format});

  return blob;
};
/*
*/
function download(data, fileName) {
  
  logger.debug(' download >>> ', data, fileName);
  
  var saveData = (function () {
    
    var a = document.createElement("a");
    
    document.body.appendChild(a);
    a.style = "display: none";
    
    return function (data, fileName) {
      
      let url = window.URL.createObjectURL(data);
      
      a.href = url;
      a.download = fileName;
      
      a.click();
      
      window.URL.revokeObjectURL(url);
    };
  }());


  saveData(data, fileName);
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
