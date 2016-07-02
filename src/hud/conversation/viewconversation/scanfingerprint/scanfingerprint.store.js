import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
*/
import {SCAN_FINGERPRINT_ACTIONS} from './scanfingerprint.actions';
/*
*/
const logger = LogManager.getLogger('ScanFingerprintStore');
/*
*/
const FINGERS_DISPLAY_NAMES = [
  'left pinky finger',
  'left ring finger',
  'left middle finger',
  'left index finger',
  'left thumb',
  'right thumb',
  'right index finger',
  'right middle finger',
  'right ring finger',
  'right pinky finger'
];
/*
*/
const FINGER_INDICATOR_CLASS_NAMES = [
  'l_pinky',
  'l_ring',
  'l_middle',
  'l_index',
  'l_thumb',
  'r_thumb',
  'r_index',
  'r_middle',
  'r_ring',
  'r_pinky'
];
/*
*/
const FINGERS = [
  'SCAN_FP_LEFT_PINKY',
  'SCAN_FP_LEFT_RING',
  'SCAN_FP_LEFT_MIDDLE',
  'SCAN_FP_LEFT_INDEX',
  'SCAN_FP_LEFT_THUMB',
  'SCAN_FP_RIGHT_THUMB',
  'SCAN_FP_RIGHT_INDEX',
  'SCAN_FP_RIGHT_MIDDLE',
  'SCAN_FP_RIGHT_RING',
  'SCAN_FP_RIGHT_PINKY'
];
/*
*/
let STATE = {};
/*
*/
function setDefaultState() {

  STATE = {

    instruction: null,
    serviceInstruction: null,
    fingerprint: null,
    fingerprintIndex: null,
    preview: null,
    displayNameInstruction: null,
    document: null,
    canClose: true,
    currentFingerIndex: 0,
    enableSkip: false,
    documentList: []
  };
}
/*
*/
export class ScanFingerprintStore {

  get FINGERS() {

    return [
      'SCAN_FP_LEFT_PINKY',
      'SCAN_FP_LEFT_RING',
      'SCAN_FP_LEFT_MIDDLE',
      'SCAN_FP_LEFT_INDEX',
      'SCAN_FP_LEFT_THUMB',
      'SCAN_FP_RIGHT_THUMB',
      'SCAN_FP_RIGHT_INDEX',
      'SCAN_FP_RIGHT_MIDDLE',
      'SCAN_FP_RIGHT_RING',
      'SCAN_FP_RIGHT_PINKY'
    ];
  }

  constructor() {

    setDefaultState();
  }
  
  get firstFinger() {
    
    return FINGERS[0];
  }
  
  get nextFinger() {
    
    return FINGERS[STATE.currentFingerIndex + 1];
  }
  
  get currentFinger() {
    
    return FINGERS[STATE.currentFingerIndex];
  }

  get isReadyToScanNextFinger() {

    return STATE.serviceInstruction === 'fingers' && STATE.currentFingerIndex < 9;
  }

  get instruction() {

    return STATE.instruction;
  }

  get fpInstruction() {

    return STATE.fpInstruction;
  }

  get serviceInstruction() {

    return STATE.serviceInstruction;
  }

  get instructionTitle() {

    return STATE.instructionTitle;
  }

  get fingerprint() {

    return STATE.fingerprint;
  }

  get fingerprintIndex() {

    return STATE.fingerprintIndex;
  }

  get preview() {

    return STATE.preview;
  }

  get displayNameInstruction() {

    return STATE.displayNameInstruction;
  }

  get document() {

    return STATE.document;
  }

  get canClose() {

    return STATE.canClose;
  }

  get currentFingerIndex() {

    return STATE.currentFingerIndex;
  }

  get enableSkip() {

    return STATE.enableSkip;
  }

  get documentList() {

    return STATE.documentList;
  }

  @handle(SCAN_FINGERPRINT_ACTIONS.PROCESS_SCANNED_FP)
  handleProcessScannedFingerprint(action, fingerprint) {
       
    if(STATE.canClose){
      logger.debug(" PROCESS_SCANNED_FP > Not showing finger print as processing finger print has already been closed");
      return;
    }

    logger.debug(' PROCESS_SCANNED_FP > fingerprint >>> ', fingerprint);
    
    let currentFingerName = FINGERS_DISPLAY_NAMES[STATE.currentFingerIndex];

    STATE.fingerprint = fingerprint;
    STATE.fingerprintIndex++;
    STATE.fingerprint.documentName = STATE.instruction === 'thumbs' ? 'Thumbs' : (currentFingerName);
    STATE.fpInstruction = 'document.received';

    STATE.canClose = false;
    STATE.displayNameInstruction = null;

    fingerprint.title = STATE.instruction === 'thumbs' ? 'Thumbs print preview.' : currentFingerName + ' print preview.';

    STATE.document = {
      documentContent: 'data:image/jpeg;charset=utf-16le;base64,' + fingerprint.content,
      documentName: fingerprint.documentName,
      title: fingerprint.title.charAt(0).toUpperCase() + fingerprint.title.slice(1)
    };

    if (fingerprint.content) {
      STATE.enableSkip = fingerprint.isAllFingerprints;
    }
  }

  @handle(SCAN_FINGERPRINT_ACTIONS.SCAN_THUMBS)
  handleScanThumbsFingerprints() {

    setTimeout(() => {
      
      STATE.preview = null;
      STATE.instruction = 'thumbs';
      STATE.serviceInstruction = 'thumbs';
      STATE.instructionTitle = 'Thumbs are being scanned.';
      STATE.displayNameInstruction = 'thumbs';
      STATE.fpInstruction = 'thumbs';
      STATE.fingerprint = null;
      STATE.canClose = false;
    }, 50);
  }

  @handle(SCAN_FINGERPRINT_ACTIONS.SCAN_HANDS)
  handleScanHandsFingerprints(action, finger) {

    logger.debug('handleScanHandsFingerprints >> scanning finger >> ', finger);
    logger.debug('handleScanHandsFingerprints >> current finger index >> ', STATE.currentFingerIndex);
    if (finger === this.FINGERS[0]) {
      STATE.currentFingerIndex = 0;
    }
    
    STATE.preview = null;
    STATE.canClose = false;
    STATE.instruction = FINGERS[STATE.currentFingerIndex];
    STATE.displayNameInstruction = FINGERS_DISPLAY_NAMES[STATE.currentFingerIndex];
    this.fingerToScan = FINGER_INDICATOR_CLASS_NAMES[STATE.currentFingerIndex];
    STATE.serviceInstruction = 'fingers';
    STATE.instructionTitle = FINGERS_DISPLAY_NAMES[STATE.currentFingerIndex] + ' is being scanned.';
    STATE.instructionTitle = STATE.instructionTitle.charAt(0).toUpperCase() + STATE.instructionTitle.slice(1);
    STATE.fingerprint = null;
    STATE.fpInstruction = 'right.hand';
  }

  @handle(SCAN_FINGERPRINT_ACTIONS.SCAN_NEXT_FP)
  handleScanNextFingerprint() {

    if (STATE.currentFingerIndex >= 9) { // TODO think this can be removed - handled in vm
      STATE.currentFingerIndex = 0;
      return;
    }
    
    STATE.canClose = false;
    STATE.currentFingerIndex++;
    STATE.displayNameInstruction = FINGERS_DISPLAY_NAMES[STATE.currentFingerIndex];
    this.fingerToScan = FINGER_INDICATOR_CLASS_NAMES[STATE.currentFingerIndex];
    STATE.fingerprint = null;
    STATE.instruction = 'waiting';
    STATE.instructionTitle = FINGERS_DISPLAY_NAMES[STATE.currentFingerIndex] + ' is being scanned.';
    STATE.instructionTitle = STATE.instructionTitle.charAt(0).toUpperCase() + STATE.instructionTitle.slice(1);
    STATE.fpInstruction = 'left.hand';
  }

  @handle(SCAN_FINGERPRINT_ACTIONS.REDO_SCAN_FP)
  handleRedoScanFingerprint() {

    STATE.document = null;
    STATE.preview = null;
    STATE.canClose = false;
    STATE.fpInstruction = '';
    STATE.serviceInstruction = this.instruction === 'thumbs' ? this.instruction : 'fingers';
    STATE.instructionTitle = (this.instruction === 'thumbs' ? this.instruction : FINGERS_DISPLAY_NAMES[STATE.currentFingerIndex]) + ' is being scanned.';
    STATE.instructionTitle = STATE.instructionTitle.charAt(0).toUpperCase() + STATE.instructionTitle.slice(1);
  }

  @handle(SCAN_FINGERPRINT_ACTIONS.ACCEPT_SCANNED_FP)
  handleAcceptScannedFingerprint(action, fingerprint) {

    if(STATE.serviceInstruction === 'fingers') {
      
      if(STATE.currentFingerIndex >= 9) {
        STATE.instruction = null;
      }
    } else {
      
      STATE.instruction = null;
    }
    
    STATE.canClose = true;
    STATE.fpInstruction = null;
    STATE.instructionTitle = null;

    setTimeout(() => {
      STATE.document = null;
      STATE.preview = null;
    }, 100);
  }

  @handle(SCAN_FINGERPRINT_ACTIONS.CANCEL_SCANNED_FP)
  handleCancelScannedFingerprint() {

    STATE.document = null;
    STATE.preview = null;
    STATE.instruction = null;
    STATE.currentFingerIndex = 0;
    STATE.displayNameInstruction = null;
    STATE.canClose = true;
    STATE.fpInstruction = '';
  }

  @handle(SCAN_FINGERPRINT_ACTIONS.PREVIEW_SCANNED_FP)
  handlePreviewScannedFingerprint(action, fingerprint) {

    STATE.preview = null;
    STATE.canClose = true;
    STATE.fpInstruction = 'document.preview';

//    setTimeout(() => {

      STATE.preview = {
        documentName: fingerprint.name,
        content: fingerprint.content,
        title: fingerprint.title
      };
//    }, 100);
  }

  @handle(SCAN_FINGERPRINT_ACTIONS.CLOSE_SCAN_FP)
  handleCloseScanFingerprint() {

    logger.debug(' CLOSE_SCAN_FP ><>>> ');
    
    STATE.fpInstruction = '';
    setDefaultState();
  }

  @handle('videocall.disconnect')
  handleCallEnded() {

    STATE.fpInstruction = '';
    setDefaultState();
  }
}

