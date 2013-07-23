var mc = require('minecraft-protocol');
var bindPlayer = require('./player.js');
var events = require('./events.js');
var plugins = require('./plugins.js');
var storage = require('./storage.js');
var config = require('../config.json');

var server = mc.createServer(config.server);

var api = {
  before: events.before,
  on: events.on,
  after: events.after,
  save: storage.save,
  load: storage.load,
  server: server,
  log: console.log,
  broadcast: broadcast
};

console.log('\nNodecraft v0.1.0a');
console.log('========================================\n');

plugins.load(__dirname + '/../plugins', api);

server.on('login', bindPlayer);

///////////////////////////////////////

function broadcast(message, sender) {
  var chat;
  if (sender) {
    chat = {
      translate: 'chat.type.text',
      using: [sender.name, message]
    };
  } else {
    chat = {
      text: message
    };
  }

  for (var clientId in server.clients) {
    server.clients[clientId].write(0x03, { message: JSON.stringify(chat) });
  }
}
