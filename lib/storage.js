var fs = require('fs');
var path = require('path');

var stores = {};

function DataStore(storageDir) {
	this._dir = storageDir;
	fs.exists(storageDir, function(exists) {
		if (!exists) {
			fs.mkdir(storageDir);
		}
	});
}

DataStore.prototype._makeFilepath = function(key) {
	return this._dir + '/' + key + '.json';
};

DataStore.prototype.get = function(key, callback) {
	fs.readFile(this._makeFilepath(key), 'utf8', function(err, data) {
		if (err) {
			callback(null); // TODO
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

function getDataStore(dir) {
	stores[dir] = stores[dir] || new DataStore(dir);
	return stores[dir];
}

module.exports = {
	load: function(storageDir, key, callback) {
		getDataStore(storageDir).get(key, callback);
	},

	save: function(storageDir, key, value) {
		getDataStore(storageDir).set(key, value);
	}
};
