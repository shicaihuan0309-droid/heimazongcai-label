const SidebarManager = (() => {
  let onChange = null;

  function init(changeCallback) {
    onChange = changeCallback;
    document.getElementById('sidebarClose')?.addEventListener('click', close);
    document.getElementById('sidebarOverlay')?.addEventListener('click', close);
    document.getElementById('clearCollection')?.addEventListener('click', () => {
      if (!confirm('确定清空收集箱吗？此操作不可恢复。')) return;
      PanelManager.clearCollection();
      render();
      onChange?.();
      toast('收集箱已清空');
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') close();
    });
    DragManager.setupSidebarDrop();
  }

  function open() {
    document.getElementById('sidebarOverlay')?.classList.add('active');
    document.getElementById('sidebar')?.classList.add('active');
    render();
  }

  function close() {
    document.getElementById('sidebarOverlay')?.classList.remove('active');
    document.getElementById('sidebar')?.classList.remove('active');
  }

  function addToCollection(cardId, bookmarkIndex) {
    const result = PanelManager.addToCollection(cardId, bookmarkIndex);
    if (!result) return false;
    render();
    onChange?.();
    toast('已添加到收集箱');
    return true;
  }

  function render() {
    const container = document.getElementById('sidebarContent');
    if (!container) return;
    const items = PanelManager.getCollection();
    if (!items.length) {
      container.innerHTML = '<p class="sidebar-empty">暂无内容。把链接拖到这里，稍后再整理。</p>';
      return;
    }
    container.innerHTML = items.map((item, index) => `
      <div class="sidebar-item" data-index="${index}">
        <div>
          <div class="ellipsis">${escapeHtml(item.name)}</div>
          <div class="subtle">${escapeHtml(item.fromCard || '')} · ${escapeHtml(domainOf(item.url))}</div>
        </div>
        <button class="sidebar-remove" title="移除">×</button>
      </div>
    `).join('');

    container.querySelectorAll('.sidebar-item').forEach(item => {
      item.addEventListener('click', event => {
        const index = Number(item.dataset.index);
        if (event.target.classList.contains('sidebar-remove')) {
          PanelManager.removeFromCollection(index);
          render();
          return;
        }
        const target = PanelManager.getCollection()[index];
        if (target?.url) window.open(target.url, '_blank', 'noopener,noreferrer');
      });
    });
  }

  function domainOf(url) {
    try {
      return new URL(url.startsWith('http') ? url : 'https://' + url).hostname.replace(/^www\./, '');
    } catch (error) {
      return url || '';
    }
  }

  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value || '';
    return div.innerHTML;
  }

  function toast(message) {
    if (typeof window._showToast === 'function') window._showToast(message);
  }

  return { init, open, close, addToCollection, render };
})();
