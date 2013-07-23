var events = require('./events.js');
var storage = require('./storage.js');

function Player(client) {
	this._client = client;
	this._pos = {}, this._facing = {};

	client.write(0x01, {
		entityId: client.id,
		levelType: 'default',
		gameMode: 1,
		dimension: 0,
		difficulty: 2,
		maxPlayers: 5
	});
}

Player.prototype.getName = function() {
	return this._client.username;
};

Player.prototype.sendMessage = function(message) {
	this._client.write(0x03, JSON.stringify({
		text: message
	}));
};

Player.prototype.teleport = function(pos, facing) {
	if (facing) {
		this._client.write(0x0d, {
			x: pos.x,
			y: pos.y,
			stance: pos.stance,
			z: pos.z,
			yaw: facing.yaw,
			pitch: facing.pitch,
			onGround: pos.onGround
		});
	} else {
		this._client.write(0x0b, {
			x: pos.x,
			y: pos.y,
			stance: pos.stance,
			z: pos.z,
			onGround: pos.onGround
		});
	}
};

///////////////////////////////////////

function handleConnect(client) {
	var player = new Player(client);

	storage.load('players', client.username, function(data) {
		if (data) {
			player.teleport(data._pos, data._facing);
		} else {
			player.teleport({
				x: 0,
				y: 1.62,
				stance: 0,
				z: 0,
				onGround: true
			}, {
				yaw: 0,
				pitch: 0
			});
		}
	});

	client.on('end', handleDisconnect(player));
	client.on(0x03, handleChatOrCommand(player));
	client.on(0x0b, handleMove(player));
	client.on(0x0c, handleLook(player));
	client.on(0x0d, handleMoveAndLook(player));

	events.fire('join', {
		player: player
	});
}

function handleDisconnect(player) {
  return function(data) {
    events.fire('quit', {
      player: player
    });
  };
}

function handleChatOrCommand(player) {
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
				sender: player
			});
		} else {
			events.fire('chat', {
				message: message,
				sender: player
			});
		}
	};
}

function handleMove(player) {
	return function(data) {
		player._pos.x = data.x;
		player._pos.y = data.y;
		player._pos.z = data.z;
	};
}

function handleLook(player) {
	return function(data) {
		player._facing.yaw = data.yaw;
		player._facing.pitch = data.pitch;
	};
}

function handleMoveAndLook(player) {
	return function(data) {
		player._pos.x = data.x;
		player._pos.y = data.y;
		player._pos.z = data.z;
		player._facing.yaw = data.yaw;
		player._facing.pitch = data.pitch;
	};
}

module.exports = handleConnect;
