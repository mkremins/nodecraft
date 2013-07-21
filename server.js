var mc = require('minecraft-protocol');

var server = mc.createServer({
  'online-mode': false,
  encryption: false,
  host: 'localhost',
  port: 25565
});

var restrictableEvents = {
  chat:    [],
  command: [],
  join:    []
}, observableEvents = {
  chat:    [],
  command: [],
  join:    [],
  quit:    []
};

onlyAllow('command', ifSenderHasPermission('core.stop'), when({name: 'stop'}));
on('command', stopServer, when({name: 'stop'}));

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
      fireEvent('command', {
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

function onlyAllow(eventType, eventPrecondition, eventFilter) {
  var preconditions = restrictableEvents[eventType];
  if (preconditions) {
    preconditions.push({
      allows: eventPrecondition,
      accepts: eventFilter
    });
  } else {
    // TODO no such event type
  }
}

function on(eventType, eventMonitor, eventFilter) {
  var monitors = observableEvents[eventType];
  if (monitors) {
    monitors.push({
      notify: eventMonitor,
      accepts: eventFilter
    });
  } else {
    // TODO no such event type
  }
}

function fireEvent(eventType, event) {
  if (restrictableEvents[eventType].every(function(precondition) {
    return (precondition.accepts ? precondition.accepts(event) : true) ? precondition.allows(event) : true;
  })) {
    var monitor, monitors = observableEvents[eventType];
    for (var index in monitors) {
      monitor = monitors[index];
      if (monitor.accepts ? monitor.accepts(event) : true) {
        monitor.notify(event);
      }
    }
  }
}

function when(conditions) {
  return function(event) {
    for (var name in conditions) {
      if (conditions[name] != event[name]) {
        return false;
      }
    }
    return true;
  };
}

function ifSenderHasPermission(permission) {
  return function(command) {
    console.log('testing permission for ' + command.name + ' on ' + command.sender.username);
    return true; // TODO
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

function stopServer() {
  server.close();
}
