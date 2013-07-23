var log;

function enable(api) {
	log = api.log;
	api.before('chat', logChat);
}

function logChat(chat) {
	log('<' + chat.sender.name + '> ' + chat.message);
}

module.exports = {
	enable: enable
};
