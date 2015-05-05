/**
 * These template helpers have been repurposed from Iron:Router to server-side.
 */

/*****************************************************************************/
/* UI Helpers */
/*****************************************************************************/

/**
 * Create a region in the closest layout ancestor.
 *
 * Examples:
 *    <aside>
 *      {{> yield "aside"}}
 *    </aside>
 *
 *    <article>
 *      {{> yield}}
 *    </article>
 *
 *    <footer>
 *      {{> yield "footer"}}
 *    </footer>
 */
UI.registerHelper('yield', new Template('yield', function () {
  var options = this._templateInstance.data;

  if (_.isString(options)) {
    region = options;
  } else if (_.isObject(options)) {
    region = options.region;
  }

  region = region || 'main';

  // Look for the corrent parent view with contains the yield region data.
  var view = this.parentView;
  while (view) {
    if (view._templateInstance && _.isObject(view._templateInstance.data)) {
      if (view._templateInstance.data.for && view._templateInstance.data.for[region]) {
        break;
      }
    }
    view = view.parentView;
  }
  if (view) {
    var layoutOptions = view._templateInstance.data;
    if (layoutOptions.for[region]) {
      var _template = Template[layoutOptions.for[region].template];
      if (_template) {
        if (layoutOptions.for[region].data) {
          return Blaze._TemplateWith(layoutOptions.for[region].data, function() {
            return Spacebars.include(_template);
          });
        }
        return _template;
      }
    }
  }
}));

/**
 * Render a template into a region in the closest layout ancestor from within
 * your template markup.
 *
 * Examples:
 *
 *  {{#contentFor "footer"}}
 *    Footer stuff
 *  {{/contentFor}}
 *
 *  {{> contentFor region="footer" template="SomeTemplate" data=someData}}
 *
 * Note: The helper is a UI.Component object instead of a function so that
 * Meteor UI does not create a Deps.Dependency.
 *
 * XXX what happens if the parent that calls contentFor gets destroyed?
 * XXX the layout.region should be reset to be empty?
 * XXX but how do we control order of setting the region? what if it gets destroyed but then something else sets it?
 *
 */
UI.registerHelper('contentFor', new Template('contentFor', function () {
  var options = this._templateInstance.data;
  var view = this.parentView;
  while (view) {
    if (view.name != 'yield' && view._templateInstance &&
      (view.parentView && view.parentView.name != 'yield') &&
      _.isObject(view._templateInstance.data)) {
      break;
    }
    view = view.parentView;
  }

  var contentFor = {};
  contentFor[options.region] = {
    template: options.template,
    data: options.data
  };

  _.extend(view._templateInstance.data.for, contentFor);

  // just render nothing into this area of the page since the dynamic template
  // will do the actual rendering into the right region.
  return null;
}));
