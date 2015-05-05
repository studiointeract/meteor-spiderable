Package.describe({
  name: 'studiointeract:spiderable',
  version: '0.9.5',
  summary: 'Spiderable with Server Side Rendering (meteorhacks:ssr) and (iron:router).',
  git: 'https://github.com/studiointeract/meteor-spiderable',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  configurePackage(api);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('studiointeract:spiderable');
  api.addFiles('spiderable-tests.js');
});

function configurePackage(api) {
  api.versionsFrom('1.1.0.2');

  api.use('meteor-platform');
  api.use('meteorhacks:picker@1.0.2');
  api.use('meteorhacks:ssr@2.1.2');
  api.use('iron:router@1.0.0');
  api.use(['markdown'], 'server');

  api.addFiles('lib/fragment.html', 'client');
  api.addFiles([
    'lib/boilerplate.html',
    'lib/boilerplate.js',
    'lib/layout.js',
  ], 'server', {isAsset: true});

  api.addFiles([
    'lib/overrides.js',
    'lib/boot_templates.js',
    'lib/routes.js',
    'lib/markdown.js',
  ], 'server');
}
