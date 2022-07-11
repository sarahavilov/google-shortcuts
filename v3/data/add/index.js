document.querySelector('form').onsubmit = e => {
  e.preventDefault();

  chrome.storage.local.get({
    products: {},
    tops: [
      'music', 'news', 'book', 'groups', 'search', 'youtube', 'maps', 'play', 'gmail', 'calender',
      'drive', 'shopping', 'keep', 'translate', 'print', 'alerts', 'analytics', 'duo'
    ]
  }, prefs => {
    const save = icon => {
      const name = (Math.random() + 1).toString(36).substring(7);
      prefs.products[name] = {
        desc: document.getElementById('title').value,
        href: document.getElementById('href').value,
        icon
      };
      prefs.tops.unshift(name);
      chrome.storage.local.set(prefs, () => window.close());
    };

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        if (img.width <= 64 && img.height <= 64) {
          save(reader.result);
        }
        else {
          // resize
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const oc = document.createElement('canvas');
          const octx = oc.getContext('2d');

          canvas.width = 64; // destination canvas size
          canvas.height = canvas.width * img.height / img.width;

          oc.width = img.width;
          oc.height = img.height;
          octx.drawImage(img, 0, 0, img.width, img.height);

          ctx.drawImage(oc, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

          document.body.appendChild(canvas);
          document.body.appendChild(oc);

          save(canvas.toDataURL());
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(document.getElementById('file').files[0]);
  });
};


const products = document.getElementById('products');
const form = products.closest('form');

chrome.storage.local.get({
  products: {}
}, prefs => {
  for (const [key, o] of Object.entries(prefs.products)) {
    const input = document.createElement('input');
    input.id = key;
    input.type = 'checkbox';
    const label = document.createElement('label');
    label.textContent = o.desc + '->' + o.href;
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
