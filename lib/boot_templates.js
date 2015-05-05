var fs = Npm.require('fs');
_staticHeaders = _staticHeaders || "";

function findAndLoadAssets(dir, filetype, recursive) {
  recursive = recursive || true;
  var files = fs.readdirSync(dir);
  var pattern = new RegExp("\." + filetype + "$", "i");
  _.each(files, function(file) {
    var uri = dir + "/" + file;
    var stats = fs.statSync(uri);
    if (stats.isFile()) {
      if (pattern.test(file)) {
        try {
          var data = fs.readFileSync(uri, {
            encoding: 'utf-8'
          });
          if (data) {
            switch(filetype) {
              case 'html':
                var parts = data.split(/\<template name\="(.*)"\>/i);
                for (var i = 1; i < parts.length; i+=2) {
                  // Compile extracted templates.
                  if ((parts[i] + parts[i+1]).length > 0) {
                    var trimmed = parts[i+1].replace(/\<\/template\>/, '');
                    SSR.compileTemplate(parts[i], trimmed);
                  }
                }
                if (parts.length == 1) {
                  // Extract static headers.
                  if (!/\<\/?(html|body)>/i.test(data)) {
                    parts = data.split(/\<head>/i);
                    for (var i = 1; i <= parts.length; i++) {
                      if (parts[i].length > 0) {
                        var trimmed = parts[i].replace(/\<\/head\>/, '');
                        _staticHeaders += trimmed;
                      }
                    }
                  }
                }
                break;
              case 'js':
                eval(data);
                break;
              case 'css':
              _staticHeaders += '<link rel="stylesheet" type="text/css" class="__meteor-css__" href="/' + file + '">'
                break;
            }
          }
        } catch(e) {
          // Don't handle file errors.
        }
      }
    }
    else if (recursive && stats.isDirectory()) {
      findAndLoadAssets(dir + "/" + file, filetype);
    }
  });
}

Meteor.startup(function() {
  var currentDir = './assets';
  findAndLoadAssets(currentDir, 'html');
  findAndLoadAssets(currentDir, 'js');
  findAndLoadAssets('../web.browser', 'css', false);
});
