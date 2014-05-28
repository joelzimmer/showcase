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

exports.badWorkspace = function(test) {
  gx(function*() {
		var collections = yield Collection.all({ workspace_handle: 'testfake' });
		test.equal(collections.length, 0);
    test.done();
  });
};
