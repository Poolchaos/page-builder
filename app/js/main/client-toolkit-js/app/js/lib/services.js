var services = angular.module('app.toolkit.Services', []);

services.factory('UserDataService', function ($sessionStorage) {

  console.log(' :: UserDataService IN TESTING - $sessionStorage = ', $sessionStorage);

  var info = {
    currentUser: $sessionStorage.currentUser ? $sessionStorage.currentUser : {},
    currentAccount: $sessionStorage.currentAccount ? $sessionStorage.currentAccount : null,
    userAccessRoles: $sessionStorage.userAccessRoles ? $sessionStorage.userAccessRoles : null
  };

  for (var s in info) {
    $sessionStorage[s] = info[s];
  }

  var actions = {
    update: {
      currentUser: function (data, callback) { // callback - if needed

        //    data format:
        //    {
        //       token: 'Bearer vd2eet4...',
        //       organisationId: 'some Id'
        //    }

        if (!$sessionStorage.currentUser) {
          info.currentUser = {};
          $sessionStorage.currentUser = {};
        }

        for (var i in data) {
          info.currentUser[i] = data[i];
        }

        $sessionStorage.currentUser = info.currentUser;

      },

      currentAccount: function (data) {
        info.currentAccount = data;
        $sessionStorage.currentAccount = info.currentAccount;
      },

      userAccessRoles: function (data) {
        //        console.log(' userAccessRoles -> ', data);

        info.userAccessRoles = angular.copy(data);
        $sessionStorage.userAccessRoles = angular.copy(data);

        //        console.log('userAccessRoles after stored -> ', {
        //          userAccessRoles: info.userAccessRoles,
        //          $sessionStorage: $sessionStorage
        //        });
      },

      custom: function (obj, prop) {

        if (!$sessionStorage.currentUser) {
          info.currentUser = {};
          $sessionStorage.currentUser = {};
        }

        if (prop) {
          for (var n in obj) {
            $sessionStorage.currentUser[n] = obj[n];
            info.currentUser[n] = obj[n];
          }
          return;
        }

        for (var i in obj) {
          $sessionStorage[i] = obj[i];
        }

      }

    },

    retrieve: {
      user: function (prop) {
        if (!prop) {
          return info.currentUser;
        }
        return info.currentUser[prop];
      },
      account: function (prop) {
        if (!prop) {
          return info.currentAccount;
        }
        return info.currentAccount[prop];
      },
      roles: function () {
        return info.userAccessRoles
      },
      custom: function (prop) {
        return $sessionStorage[prop];
      },
      session: function () {
        return $sessionStorage
      }
    },

    clear: {

      all: function (callback) { // callback - if needed

        console.log(' %c user logged out... clearing all data ', 'background:#7a3035; color:white; margin:3px 10px; font-size:15px;');

        // clear service variables
        for (var i in info) {
          info[i] = {};
        }

        // clear session variables
        for (var s in $sessionStorage) {
          $sessionStorage[s] = {};
        }
      },

      user: function (prop) {
        $sessionStorage.currentUser[prop] = {}
        info.currentUser[prop] = {}
      },

      custom: function (prop, callback) {

        if (info[prop]) {
          info[prop] = {};
        }

        if ($sessionStorage[prop]) {
          $sessionStorage[prop] = {};
        }

      }

    }
  };

  return {
    update: actions.update,
    clear: actions.clear,
    retrieve: actions.retrieve
  }

});

services.factory('UserRoleService', function (UserDataService) {

  var roles_constant = {
    "All": "ALL",
    "System Admin": "SYSTEM_ADMIN",
    "Administrator": "ADMIN",
    "Team Leader": "TEAM_LEADER",
    "Agent": "AGENT",
    "Office Employee": "OFFICE_EMPLOYEE",
    "Default User": "DEFAULT_USER"
  };

  var access_constant = {
    allocate_skills: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<button ng-click="displayAllocateSkillsFlow(\'skillGroups\')" class="gray X_small addSkillGroup"><img src="/img/profile/plus_small_Icon.png" /></button>'
    },
    edit_allocated_skills: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<div class="pull-right editUtility"><button ng-hide="item.editMode" ng-click="editSkillGroup(item)" class="gray X_small"><img src="/img/profile/edit_icon.png"></button><button class="gray X_small done" ng-click="editSkillGroup(item)" ng-show="item.editMode"><img src="/img/profile/btnConfirm_icon.png"></button></div>'
    },
    edit_member_detail_user_role: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<div class="pull-right editUtility" ng-click="showUserRole = !showUserRole"> <button ng-hide="showUserRole" class="gray X_small"> <img src="/img/profile/edit_icon.png"></button><button class="gray X_small done" ng-show="showUserRole"><img src="/img/profile/btnConfirm_icon.png"></button></div>'
    },
    remove_member: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<div class="pods_hex"><div class="r-hex user_profile_wrap"><div class="r-hex-inner"><div class="r-hex-inner-2" ng-click="removeMember()"><ul><li><span>Remove Member</span></li></ul></div></div></div></div>'
        //      template: '<div class="r-hex-inner-2" ng-click="removeMember()"><ul><li><span>Remove Member</span></li></ul></div>'
    },
    edit_member_detail_cos: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<div class="pull-right editUtility" ng-click="showCos = !showCos"><button ng-hide="showCos" class="gray X_small"><img src="/img/profile/edit_icon.png"></button><button class="gray X_small done" ng-show="showCos"><img src="/img/profile/btnConfirm_icon.png"></button></div>'
    },
    edit_member_detail_site: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<div class="pull-right editUtility" ng-click="editSite = !editSite" ><button ng-hide="editSite" class="gray X_small"><img src="/img/profile/edit_icon.png"></button><button class="gray X_small done" ng-show="editSite"><img src="/img/profile/btnConfirm_icon.png"></button></div>'
    },
    edit_member_detail_services: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<div class="pull-right editUtility btnMarginPos" ng-click="editServices = !editServices"><button ng-hide="editServices" class="gray X_small"><img src="/img/profile/edit_icon.png"></button><button class="gray X_small done" ng-show="editServices"><img src="/img/profile/btnConfirm_icon.png"></button></div>'
    },
    edit_member_detail_number: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<div class="pull-right editUtility" ng-click="closeEditSearchList(); showFetch=!showFetch"><button ng-hide="member.telephoneNumbers.length>0 || showFetch" class="gray X_small"><img class="addNumIcon" src="/img/profile/addNumber_icon.png"></button><button class="gray X_small done" ng-show="showFetch"><img src="/img/profile/btnConfirm_icon.png"></button></div>'
    },
    edit_organisation_detail: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<a ng-click="switchOrganisationButton(\'edit\')" class="btn_edit" ng-show="!orgProfileInEditMode"></a>'
    },
    change_organisation_profile_picture: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<span><span ng-click="changeOrganisationPicture()" class="changeOrg_banner"><img src="/img/profile/uploadPicture.png"><h5>Update picture</h5></span></span>'
    },
    invite_member: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<li id="invite" ui-sref="^.^.groupMembersInvite"><div class="inviteMember"><div id="addNewSite"></div>Invite Members</div></li>'
    },
    deallocate_number: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<div ng-show="showButton && userCanEdit" ng-click="deallocateNumber(number)"><img class="deallocateNumberImg" src="/img/profile/deallocateNumber_icon.png" /><div class="deallocateText">Deallocate</div></div>'
    },
    allocate_number: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<div ng-show="showButton && userCanEdit"  ng-click="allocateNumber(number)"><img class="allocateNumberImg" src="/img/profile/assignNumberToUser.png" /><div class="deallocateText">Allocate</div></div>'
    },
    export_call_log: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<button class="export_log" title="Download file" type="button"  quote-strings="true" text-delimiter="\"" ng-csv="exportableCallLog" csv-header="csvHeaders" filename="callLog.csv"><img class="download_icon" src="/img/profile/download_icon.png" /></button>'
    },
    delete_call_recordings: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<div class="pull-right editUtility" ><button class="gray small" ng-click="view = \'delete\'"><img src="/img/profile/deleteBin_icon.png" alt="Delete"></button></div>'
    },
    play_call_recordings: {
      roles: ["SYSTEM_ADMIN", "ADMIN", "TEAM_LEADER"],
      template: '<button class="gray small"  ng-click="displayCallRecordingPopup(value, $parent.$index)"><img src="/img/unholdCall_icon.png" alt="Play"></button>'
    },
    agent_status: {
      roles: ["AGENT"],
      template: ''
    },
    bulk_skills: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<button class="gray small" ui-sref="^.^.organisationMembers.displayOrganisationSkillGroups"><img src="/img/profile/addSkills_icon.png" alt="Assign Skills To Many" title="Assign Skills To Many"></button>'
    },
    bulk_services: {
      roles: ["SYSTEM_ADMIN", "ADMIN"],
      template: '<a class="feeds_filter_item" ui-sref="^.^.memberServices.displayOrganisationSkillGroups" style="float:right;">Services</a>'
    }
  }

  var methods = {
    getUserAccessConstant: function (name) {
      return access_constant[name];
    },
    getRoleConstant: function (role) {
      return roles_constant[role];
    },
    getCurrentUserRoleConstant: function () {

      var currentRole = UserDataService.retrieve.roles() ? UserDataService.retrieve.roles() : 'Default User';

            //console.log(' :: role check current currentRole -> ', {
            //  userAccessRoles: UserDataService.retrieve.userAccessRoles,
            //  currentRole: currentRole
            //});

      if (UserDataService.retrieve.user()) {
        var organisationId = UserDataService.retrieve.user('organisationId');

                console.log(' :: role check organisationId -> ', organisationId);

        if (organisationId) {

          var userAccessRoles = UserDataService.retrieve.roles();

          for (var r in userAccessRoles) {

            var userAccessRole = userAccessRoles[r];
            if (userAccessRole.accountType === "ORGANISATION" && userAccessRole.ownerId === organisationId) {
                currentRole = userAccessRole.roleName;
              return;
            }
          }
        }

      }

      return methods.getRoleConstant(currentRole);
    },
    hasRole: function (roles) {


      if (roles.indexOf('All') !== -1) {
        return true;
      }

      var currentUserRole = methods.getCurrentUserRoleConstant();
      //      console.log(' :: currentUserRole -> ', currentUserRole);
      return roles.indexOf(currentUserRole) !== -1;
    }
  }

  return methods;

});


services.factory('PhoneService', function (InternalMessageSocket, $sessionStorage, applicationProperties, WebsocketService, uuid4, AnimationService, UserDataService) {

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  var connection, localStream, remoteStream;
  var screen;
  var screenShareConnection;
  var onRemoteStreamCallback;
  var peer, remotePeer, screenPeer, targetId, call, remotePeerId, $scope,
    //    streams = {
    //      local: null,
    //      remote: null
    //    },
    actions = {

      peerId: null,
      remotePeerId: null,
      onCallRejectedCallback: null,
      initialCloseCallback: null,
      shareScreenStream: null,
      incomingCallCallback: null,
      initiateWebSocket: function (remoteId, subscribers, username, scope) {
        WebsocketService.open(username);
        console.log(' :: initiateWebSocket -> ', actions);
        $scope = scope;
        actions.peerId = username;
        actions.connect.initialConnection(null, subscribers, username);
      },
      webSocket: {
        subscribe: function (instruction, callback) {
          WebsocketService.unon(instruction, callback);
        },
        publish: function (instruction, payload) {
          WebsocketService.emit(instruction, payload);
        }
      },
      connect: {

        initialConnection: function (remoteId, subscribers, username) {

          // :: :: subscribers format :: :: 
          // ------------------------------
          //          subscribers = {
          //            local: {
          //              open: function () {}
          //            },
          //            remote: {
          //              disconnect: function () {},
          //              call: function () {}
          //            }
          //          };

          //    :: :: Debug level :: :: 
          // ------------------------------
          //          0 Prints no logs.
          //          1 Prints only errors.
          //          2 Prints errors and warnings.
          //          3 Prints all logs.

          if (peer) {
            return;
          }

          console.log(' :: applicationProperties -> ', applicationProperties);
          var peerHost = applicationProperties.apiInteractionEndpoint.host;
          var peerPort = applicationProperties.apiInteractionEndpoint.port;

          console.log(' :: WebsocketService.ws ->', WebsocketService.ws);

          peer = new Peer(username, {
            debug: 3,
            websocket: WebsocketService.ws,
            peerHost: peerHost,
            peerPort: peerPort
          });

          peer.on('incoming-call', function (msg) {
            console.log('######## in incoming-call with msg -> ', msg);
            actions.remotePeerId = msg;
            subscribers.local.call();
            incomingCallCallback = subscribers.local.call();

          });

          peer.on('end-call', function () {
            console.log('on end-call :: callEnded');

            actions.endCall('notStarted');
            subscribers.local.close();


            //            localStream.getAudioTracks()[0].stop();
            //            localStream.getVideoTracks()[0].stop();
            //            remoteStream.getAudioTracks()[0].stop();
            //            remoteStream.getVideoTracks()[0].stop();
          });

          peer.on('error', function (error) {
            console.log(' :: an error has occurred -> ', error);
            actions.connect.initialConnection(remoteId, subscribers, username);
          });

          peer.on('stream', function (msg) {
            console.log('1 subscribed to stream. ');
          });

          if (remoteId) {
            // bridge connection between peers
            remotePeer = peer.connect(remoteId); // remoteId will be removed
          }

          if (!subscribers) {
            return;
          }

          for (var i in subscribers) {

            var subscriber;

            if (i === 'local') {
              subscriber = peer;
            } else if (i === 'remote') {
              subscriber = remotePeer;
            }

            for (var s in subscribers[i]) {
              if (s === 'close') {
                continue;
              }
              actions.subscribeTo[s](subscriber, subscribers[i][s]);
            }

          }

        },

        initiateVideoCall: function (closeCallback, streamCallback) {
          console.log('initiateVideoCall');

          navigator.getUserMedia({
            video: true,
            audio: false
          }, function (stream) {

            call = peer.call(remotePeerId, stream);
            localStream = stream;
            //            streams.local = stream;

            actions.connect.subscribeToCallEvents(call, closeCallback, streamCallback);

          }, function (err) {
            console.log('Failed to get local stream', err);
          });

        },

        answerVideoCall: function (callbacks) {

          actions.initialCloseCallback = callbacks.close;

          console.log('answerVideoCall :: actions.peerId -> ', actions.peerId, ', actions.remotePeerId -> ', actions.remotePeerId, ', peer -> ', peer);
          peer.acceptCall(actions.remotePeerId, InternalMessageSocket);

          console.log('answerVideoCall :: callbacks -> ', callbacks);
          actions.subscribeTo.answer(peer, callbacks.remoteStream);

          AnimationService.stopBarAnimations();



          /*navigator.getUserMedia({
            video: true,
            audio: true
          }, function (stream) {

			//call.answer(stream); // Answer the call with an A/V stream. 
            localStream = stream;

            //console.log('CALL >>> ', call);

            //actions.peerId = call.provider.id;
            //actions.remotePeerId = call.peer;

            /*actions.connect.subscribeToCallEvents(call, function (err) {
              console.log('%c connection closed ', 'background:#C96B6B;color:#fff;font-size:16px;');
              callbacks.close();
            }, function (remoteStream) {
              remoteStream = remoteStream;
              console.log(' :: remote stream received :: -> ', remoteStream);
              callbacks.remoteStream();

              if ($scope) { // If already on agent dashboard
                $scope.actions.newCallStarted();
              }

            });

          }, function (err) {
            console.log('Failed to get local stream', err);
          });*/

        },

        shareScreen: function (callbacks, username) {

          screen = new Screen(uuid4.generate());

          //          screen.onscreen = function (_screen) {
          //            console.log('_screen -> ', _screen);
          //          };

          screen.onaddstream = function (media) {

            console.log('onaddstream -> ', {
              media: media,
              stream: media.stream,
              peer: peer,
              remotePeerId: actions.remotePeerId
            });

            actions.shareScreenStream = media.stream;

            //            ScreenShareService.createConnection();


            function shareScreen() {

              screenShareConnection = screenPeer.call(actions.remotePeerId, media.stream);
              console.log(' :: screenShareConnection -> ', screenShareConnection);

              screenShareConnection.on('close', function (evt) {
                console.log(' :: screenshare connection closed detected :: ', evt);
                //                actions.connect.stopScreenShare();
                //                callbacks.close();
              });

            }

            //            if (!screenPeer) {

            screenPeer = new Peer(username + 'screenShare', {
              debug: 3,
              websocket: WebsocketService.ws
            });
            shareScreen();

            screenPeer.on('end-call', function (msg) {
              if (!actions.shareScreenStream) {
                //                actions.initialCloseCallback(msg);
                actions.endCall('alreadyStopped');

                screenPeer.on('incoming-call', function (msg) {
                  console.log('######## in incoming-call with msg -> ', msg);
                  actions.remotePeerId = msg;
                  actions.incomingCallCallback();

                });

              }
            });

            //
            //            } else {
            //              actions.connect.stopScreenShare(shareScreen);
            //            }

          };

          console.log('screen -> ', screen);
          screen.share(); //init extension

        },

        stopScreenShare: function (callback) {
          console.log(' PhoneService > stopScreenShare ');
          screen.check();
          actions.shareScreenStream.getVideoTracks()[0].stop();
          actions.shareScreenStream.stop();
          screen.leave();

          screenPeer.disconnectFromCall(actions.remotePeerId, true);
          //          screenShareConnection.stopScreenShare();

          if (callback) {
            callback();
          }

          setTimeout(function () {
            actions.shareScreenStream = null;
          }, 200);
        },

        subscribeToCallEvents: function (call, closeCallback, streamCallback) {



          actions.initialCloseCallback = closeCallback;

          actions.subscribeTo.close(call, function (err) {
            console.log('connection closed detected');
            closeCallback(err);
            call.close();
          });

          actions.subscribeTo.stream(call, function (remoteStream) {
            //streams.remote = remoteStream;
            console.log('2 subscribe to stream');
            remoteStream = remoteStream;
            streamCallback(localStream, remoteStream); // transition to next state and display both streams n this callback
          });
        },
        reject: function (callback) {
          if (localStream) {
            localStream.stop();
          }
          if (remoteStream) {
            remoteStream.stop();
          }
          if (actions.shareScreenStream) {
            actions.shareScreenStream.stop();
          }
          if (screenShareConnection) {
            screenShareConnection.close();
          }
          if (connection) {
            connection.close(); // Close the mediaConnection
          }
          //          peer.disconnectFromCall(actions.remotePeerId);
          console.log(' ---- reject call method ---- ');
          peer.rejectCall(actions.remotePeerId);
          callback();

        }
      },

      endCall: function (state) {

        UserDataService.update.currentUser({
          status: 'Available'
        });

        InternalMessageSocket.publish({
          name: 'SetScopeValues',
          payload: {
            currentAgentStatus: 'Available'
          }
        });

        console.log(' :: localStream = ', localStream);

        //          peer.rejectCall(actions.remotePeerId);
        //          $scope.incomingCall = false;

        console.log(' ---- endCall ---- ');
        //          peer.rejectCall(actions.remotePeerId);
        AnimationService.stopBarAnimations();
        if (actions.initialCloseCallback) {
          actions.initialCloseCallback();
        }

        if (localStream) {
          localStream.getAudioTracks()[0].stop();
          localStream.getVideoTracks()[0].stop();
          localStream.stop();
        }
        if (remoteStream) {
          remoteStream.getAudioTracks()[0].stop();
          remoteStream.getVideoTracks()[0].stop();
          remoteStream.stop();
        }
        if (actions.shareScreenStream) {
          actions.shareScreenStream.getVideoTracks()[0].stop();
          actions.shareScreenStream.stop();
          screenShareConnection.close();
          screen.leave();
        }
        if (!state) {
          peer.disconnectFromCall(actions.remotePeerId);
        }

      },

      disconnect: function () {
        if (peer) {
          peer.disconnect(); // Close the connection to the server and all other connections

          setTimeout(function () {
            peer.destroy();

            setTimeout(function () {
              peer = null;
            }, 100);
          }, 100);
        }
      },

      subscribeTo: {

        //        endCall: function (callback) {
        //          console.log(' PhoneService - subscribeTo > endCall :: ', callback);
        //          actions.initialCloseCallback = callback;
        //        },

        connection: function (subscriber, callback) {
          console.log('subscribe to connection');
          subscriber.on('connection', function (dataConnection) {
            console.log('on connection ', dataConnection);
            connection = dataConnection;
            callback(dataConnection);
          });
        },
        disconnect: function (subscriber, callback) {
          console.log('subscribe to disconnect');
          subscriber.on('disconnected', callback);
        },
        open: function (subscriber, callback) {
          console.log('subscribe to open -> ', subscriber);
          //          actions.webSocket.subscribe('open', function (data) {
          subscriber.on('open', function (data) {
            console.log(' :: open event -> ', data);
            actions.peerId = data;
            callback(data);
          });
        },
        /*close: function (subscriber, callback) {
          console.log('subscribe to close');
          subscriber.on('close', function (data) {

            actions.callEnded();

            console.log(' ************ ');
            console.log(' call ended ');
            console.log(' data -> ', data);

            actions.connect.reject(function () {
              console.log(' :::: call closed :::: ');
              callback(data);
            });
          });
        },*/
        call: function (subscriber, callback) {
          subscriber.on('call', function (incomingCall) {

            console.log(' incoming call -> ', incomingCall);

            actions.subscribeTo.stream(incomingCall, function (stream) {
              remoteStream = stream;
            });
            console.log('subscribe to call');
            call = incomingCall;
            callback(incomingCall);
            //actions.connect.answerVideoCall(incomingCall, callbacks);
          });
        },
        error: function (subscriber, callback) {
          console.log('subscribe to error');
          subscriber.on('error', callback);
        },
        stream: function (subscriber, callback) {
          console.log('subscribe to stream');
          subscriber.on('stream', function (stream) {
            console.log('subscribed to stream with stream -> ', stream);
            remoteStream = stream;
            callback();
          });
        },
        data: function (subscriber, callback) {
          console.log('subscribe to data');
          subscriber.on('data', callback);
        },
        answer: function (subscriber, callback) {
          console.log('subscribe to answer with subscriber -> ', subscriber, ', callback -> ', callback);
          onRemoteStreamCallback = callback;
          subscriber.on('call-answered', function (msg) {
            console.log('call-answered :: msg -> ', msg);
            localStream = msg.localStream;
            //remoteStream = msg.mediaConnection.remoteStream;
            //InternalMessageSocket.publish({name: 'SetScopeValues', payload: {localStream: msg.localStream, remoteStream: msg.mediaConnection.remoteStream}});
            //callback();
            msg.mediaConnection.on('stream', function (stream) {
              console.log('Did it go in here? stream -> ', stream);
              remoteStream = stream;
              console.log('callback -> ', onRemoteStreamCallback);
              onRemoteStreamCallback();
            });
          });
        }

      },

      get: {
        streams: function () {
          return {
            localStream: localStream,
            remoteStream: remoteStream
          };
        }
      },

      setCurrentScope: function (scope) {
        $scope = scope;
      }

    };

  return actions;

});

services.factory('WebsocketService', function ($websocket, applicationProperties) {

  var peerHost = applicationProperties.apiInteractionEndpoint.host;
  var peerPort = applicationProperties.apiInteractionEndpoint.port;

  var instance = this;

  var ws;
  var uq = [];
  var oq = [];
  var eq = [];

  function _un(obj) {

    console.log('instance.__proto__._un :: obj = ', obj);
    ws.$un(obj.type);
  }

  function _on(obj) {

    console.log('instance.__proto__._on :: obj = ', obj);
    ws.$on(obj.type, obj.callback);
  }

  function _emit(obj) {

    console.log('websocket.emit()');
    console.log('ws -> ', ws);
    console.log('instance.__proto__._emit :: obj = ', obj);
    ws.$emit(obj.type, obj.data);
  }

  function _open(wsUri, openCallback, closeCallback) {

    //		console.log('instance.__proto__._open :: wsUri = ', wsUri);

    ws = $websocket.$get(wsUri);
    if (!ws) {
      ws = $websocket.$new({
        url: wsUri,
        lazy: false,
        reconnect: true,
        reconnectInterval: 2000,
        enqueue: false,
        mock: false,
        protocols: ['binary', 'base64']
      });
      instance.ws = ws.$$ws;
    }

    ws.$on('$open', function () {

      console.log(' :: $open ');

      openCallback();
    });

    ws.$on('$close', function () {
      closeCallback();
    });

    // if (ws.$ready() === false) {
    //
    // ws.$open();
    // }
  }

  instance.handleQueuedInteractions = function handleQueuedInteractions() {

    function init(q, callback) {

      for (var i = 0; i < q.length; i++) {

        callback(q[i]);
      }
      q = [];
    }

    init(uq, function (obj) {
      _un(obj);
    });
    init(oq, function (obj) {
      _on(obj);
    });
    init(eq, function (obj) {
      _emit(obj);
    });
  }

  instance.open = function open(id) {

    var wsUri = 'ws://' + peerHost + ':' + peerPort + '/exchange?id=' + id + '&token=token';

    _open(wsUri, function () {

      console.log('Websocket opened :)');
      instance.handleQueuedInteractions()
    }, function () {

      console.log('Websocket closed :(');
    });
  }

  instance.un = function un(type) {

    var obj = {
      type: type
    };

    if (ws && ws.$ready()) {

      _un(obj);
    } else {

      uq.push(obj);
    }
  }

  var subscribers = [];

  instance.on = function on(type, callback) {

    //    var tmp = angular.copy(subscribers);
    //
    //    console.log(' ---------------------------------------------------------- ');
    //    console.log(' :: WebsocketService - on ', type);
    //    var found = false;
    //    for (var i in tmp) {
    //      console.log(' subscribers[' + i + '] = ', tmp[i]);
    //      if (tmp[i].type === type) {
    //        console.log('found');
    //        found = true;
    //        subscribers[i].callback = callback;
    //        instance.un(type);
    //      }
    //    }
    //    if (!found) {
    //      console.log('not found');
    //      subscribers.push({
    //        type: type,
    //        callback: callback
    //      });
    //      console.log('subscribers = ', subscribers);
    //    }

    var obj = {
      type: type,
      callback: callback
    };

    if (ws && ws.$ready()) {

      _on(obj);
    } else {

      oq.push(obj);
    }
  }

  instance.emit = function emit(type, payload) {

    var obj = {
      type: type,
      data: payload
    };

    if (ws && ws.$ready()) {

      _emit(obj);
    } else {

      eq.push(obj);
    }
  }

  instance.unon = function unon(type, callback) {

    instance.un(type);
    instance.on(type, callback);
  }

  return instance;

});

services.factory('AnimationService', function ($sessionStorage) {
  var $scope = null;

  /*---
    Incoming call animation
    ---*/
  var canvas, ctx, circleActions, barActions, animationSupport, isAnimating;
  var fps = 100;

  var barProperties = {
    bars: [],
    totalBars: 125, //total bars to create (TODO increase canvas size if needed)
    maxBarHeight: 150,
    minBarHeight: 15,
    barPadding: 7, //space between bars
    barWidth: 0.5, //width of each bar
    horLineColor: '#416978',
    barColor: null,
    backgroundColor: '#252525'
  };

  var circleProperties = {
    topCircles: [],
    bottomCircles: [],
    circleRadius: 3,
    circleColor: '#12bcfa',
    horCircleColor: '#C7C7C7'
  };

  function CircleAnimationActions() {

    this.drawHorizontalCircle = function (centerX, centerY) {
      ctx.beginPath();
      ctx.arc(centerX - 2.5, centerY, 1.5, 0, 2 * Math.PI, false);
      ctx.fillStyle = circleProperties.horCircleColor;
      ctx.fill();
    }

    this.drawTopCircle = function (centerX, centerY, index) {
      circleProperties.topCircles[index].x = centerX;
      circleProperties.topCircles[index].y = centerY;
      ctx.clearRect(centerX, centerY, circleProperties.circleRadius, circleProperties.circleRadius);
      ctx.beginPath();
      ctx.arc(centerX, centerY, circleProperties.circleRadius, 0, 2 * Math.PI, false);
      ctx.fillStyle = circleProperties.circleColor;
      ctx.fill();
      ctx.strokeStyle = barProperties.backgroundColor;
      ctx.stroke();
    }

    this.drawBotomCircle = function (centerX, centerY, index) {
      circleProperties.bottomCircles[index].x = centerX;
      circleProperties.bottomCircles[index].y = centerY;
      ctx.clearRect(centerX, centerY, circleProperties.circleRadius, circleProperties.circleRadius);
      ctx.beginPath();
      ctx.arc(centerX, centerY, circleProperties.circleRadius, 0, 2 * Math.PI, false);
      ctx.fillStyle = circleProperties.circleColor;
      ctx.fill();
      ctx.strokeStyle = barProperties.backgroundColor;
      ctx.stroke();
    }
  }


  function BarAnimationActions() {

    this.growBar = function (index) {
      if (barProperties.bars[index].height < barProperties.bars[index].buffHeight) {
        ctx.clearRect(circleProperties.topCircles[index].x, circleProperties.topCircles[index].y, circleProperties.circleRadius, circleProperties.circleRadius); // Clear previous
        barProperties.bars[index].height++;

        barProperties.bars[index].y = animationSupport.computeTopYAxis(barProperties.bars[index].height);
        ctx.fillStyle = barProperties.barColor;
        ctx.fillRect(barProperties.bars[index].x, barProperties.bars[index].y, barProperties.barWidth, barProperties.bars[index].height);
        circleActions.drawTopCircle(barProperties.bars[index].x, barProperties.bars[index].y, index);
        circleActions.drawBotomCircle(barProperties.bars[index].x, animationSupport.computeBottomYAxis(barProperties.bars[index].height), index);

        if (isAnimating) {
          //setTimeout(function () {
          requestAnimationFrame(function () {
              barActions.growBar(index)
            })
            //}, 1000 / fps);
        }

      } else {
        if (isAnimating) {
          barActions.shrinkBar(index); //shrink it again
        }
      }
    }

    this.shrinkBar = function (index) {
      if (barProperties.bars[index].height > barProperties.minBarHeight) {
        barProperties.bars[index].height--;

        barProperties.bars[index].y = animationSupport.computeTopYAxis(barProperties.bars[index].height);
        ctx.fillStyle = barProperties.barColor;
        ctx.fillRect(barProperties.bars[index].x, barProperties.bars[index].y, barProperties.barWidth, barProperties.bars[index].height);
        circleActions.drawTopCircle(barProperties.bars[index].x, barProperties.bars[index].y, index);
        circleActions.drawBotomCircle(barProperties.bars[index].x, animationSupport.computeBottomYAxis(barProperties.bars[index].height), index);
        ctx.clearRect(circleProperties.topCircles[index].x - 5, circleProperties.topCircles[index].y - 16, circleProperties.circleRadius + 10, circleProperties.circleRadius + 10); // Clean up previous strokes
        ctx.clearRect(circleProperties.bottomCircles[index].x - 5, circleProperties.bottomCircles[index].y + 5, circleProperties.circleRadius + 10, circleProperties.circleRadius + 10); // Clean up previous strokes

        if (isAnimating) {
          //setTimeout(function () {
          requestAnimationFrame(function () {
              barActions.shrinkBar(index)
            })
            //}, 1000 / fps);
        }
      } else {
        var newHeight = animationSupport.randomizeHeight(index);
        while (newHeight === barProperties.minBarHeight) {
          newHeight = animationSupport.randomizeHeight(index);
        }
        barProperties.bars[index].buffHeight = newHeight;
        if (isAnimating) {
          barActions.growBar(index);
        }
      }
    }

  }

  function CallAnimationSupport() {

    this.generateGradients = function () {

      var gradient;
      gradient = ctx.createLinearGradient(0, 0, 0, 150);
      gradient.addColorStop(0, "rgb(18, 188, 250)");
      gradient.addColorStop(0.3, "rgb(18, 188, 250)");
      gradient.addColorStop(0.5, "#2d2d2d");
      gradient.addColorStop(0.7, "rgb(18, 188, 250)");
      gradient.addColorStop(1, "rgb(18, 188, 250)");
      barProperties.barColor = gradient;
    }

    this.randomizeHeight = function (index) //generate random height number
      {
        //return 40 / index + barProperties.maxBarHeight; //Math.floor(Math.random() * maxBarHeight);
        return Math.floor(Math.random() * barProperties.maxBarHeight);
      }

    this.computeTopYAxis = function (height) //computes the position of the y
      {
        return Math.round((barProperties.maxBarHeight - height) / 2);
      }

    this.computeBottomYAxis = function (height) //computes the position of the y
      {
        return Math.round((barProperties.maxBarHeight + height) / 2);
      }
  }


  function initBars() {

    canvas = document.getElementById("callAnimationCanvas");
    ctx = canvas.getContext("2d");
    barActions = new BarAnimationActions();
    circleActions = new CircleAnimationActions();
    animationSupport = new CallAnimationSupport();
    animationSupport.generateGradients();

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear all before animation

    var barHeight = 0;
    var x = 0;
    var y = 0;
    for (var i = 0; i < barProperties.totalBars; i++) {
      barHeight = animationSupport.randomizeHeight(i);
      x = (i + (i * barProperties.barPadding)) + 2;
      y = animationSupport.computeTopYAxis(barHeight);

      barProperties.bars.push({
        height: barHeight,
        buffHeight: barHeight,
        x: x,
        y: y
      });

      var bottomCircY = animationSupport.computeBottomYAxis(barHeight);

      circleProperties.topCircles.push({
        x: x,
        y: y
      });

      circleProperties.bottomCircles.push({
        x: x,
        y: bottomCircY
      });

      barActions.shrinkBar(i);
      circleActions.drawHorizontalCircle(x, barProperties.maxBarHeight / 2);
    }

  }

  function stopBarAnimations() {
    //    console.log('%c AnimationService > Stopping', 'background:#90EE90;color:#6E6E6E;padding:10px 3px;');

    if (!isAnimating) {
      return;
    }

    isAnimating = false;
    //
    //    InternalMessageSocket.publish({
    //      name: 'SetScopeValues',
    //      payload: {
    //        incomingCall: false,
    //        hideOverlay: true
    //      }
    //    });

    setTimeout(function () {
      $scope.$apply(function () {
        $scope.incomingCall = false;
        $scope.hideOverlay = true;
      });
    });

  }

  function startBarAnimations(scope) {

    if (!$scope) {
      $scope = scope;
    }

    if (isAnimating) {
      return;
    }

    //    console.log('%c AnimationService > Starting', 'background:#E9EE90;color:#6E6E6E;padding:10px 3px;');

    //    InternalMessageSocket.publish({
    //      name: 'SetScopeValues',
    //      payload: {
    //        incomingCall: true,
    //        hideOverlay: false
    //      }
    //    });
    isAnimating = true;
    initBars();

    setTimeout(function () {
      $scope.$apply(function () {
        $scope.incomingCall = true;
        $scope.hideOverlay = false;
      })
    });
  }


  return {
    startBarAnimations: startBarAnimations,
    stopBarAnimations: stopBarAnimations
  }
});