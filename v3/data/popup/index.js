/* global Sortable */

const TOPS = [
  'music', 'news', 'book', 'groups', 'search', 'youtube', 'maps', 'play', 'gmail', 'calender',
  'drive', 'shopping', 'keep', 'translate', 'print', 'alerts', 'analytics', 'duo'
];

const e = {
  top: document.getElementById('top'),
  bottom: document.getElementById('bottom'),
  toast: document.getElementById('toast'),
  cols: document.getElementById('cols'),
  size: document.getElementById('size')
};

const save = () => {
  storage.set({
    tops: [...e.top.querySelectorAll('.entry')].map(e => e.name),
    bottoms: [...e.bottom.querySelectorAll('.entry')].map(e => e.name)
  });
};

const storage = {
  get: o => new Promise(resolve => chrome.storage.local.get(o, resolve)),
  set(ps) {
    chrome.storage.local.set(ps);
  }
};
const build = async () => {
  const prefs = await storage.get({
    products: {},
    tops: TOPS,
    bottoms: []
  });

  if (prefs.tops.length === 0) {
    prefs.tops.push(...TOPS);
  }

  Object.assign(prefs.products, await fetch('products.json').then(r => r.json()));

  const ftop = document.createDocumentFragment();
  for (const key of prefs.tops) {
    const div = document.createElement('div');
    div.classList.add('entry');
    const src = prefs.products[key].icon || 'icons/' + key + '.png';
    div.style['background-image'] = `url("${src}")`;
    div.name = key;
    div.title = prefs.products[key].desc;
    div.href = prefs.products[key].href;
    if (!div.href) {
      div.classList.add('disabled');
    }
    ftop.appendChild(div);
  }
  e.top.appendChild(ftop);
  Sortable.create(e.top, {
    group: 'items',
    animation: 100,
    onChange() {
      clearTimeout(save.id);
      setTimeout(save, 100);
    }
  });

  //
  const keys = [
    ...prefs.bottoms,
    ...Object.keys(prefs.products)
  ].filter(a => prefs.tops.indexOf(a) === -1).filter((s, i, l) => l.indexOf(s) === i);
  const fbottom = document.createDocumentFragment();
  for (const key of keys) {
    if (prefs.tops.indexOf(key) === -1) {
      const div = document.createElement('div');
      div.classList.add('entry');
      const src = prefs.products[key].icon || 'icons/' + key + '.png';
      div.style['background-image'] = `url("${src}")`;
      div.name = key;
      div.title = prefs.products[key].desc;
      div.title = prefs.products[key].desc;
      div.href = prefs.products[key].href;
      if (!div.href) {
        div.classList.add('disabled');
      }
      fbottom.appendChild(div);
    }
  }
  e.bottom.appendChild(fbottom);
  Sortable.create(e.bottom, {
    group: 'items',
    animation: 100,
    onChange() {
      clearTimeout(save.id);
      setTimeout(save, 100);
    }
  });
};

const start = () => storage.get({
  cols: 14,
  size: 32
}).then(prefs => {
  e.top.style['grid-template-columns'] = `repeat(${prefs.cols}, min-content)`;
  e.bottom.style['grid-template-columns'] = `repeat(${prefs.cols}, min-content)`;
  document.documentElement.style.setProperty('--size', prefs.size + 'px');
  e.cols.value = prefs.cols;
  e.size.value = prefs.size;

  document.body.style.width = (prefs.cols * (prefs.size + 10)) + 'px';
});

start().then(build);
chrome.storage.onChanged.addListener(ps => {
  if (ps.size) {
    document.documentElement.style.setProperty('--size', ps.size.newValue + 'px');
  }
  if (ps.cols) {
    e.top.style['grid-template-columns'] = `repeat(${ps.cols.newValue}, min-content)`;
    e.bottom.style['grid-template-columns'] = `repeat(${ps.cols.newValue}, min-content)`;
  }
});

document.getElementById('down').onclick = () => {
  document.body.dataset.expand = document.body.dataset.expand === 'false';
};

document.getElementById('faqs').onclick = () => {
  chrome.tabs.create({
    url: chrome.runtime.getManifest().homepage_url
  });
};

document.getElementById('options').onclick = () => {
  document.body.dataset.settings = document.body.dataset.settings === 'false';
};

document.getElementById('reset').onclick = () => {
  if (confirm('This will remove all custom icons. Are you sure?')) {
    localStorage.clear();
    chrome.storage.local.clear(() => {
      chrome.runtime.reload();
      window.close();
    });
  }
};

document.getElementById('add').onclick = async () => {
  const win = await chrome.windows.getCurrent();
  chrome.windows.create({
    url: '/data/add/index.html',
    width: 600,
    height: 300,
    left: win.left + Math.round((win.width - 600) / 2),
    top: win.top + Math.round((win.height - 300) / 2),
    type: 'popup'
  });
};

document.addEventListener('mouseover', ({target}) => {
  const title = target.title;
  e.toast.textContent = title || '...';
});

document.getElementById('size').onchange = ({target}) => {
  const size = Math.min(64, Math.max(16, Number(target.value)));
  let cols = Number(document.getElementById('cols').value);

  while (true) {
    const width = (size + 10) * cols;

    if (width < 800) {
      break;
    }
    cols -= 1;
  }
  document.getElementById('cols').value = cols;
  document.body.style.width = (cols * (size + 10)) + 'px';

  storage.set({
    size,
    cols
  });
};

document.getElementById('cols').onchange = ({target}) => {
  const cols = Math.min(24, Math.max(8, Number(target.value)));
  let size = Number(document.getElementById('size').value);

  while (true) {
    const width = (size + 10) * cols;

    if (width < 800) {
      break;
    }
    size -= 1;
  }

  document.getElementById('size').value = size;
  document.body.style.width = (cols * (size + 10)) + 'px';

  storage.set({
    size,
    cols
  });
};

// open
document.addEventListener('click', async e => {
  const href = e.target.href;

  if (href) {
    if (e.shiftKey) {
      chrome.windows.create({
        url: href
      });
    }
    else {
      const tab = (await chrome.tabs.query({
        currentWindow: true,
        active: true
      })).shift();

      chrome.tabs.create({
        url: href,
        index: tab.index + 1,
        active: e.metaKey === false && e.ctrlKey === false
      });
    }
  }
});
