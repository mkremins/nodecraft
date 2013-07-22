function enable(api) {
	api.after('command', displayHelp);
}

function displayHelp(command) {
	// TODO display help
}

module.exports = {
	enable: enable
};
