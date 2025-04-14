chrome.storage.local.get({
  'user-style': ''
}, prefs => {
  document.getElementById('user-style').value = prefs['user-style'];
});

document.getElementById('save').onclick = () => chrome.storage.local.set({
  'user-style': document.getElementById('user-style').value
}, () => {
  const toast = document.getElementById('toast');
  toast.textContent = 'Options saved';
  setTimeout(() => toast.textContent = '', 750);
});

// support
document.getElementById('support').addEventListener('click', () => chrome.tabs.create({
  url: chrome.runtime.getManifest().homepage_url + '?rd=donate'
}));
