const params = new URLSearchParams(location.search);
const title = document.getElementById('title');
const href = document.getElementById('href');
const file = document.getElementById('file');
const browse = document.getElementById('browse');
const favicon = document.getElementById('favicon');
const note = document.getElementById('note');

if (params.get('title')) {
  title.value = params.get('title');
}
if (params.get('href')) {
  href.value = params.get('href');
}

const toast = msg => {
  note.textContent = msg;
  clearTimeout(toast.id);
  toast.id = setTimeout(() => {
    note.textContent = '';
  }, 5000);
};

const loadImage = url => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error('failed to load image'));
  img.src = url;
});

const toDataURL = img => {
  const max = 64;
  const canvas = document.createElement('canvas');

  if (img.width <= max && img.height <= max) {
    canvas.width = img.width;
    canvas.height = img.height;
  }
  else {
    canvas.width = max;
    canvas.height = Math.round(max * img.height / img.width);
  }
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL();
};

const fileToDataURL = async blob => {
  const data = await new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
  return toDataURL(await loadImage(data));
};

const genericIcon = () => 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="#9aa0a6" d="M9 0a9 9 0 1 0 0 18A9 9 0 0 0 9 0Zm3.46 11.95c0 1.47-.8 3.3-4.06 4.7c.3-4.17-2.52-3.69-3.2-5A3.25 3.25 0 0 1 7 9.1a8.49 8.49 0 0 1-4.18-2c.05.47.279.904.64 1.21a4.18 4.18 0 0 1-1.94-1.5a7.94 7.94 0 0 1 7.25-5.63c-.84 1.38-1.5 4.13 0 5.57C7.23 7 6.26 5 5.41 5.79c-1.13 1.06.33 2.51 3.42 3.08c3.29.59 3.66 1.58 3.63 3.08Zm1.34-4c-.32-1.11.62-2.23 1.69-3.14a7.27 7.27 0 0 1 .84 6.68c-.77-1.89-2.17-2.32-2.53-3.57v.03Z"></path></svg>`);

let faviconSrc = '';
let faviconGranted = false;

const tryFavicon = async () => {
  faviconSrc = '';
  faviconGranted = false;
  try {
    const contains = await chrome.permissions.contains({permissions: ['favicon']});
    faviconGranted = contains || await chrome.permissions.request({permissions: ['favicon']});
  }
  catch (e) {}

  const h = href.value.trim();
  if (faviconGranted && h) {
    const url = 'chrome-extension://' + chrome.runtime.id + '/_favicon/?pageUrl=' +
      encodeURIComponent(h) + '&size=64';
    try {
      const blob = await fetch(url).then(r => r.blob());
      const objectURL = URL.createObjectURL(blob);
      faviconSrc = toDataURL(await loadImage(objectURL));
      URL.revokeObjectURL(objectURL);
    }
    catch (e) {}
  }
  return faviconSrc;
};

browse.addEventListener('click', () => file.click());

file.addEventListener('change', () => {
  browse.value = file.files[0] ? file.files[0].name : 'Browse...';
});

favicon.addEventListener('change', async () => {
  if (favicon.checked) {
    if (await tryFavicon()) {
      file.disabled = true;
      browse.disabled = true;
      browse.value = 'Using favicon';
    }
    else {
      favicon.checked = false;
      file.disabled = false;
      browse.disabled = false;
      browse.value = file.files[0] ? file.files[0].name : 'Browse...';
      toast('Unable to fetch favicon. Select an icon or a generic icon will be used.');
    }
  }
  else {
    faviconSrc = '';
    file.disabled = false;
    browse.disabled = false;
    browse.value = file.files[0] ? file.files[0].name : 'Browse...';
  }
});

document.querySelector('form').onsubmit = async e => {
  e.preventDefault();

  const prefs = await chrome.storage.local.get({
    products: {},
    tops: [
      'music', 'news', 'book', 'groups', 'search', 'youtube', 'maps', 'play', 'gmail', 'calender',
      'drive', 'shopping', 'keep', 'translate', 'print', 'alerts', 'analytics', 'duo'
    ]
  });
  let icon;
  if (faviconSrc) {
    icon = faviconSrc;
  }
  else if (file.files[0]) {
    icon = await fileToDataURL(file.files[0]);
  }
  else {
    icon = genericIcon();
  }

  const name = (Math.random() + 1).toString(36).substring(7);
  prefs.products[name] = {
    desc: title.value,
    href: href.value,
    icon
  };
  prefs.tops.unshift(name);
  chrome.storage.local.set(prefs, () => window.close());
};

const products = document.querySelector('#products > div');
const form = products.closest('form');

chrome.storage.local.get({
  products: {}
}, prefs => {
  for (const [key, o] of Object.entries(prefs.products)) {
    const input = document.createElement('input');
    input.id = key;
    input.type = 'checkbox';
    const label = document.createElement('label');
    label.textContent = o.desc + ' → ' + o.href;
    label.setAttribute('for', key);

    products.appendChild(input);
    products.appendChild(label);
  }
  products.dispatchEvent(new Event('change'));

  if (Object.keys(prefs.products).length === 0) {
    form.style.display = 'none';
  }
});

products.addEventListener('change', () => {
  form.querySelector('input[type=submit]').disabled = products.querySelector('input:checked') ? false : true;
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const ids = [...products.querySelectorAll('input:checked')].map(e => e.id);

  chrome.storage.local.get({
    products: {},
    tops: [
      'music', 'news', 'book', 'groups', 'search', 'youtube', 'maps', 'play', 'gmail', 'calender',
      'drive', 'shopping', 'keep', 'translate', 'print', 'alerts', 'analytics', 'duo'
    ],
    bottoms: []
  }, prefs => {
    for (const id of ids) {
      delete prefs.products[id];
      const n = prefs.tops.indexOf(id);
      if (n !== -1) {
        prefs.tops.splice(n, 1);
      }
      const m = prefs.bottoms.indexOf(id);
      if (m !== -1) {
        prefs.bottoms.splice(m, 1);
      }
    }
    chrome.storage.local.set(prefs, () => window.close());
  });
});
