const PanelManager = (() => {
  let appData = null;
  let activePanelIndex = 0;
  let onDataChange = null;

  function init(data, changeCallback) {
    appData = data;
    activePanelIndex = getSettings().sidebarRememberPanel === false ? 0 : (data.activePanelIndex || 0);
    onDataChange = changeCallback;
    renderPanelTabs();
    const addButton = document.getElementById('addPanelBtn');
    if (addButton) addButton.onclick = addPanel;
  }

  function renderPanelTabs() {
    const container = document.getElementById('panelTabsScroll');
    if (!container || !appData) return;
    container.innerHTML = '';
    appData.panels.forEach((panel, index) => {
      const tab = document.createElement('button');
      tab.className = 'panel-tab panel-dock-item' + (index === activePanelIndex ? ' active' : '');
      tab.dataset.index = String(index);
      tab.type = 'button';
      tab.title = panel.name || '未命名面板';
      tab.setAttribute('aria-current', index === activePanelIndex ? 'page' : 'false');
      tab.innerHTML = `
        <span class="panel-dock-icon">${panelIcon(panel.name, index)}</span>
        <span class="panel-dock-label">${escapeHtml(panel.name)}</span>
      `;
      tab.addEventListener('click', event => {
        if (event.target.classList.contains('tab-delete')) {
          event.stopPropagation();
          deletePanel(index);
        } else {
          switchPanel(index);
        }
      });
      container.appendChild(tab);
    });
  }

  function panelIcon(name = '', index = 0) {
    const text = String(name || '').toLowerCase();
    if (index === 0 || /主页|首页|home/.test(text)) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8.5Z"></path></svg>';
    }
    if (/设计|design|ui/.test(text)) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5"></path><path d="M14 5h5v5"></path><path d="M5 14v5h5"></path><path d="M7 7l3 3"></path></svg>';
    }
    if (/ai|智能|gpt|人工/.test(text)) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4"></path><path d="M8.5 8.5 6 6M15.5 8.5 18 6M8.5 15.5 6 18M15.5 15.5 18 18"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    }
    if (/产品|product/.test(text)) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="M12 8v4l3 2"></path></svg>';
    }
    if (/工具|tool/.test(text)) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5a4 4 0 0 0 4 4L9 19l-4-4 9.5-9.5Z"></path><path d="m5 15 4 4"></path></svg>';
    }
    const initial = escapeHtml(String(name || '?').trim().charAt(0).toUpperCase() || '?');
    return `<span class="panel-dock-initial">${initial}</span>`;
  }

  function switchPanel(index) {
    if (!appData || index === activePanelIndex || !appData.panels[index]) return;
    activePanelIndex = index;
    if (getSettings().sidebarRememberPanel !== false) appData.activePanelIndex = index;
    renderPanelTabs();
    saveAndNotify(true);
  }

  function addPanel() {
    const name = prompt('请输入新面板名称：', '新面板');
    if (!name || !name.trim()) return;
    appData.panels.push({
      id: Storage.generateId('panel_'),
      name: name.trim(),
      cards: []
    });
    activePanelIndex = appData.panels.length - 1;
    appData.activePanelIndex = activePanelIndex;
    renderPanelTabs();
    saveAndNotify(true);
  }

  function deletePanel(index) {
    if (appData.panels.length <= 1) {
      toast('至少保留一个面板');
      return;
    }
    if (!confirm(`确定删除面板“${appData.panels[index].name}”吗？`)) return;
    appData.panels.splice(index, 1);
    activePanelIndex = Math.min(activePanelIndex, appData.panels.length - 1);
    appData.activePanelIndex = activePanelIndex;
    renderPanelTabs();
    saveAndNotify(true);
  }

  function getActivePanel() {
    return appData.panels[activePanelIndex] || appData.panels[0];
  }

  function addCard(name, bookmarks, style) {
    const panel = getActivePanel();
    const card = { id: Storage.generateId('card_'), name, bookmarks: bookmarks || [], collapsed: false, style: style || {} };
    panel.cards.push(card);
    saveAndNotify(true);
    return card;
  }

  function addCardAtColumn(name, columnIndex, columnCount) {
    const panel = getActivePanel();
    const count = Math.max(1, Number(columnCount) || 1);
    const targetColumn = Math.max(0, Math.min(Number(columnIndex) || 0, count - 1));
    const card = { id: Storage.generateId('card_'), name, bookmarks: [], collapsed: false, column: targetColumn };
    let insertAt = panel.cards.length;
    for (let index = 0; index <= panel.cards.length; index++) {
      if (index % count === targetColumn) insertAt = index;
    }
    panel.cards.splice(insertAt, 0, card);
    saveAndNotify(true);
    return card;
  }

  function editCard(cardId, name, bookmarks, style) {
    const card = findCard(cardId);
    if (!card) return;
    card.name = name;
    card.bookmarks = bookmarks || [];
    card.style = style || {};
    saveAndNotify(true);
  }

  function deleteCard(cardId) {
    const panel = getActivePanel();
    const index = panel.cards.findIndex(card => card.id === cardId);
    if (index < 0) return;
    if (!confirm(`确定删除模块“${panel.cards[index].name}”吗？`)) return;
    panel.cards.splice(index, 1);
    saveAndNotify(true);
  }

  function toggleCard(cardId) {
    const card = findCard(cardId);
    if (!card) return;
    card.collapsed = !card.collapsed;
    saveAndNotify(true);
  }

  function reorderCards(fromId, toId) {
    const panel = getActivePanel();
    const from = panel.cards.findIndex(card => card.id === fromId);
    const to = panel.cards.findIndex(card => card.id === toId);
    if (from < 0 || to < 0 || from === to) return;
    const targetColumn = panel.cards[to]?.column;
    const [moved] = panel.cards.splice(from, 1);
    if (Number.isInteger(targetColumn)) moved.column = targetColumn;
    panel.cards.splice(to, 0, moved);
    saveAndNotify(true);
  }

  function moveCardToColumn(cardId, columnIndex, columnCount) {
    const panel = getActivePanel();
    const from = panel.cards.findIndex(card => card.id === cardId);
    if (from < 0) return;
    const count = Math.max(1, Number(columnCount) || 1);
    const targetColumn = Math.max(0, Math.min(Number(columnIndex) || 0, count - 1));
    const [moved] = panel.cards.splice(from, 1);
    moved.column = targetColumn;
    let insertAt = panel.cards.length;
    for (let index = panel.cards.length - 1; index >= 0; index -= 1) {
      const column = Number.isInteger(panel.cards[index].column) ? panel.cards[index].column : index % count;
      if (column === targetColumn) {
        insertAt = index + 1;
        break;
      }
    }
    panel.cards.splice(insertAt, 0, moved);
    saveAndNotify(true);
  }

  function importCards(cards, columnCount) {
    const panel = getActivePanel();
    const count = Math.max(1, Number(columnCount) || 1);
    let imported = 0;
    (cards || []).forEach(source => {
      const name = (source.name || '').trim();
      const bookmarks = (source.bookmarks || []).filter(bm => bm && bm.url);
      if (!name || !bookmarks.length) return;
      let card = panel.cards.find(item => item.name === name);
      if (!card) {
        card = {
          id: Storage.generateId('card_'),
          name,
          bookmarks: [],
          collapsed: false,
          column: panel.cards.length % count
        };
        panel.cards.push(card);
      }
      if (!Array.isArray(card.bookmarks)) card.bookmarks = [];
      const exists = new Set(card.bookmarks.map(bm => bm.url).filter(Boolean));
      bookmarks.forEach(bm => {
        if (exists.has(bm.url)) return;
        card.bookmarks.push({
          name: bm.name || bm.title || bm.url,
          url: bm.url,
          remark: bm.remark || '',
          icon: bm.icon || ''
        });
        exists.add(bm.url);
        imported += 1;
      });
    });
    if (imported) saveAndNotify(true);
    return imported;
  }

  function addBookmark(cardId, name, url, remark, icon) {
    const card = findCard(cardId);
    if (!card) return;
    if (!Array.isArray(card.bookmarks)) card.bookmarks = [];
    const bm = { name, url, remark: remark || '', icon: icon || '' };
    if (getSettings().addPos === 'top') card.bookmarks.unshift(bm);
    else card.bookmarks.push(bm);
    saveAndNotify(true);
  }

  function updateBookmark(cardId, index, name, url, remark, icon) {
    const card = findCard(cardId);
    if (!card || !card.bookmarks[index]) return;
    card.bookmarks[index] = { ...card.bookmarks[index], name, url, remark: remark || '', icon: icon ?? (card.bookmarks[index].icon || '') };
    saveAndNotify(true);
  }

  function removeBookmark(cardId, index) {
    const card = findCard(cardId);
    if (!card || !card.bookmarks[index]) return;
    card.bookmarks.splice(index, 1);
    saveAndNotify(true);
  }

  function setCardDesktopLayout(cardId, layout) {
    const card = findCard(cardId);
    if (!card) return;
    card.desktopLayout = layout || '1x1';
    saveAndNotify(true);
  }

  function releaseCardBookmarks(cardId) {
    const panel = getActivePanel();
    const index = panel.cards.findIndex(card => card.id === cardId);
    if (index < 0) return;
    const card = panel.cards[index];
    const bookmarks = Array.isArray(card.bookmarks) ? card.bookmarks : [];
    if (!bookmarks.length) return;
    const released = bookmarks.map((bm, offset) => ({
      id: Storage.generateId('card_'),
      name: bm.name || bm.url || `${card.name || '图标'} ${offset + 1}`,
      bookmarks: [{ ...bm }],
      collapsed: false,
      column: Number.isInteger(card.column) ? card.column : undefined,
      desktopLayout: '1x1'
    }));
    panel.cards.splice(index, 1, ...released);
    saveAndNotify(true);
  }

  function releaseBookmark(cardId, index) {
    const panel = getActivePanel();
    const cardIndex = panel.cards.findIndex(card => card.id === cardId);
    if (cardIndex < 0) return;
    const card = panel.cards[cardIndex];
    if (!card || !Array.isArray(card.bookmarks) || !card.bookmarks[index]) return;
    const [bm] = card.bookmarks.splice(index, 1);
    const released = {
      id: Storage.generateId('card_'),
      name: bm.name || bm.url || '独立图标',
      bookmarks: [{ ...bm }],
      collapsed: false,
      column: Number.isInteger(card.column) ? card.column : undefined,
      desktopLayout: '1x1'
    };
    panel.cards.splice(cardIndex + 1, 0, released);
    if (card.bookmarks.length === 0) panel.cards.splice(cardIndex, 1);
    saveAndNotify(true);
  }

  function reorderBookmarks(fromCardId, fromIndex, toCardId, toIndex) {
    const fromCard = findCard(fromCardId);
    const toCard = findCard(toCardId);
    if (!fromCard || !toCard || !fromCard.bookmarks[fromIndex]) return;
    const [moved] = fromCard.bookmarks.splice(fromIndex, 1);
    const insertAt = fromCardId === toCardId && fromIndex < toIndex ? toIndex - 1 : toIndex;
    toCard.bookmarks.splice(insertAt, 0, moved);
    saveAndNotify(true);
  }

  function addToCollection(cardId, index) {
    const card = findCard(cardId);
    if (!card || !card.bookmarks[index]) return false;
    const [bm] = card.bookmarks.splice(index, 1);
    appData.collectionBox.push({ ...bm, fromCard: card.name, addedAt: Date.now() });
    saveAndNotify(true);
    return true;
  }

  function getCollection() {
    return appData.collectionBox || [];
  }

  function clearCollection() {
    appData.collectionBox = [];
    saveAndNotify(false);
  }

  function removeFromCollection(index) {
    appData.collectionBox.splice(index, 1);
    saveAndNotify(false);
  }

  function findCard(cardId) {
    return getActivePanel().cards.find(card => card.id === cardId);
  }

  function saveAndNotify(render) {
    Storage.save(appData);
    if (render && typeof onDataChange === 'function') onDataChange();
  }

  function getSettings() {
    return typeof window.getSettings === 'function' ? window.getSettings() : {};
  }

  function toast(message) {
    if (typeof window._showToast === 'function') window._showToast(message);
  }

  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value || '';
    return div.innerHTML;
  }

  return {
    init, renderPanelTabs, switchPanel, addPanel, deletePanel,
    getPanels: () => appData.panels,
    getActiveIndex: () => activePanelIndex,
    getActivePanel, findCard, addCard, addCardAtColumn, editCard, deleteCard, toggleCard, reorderCards, moveCardToColumn,
    addBookmark, updateBookmark, removeBookmark, reorderBookmarks, setCardDesktopLayout, releaseCardBookmarks, releaseBookmark,
    importCards,
    addToCollection, getCollection, clearCollection, removeFromCollection,
    savePanel: () => saveAndNotify(false)
  };
})();
