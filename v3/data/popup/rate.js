chrome.storage.local.get({
  'rate': true,
  'crate': 0
}, prefs => {
  document.getElementById('rate').dataset.hide = prefs['rate'] === false || prefs.crate < 5 || Math.random() < 0.5;

  if (prefs.crate < 5) {
    prefs.crate += 1;
    chrome.storage.local.set({crate: prefs.crate});
  }
});

document.getElementById('rate').onclick = () => {
  let url = 'https://chrome.google.com/webstore/detail/google-shortcuts/pdlecffodcfabchelafoljcdphfpkpcl/reviews/';
  if (/Edg/.test(navigator.userAgent)) {
    url = 'https://microsoftedge.microsoft.com/addons/detail/lemjjheiicoobcmhaecfecpccjnjmemd';
  }
  else if (/Firefox/.test(navigator.userAgent)) {
    url = 'https://addons.mozilla.org/firefox/addon/google-shortcuts/';
  }
  else if (/OPR/.test(navigator.userAgent)) {
    url = 'https://addons.opera.com/extensions/details/shortcuts-for-googletm-products/';
  }

  chrome.storage.local.set({
    'rate': false
  }, () => chrome.tabs.create({
    url
  }));
};
