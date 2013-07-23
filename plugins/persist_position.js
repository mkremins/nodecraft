var load, save;

function enable(api) {
	load = api.load, save = api.save;
	api.after('join', function(joining) {
		var player = joining.player;
		load('players', player.name, function(data) {
			if (data) {
				player.teleport(data.pos, data.facing);
			} else {
				player.teleport(
					{ x: 0, y: 0, z: 0 },
					{ yaw: 0, pitch: 0 }
				);
			}
		});
	});

	api.after('quit', function(quitting) {
		var player = quitting.player;
		var pos = player.pos, facing = player.facing;
		save('players', player.name, {
			pos: { x: pos.x, y: pos.y, z: pos.z},
			facing: { yaw: facing.yaw, pitch: facing.pitch }
		});
	});
}

module.exports = {
	enable: enable
};
