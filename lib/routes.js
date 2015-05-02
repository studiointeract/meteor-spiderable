Meteor.startup(function() {
  var seoPicker = Picker.filter(function(req, res) {
    return /_escaped_fragment_/.test(req.url);
  });

  var routes = Router.routes._byPath;
  _.each(routes, function(route, path) {
    seoPicker.route(path, function(params, req, res) {
      // Add Router.current for the current request.
      Router.current = function() {
        return {
          params: params,
          options: {
            route: route
          }
        }
      };

      // Grab the current route's controller.
      var controller = route.createController();

      // Lookup the action method.
      var action = controller.lookupOption('action');

      // Default options.
      var options = {
        layoutTemplate: controller.lookupOption('layoutTemplate'),
        params: params,
        render: function(template, region) {
          options.for = options.for || {};
          template = template || controller.lookupOption('template');
          region = region || {to: 'main'};
          options.for[region.to] = {template: template};
        },
        layout: function(layoutTemplate) {
          options.layoutTemplate = layoutTemplate;
        }
      };

      // Use the current action method to hitch-and-grab render and layout changes.
      action.call(options);

      // Render the markup.
      var html = SSR.render('html', {
        template: options.layoutTemplate,
        data: options
      });

      // Respond with the markup.
      res.end(html);
    });
  });
});
