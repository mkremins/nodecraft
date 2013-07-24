function ConsoleCommandSender(log) {
	this.name = 'Server';
	this.log = log;
}

ConsoleCommandSender.prototype.sendMessage = function(message) {
	this.log(message);
};

function enable(api) {
	var split;
	process.stdin.resume();
	process.stdin.on('data', function(chunk) {
		split = chunk.toString().split(/\s+/);
		api.fire('command', {
			name: split[0],
			args: split.slice(1, split.length),
			sender: new ConsoleCommandSender(api.log)
		});
	});
}

module.exports = {
	enable: enable
};
