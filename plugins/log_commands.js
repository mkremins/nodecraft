var cconsole;

function enable(api) {
	cconsole = api.console;
	api.before('command', logCommand);
}

function logCommand(command) {
	cconsole.log(command.sender.username + ': /' + command.name + ' ' + command.args);
}

module.exports = {
	enable: enable
};
