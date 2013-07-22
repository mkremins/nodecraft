var broadcast;

function enable(api) {
	broadcast = api.broadcast;
	api.after('join', displayJoin);
	api.after('quit', displayQuit);
}

function displayJoin(join) {
	broadcast(join.player.username + ' has joined the game');
}

function displayQuit(quit) {
	broadcast(quit.player.username + ' left the game');
}

module.exports = {
	enable: enable
};
