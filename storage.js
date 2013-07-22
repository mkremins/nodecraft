var fs = require('fs');

function makeFilepath(dirpath, key) {
	return dirpath + '/' + key + '.json';
}

function DataStore(name) {
	this._dirpath = __dirname + '/' + name;
}

DataStore.prototype.get = function(key, callback) {
	var filepath = makeFilepath(this._dirpath, key);
	fs.readFile(filepath, 'utf8', function(err, data) {
		if (err) {
			throw err; // TODO actually handle the error
		} else {
			callback(JSON.parse(data));
		}
	});
};

DataStore.prototype.set = function(key, value) {
	var filepath = makeFilepath(this._dirpath, key);
	fs.writeFile(filepath, JSON.stringify(value), function(err) {
		if (err) {
			throw err; // TODO actually handle the error
		}
	});
};

function load(type, key, callback) {
	new DataStore(type).get(key, callback);
}

function save(type, key, value) {
	new DataStore(type).set(key, value);
}

module.exports = {
	save: save,
	load: load
};
