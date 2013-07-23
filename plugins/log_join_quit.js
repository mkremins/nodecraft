var log;

function enable(api) {
	log = api.log;
	api.after('join', logJoin);
	api.after('quit', logQuit);
}

function logJoin(join) {
	log(join.player.getName() + ' has joined the game');
}

function logQuit(quit) {
	log(quit.player.getName() + ' left the game');
}

module.exports = {
	enable: enable
};
