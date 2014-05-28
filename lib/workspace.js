var dreamer = require('dreamer');
var models = dreamer.instance.models;
var controls = require('./fields').controls;
var gx = require('gx');

var Workspace = function() {
	this.initialize.apply(this, arguments);
};

Workspace.prototype = {
  attributes: ['title', 'handle', 'description'],

  initialize: function*(properties) {
    if (!properties) return;
    if (properties.id) this.id = properties.id;

    this.attributes.forEach(function (attr) {
      this[attr] = properties[attr];
    }, this);
    return this;
  },

	save: function*() {

		this.attributes.forEach(function(key) {
			this._data[key] = this[key];
		}, this);

		yield this._data.save().complete(gx.resume);
		this.id = this._data.id;
	},

	update: function*(args) {
	},

	destroy: function*() {
	},

	_fields: function*() {
	},

	_resolveFieldModifications: function(args) {
	},

	_createFields: function*(fields) {
	},

	_updateFields: function*(args) {
  }
};

Workspace.create = function*(args) {
};

Workspace.all = function*(args) {
		var workspaces = yield models.workspaces
			.findAll({})
			.complete(gx.resume);

    return workspaces;
};


