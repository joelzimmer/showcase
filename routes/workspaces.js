var Collection = require('../lib/collection.js');
var Deferrals = require('../lib/deferrals');
var Workspace = require('../lib/workspace');
var gx = require('gx');

exports.initialize = function(app) {

	var models = app.dreamer.models;
	var workspaceAdmin = app.showcase.middleware.workspacePermission('administrator');
	var workspaceLoader = app.showcase.middleware.workspaceLoader;
	var requireSuperuser = app.showcase.middleware.requireSuperuser;

	var fields = ['title', 'handle', 'description'];

	app.get("/workspaces", function*(req, res) {

		var workspaces = Workspace.all();

		res.render("workspaces.html", { workspaces: workspaces });
	});

  app.get("/workspaces/import", requireSuperuser, function (req, res) {
    res.render("import.html");
  });

  app.post("/workspaces/import", requireSuperuser, function*(req, res) {
    var data = JSON.parse(req.body.json);
    if (!Array.isArray(data)) {
      data = [data];
    }
    // now that we've parsed the json, we have data to reconstruct our workspace.
    var create = [];
    var update = [];
    // 1. see which workspace exists and schedule it for creation or update.
    data.forEach(function*(set) {
      var workspace = set.workspace;
      models.workspaces.find({ where: { handle: workspace.handle } })
        .error(req.error)
        .success(function(found) {

          if (!found) {
            create.push(set);
          }
      });
    });

    create.forEach(function*(handle) {

    });

    res.redirect('/workspaces/');

  });

  app.get("/workspaces/:workspace_handle/export", workspaceLoader, workspaceAdmin, function*(req, res) {
		var workspace = req.showcase.workspace;
		var workspace_handle = req.params.workspace_handle;

		var collections = yield Collection.all({ workspace_handle: workspace_handle });

    var data = {
      workspace: workspace,
      collections: collections
    };
		res.json(data);
  });


	app.get("/workspaces/new", requireSuperuser, function(req, res) {

		var breadcrumbs = [ { text: 'New' } ];

		res.render("workspace.html", {
			breadcrumbs: breadcrumbs
		});
	});

	app.get("/workspaces/:workspace_handle/edit", workspaceLoader, workspaceAdmin, function(req, res) {

		var workspace = req.showcase.workspace;

		var breadcrumbs = [
			{ href: '/workspaces/' + workspace.handle + '/collections', text: workspace.title }
		];

		res.render("workspace.html", {
			breadcrumbs: breadcrumbs,
			workspace: workspace
		});
	});

	app.post("/workspaces/new", requireSuperuser, function*(req, res) {

		var workspace = models.workspaces.build({
			title: req.body.title,
			handle: req.body.handle,
			description: req.body.description
		});

		var errors = workspace.validate();

		fields.forEach(function(field) {
			if (workspace[field]) return;
			errors = errors || {};
			errors[field] = [field + ' is required'];
		});

		if (!errors) {
			yield workspace.save().complete(gx.resume);
			req.flash('info', 'Saved new workspace');
			res.redirect("/workspaces");
		} else {
			req.flash('danger', 'There was an error: ' + JSON.stringify(errors));
			res.redirect("/workspaces/new");
		}
	});

	app.delete("/workspaces/:workspace_handle", workspaceLoader, workspaceAdmin, function*(req, res) {

		var workspace = req.showcase.workspace;
		yield workspace.destroy().complete(gx.resume);
		req.flash('info', 'Deleted workspace');
		res.redirect('/workspaces');
	});

	app.post("/workspaces/:workspace_handle/edit", workspaceLoader, workspaceAdmin, function*(req, res) {

		var workspace = req.showcase.workspace;

		fields.forEach(function(field) {
			workspace[field] = req.body[field];
		});

		var errors = workspace.validate();

		fields.forEach(function(field) {
			if (workspace[field]) return;
			errors = errors || {};
			errors[field] = [field + ' is required'];
		});

		if (!errors) {
			yield workspace.save().complete(gx.resume);
			req.flash('info', 'Saved new workspace');
			res.redirect("/workspaces");
		} else {
			req.flash('danger', 'There was an error: ' + JSON.stringify(errors));
			res.redirect("/workspaces/new");
		}

	});
};
