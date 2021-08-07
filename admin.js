'use strict';

define('admin/rss', ['settings'], function(Settings) {
  let ACP = {};
  ACP.init = function() {
    Settings.load('rss', $('.rss-settings'));
    $('#save').on('click', function() {
      Settings.save('rss', $('.rss-settings'), function() {
        app.alert({
          alert_id: 'rss-saved',
          message: 'Updated RSS settings',
          timeout: 2000,
          title: 'Settings Saved',
          type: 'success'
        });
      });
    });
  };
  return ACP;
});
