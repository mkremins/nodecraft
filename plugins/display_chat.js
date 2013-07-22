var broadcast;

function enable(api) {
	broadcast = api.broadcast;
	api.on('chat', displayChat);
}

function displayChat(chat) {
	broadcast(chat.message, chat.sender);
	chat.consumed = true;
	return chat;
}

module.exports = {
	enable: enable
};
