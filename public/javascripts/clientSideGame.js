// var express = require('express');
// var app = express();
//
// var http = require('http');
// http.createServer(app);
//
// var socketIO = require('socket.io');
// var io = socketIO(http);

JQuery(function($){
  'use strict';

  var IO = {
    init: function(){
      IO.socket = io.connect();
      IO.bindEvents();
    },

    bindEvents: function(){
      IO.socket.on('connected', IO.connected);
      IO.socket.on('newGameCreated', IO.newGameCreated);
      IO.socket.on('playerJoinedRoom', IO.playerJoinedRoom);
      IO.socket.on('beginNewGame', IO.beginNewGame);
    },

    connected: function(){
      logic.mySocketId = IO.socket.socket.sessionid;
    },

    newGameCreated: function(data){
      logic.Host.gameInit(data);
    },

    playerJoinedRoom: function(data){
      logic[logic.myRole].updateWaitingScreen(data);
    }
  };

  var logic = {
    gameId: 0,

    myRole: '',

    mySocketId: '',

    init: function(){
      logic.cacheElements();
      logic.bindEvents();
    },

    cacheElements: function(){
      logic.$doc = $(document);

      //Templates
      logic.$playerArea = $('#playerArea');
      logic.$playerTemplate = $('#player-template').html();
    },

    bindEvents:function(){
      //host
      logic.$doc.on('click', '#startGame', logic.Host.startClick);

      //player
      logic.$doc.on('click', '#enterCodeButton', logic.Player.enterCodeClick);
    },

    Host:{
      players : [],

      numberOfPlayersInRoom: 0,

      startClick: function(){
        IO.socket.emit('hostCreateNewGame');
      },

      gameInit:function(data){
        logic.gameId = data.gameId;
        logic.mySocketId = data.mySocketId;
        logic.myRole = 'Host';
        logic.Host.numberOfPlayersInRoom = 0;
      },

      updateWaitingScreen: function(data){
        $('#player1').append('</p>').text('Player is joined the game !');

        logic.Host.players.push(data);

        logic.Host.numberOfPlayersInRoom += 1;

        if (logic.Host.numberOfPlayersInRoom === 2) {
          IO.socket.emit('hostRoomFull', logic.gameId);
        }
      }
    },

    Player : {
      hostSocketId: '',

      enterCodeClick: function(){
        var data = {
          gameId: +($('#inputGameId').val())
        };

        IO.socket.emit('playerJoinGame', data);

        logic.myRole = 'Player';
      },

      updateWaitingScreen: function(data){
        if (IO.socket.socket.sessionid === data.mySocketId) {
          logic.myRole = 'Player';
          logic.gameId = data.gameId;
        }

        $('#playerWaitingMessage').append('</p>').text('Player is joined the game! Please Wait...');
      }
    }
  };

  IO.init();
  logic.init();

}($));