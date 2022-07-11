var height_1 = 0, height_2 = 0, width = 0, iconPadding = 10;
var Titles = {}, total_drag = false, isDraging = false, toggle = true;
var mainTypes, iconSize, popupWidth, closePanel, panelColor, fontColor, backupTypes;

var background = (function () {
  var _tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in _tmp) {
      if (_tmp[id] && (typeof _tmp[id] === "function")) {
        if (request.path === 'background-to-popup') {
          if (request.method === id) _tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {_tmp[id] = callback},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": 'popup-to-background', "method": id, "data": data})}
  }
})();

Titles['alerts'] = 'Google Alerts';                   Titles['analytics'] = 'Google Analytics';
Titles['blog'] = 'Google Blog Search';                Titles['blogger'] = 'Google Blogger';
Titles['book'] = 'Google Book Search';                Titles['calender'] = 'Google Calendar';
Titles['code'] = 'Google Code';                       Titles['dashboard'] = 'Google Dashboard';
Titles['drive'] = 'Google Drive';                     Titles['earth'] = 'Google Earth';
Titles['finance'] = 'Google Finance';                 Titles['gmail'] = 'Google Mail';
Titles['groups'] = 'Google Groups';                   Titles['image'] = 'Google Image';
Titles['maps'] = 'Google Maps';                       Titles['mobile'] = 'Google Mobile';
Titles['music'] = 'Google Music';                     Titles['news'] = 'Google News';
Titles['note'] = 'Google Keep';                       Titles['panoramio'] = 'Panoramio';
Titles['picasa'] = 'Picasa (Google Photos)';          Titles['play'] = 'Google Play';
Titles['plus'] = 'Google+';                           Titles['print'] = 'Google Cloud Print';
Titles['scholar'] = 'Google Scholar';                 Titles['search'] = 'Google Web Search';
Titles['site'] = 'Google Sites';                      Titles['sketchup'] = 'SketchUp | 3D for Everyone';
Titles['hangouts'] = 'Google Hangouts';               Titles['translate'] = 'Google Translate';
Titles['trends'] = 'Google Trends';                   Titles['wallet'] = 'Google Wallet';
Titles['youtube'] = 'YouTube';                        Titles['shopping'] = 'Google Shopping';
Titles['patent'] = 'Google Patent Search';            Titles['hotel'] = 'Google Hotel Finder';
Titles['android'] = 'Android';                        Titles['wdyl'] = 'Google Home (Beta)';
Titles['bookmarks'] = 'Google Bookmarks';             Titles['webpagetest'] = 'Google Webpage Test';
Titles['cloudeplatform'] = 'Google Cloude Platform';  Titles['transit'] = 'Google Transit';
Titles['feedburner'] = 'Google Feedburner';           Titles['sky'] = 'Google Sky';
Titles['fusion'] = 'Google Fusion Tables';            Titles['mars'] = 'Google Mars';
Titles['offers'] = 'Google Offers';                   Titles['ideas'] = 'Google Ideas';
Titles['urlshortner'] = 'Google URL Shortner';        Titles['inputtool'] = 'Google Input Tool';
Titles['webhistory'] = 'Google Web History';          Titles['developersdashboard'] = 'Google Developement Dash';
Titles['webmaster'] = 'Google Webmaster';             Titles['currents'] = 'Google Currents';
Titles['chromebook'] = 'Google Chromebook';           Titles['correlate'] = 'Google Correlate';
Titles['chromium'] = 'Chromium';                      Titles['contacts'] = 'Google Contacts';
Titles['adsense'] = 'Google Adsense';
Titles['video'] = 'Google Videos';                    Titles['voice'] = 'Google Voice';
Titles['catalogs'] = 'Google Catalogs';               Titles['authenticator'] = 'Google Authenticator';
Titles['business'] = 'Google Business';               Titles['computeengine'] = 'Google Compute Engine';
Titles['coordinate'] = 'Google Maps Coordinate';      Titles['earthengine'] = 'Google Earth Engine';
Titles['fonts'] = 'Google Fonts';                     Titles['forms'] = 'Google Forms';
Titles['glass'] = 'Google Glass';                     Titles['goggles'] = 'Google Goggles';
Titles['help'] = 'Google Help';                       Titles['partnerdash'] = 'Google Partnerdash';
Titles['photos'] = 'Google Photos';                   Titles['local'] = 'Google Local';
Titles['presentation'] = 'Google Presentation';       Titles['script'] = 'Google App Script';
Titles['streetview'] = 'Google Street View';          Titles['sync'] = 'Google Sync';
Titles['tagmanager'] = 'Google Tag Manager';          Titles['tasks'] = 'Google Tasks';
Titles['webstore'] = 'Chrome Web Store';              Titles['mapsengine'] = 'Google Maps Engine';
Titles['chrome'] = 'Google Chrome';                   Titles['encrypted'] = 'Encrypted Google';
Titles['sheets'] = 'Google Sheets';                   Titles['privacy'] = 'Google Privacy Checkup';
Titles['admin'] = 'Google Admin';                     Titles['apps'] = 'Google Apps for Work';
Titles['flights'] = 'Google Flights';                 Titles['domains'] = 'Google Domains';
Titles['security'] = 'Google Security Checkup';       Titles['docs'] = 'Google Docs';
Titles['drawings'] = 'Google Drawings';               Titles['inbox'] = 'Inbox by Gmail';
Titles['support'] = 'Google Support';                 Titles['account'] = 'Google My Account';
Titles['admob'] = 'Google AdMob';                     Titles['store'] = 'Google Store';
Titles['allo'] = 'Google Allo';                       Titles['duo'] = 'Google Duo';
Titles['express'] = 'Google Express';                 Titles['classroom'] = 'Google Classroom';
Titles['hub'] = 'Google OnHub';                       Titles['fi'] = 'Google Fi';
Titles['tiltbrush'] = 'Tilt Brush';                   Titles['tango'] = 'Google Tango';
Titles['tango'] = 'Zagat';
Titles['ymusic'] = 'YouTube Music';                   Titles['movies'] = 'Google Play Movies';
Titles['chromecast'] = 'Chromecast';                  Titles['cast'] = 'Google Cast';
Titles['messages'] = 'Messages';                      Titles['duo'] = 'Google Duo';
Titles['chat'] = 'Google Chat';                       Titles['keep'] = 'Keep';
Titles['agenda'] = 'agenda';                          Titles['ads'] = 'Google Ads';
Titles['auto'] = 'Android Auto';                      Titles['cardboard'] = 'Cardboard';
Titles['gboard'] = 'Gboard';                          Titles['assistant'] = 'Google Assistant';
Titles['fit'] = 'Google Fit';                         Titles['meet'] = 'Google Meet';
Titles['one'] = 'Google One';                         Titles['games'] = 'Google Play Games';
Titles['transcript'] = 'Google Transcript';           Titles['wifi'] = 'Google Wifi';
Titles['podcast'] = 'Podcasts';                       Titles['stages'] = 'Stages';
Titles['waze'] = 'Waze';                              Titles['ykids'] = 'YouTube Kids';
Titles['ytv'] = 'YouTube TV';                         Titles['expeditions'] = 'Google Expeditions';
Titles[''] = '';                                      Titles['emptyCell'] = '';

var init = function (data, name) {
  var id_pref, count = 0;
  if (name === 'backup-table') id_pref = 'b';
  if (name === 'shortcuts-table') id_pref = 'm';
  var nc = parseInt(document.getElementById('panel-size-input').value);
  var table = document.getElementById(name);
  var trs = table.getElementsByTagName('tr');
  document.body.style.color = fontColor;
  document.body.style.backgroundColor = '#' + panelColor;
  /*  */
  if (fontColor === '#444444') {
    document.getElementById('more-td').setAttribute('type', 'black');
    document.getElementById('support-td').setAttribute('type', 'black');
    document.getElementById('settings-td').setAttribute('type', 'black');
  } else {
    document.getElementById('more-td').setAttribute('type', 'white');
    document.getElementById('support-td').setAttribute('type', 'white');
    document.getElementById('settings-td').setAttribute('type', 'white');
  }
  /*  */
  var inputs = document.getElementsByTagName('input');
  for (var i = 0; i < inputs.length; i++) inputs[i].style.color = fontColor;
  for (var i = 0; i < trs.length; i++) {
    var tds = trs[i].getElementsByTagName('td');
    for (var k = 0; k < tds.length; k++) {
      tds[k].draggable = false;
      tds[k].removeAttribute('id');
      tds[k].removeAttribute('type');
      tds[k].removeAttribute('title');
      tds[k].setAttribute('status', 'empty');
    }
  }
  /*  */
  for (var i = 0; i < trs.length; i++) {
    var tds = trs[i].getElementsByTagName('td');
    for (var j = 0; j < nc; j++) {
      var id = id_pref + count.toString();
      var td = tds[j];
      td.setAttribute('id', id);
      if (count < data.length && data[count]) {
        td.draggable = true;
        td.removeAttribute('status');
        td.setAttribute('type', data[count]);
        td.setAttribute('title', Titles[data[count]]);
        var wIC = parseInt(document.getElementById('icon-size-input').value) + "px";
        var wTD = parseInt(document.getElementById('icon-size-input').value) + iconPadding + "px";
        td.style.width = wTD;
        td.style.height = wTD;
        td.style.minWidth = wTD;
        td.style.maxWidth = wTD;
        td.style.minHeight = wTD;
        td.style.maxHeight = wTD;
        td.style.backgroundSize = wIC;
      }
      count++;
    }
  }
  /*  */
  var width = nc * (parseInt(document.getElementById('icon-size-input').value) + iconPadding);
  var height_1 = document.getElementById('shortcuts-table').getBoundingClientRect().height;
  var height_2 = document.getElementById('separator-table').getBoundingClientRect().height;
  var height_3 = document.getElementById('backup-table').getBoundingClientRect().height;
  var height_4 = document.getElementById('settings-div').getBoundingClientRect().height;
  var height_5 = document.getElementById('status-div').getBoundingClientRect().height;
  var height = height_1 + height_2 + height_3 + height_4 + height_5 + 22;
  /*  */
  document.body.style.width = width + 'px';
  document.body.style.height = height + 'px';
  document.documentElement.style.width = width + 'px';
  document.documentElement.style.height = height + 'px';
};

var initAll = function () {
  init(mainTypes, 'shortcuts-table');
  init(backupTypes, 'backup-table');
};

var showMore = function (e) {
  if (toggle) {
    toggle = false;
    total_drag = true;
    e.target.setAttribute('status', 'active');
    document.getElementById('backup-table').style.display = 'table';
    e.target.setAttribute("title", "Click to collapse hidden section");
    document.getElementById('separator-table').style.display = 'table';
  } else {
    toggle = true;
    total_drag = false;
    e.target.removeAttribute('status');
    e.target.setAttribute("title", "Click to see all products");
    document.getElementById('backup-table').style.display = 'none';
    document.getElementById('separator-table').style.display = 'none';
  }
  /*  */
  initAll();
};

var onMouseup = function (e) {
  if (isDraging) return;
  var type = e.target.getAttribute('type');
  if (type) {
    var hide = (e.ctrlKey && e.button === 0) || (e.metaKey && e.button === 0) || e.button == 1;
    background.send('open-tab-request', {"type": type, "hide": hide});
    if (closePanel === 'close') window.close();
  }
};

var load = function () {
  document.getElementById('settings-td').addEventListener('click', function (e) {
    var table = document.getElementById('settings-table');
    var display = table.style.display;
    table.style.display = !display || display === "none" ? "block" : "none";
    /*  */
    initAll();
  });
  /*  */
  document.getElementById('close-panel').addEventListener('click', function (e) {
    var st = e.target.getAttribute('state');
    console.log(st, e.target);
    st = st === 'close' ? '' : 'close';
    closePanel = st;
    e.target.setAttribute('state', st);
    background.send('store-close-panel', st);
  });
  /*  */
  document.getElementById('panel-size-input').addEventListener('change', function (e) {
    var nc = parseInt(e.target.value) || 10;
    e.target.value = nc;
    popupWidth = nc;
    background.send('store-popup-width', nc);
    /*  */
    initAll();
  });
  /*  */
  document.getElementById('icon-size-input').addEventListener('change', function (e) {
    var is = parseInt(e.target.value) || 32;
    e.target.value = is;
    iconSize = is;
    background.send('store-icon-size', is);
    /*  */
    initAll();
  });
  /*  */
  document.getElementById('panel-color-input').addEventListener('change', function (e) {
    var pc = e.target.value || 'FFFFFF';
    e.target.value = pc;
    panelColor = pc;
    fontColor = window.getComputedStyle(e.target).color;
    var font = fontColor === 'rgb(0, 0, 0)' || fontColor === '000000' || fontColor === '#000000' || fontColor === '000' || fontColor === '#000' || fontColor === 'black';
    fontColor = font ? '#444444' : '#FFFFFF';
    background.send('store-panel-color', pc);
    background.send('store-font-color', fontColor);
    /*  */
    initAll();
  });
  /*  */
  background.send('request-inits');
  window.removeEventListener("load", load, false);
  document.getElementById('more-td').addEventListener('click', showMore, false);
  document.getElementById('backup-table').addEventListener('mouseup', onMouseup, false);
  document.getElementById('shortcuts-table').addEventListener('mouseup', onMouseup, false);
  document.getElementById('support-td').addEventListener('click', function () {background.send("support")});
  document.getElementById('backup-table').addEventListener("click", function (e) {e.preventDefault()}, true);
  document.getElementById('shortcuts-table').addEventListener("click", function (e) {e.preventDefault()}, true);
  document.getElementById('reset-button').addEventListener('click', function (e) {
    mscConfirm("Reset", "Are you sure you want to reset the addon to factory settings?", function () {
      background.send('reset-history');
    });
  });
  /*  */
  (function () {
    var tds = document.querySelectorAll('td');
    var resetInformation = function (e) {document.getElementById('status-td').textContent = 'Shortcuts for Google™ Products'};
    var updateInformation = function (e) {document.getElementById('status-td').textContent = e.target.getAttribute('title') || 'Shortcuts for Google™ Products'};
    for (var i = 0; i < tds.length; i++) {
      tds[i].addEventListener("mouseleave", resetInformation, false);
      tds[i].addEventListener("mouseenter", updateInformation, false);
    }
  })();
};

background.receive('request-inits', function (data) {
  iconSize = data.iconSize;
  mainTypes = data.mainTypes;
  fontColor = data.fontColor;
  popupWidth = data.popupWidth;
  closePanel = data.closePanel;
  panelColor = data.panelColor;
  backupTypes = data.backupTypes;
  /*  */
  document.getElementById('icon-size-input').value = iconSize;
  document.getElementById('panel-size-input').value = popupWidth;
  document.getElementById('panel-color-input').value = panelColor;
  document.getElementById('close-panel').setAttribute('state', closePanel);
  /*  */
  initAll();
});

window.addEventListener("load", load, false);
