/**
 * These template helpers have been repurposed from Showdown to work server-side.
 */

/*****************************************************************************/
/* UI Helpers */
/*****************************************************************************/
if (typeof Template !== 'undefined') {
  UI.registerHelper('markdown', new Template('markdown', function() {
    var view = this;
    var content = '';
    if (view.templateContentBlock) {
      content = Blaze._toText(view.templateContentBlock, HTML.TEXTMODE.STRING);
    }
    var converter = new Showdown.converter();
    return HTML.Raw(converter.makeHtml(content));
  }));
}
