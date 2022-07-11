const app = window.app = {};

app.name = function() {
  return chrome.runtime.getManifest().name;
};
app.version = function() {
  return chrome.runtime.getManifest().version;
};
app.homepage = function() {
  return chrome.runtime.getManifest().homepage_url;
};
app.tab = {'open': function(url) {
  chrome.tabs.create({'url': url, 'active': true});
}};

app.storage = (function() {
  let objs = {};
  window.setTimeout(function() {
    chrome.storage.local.get(null, function(o) {
      objs = o;
      const script = document.createElement('script');
      script.src = '../common.js';
      document.body.appendChild(script);
    });
  }, 300);
  /*  */
  return {
    'read': function(id) {
      return objs[id];
    },
    'write': function(id, data, callback) {
      const tmp = {};
      tmp[id] = data;
      objs[id] = data;
      chrome.storage.local.set(tmp, callback);
    }
  };
})();

app.popup = (function() {
  const _tmp = {};
  chrome.runtime.onMessage.addListener(function(request) {
    for (const id in _tmp) {
      if (_tmp[id] && (typeof _tmp[id] === 'function')) {
        if (request.path === 'popup-to-background') {
          if (request.method === id) _tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    'receive': function(id, callback) {
      _tmp[id] = callback;
    },
    'send': function(id, data) {
      chrome.runtime.sendMessage({
        'path': 'background-to-popup',
        'method': id,
        'data': data
      });
    }
  };
})();
