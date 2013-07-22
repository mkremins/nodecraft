var mc = require('minecraft-protocol');
var events = require('./events.js');

var server = mc.createServer({
  'online-mode': false,
  encryption: false,
  host: 'localhost',
  port: 25565
});

events.before('command', logCommand);
events.on('command', named('stop'), stopServer);
events.after('command', displayHelp);

server.on('login', handleConnect);

///////////////////////////////////////

function handleConnect(client) {
  client.write(0x01, {
    entityId: client.id,
    levelType: 'default',
    gameMode: 1,
    dimension: 0,
    difficulty: 2,
    maxPlayers: server.maxPlayers
  });
  client.write(0x0d, {
    x: 0,
    y: 1.62,
    stance: 0,
    z: 0,
    yaw: 0,
    pitch: 0,
    onGround: true
  });

  client.on('end', handleDisconnect(client));
  client.on(0x03, handleChat(client));

  broadcast(client.username + ' has joined the game');
}

function handleDisconnect(client) {
  return function() {
    broadcast(client.username + ' left the game');
  };
}

function handleChat(client) {
  return function(data) {
    var message = data.message;
    if (message.charAt(0) == '/') {
      var args = [], split = message.split(' ');
      for (var i = 1; i < split.length; i++) {
        args.push(split[i]);
      }
      events.fire('command', {
        name: split[0].substr(1),
        args: args,
        sender: client
      });
    } else {
      broadcast(message, client);
    }
  };
}

///////////////////////////////////////

function broadcast(message, sender) {
  var logMessage, senderName, translate;
  if (sender) {
    senderName = sender.username;
    logMessage = '<' + senderName + '> ' + message;
    translate = 'chat.type.text';
  } else {
    logMessage = message;
    senderName = 'Server';
    translate = 'chat.type.announcement';
  }

  console.log(logMessage);

  var chat = {
    translate: translate,
    using: [senderName, message]
  };

  for (var clientId in server.clients) {
    server.clients[clientId].write(0x03, { message: JSON.stringify(chat) });
  }
}

///////////////////////////////////////

function logCommand(command) {
  console.log(command.sender.username + ': /' + command.name + ' ' + command.args);
}

function named(name) {
  return function(command) {
    return command.name == name;
  };
}

function stopServer(command) {
  server.close();
  command.consumed = true;
  return command;
}

function displayHelp(command) {
  // TODO display help
}
