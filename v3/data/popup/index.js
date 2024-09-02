/* global Sortable, FuzzySet */

const TOPS = [
  'music', 'news', 'book', 'groups', 'search', 'youtube', 'maps', 'play', 'gmail', 'calender',
  'drive', 'shopping', 'keep', 'translate', 'print', 'alerts', 'analytics', 'duo'
];

const e = {
  top: document.getElementById('top'),
  bottom: document.getElementById('bottom'),
  toast: document.getElementById('toast'),
  cols: document.getElementById('cols'),
  size: document.getElementById('size'),
  search: document.getElementById('search')
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
  const entries = new Map();
  const search = new FuzzySet();
  search.useLevenshtein = false;

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
    if (key in prefs.products) {
      const div = document.createElement('div');
      div.classList.add('entry');
      div.setAttribute('tabindex', '0');
      div.setAttribute('role', 'button');
      const src = prefs.products[key].icon || 'icons/' + key + '.png';
      div.style['background-image'] = `url("${src}")`;
      div.name = key;
      div.title = prefs.products[key].desc;
      div.href = prefs.products[key].href;
      if (!div.href) {
        div.classList.add('disabled');
      }
      ftop.appendChild(div);

      const q = div.title + ' ' + key;
      search.add(q);
      entries.set(q, div);
    }
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
  ].filter((s, i, l) => l.indexOf(s) === i);

  const fbottom = document.createDocumentFragment();
  for (const key of keys) {
    if (prefs.tops.includes(key) === false && key in prefs.products) {
      const div = document.createElement('div');
      div.classList.add('entry');
      div.setAttribute('tabindex', '0');
      div.setAttribute('role', 'button');
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

      const q = div.title + ' ' + key;
      search.add(q);
      entries.set(q, div);
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

  build.search = q => {
    const results = search.get(q, undefined, 0.01) || [];

    const r = results.map(a => {
      const div = entries.get(a[1]);

      return {
        item: {
          title: div.title,
          div
        },
        score: a[0]
      };
    });

    const score = Math.max(...results.map(a => a[0]));

    return {
      score,
      top: r.filter(o => o.item.div.closest('#top')),
      bottom: r.filter(o => !o.item.div.closest('#top'))
    };
  };
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
  e.search.value = '';
  e.search.dispatchEvent(new Event('input'));

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

{
  const change = ({target}) => {
    const title = target.title;
    e.toast.textContent = title || '...';
  };
  document.addEventListener('mouseover', change);
  document.addEventListener('focusin', change);
}

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

      const active = e.metaKey === false && e.ctrlKey === false;
      chrome.tabs.create({
        url: href,
        index: tab.index + 1,
        active
      }, () => {
        if (active) {
          window.close();
        }
      });
    }
  }
});
document.addEventListener('keydown', e => {
  if (e.code === 'Enter' || e.key === 'Enter') {
    e.preventDefault();
    e.stopPropagation();

    let entry;
    if (document.activeElement?.classList?.contains('entry')) {
      entry = document.activeElement;
    }
    entry = entry ||
      document.querySelector('.entry.search.highest') ||
      document.querySelector('.entry.search') ||
      document.querySelector('.entry');

    if (entry) {
      const ne = new MouseEvent('click', e);
      entry.dispatchEvent(ne);
    }
  }
});

// search
const search = {
  build(top, bottom, score) {
    search.clear();

    let highScoreInBottom = false;
    let set = false;

    for (const entry of top) {
      entry.item.div.classList.add('search');
      if (entry.score === score && !set) {
        entry.item.div.classList.add('highest');
        if (!set) {
          set = true;
          e.toast.textContent = entry.item.title;
        }
      }
    }
    for (const entry of bottom) {
      entry.item.div.classList.add('search');
      if (entry.score === score && !set) {
        entry.item.div.classList.add('highest');
        highScoreInBottom = true;
        set = true;
        e.toast.textContent = entry.item.title;
      }
    }

    const expand = (bottom.length && top.length < 5) || highScoreInBottom;
    document.body.classList[expand ? 'add' : 'remove']('sexpand');
  },
  clear() {
    for (const e of document.querySelectorAll('.entry.search')) {
      e.classList.remove('search');
      e.classList.remove('highest');
    }
  }
};

e.search.addEventListener('input', e => {
  const v = e.target.value;

  e.target.classList.remove('error');
  if (v) {
    document.body.classList.add('search');
    const {top, bottom, score} = build.search(v);

    if (top.length || bottom.length) {
      return search.build(top, bottom, score);
    }
    else {
      e.target.classList.add('error');
    }
  }
  document.body.classList.remove('search');
  search.clear();
});
document.addEventListener('keydown', ev => {
  const meta = ev.metaKey || ev.ctrlKey;
  if (ev.code === 'KeyF' && meta) {
    ev.preventDefault();
    ev.stopPropagation();
    e.search.focus();
  }
  else if (ev.code === 'KeyE' && meta) {
    ev.preventDefault();
    ev.stopPropagation();
    document.getElementById('down').click();
  }
  else if (ev.code === 'KeyO' && meta) {
    ev.preventDefault();
    ev.stopPropagation();
    document.getElementById('options').click();
  }
});
