const Storage = (() => {
  const STORE_KEY = 'startab_data_v3_edge';
  const LEGACY_KEYS = ['startab_data_v2', 'startab_data'];

  const DEFAULT_CARDS = [];


  const DEFAULT_DATA = {
    version: 3,
    panels: [
      {
        id: 'panel_default',
        name: '主页',
        cards: []
      }
    ],
    activePanelIndex: 0,
    collectionBox: [],
    recentLinks: [],
    auth: {
      apiBase: '',
      token: '',
      user: null,
      lastLoginAt: 0
    },
    memos: [
      {
        id: 'memo_default',
        title: 'iTab操作小技巧',
        content: '1. 切换搜索引擎：点击搜索框左侧图标可快速切换搜索引擎\n2. 快速翻译：点击搜索框联想列表第一项可快速翻译文本\n3. 右键菜单：在桌面空白处点击右键可快速添加图标、切换壁纸、设置、备份等操作\n4. 极简模式：点击标签页时间快速切换到极简模式\n5. 动态壁纸：点击【壁纸】打开壁纸应用，选择壁纸',
        completed: false,
        createdAt: '2026-06-21T02:54:00.000Z',
        updatedAt: '2026-06-21T02:54:00.000Z'
      }
    ],
    localBackup: null,
    settings: {
      theme: 'dark',
      pageWidth: '1200px',
      searchEngine: 'baidu',
      searchNewWindow: true,
      linkNewWindow: true,
      singleLine: true,
      linkNote: 'none',
      dblClick: 'none',
      addPos: 'bottom',
      autoFocus: true,
      memoDockPosition: 'top',
      memoDockHeight: 520,
      memoDockWidth: 420,
      memoDockX: 76,
      memoDockY: 96,
      memoDockCollapsed: false,
      memoDockActiveId: '',
      memoDockLastSide: 'left',
      collectionMode: 'cards',
      themeColor: '#1d74ff',
      wallpaper: '',
      wallpaperMask: 0,
      wallpaperBlur: 0,
      wallpaperAutoSwitch: 'none',
      wallpaperAutoChangedAt: 0,
      wallpaperButton: false,
      sidebarPosition: 'left',
      sidebarAutoHide: false,
      sidebarRememberPanel: true,
      sidebarWheelSwitch: true,
      sidebarOpacity: 0.92,
      sidebarWidth: 48,
      desktopIconSize: 58,
      desktopIconBgColor: '#ffffff',
      desktopIconBgOpacity: 0.96,
      desktopShortcutWidth: 72,
      desktopShortcutHeight: 72,
      desktopFolderWidth: 72,
      desktopFolderHeight: 72,
      desktopFolderBgOpacity: 0.74,
      desktopIconRadius: 18,
      desktopIconOpacity: 1,
      desktopIconGap: 14,
      desktopIconShowName: true,
      desktopIconFontSize: 12,
      desktopIconLabelColor: '',
      desktopIconMaxWidth: 1350
    }
  };

  const clone = value => JSON.parse(JSON.stringify(value));

  function hasChromeStorage() {
    return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
  }

  function getLocal() {
    return new Promise(resolve => {
      if (hasChromeStorage()) {
        chrome.storage.local.get([STORE_KEY, ...LEGACY_KEYS], result => {
          resolve(result[STORE_KEY] || LEGACY_KEYS.map(key => result[key]).find(Boolean) || null);
        });
        return;
      }
      try {
        const raw = localStorage.getItem(STORE_KEY) || LEGACY_KEYS.map(key => localStorage.getItem(key)).find(Boolean);
        resolve(raw ? JSON.parse(raw) : null);
      } catch (error) {
        resolve(null);
      }
    });
  }

  function setLocal(data) {
    return new Promise(resolve => {
      if (hasChromeStorage()) {
        chrome.storage.local.set({ [STORE_KEY]: data }, resolve);
        return;
      }
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
      resolve();
    });
  }

  function normalize(data) {
    const base = clone(DEFAULT_DATA);
    const merged = deepMerge(base, data || {});
    if (!Array.isArray(merged.panels) || merged.panels.length === 0) merged.panels = clone(DEFAULT_DATA.panels);
    merged.panels.forEach(panel => {
      if (!panel.id) panel.id = generateId('panel_');
      if (!panel.name) panel.name = '未命名面板';
      if (!Array.isArray(panel.cards)) panel.cards = [];
      delete panel.widgets;
      panel.cards.forEach(card => {
        if (!card.id) card.id = generateId('card_');
        if (!Array.isArray(card.bookmarks)) card.bookmarks = [];
      });
    });
    if (!Array.isArray(merged.collectionBox)) merged.collectionBox = [];
    if (!Array.isArray(merged.recentLinks)) merged.recentLinks = [];
    if (!merged.auth || typeof merged.auth !== 'object') merged.auth = clone(DEFAULT_DATA.auth);
    merged.auth = {
      ...clone(DEFAULT_DATA.auth),
      ...merged.auth,
      apiBase: typeof merged.auth.apiBase === 'string' ? merged.auth.apiBase : '',
      token: typeof merged.auth.token === 'string' ? merged.auth.token : '',
      user: merged.auth.user && typeof merged.auth.user === 'object' ? merged.auth.user : null,
      lastLoginAt: Number(merged.auth.lastLoginAt) || 0
    };
    if (!Array.isArray(merged.memos)) merged.memos = [];
    merged.memos.forEach(memo => {
      if (!memo.id) memo.id = generateId('memo_');
      if (!memo.title) memo.title = '未命名备忘录';
      if (typeof memo.content !== 'string') memo.content = '';
      memo.completed = memo.completed === true;
      if (!memo.createdAt) memo.createdAt = new Date().toISOString();
      if (!memo.updatedAt) memo.updatedAt = memo.createdAt;
    });
    if (!merged.localBackup || typeof merged.localBackup !== 'object' || !merged.localBackup.data) {
      merged.localBackup = null;
    }
    if (merged.settings?.pageWidth === '1188px') merged.settings.pageWidth = '1200px';
    merged.activePanelIndex = Math.min(Math.max(merged.activePanelIndex || 0, 0), merged.panels.length - 1);
    return merged;
  }

  async function load() {
    const stored = await getLocal();
    if (!stored) {
      const fresh = clone(DEFAULT_DATA);
      await setLocal(fresh);
      return fresh;
    }
    const data = normalize(stored);
    await setLocal(data);
    return data;
  }

  async function save(data) {
    await setLocal(normalize(data));
  }

  async function reset() {
    const fresh = clone(DEFAULT_DATA);
    await setLocal(fresh);
    return fresh;
  }

  async function exportData() {
    return JSON.stringify(await load(), null, 2);
  }

  async function importData(jsonText) {
    try {
      const imported = normalize(JSON.parse(jsonText));
      await setLocal(imported);
      return { success: true, data: imported };
    } catch (error) {
      return { success: false, error: error.message || 'JSON 格式错误' };
    }
  }

  function deepMerge(target, source) {
    Object.keys(source || {}).forEach(key => {
      const value = source[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        target[key] = deepMerge(target[key] || {}, value);
      } else {
        target[key] = value;
      }
    });
    return target;
  }

  function generateId(prefix = '') {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  return { load, save, reset, exportData, importData, generateId, DEFAULT_DATA, DEFAULT_CARDS };
})();
