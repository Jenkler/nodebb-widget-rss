'use strict';

const dateformat = require('dateformat');
const meta = require.main.require('./src/meta');
const rssparser = new (require('rss-parser'));

let nodebb = {};
let rss = {};
rss.updated = Math.round(new Date().getTime() / 1000);

async function updateFeed(force = false) {
  rss.now = Math.round(new Date().getTime() / 1000);

  if(force || rss.now - rss.updated > 3600) {
    let data = {};
    let urls = meta.config['rss:urls'].split(',');
    for(let i = 0; i < urls.length; i++) {
      let url = urls[i].trim();  
      if (/^(f|ht)tps?:\/\//i.test(url)) urls[i] = url;
      else delete urls[i];
    }
    for(let i = 0; i < urls.length; i++) {
      try {
        let count = 0;
        let feed = await rssparser.parseURL(urls[i]);
        for(let key in feed.items) {
          data[dateformat(feed.items[key].pubDate, "yyyy-mm-dd HH:MM")] = {
            "content": feed.items[key].content.replace("<![CDATA[", "").replace("]]>", ""),
            "link": feed.items[key].link,
            "title": feed.items[key].title
          };
          if(count > 8) break;
          count++;
       }
     }
     catch(e) { console.error(e) }
    }
    rss.data = rsort(data);
    rss.updated = Math.round(new Date().getTime() / 1000);
    return true;
  } 
  else { return false }
}

function keyExists(data) {
  let args = Array.prototype.slice.call(arguments, 1);
  for(var i = 0; i < args.length; i++) {
    if(!data || !data.hasOwnProperty(args[i])) {
      return false;
    }
    data = data[args[i]];
  }
  return true;
}

function renderAdmin(req, res, next) {
  res.render('admin/rss', {});
}

function rsort(data) {
  const out = {};
  Object.keys(data).sort().reverse().forEach(function(key) {
    out[key] = data[key];
  });
  return out;
}

exports.filterAdminHeaderBuild = function(header, callback) {
  header.plugins.push({
    route: '/rss',
    icon: 'fa-link',
    name: 'RSS'
  });
  callback(null, header);
};

exports.filterWidgetRenderRss = function(data, callback) {
  let body = '<table id="nyheter" class="table table-striped">';
  if(keyExists(meta.config, 'rss:urls')) {
    updateFeed();
    for(let key in rss.data) {
      body += '<tr><td><a href="' + rss.data[key]['link'] + '" target="_blank">' + rss.data[key]['title'] + '</a>';
      body += '<span class="date">' + key + '</span><br/><span>' + rss.data[key]['content'] + '</span><br/></td></tr>';
    }
  }
  body += '</table>';
  nodebb.app.render('widgets/rss', { title: data.data.title, body: body }, function(err, html) {
    data.html = html;
    callback(err, data);
  });
};

exports.filterWidgetsGetWidgets = function(data, callback) {
  data = data.concat([
  {
    widget: 'rss',
    name: 'RSS',
    content: '',
    description: 'A widget that shows your rss feed'
  }]);
  callback(null, data);
};

exports.staticAppLoad = function(data, callback) {
  console.log('Loading Jenkler RSS widget ' + require('./package.json').version);
  data.router.get('/admin/rss', data.middleware.admin.buildHeader, renderAdmin);
  data.router.get('/api/admin/rss', renderAdmin);
  nodebb.app = data.app;
  if(keyExists(meta.config, 'rss:urls')) updateFeed(true);
  callback();
};
