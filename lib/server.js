var mc = require('minecraft-protocol');
var PluginLoader = require('jigsaw');

var bindPlayer = require('./player.js');
var events = require('./events.js');
var storage = require('./storage.js');
var config = require('../config.json');

var server = mc.createServer(config.server);

console.log('\nNodecraft v0.1.0a');
console.log('========================================\n');

var plugins = new PluginLoader(__dirname + '/../plugins', api);

plugins.on('load', function(plugin) {
  console.log('  ✔  Loaded \'plugins/' + plugin.filename + '\' as \'' + plugin.name + '\'');
});
plugins.on('fail', function(plugin) {
  console.log('  ✘  Unable to load \'plugins/' + plugin.filename + '\' (' + plugin.reason + ')');
});

var api = {
  before: events.before,
  on: events.on,
  after: events.after,
  fire: events.fire,
  save: storage.save,
  load: storage.load,
  server: server,
  log: console.log,
  broadcast: broadcast
};

plugins.loadAll(api);

server.on('login', bindPlayer);
server.on('close', function() {
  plugins.unloadAll();
  console.log('Server shutting down.');
  process.exit();
});

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
