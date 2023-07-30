'use strict';

define('admin/plugins/rss-widget', ['settings'], function(Settings) {
  let ACP = {};
  ACP.init = function() {
    Settings.load('rss', $('.rss-settings'));
    $('#save').on('click', function() {
      Settings.save('rss', $('.rss-settings'));
    });
  };
  return ACP;
});
