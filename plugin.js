'use strict';

const meta = require.main.require('./src/meta');
const routeHelpers = require.main.require('./src/routes/helpers');

const rssparser = new (require('rss-parser'));
let nodebb = {};
let rss = { data: {}, updated: Math.round(new Date().getTime() / 1000) };

const updateFeed = async (force = false) => {
  rss.now = Math.round(new Date().getTime() / 1000);
  if(force || rss.now - rss.updated > 3600) {
    let data = {};
    let settings = await meta.settings.get('rss');
    let limit = Number(settings?.limit ?? 10) ? Number(settings?.limit ?? 10) : 10;
    let urls = (settings?.urls ?? '').split(',').map((x) => { return x.trim().split(' ')[0]; }).filter((x) => {
      if(/^(f|ht)tps?:\/\//i.test(x)) return x
      else return false;
    });
    if(urls[0] == undefined) return false;
    for(let i = 0; i < urls.length; i++) {
      try {
        let count = 0;
        let feed = await rssparser.parseURL(urls[i]);
        for(let key in feed.items) {
          count++;
          data[new Date(Date.parse(feed.items[key].pubDate)).toISOString().substr(0, 16).replace('T', ' ')] = {
            "content": feed.items[key].content.replace("<![CDATA[", "").replace("]]>", ""),
            "link": feed.items[key].link,
            "title": feed.items[key].title
          };
          if(count >= limit) break;
        }
      }
      catch(e) { console.error(e) }
    }
    rss.data = await rsort(data);
    rss.updated = Math.round(new Date().getTime() / 1000);
    return true;
  }
  else { return false }
}
const renderAdmin = async (req, res) => {
  res.render('admin/plugins/rss-widget', {
    title: 'RSS Widget',
  });
}
const rsort = async (data) => {
  return Object.keys(data).sort().reverse().reduce((r, k) => (r[k] = data[k], r), {});
}

exports.filterAdminHeaderBuild = async (data) => {
  data.plugins.push({
    icon: 'fa-link',
    name: 'RSS Widget',
    route: '/plugins/rss-widget'
  });
  return data;
};
exports.filterWidgetRenderRss = async (data) => {
  let body = '<table id="nyheter" class="table table-striped">';
  await updateFeed();
  for(let key in rss.data) {
    body += '<tr><td><a href="' + rss.data[key]['link'] + '" target="_blank">' + rss.data[key]['title'] + '</a>';
    body += '<span class="date">' + key + '</span><br/><span>' + rss.data[key]['content'] + '</span><br/></td></tr>';
  }
  body += '</table>';
  data.html = await nodebb.app.renderAsync('widgets/rss', { body: body, title: data.data.title });
  return data;
};
exports.filterWidgetsGetWidgets = async (data) => {
  data.push({
    content: '',
    description: 'A widget that shows your rss feed',
    name: 'RSS',
    widget: 'rss'
  });
  return data;
};
exports.staticAppLoad = async (data) => {
  console.log('Loading Jenkler RSS widget ' + require('./package.json').version);

  routeHelpers.setupAdminPageRoute(data.router, '/admin/plugins/rss-widget', renderAdmin);
  nodebb.app = data.app;
  await updateFeed(true);
};
