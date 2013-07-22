var log;

function enable(api) {
	log = api.log;
	api.before('chat', logChat);
}

function logChat(chat) {
	log('<' + chat.sender.username + '> ' + chat.message);
}

module.exports = {
	enable: enable
};
