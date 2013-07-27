var events = require('./events.js');

function Player(client) {
	this._client = client;
	this.name = client.username;
	this.pos = {}, this.facing = {};

	client.write(0x01, {
		entityId: client.id,
		levelType: 'default',
		gameMode: 1,
		dimension: 0,
		difficulty: 2,
		maxPlayers: 5
	});
}

Player.prototype.sendMessage = function(message) {
	this._client.write(0x03, JSON.stringify({
		text: message
	}));
};

Player.prototype.teleport = function(pos, facing) {
	if (facing) {
		this._client.write(0x0d, {
			x: pos.x,
			y: pos.y + 1.62,
			stance: pos.y,
			z: pos.z,
			yaw: facing.yaw,
			pitch: facing.pitch,
			onGround: true
		});
	} else {
		this._client.write(0x0b, {
			x: pos.x,
			y: pos.y + 1.62,
			stance: pos.y,
			z: pos.z,
			onGround: true
		});
	}
};

///////////////////////////////////////

function handleConnect(client) {
	var player = new Player(client);

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
			var split = message.split(/\s+/);
			events.fire('command', {
				name: split[0].substr(1),
				args: split.slice(1, split.length),
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
		if (player.pos.x !== data.x || player.pos.y !== data.y - 1.62 || player.pos.z !== data.z) {
			events.fire('move', {
				player: player,
				oldPos: player.pos,
				newPos: data
			});
			player.pos.x = data.x;
			player.pos.y = data.y - 1.62;
			player.pos.z = data.z;
		}
	};
}

function handleLook(player) {
	return function(data) {
		player.facing.yaw = data.yaw;
		player.facing.pitch = data.pitch;
	};
}

function handleMoveAndLook(player) {
	return function(data) {
		player.pos.x = data.x;
		player.pos.y = data.y - 1.62;
		player.pos.z = data.z;
		player.facing.yaw = data.yaw;
		player.facing.pitch = data.pitch;
	};
}

module.exports = handleConnect;
