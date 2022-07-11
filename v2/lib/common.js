/* global app */

const closePanel = '';
const iconSize = '32';
const popupWidth = '14';
const panelColor = 'FFFFFF';
const fontColor = '#444444';

const mainTypes = [
  'music', 'news', 'book', 'groups',
  'search', 'youtube', 'maps', 'play', 'gmail', 'calender',
  'drive', 'shopping', 'keep', 'translate',
  'print', 'alerts', 'analytics', 'duo'
].filter((s, i, l) => s && l.indexOf(s) === i);

const backupTypes = [
  'admob', 'store', 'docs', 'encrypted', 'classroom', 'contacts',
  'chrome', 'sheets', 'privacy', 'admin', 'apps', 'flights', 'fi',
  'image', 'mobile', 'earth', 'panoramio', 'site', 'hotel', 'express',
  'finance', 'code', 'scholar', 'patent', 'trends', 'sketchup',
  'webhistory', 'webmaster', 'chromebook', 'chromium', 'cloudeplatform',
  'streetview', 'sync', 'tagmanager', 'tasks', 'webstore', 'mapsengine',
  'android', 'bookmarks', 'feedburner', 'fusion', 'offers', 'urlshortner',
  'domains', 'security', 'drawings', 'inbox', 'support', 'account', 'tango',
  'coordinate', 'earthengine', 'fonts', 'forms', 'glass', 'goggles', 'allo',
  'sky', 'transit', 'webpagetest', 'wdyl', 'adsense', 'tiltbrush',
  'video', 'voice', 'catalogs', 'authenticator', 'business', 'computeengine',
  'help', 'partnerdash', 'photos', 'local', 'presentation', 'script', 'zagat',
  'correlate', 'currents', 'developersdashboard', 'inputtool', 'ideas', 'mars',
  'ymusic', 'movies', 'chromecast', 'cast', 'messages', 'chat',
  'agenda', 'ads', 'auto', 'cardboard', 'gboard', 'assistant', 'expeditions',
  'fit', 'one', 'games', 'transcript', 'wifi', 'podcast',
  'stages', 'waze', 'ykids', 'ytv', 'art', 'meet'
].filter((s, i, l) => s && l.indexOf(s) === i);
{
  if (!app.storage.read('mainTypes')) app.storage.write('mainTypes', JSON.stringify(mainTypes));
  if (!app.storage.read('backupTypes')) app.storage.write('backupTypes', JSON.stringify(backupTypes));

  const extra = [...mainTypes, ...backupTypes];
  for (const name of [
    ...JSON.parse(app.storage.read('mainTypes')),
    ...JSON.parse(app.storage.read('backupTypes'))
  ]) {
    const index = extra.indexOf(name);
    if (index !== -1) {
      extra.splice(index, 1);
    }
  }
  if (extra.length) {
    app.storage.write('backupTypes', JSON.stringify([
      ...JSON.parse(app.storage.read('backupTypes')),
      ...extra
    ]));
  }
}

const inits = function() {
  app.popup.send('request-inits', {
    'iconSize': app.storage.read('iconSize') || iconSize,
    'mainTypes': JSON.parse(app.storage.read('mainTypes')),
    'fontColor': app.storage.read('fontColor') || fontColor,
    'popupWidth': app.storage.read('popupWidth') || popupWidth,
    'closePanel': app.storage.read('closePanel') || closePanel,
    'panelColor': app.storage.read('panelColor') || panelColor,
    'backupTypes': JSON.parse(app.storage.read('backupTypes'))
  });
};

app.popup.receive('request-inits', inits);
app.popup.receive('support', function() {
  app.tab.open(app.homepage());
});
app.popup.receive('store-icon-size', function(data) {
  app.storage.write('iconSize', data);
});
app.popup.receive('store-font-color', function(data) {
  app.storage.write('fontColor', data);
});
app.popup.receive('store-popup-width', function(data) {
  app.storage.write('popupWidth', data);
});
app.popup.receive('store-panel-color', function(data) {
  app.storage.write('panelColor', data);
});
app.popup.receive('store-close-panel', function(data) {
  app.storage.write('closePanel', data);
});
app.popup.receive('store-mainTypes', function(data) {
  app.storage.write('mainTypes', JSON.stringify(data));
});
app.popup.receive('store-backupTypes', function(data) {
  app.storage.write('backupTypes', JSON.stringify(data));
});

app.popup.receive('reset-history', function() {
  app.storage.write('iconSize', iconSize);
  app.storage.write('fontColor', fontColor);
  app.storage.write('popupWidth', popupWidth);
  app.storage.write('closePanel', closePanel);
  app.storage.write('panelColor', panelColor);
  app.storage.write('mainTypes', JSON.stringify(mainTypes));
  app.storage.write('backupTypes', JSON.stringify(backupTypes));
  /*  */
  inits();
});

app.popup.receive('open-tab-request', function(o) {
  switch (o.type) {
  case 'fi': app.tab.open('https://fi.google.com/', o.hide); break;
  case 'urlshortner': app.tab.open('https://goo.gl/', o.hide); break;
  case 'zagat': app.tab.open('https://www.zagat.com/', o.hide); break;
  case 'code': app.tab.open('https://code.google.com/', o.hide); break;
  case 'news': app.tab.open('https://news.google.com/', o.hide); break;
  case 'note': app.tab.open('https://keep.google.com/', o.hide); break;
  case 'keep': app.tab.open('https://keep.google.com/', o.hide); break;
  case 'plus': app.tab.open('https://plus.google.com/', o.hide); break;
  case 'wdyl': app.tab.open('https://home.google.com/', o.hide); break;
  case 'allo': app.tab.open('https://allo.google.com/', o.hide); break;
  case 'book': app.tab.open('https://books.google.com/', o.hide); break;
  case 'search': app.tab.open('https://www.google.com/', o.hide); break;
  case 'site': app.tab.open('https://sites.google.com/', o.hide); break;
  case 'hub': app.tab.open('https://on.google.com/hub/', o.hide); break;
  case 'earth': app.tab.open('https://earth.google.com/', o.hide); break;
  case 'music': app.tab.open('https://music.google.com/', o.hide); break;
  case 'sky': app.tab.open('https://www.google.com/sky/', o.hide); break;
  case 'admin': app.tab.open('https://admin.google.com/', o.hide); break;
  case 'inbox': app.tab.open('https://inbox.google.com/', o.hide); break;
  case 'store': app.tab.open('https://store.google.com/', o.hide); break;
  case 'android': app.tab.open('https://www.android.com/', o.hide); break;
  case 'blogger': app.tab.open('https://www.blogger.com/', o.hide); break;
  case 'youtube': app.tab.open('https://www.youtube.com/', o.hide); break;
  case 'help': app.tab.open('https://support.google.com/', o.hide); break;
  case 'maps': app.tab.open('https://www.google.com/maps/', o.hide); break;
  case 'picasa': app.tab.open('https://photos.google.com/', o.hide); break;
  case 'groups': app.tab.open('https://groups.google.com/', o.hide); break;
  case 'mars': app.tab.open('https://www.google.com/mars/', o.hide); break;
  case 'sync': app.tab.open('https://www.google.com/sync/', o.hide); break;
  case 'sketchup': app.tab.open('https://www.sketchup.com/', o.hide); break;
  case 'chromium': app.tab.open('https://www.chromium.org/', o.hide); break;
  case 'voice': app.tab.open('https://www.google.com/voice', o.hide); break;
  case 'tango': app.tab.open('https://get.google.com/tango/', o.hide); break;
  case 'gmail': app.tab.open('https://mail.google.com/mail/', o.hide); break;
  case 'play': app.tab.open('https://play.google.com/store/', o.hide); break;
  case 'ideas': app.tab.open('https://www.google.com/ideas/', o.hide); break;
  case 'fonts': app.tab.open('https://www.google.com/fonts/', o.hide); break;
  case 'scholar': app.tab.open('https://scholar.google.com/', o.hide); break;
  case 'glass': app.tab.open('https://www.google.com/glass/', o.hide); break;
  case 'admob': app.tab.open('https://www.google.com/admob/', o.hide); break;
  case 'domains': app.tab.open('https://domains.google.com/', o.hide); break;
  case 'support': app.tab.open('https://support.google.com/', o.hide); break;
  case 'tiltbrush': app.tab.open('https://www.tiltbrush.com/', o.hide); break;
  case 'panoramio': app.tab.open('https://www.panoramio.com/', o.hide); break;
  case 'alerts': app.tab.open('https://www.google.com/alerts', o.hide); break;
  case 'video': app.tab.open('https://www.google.com/videohp', o.hide); break;
  case 'forms': app.tab.open('https://docs.google.com/forms/', o.hide); break;
  case 'image': app.tab.open('https://images.google.com/imghp', o.hide); break;
  case 'mobile': app.tab.open('https://www.google.com/mobile/', o.hide); break;
  case 'trends': app.tab.open('https://www.google.com/trends/', o.hide); break;
  case 'wallet': app.tab.open('https://www.google.com/wallet/', o.hide); break;
  case 'chrome': app.tab.open('https://www.google.com/chrome/', o.hide); break;
  case 'account': app.tab.open('https://myaccount.google.com/', o.hide); break;
  case 'offers': app.tab.open('https://www.google.com/offers/', o.hide); break;
  case 'photos': app.tab.open('https://plus.google.com/photos/', o.hide); break;
  case 'patent': app.tab.open('https://www.google.com/patents/', o.hide); break;
  case 'finance': app.tab.open('https://www.google.com/finance', o.hide); break;
  case 'docs': app.tab.open('https://docs.google.com/document/', o.hide); break;
  case 'classroom': app.tab.open('https://classroom.google.com/', o.hide); break;
  case 'express': app.tab.open('https://www.google.com/express/', o.hide); break;
  case 'adsense': app.tab.open('https://www.google.com/adsense/', o.hide); break;
  case 'adwords': app.tab.open('https://www.google.com/adwords/', o.hide); break;
  case 'encrypted': app.tab.open('https://encrypted.google.com/', o.hide); break;
  case 'flights': app.tab.open('https://www.google.com/flights/', o.hide); break;
  case 'blog': app.tab.open('https://www.google.com/blogsearch/', o.hide); break;
  case 'translate': app.tab.open('https://translate.google.com/', o.hide); break;
  case 'cloudeplatform': app.tab.open('https://cloud.google.com/', o.hide); break;
  case 'print': app.tab.open('https://www.google.com/cloudprint/', o.hide); break;
  case 'local': app.tab.open('https://plus.google.com/u/0/local/', o.hide); break;
  case 'webpagetest': app.tab.open('https://www.webpagetest.org/', o.hide); break;
  case 'feedburner': app.tab.open('https://feedburner.google.com/', o.hide); break;
  case 'contacts': app.tab.open('https://www.google.com/contacts/', o.hide); break;
  case 'catalogs': app.tab.open('https://www.google.com/catalogs/', o.hide); break;
  case 'shopping': app.tab.open('https://www.google.com/shopping/', o.hide); break;
  case 'business': app.tab.open('https://www.google.com/business/', o.hide); break;
  case 'hotel': app.tab.open('https://www.google.com/hotelfinder/', o.hide); break;
  case 'hangouts': app.tab.open('https://www.google.com/hangouts/', o.hide); break;
  case 'calender': app.tab.open('https://www.google.com/calendar/', o.hide); break;
  case 'drawings': app.tab.open('https://docs.google.com/drawings/', o.hide); break;
  case 'tasks': app.tab.open('https://mail.google.com/tasks/canvas', o.hide); break;
  case 'bookmarks': app.tab.open('https://www.google.com/bookmarks/', o.hide); break;
  case 'analytics': app.tab.open('https://www.google.com/analytics/', o.hide); break;
  case 'fusion': app.tab.open('https://www.google.com/fusiontables/', o.hide); break;
  case 'dashboard': app.tab.open('https://www.google.com/dashboard/', o.hide); break;
  case 'earthengine': app.tab.open('https://earthengine.google.org/', o.hide); break;
  case 'inputtool': app.tab.open('https://www.google.com/inputtools/', o.hide); break;
  case 'webmaster': app.tab.open('https://www.google.com/webmasters/', o.hide); break;
  case 'sheets': app.tab.open('https://docs.google.com/spreadsheets/', o.hide); break;
  case 'mapsengine': app.tab.open('https://mapsengine.google.com/map/', o.hide); break;
  case 'drive': app.tab.open('https://drive.google.com/drive/my-drive', o.hide); break;
  case 'webhistory': app.tab.open('https://history.google.com/history/', o.hide); break;
  case 'apps': app.tab.open('https://www.google.com/work/apps/business/', o.hide); break;
  case 'security': app.tab.open('https://myaccount.google.com/security/', o.hide); break;
  case 'tagmanager': app.tab.open('https://www.google.com/tagmanager/web/', o.hide); break;
  case 'script': app.tab.open('https://developers.google.com/apps-script/', o.hide); break;
  case 'presentation': app.tab.open('https://docs.google.com/presentation/', o.hide); break;
  case 'currents': app.tab.open('https://www.google.com/producer/currents/', o.hide); break;
  case 'correlate': app.tab.open('https://www.google.com/trends/correlate/', o.hide); break;
  case 'privacy': app.tab.open('https://myaccount.google.com/privacycheckup/', o.hide); break;
  case 'transit': app.tab.open('https://www.google.com/intl/en/landing/transit/', o.hide); break;
  case 'partnerdash': app.tab.open('https://partnerdash.google.com/partnerdash/', o.hide); break;
  case 'streetview': app.tab.open('https://www.google.com/maps/views/streetview/', o.hide); break;
  case 'chromebook': app.tab.open('https://www.google.com/intl/en/chrome/devices/', o.hide); break;
  case 'webstore': app.tab.open('https://chrome.google.com/webstore/category/apps', o.hide); break;
  case 'authenticator': app.tab.open('https://support.google.com/accounts/answer/1066447/', o.hide); break;
  case 'computeengine': app.tab.open('https://console.developers.google.com/project?getstarted/', o.hide); break;
  case 'developersdashboard': app.tab.open('https://chrome.google.com/webstore/developer/dashboard/', o.hide); break;
  case 'coordinate': app.tab.open('https://www.google.com/enterprise/mapsearth/products/coordinate.html', o.hide); break;
  case 'goggles': app.tab.open('https://support.google.com/websearch/topic/25275?hl=en&ref_topic=1733205', o.hide); break;
  case 'ymusic': app.tab.open('https://www.youtube.com/musicpremium', o.hide); break;
  case 'movies': app.tab.open('https://play.google.com/store/movies', o.hide); break;
  case 'chromecast': app.tab.open('https://store.google.com/product/chromecast', o.hide); break;
  case 'cast': app.tab.open('https://www.google.com/cast/', o.hide); break;
  case 'messages': app.tab.open('https://messages.google.com/', o.hide); break;
  case 'duo': app.tab.open('https://duo.google.com/', o.hide); break;
  case 'chat': app.tab.open('https://chat.google.com/', o.hide); break;
  case 'agenda': app.tab.open('https://www.google.com/calendar/about/', o.hide); break;
  case 'ads': app.tab.open('https://ads.google.com/', o.hide); break;
  case 'auto': app.tab.open('https://www.android.com/intl/en_us/auto/', o.hide); break;
  case 'cardboard': app.tab.open('https://www.google.com/get/cardboard/', o.hide); break;
  case 'gboard': app.tab.open('https://play.google.com/store/apps/details?id=com.google.android.inputmethod.latin', o.hide); break;
  case 'assistant': app.tab.open('https://assistant.google.com/business/', o.hide); break;
  case 'expeditions': app.tab.open('https://www.google.co.in/edu/expeditions/', o.hide); break;
  case 'fit': app.tab.open('https://play.google.com/store/apps/details?id=com.google.android.apps.fitness&hl=en', o.hide); break;
  case 'meet': app.tab.open('https://gsuite.google.com/products/meet/', o.hide); break;
  case 'one': app.tab.open('https://one.google.com/', o.hide); break;
  case 'games': app.tab.open('https://play.google.com/store/apps/details?id=com.google.android.play.games&hl=en', o.hide); break;
  case 'transcript': app.tab.open('https://www.google.com/inputtools/', o.hide); break;
  case 'wifi': app.tab.open('https://store.google.com/product/google_wifi', o.hide); break;
  case 'podcast': app.tab.open('https://podcasts.google.com/', o.hide); break;
  case 'stages': app.tab.open('https://stadia.google.com/', o.hide); break;
  case 'waze': app.tab.open('https://www.waze.com/', o.hide); break;
  case 'ykids': app.tab.open('https://www.youtube.com/kids/', o.hide); break;
  case 'ytv': app.tab.open('https://tv.youtube.com/', o.hide); break;
  case 'art': app.tab.open('https://artsandculture.google.com/', o.hide); break;
  default: app.tab.open('https://www.google.com/about/products/', o.hide); break;
  }
});

/* FAQs & Feedback */
{
  const {management, runtime: {onInstalled, setUninstallURL, getManifest}, storage, tabs} = chrome;
  if (navigator.webdriver !== true) {
    const page = getManifest().homepage_url;
    const {name, version} = getManifest();
    onInstalled.addListener(({reason, previousVersion}) => {
      management.getSelf(({installType}) => installType === 'normal' && storage.local.get({
        'faqs': true,
        'last-update': 0
      }, prefs => {
        if (reason === 'install' || (prefs.faqs && reason === 'update')) {
          const doUpdate = (Date.now() - prefs['last-update']) / 1000 / 60 / 60 / 24 > 45;
          if (doUpdate && previousVersion !== version) {
            tabs.create({
              url: page + '?version=' + version + (previousVersion ? '&p=' + previousVersion : '') + '&type=' + reason,
              active: reason === 'install'
            });
            storage.local.set({'last-update': Date.now()});
          }
        }
      }));
    });
    setUninstallURL(page + '?rd=feedback&name=' + encodeURIComponent(name) + '&version=' + version);
  }
}
