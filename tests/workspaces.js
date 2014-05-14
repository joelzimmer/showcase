var fs = require('fs');
var gx = require('gx');

var suite = require('./lib');
var showcase = require('../index');
var config = require('./lib/config');

showcase.initialize(config.showcase);

var dream = require('dreamer').instance;
var error = function(e) { console.warn(e) };
var Collection = require('../lib/collection.js');

exports.setUp = suite.setUp;
exports.tearDown = suite.tearDown;

exports.exportAll = function(test) {
  gx(function*() {
		var collection = yield Collection.create({
			title: 'Books',
			description: 'Books for reading',
			name: 'books',
			workspace_handle: 'test',
			fields: config.fixtures.book_fields,
		});
		var collections = yield Collection.exportAll({ workspace_handle: 'test' });
		test.equal(typeof collections, 'object');
    test.done()
  });
};

exports.badWorkspace = function(test) {
  gx(function*() {
		var collections = yield Collection.all({ workspace_handle: 'testfake' });
		test.equal(collections.length, 0);
    test.done();
  });
};
