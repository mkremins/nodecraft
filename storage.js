var fs = require('fs');
var stores = {};

function DataStore(name) {
	this._dirpath = __dirname + '/' + name;
}

DataStore.prototype._makeFilepath = function(key) {
	return this._dirpath + '/' + key + '.json';
};

DataStore.prototype.get = function(key, callback) {
	fs.readFile(this._makeFilepath(key), 'utf8', function(err, data) {
		if (err) {
			throw err; // TODO actually handle the error
		} else {
			callback(JSON.parse(data));
		}
	});
};

DataStore.prototype.set = function(key, value) {
	fs.writeFile(this._makeFilepath(key), JSON.stringify(value), function(err) {
		if (err) {
			throw err; // TODO actually handle the error
		}
	});
};

function getDataStore(type) {
	stores[type] = stores[type] || new DataStore(type);
	return stores[type];
}

module.exports = {
	load: function(type, key, callback) {
		getDataStore(type).get(key, callback);
	},

	save: function(type, key, value) {
		getDataStore(type).set(key, value);
	}
};
