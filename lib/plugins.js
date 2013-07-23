var fs = require('fs');
var path = require('path');

var loaders = {};

function PluginLoader(pluginsDir, passToEnable) {
	this._dir = pluginsDir;
	this._dirname = path.basename(pluginsDir);
	this._passToEnable = passToEnable;
	this._plugins = {};
}

PluginLoader.prototype.loadPlugins = function() {
	var countLoaded = 0, plugin, prettyFilename, self = this;
	console.log('Loading plugins from directory \'' + self._dirname + '\'...\n');
	var files = fs.readdirSync(self._dir);

	files.forEach(function(filename) {
		prettyFilename = self._dirname + '/' + filename;
		try {
			plugin = require(self._dir + '/' + filename);
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
	load: function(pluginsDir, passToEnable) {
		var loader = new PluginLoader(pluginsDir, passToEnable);
		loader.loadPlugins();
		loaders[loader._dirname] = loader;
	},

	unload: function(pluginsDir) {
		loaders[pluginsDir].unloadPlugins();
		delete loaders[pluginsDir];
	}
};
