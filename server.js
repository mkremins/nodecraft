var mc = require('minecraft-protocol');
var fs = require('fs');
var events = require('./events.js');

var server = mc.createServer({
  'online-mode': false,
  encryption: false,
  host: 'localhost',
  port: 25565
});

var api = {
  before: events.before,
  on: events.on,
  after: events.after,
  server: server,
  log: console.log,
  broadcast: broadcast
};

console.log('\nNodecraft v0.1.0a');
console.log('========================================\n');

console.log('Loading plugins...\n');
var plugin;
fs.readdirSync(__dirname + '/plugins').forEach(function(filename) {
  plugin = require('./plugins/' + filename);
  plugin.enable(api);
  var pluginName = plugin.name || filename.split('.')[0];
  console.log('  *  Loaded ./plugins/' + filename + ' as \'' + pluginName + '\'');
});
console.log('\nAll plugins loaded!\n');

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
      events.fire('chat', {
        message: message,
        sender: client
      });
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

  var chat = {
    translate: translate,
    using: [senderName, message]
  };

  for (var clientId in server.clients) {
    server.clients[clientId].write(0x03, { message: JSON.stringify(chat) });
  }
}
