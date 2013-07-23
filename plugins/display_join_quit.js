var broadcast;

function enable(api) {
	broadcast = api.broadcast;
	api.after('join', displayJoin);
	api.after('quit', displayQuit);
}

function displayJoin(join) {
	broadcast(join.player.getName() + ' has joined the game');
}

function displayQuit(quit) {
	broadcast(quit.player.getName() + ' left the game');
}

module.exports = {
	enable: enable
};
