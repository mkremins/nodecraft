var server;

function enable(api) {
	server = api.server;
	api.on('command', isStopCommand, stopServer);
}

function isStopCommand(command) {
	return command.name == 'stop';
}

function stopServer(command) {
	server.close();
	command.consumed = true;
	return command;
}

module.exports = {
	enable: enable
};
