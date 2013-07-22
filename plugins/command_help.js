var cconsole;

function enable(api) {
	cconsole = api.console;
	api.after('command', displayHelp);
}

function displayHelp(command) {
  // TODO display help
}

module.exports = {
	enable: enable
};
