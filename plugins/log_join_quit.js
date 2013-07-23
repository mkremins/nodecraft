var log;

function enable(api) {
	log = api.log;
	api.after('join', logJoin);
	api.after('quit', logQuit);
}

function logJoin(join) {
	log(join.player.name + ' has joined the game');
}

function logQuit(quit) {
	log(quit.player.name + ' left the game');
}

module.exports = {
	enable: enable
};
