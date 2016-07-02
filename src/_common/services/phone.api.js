export const PHONE_ACTIONS = {
  INIT_PEER: 'peer.init',
  MAKE_CALL: 'call.make',
  STREAM_REMOTE: 'stream.remote',
  STREAM_LOCAL: 'stream.local',
  STREAM_SCANNER: 'stream.scanner',
  CANCEL_CALL: 'call.cancel',
  END_CALL: 'call.end',
  CALL_ENDED: 'call.ended',
  INCOMING_CALL: 'call.incoming',
  CALL_ANSWERED: 'call.answered',
  CALL_REJECTED: 'call.rejected'
};

//jspm install aiva-peer-js="gitlab:zailab.frontend/aiva-peer-js@master"
//jspm install aiva-peer-js="gitlab:zailab.frontend/aiva-common@feature/peer"