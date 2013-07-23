var fs = require('fs');
var loaders = {};

function PluginLoader(pluginsDirname, passToEnable) {
	this._dirname = pluginsDirname;
	this._passToEnable = passToEnable;
	this._plugins = {};
}

PluginLoader.prototype.loadPlugins = function() {
	var countLoaded = 0, plugin, prettyFilename, self = this;
	console.log('Loading plugins from directory \'' + self._dirname + '\'...\n');
	var files = fs.readdirSync(__dirname + '/' + self._dirname);

	files.forEach(function(filename) {
		prettyFilename = self._dirname + '/' + filename;
		try {
			plugin = require('./' + prettyFilename);
			plugin.enable(self._passToEnable);
			plugin.name = plugin.name || filename.split('.')[0];
			self._plugins[plugin.name] = plugin;
			countLoaded++;
			console.log('  ✔  Loaded \'' + prettyFilename + '\' as \'' + plugin.name + '\'');
		} catch(err) {
			console.log('  ✘  Unable to load \'' + prettyFilename + '\': ' + err);
		}
	});

	console.log('\nLoaded ' + countLoaded + ' of ' + files.length + ' plugins!\n');
};

PluginLoader.prototype.unloadPlugins = function() {
	var plugin, self = this;
	for (var pluginName in self._plugins) {
		plugin = self._plugins[pluginName];
		if (plugin.disable) {
			plugin.disable();
		}
	}
};

module.exports = {
	load: function(pluginsDirname, passToEnable) {
		var loader = new PluginLoader(pluginsDirname, passToEnable);
		loader.loadPlugins();
		loaders[pluginsDirname] = loader;
	},

	unload: function(pluginsDirname) {
		loaders[pluginsDirname].unloadPlugins();
		delete loaders[pluginsDirname];
	}
};
