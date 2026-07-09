const SearchEngine = (() => {
  const ENGINES = {
    baidu: { name: '百度', mark: 'du', icon: 'https://www.baidu.com/favicon.ico', url: 'https://www.baidu.com/s?wd=' },
    google: { name: 'Google', mark: 'G', icon: 'https://www.google.com/favicon.ico', url: 'https://www.google.com/search?q=' },
    bing: { name: 'Bing', mark: 'B', icon: 'https://www.bing.com/favicon.ico', url: 'https://www.bing.com/search?q=' },
    sogou: { name: '搜狗', mark: 'S', icon: 'https://www.sogou.com/favicon.ico', url: 'https://www.sogou.com/web?query=' }
  };

  let currentEngine = 'baidu';

  function init() {
    const form = document.getElementById('searchForm');
    const input = document.getElementById('searchInput');
    const engineBtn = document.getElementById('engineBtn');
    if (!form || !input) return;

    Storage.load().then(data => {
      currentEngine = data.settings?.searchEngine || 'baidu';
      updateEngineButton();
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      search(input.value.trim());
    });

    engineBtn?.addEventListener('click', () => {
      const keys = Object.keys(ENGINES);
      const next = keys[(keys.indexOf(currentEngine) + 1) % keys.length];
      setEngine(next);
    });
  }

  function getSettings() {
    return typeof window.getSettings === 'function' ? window.getSettings() : {};
  }

  function search(query) {
    if (!query) return;
    const settings = getSettings();
    const url = looksLikeUrl(query)
      ? normalizeUrl(query)
      : (ENGINES[currentEngine] || ENGINES.baidu).url + encodeURIComponent(query);
    if (settings.searchNewWindow !== false) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  }

  function looksLikeUrl(value) {
    if (/\s/.test(value)) return false;
    if (/^https?:\/\//i.test(value)) return true;
    if (/[\u4e00-\u9fa5]/.test(value) && !value.includes('.')) return false;
    return /^([\w-]+\.)+[\w-]{2,}(\/.*)?$/i.test(value);
  }

  function normalizeUrl(value) {
    return /^https?:\/\//i.test(value) ? value : 'https://' + value;
  }

  function setEngine(engine) {
    if (!ENGINES[engine]) return;
    currentEngine = engine;
    updateEngineButton();
    Storage.load().then(data => {
      data.settings.searchEngine = engine;
      Storage.save(data);
      window.dispatchEvent(new CustomEvent('search-engine-change', { detail: { engine } }));
    });
  }

  function updateEngineButton() {
    const engineBtn = document.getElementById('engineBtn');
    const engine = ENGINES[currentEngine] || ENGINES.baidu;
    if (engineBtn) {
      engineBtn.innerHTML = `<span class="engine-mark"><img src="${escapeAttr(engine.icon)}" alt=""></span><span class="engine-name">${engine.name}</span>`;
      engineBtn.title = `当前搜索引擎：${engine.name}，点击切换`;
      engineBtn.dataset.engine = currentEngine;
      engineBtn.querySelector('.engine-mark img')?.addEventListener('error', () => {
        const mark = engineBtn.querySelector('.engine-mark');
        if (mark) mark.textContent = engine.mark;
      });
    }
  }

  function escapeAttr(value) {
    return String(value || '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  return { init, search, setEngine, getEngine: () => currentEngine, ENGINES };
})();
