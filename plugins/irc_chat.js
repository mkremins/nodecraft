var irc = require('irc');

var client, config, connected = false;

function enable(api) {
	config = {
		channels: ['#nodecraft'],
		server: 'irc.freenode.net',
		botName: 'nodecraft'
	};

	client = new irc.Client(config.server, config.botName, { channels: config.channels });

	client.on('registered', function(message) {
		connected = true;
	});

	client.on('message', function(from, to, text, message) {
		if (config.channels.indexOf(to) !== -1 && from !== config.botName) {
			api.fire('chat', {
				sender: new IrcChatSender(from),
				message: text,
				irc: true
			});
		}
	});

	api.on('chat', function(chat) {
		if (!chat.irc && connected) {
			config.channels.forEach(function(channel) {
				client.say(channel, '<' + chat.sender.name + '> ' + chat.message);
			});
		}
		return chat;
	});
}

function disable() {
	config.channels.forEach(function(channel) {
		client.part(channel);
	});
	client.disconnect();
}

function IrcChatSender(name) {
	this.name = name;
}

IrcChatSender.prototype.sendMessage = function(message) {
	client.notice(this.name, message);
};

module.exports = {
	enable: enable,
	disable: disable
};
