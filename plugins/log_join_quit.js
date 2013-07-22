var log;

function enable(api) {
	log = api.log;
	api.after('join', logJoin);
	api.after('quit', logQuit);
}

function logJoin(join) {
	log(join.player.username + ' has joined the game');
}

function logQuit(quit) {
	log(quit.player.username + ' left the game');
}

module.exports = {
	enable: enable
};
