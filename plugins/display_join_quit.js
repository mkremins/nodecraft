var broadcast;

function enable(api) {
	broadcast = api.broadcast;
	api.after('join', displayJoin);
	api.after('quit', displayQuit);
}

function displayJoin(join) {
	broadcast(join.player.name + ' has joined the game');
}

function displayQuit(quit) {
	broadcast(quit.player.name + ' left the game');
}

module.exports = {
	enable: enable
};
