var socket = io();
var player = 0;
var bg = $(".stage-area");
/**
 * Socket.io connection related
*/

socket.on('connect', function(){
  getRandInt();
  console.log('Host is connected to socket.io server... ');
  console.log(`This is sync socket id: ${socket.id}`);
});

socket.on('requestAccepted', function(msg){
  console.log(`${msg.room} is opened`);
  requestAccepted(msg);
});

socket.on('selectingAcc', function(msg){
  console.log(msg);
});

// Socket.io code related ends here

function toCharDesk(){
  var charHtml = $("#charDesktop").html();
  bg.html(charHtml);
}

function getRandInt(){
  var text = Math.floor(Math.random() * (999999 - 111111)) + 111111;
  document.getElementById("roomId").innerHTML = text;

  var room = text.toString();
  console.log(`this is a host room ${room}`);

  socket.emit('hostJoinRoom', room);
}

function requestAccepted(msg){
  if (player < 1) {
    console.log(`Player with id: ${msg.id} is joined`);

    var play1 = document.getElementById("player1");
    play1.innerHTML = 'player 1 is joining in ' + msg.room;
    player = player + 1;

  }else {
    console.log(`Player with id: ${msg.id} is joined`);

    var play2 = document.getElementById("player2");
    play2.innerHTML = 'player 2 is joining in ' + msg.room;
    player = 0;
  }
}