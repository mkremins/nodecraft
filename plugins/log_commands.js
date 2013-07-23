var log;

function enable(api) {
	log = api.log;
	api.before('command', logCommand);
}

function logCommand(command) {
	log(command.sender.getName() + ': /' + command.name + ' ' + command.args);
}

module.exports = {
	enable: enable
};
