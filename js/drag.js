const DragManager = (() => {
  let active = null;

  function init() {
    document.addEventListener('dragover', event => event.preventDefault());
    document.addEventListener('drop', event => event.preventDefault());
  }

  function setupCardDrag(cardEl, cardId) {
    const handle = cardEl.querySelector('.card-grid-handle') || cardEl;
    handle.draggable = true;
    handle.addEventListener('dragstart', event => {
      active = { type: 'card', cardId };
      document.body.classList.add('is-dragging-links');
      cardEl.classList.add('dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', JSON.stringify(active));
    });
    cardEl.addEventListener('dragend', () => {
      active = null;
      setTimeout(() => document.body.classList.remove('is-dragging-links'), 120);
      cardEl.classList.remove('dragging');
      document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
      document.querySelectorAll('.column-drag-over').forEach(el => el.classList.remove('column-drag-over'));
    });
    cardEl.addEventListener('dragover', event => {
      if (active?.type === 'card' && active.cardId !== cardId) {
        event.preventDefault();
        cardEl.classList.add('drag-over');
      }
    });
    cardEl.addEventListener('dragleave', () => cardEl.classList.remove('drag-over'));
    cardEl.addEventListener('drop', event => {
      event.preventDefault();
      event.stopPropagation();
      cardEl.classList.remove('drag-over');
      if (active?.type === 'card' && active.cardId !== cardId) PanelManager.reorderCards(active.cardId, cardId);
    });
  }

  function setupBookmarkDrag(itemEl, cardId, bookmarkIndex) {
    const handle = itemEl.querySelector('.bm-drag-handle') || itemEl;
    handle.draggable = true;
    handle.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
    });
    handle.addEventListener('dragstart', event => {
      active = { type: 'bookmark', cardId, bookmarkIndex };
      document.body.classList.add('is-dragging-links');
      itemEl.classList.add('dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('application/json', JSON.stringify(active));
    });
    itemEl.addEventListener('dragend', () => {
      active = null;
      setTimeout(() => document.body.classList.remove('is-dragging-links'), 120);
      itemEl.classList.remove('dragging');
      document.querySelectorAll('.drag-over-item').forEach(el => el.classList.remove('drag-over-item'));
    });
    itemEl.addEventListener('dragover', event => {
      if (active?.type === 'bookmark' && !(active.cardId === cardId && active.bookmarkIndex === bookmarkIndex)) {
        event.preventDefault();
        itemEl.classList.add('drag-over-item');
      }
    });
    itemEl.addEventListener('dragleave', () => itemEl.classList.remove('drag-over-item'));
    itemEl.addEventListener('drop', event => {
      event.preventDefault();
      event.stopPropagation();
      itemEl.classList.remove('drag-over-item');
      if (active?.type === 'bookmark') {
        PanelManager.reorderBookmarks(active.cardId, active.bookmarkIndex, cardId, bookmarkIndex);
      }
    });
  }

  function setupCardBodyDrop(cardEl, cardId) {
    const body = cardEl.querySelector('.card-body');
    if (!body) return;
    body.addEventListener('dragover', event => {
      if (active?.type === 'bookmark') event.preventDefault();
    });
    body.addEventListener('drop', event => {
      event.preventDefault();
      event.stopPropagation();
      if (active?.type === 'bookmark') {
        const targetLength = PanelManager.getActivePanel().cards.find(card => card.id === cardId)?.bookmarks.length || 0;
        PanelManager.reorderBookmarks(active.cardId, active.bookmarkIndex, cardId, targetLength);
      }
    });
  }

  function setupColumnDrop(columnEl, columnIndex, getColumnCount) {
    if (!columnEl) return;
    columnEl.addEventListener('dragover', event => {
      if (active?.type === 'card') {
        event.preventDefault();
        columnEl.classList.add('column-drag-over');
      }
    });
    columnEl.addEventListener('dragleave', event => {
      if (!columnEl.contains(event.relatedTarget)) columnEl.classList.remove('column-drag-over');
    });
    columnEl.addEventListener('drop', event => {
      if (active?.type !== 'card') return;
      event.preventDefault();
      event.stopPropagation();
      columnEl.classList.remove('column-drag-over');
      const count = typeof getColumnCount === 'function' ? getColumnCount() : 1;
      PanelManager.moveCardToColumn(active.cardId, columnIndex, count);
      active = null;
    });
  }

  function setupSidebarDrop() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.addEventListener('dragover', event => {
      if (active?.type === 'bookmark') {
        event.preventDefault();
        sidebar.classList.add('drag-over');
      }
    });
    sidebar.addEventListener('dragleave', event => {
      if (!sidebar.contains(event.relatedTarget)) sidebar.classList.remove('drag-over');
    });
    sidebar.addEventListener('drop', event => {
      event.preventDefault();
      sidebar.classList.remove('drag-over');
      if (active?.type === 'bookmark' && SidebarManager.addToCollection(active.cardId, active.bookmarkIndex)) {
        active = null;
      }
    });
  }

  return { init, setupCardDrag, setupBookmarkDrag, setupCardBodyDrop, setupColumnDrop, setupSidebarDrop };
})();
