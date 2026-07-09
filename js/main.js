(function () {
  'use strict';

  let appData = null;
  let settings = {};
  let activeContextMenu = null;
  let linkMetaTimer = null;
  let activeMemoId = null;
  let memoSaveTimer = null;
  let memoDockSaveTimer = null;
  let activeWallpaperCategory = 'all';
  let desktopEditing = false;
  let desktopDragCardId = null;
  let authWechatSceneId = '';

  const WALLPAPER_CATEGORIES = [
    { key: 'all', label: '全部' },
    { key: 'nature', label: '自然' },
    { key: 'art', label: '艺术' },
    { key: 'architecture', label: '建筑' },
    { key: 'life', label: '生命' },
    { key: 'texture', label: '纹理' },
    { key: 'space', label: '太空' },
    { key: 'other', label: '其他' }
  ];

  const USER_WALLPAPERS = [
    { id: 'user-01', category: 'nature', name: '蓝天草坡', bg: "url('wallpapers/user-wallpaper-01.webp')" },
    { id: 'user-02', category: 'nature', name: '森林湖湾', bg: "url('wallpapers/user-wallpaper-02.webp')" },
    { id: 'user-03', category: 'art', name: '柔软山丘', bg: "url('wallpapers/user-wallpaper-03.webp')" },
    { id: 'user-04', category: 'nature', name: '夜山小屋', bg: "url('wallpapers/user-wallpaper-04.webp')" },
    { id: 'user-05', category: 'life', name: '晨光侧影', bg: "url('wallpapers/user-wallpaper-05.webp')" },
    { id: 'user-06', category: 'nature', name: '云层留白', bg: "url('wallpapers/user-wallpaper-06.webp')" },
    { id: 'user-07', category: 'life', name: '绿植波纹', bg: "url('wallpapers/user-wallpaper-07.webp')" },
    { id: 'user-08', category: 'nature', name: '暮色山形', bg: "url('wallpapers/user-wallpaper-08.webp')" },
    { id: 'user-09', category: 'nature', name: '暗沙光线', bg: "url('wallpapers/user-wallpaper-09.webp')" },
    { id: 'user-10', category: 'texture', name: '彩雾颗粒', bg: "url('wallpapers/user-wallpaper-10.webp')" },
    { id: 'user-11', category: 'art', name: '橙色梦境', bg: "url('wallpapers/user-wallpaper-11.webp')" },
    { id: 'user-12', category: 'nature', name: '雨露绿叶', bg: "url('wallpapers/user-wallpaper-12.webp')" },
    { id: 'user-13', category: 'art', name: '红日山影', bg: "url('wallpapers/user-wallpaper-13.webp')" },
    { id: 'user-14', category: 'nature', name: '薄雾森林', bg: "url('wallpapers/user-wallpaper-14.webp')" },
    { id: 'user-15', category: 'texture', name: '浅绿渐变', bg: "url('wallpapers/user-wallpaper-15.webp')" },
    { id: 'user-16', category: 'art', name: '蓝紫花形', bg: "url('wallpapers/user-wallpaper-16.webp')" },
    { id: 'user-17', category: 'texture', name: '清蓝天空', bg: "url('wallpapers/user-wallpaper-17.webp')" },
    { id: 'user-18', category: 'art', name: '水彩切片', bg: "url('wallpapers/user-wallpaper-18.webp')" },
    { id: 'user-19', category: 'life', name: '荧绿花影', bg: "url('wallpapers/user-wallpaper-19.webp')" },
    { id: 'user-20', category: 'nature', name: '青绿山峦', bg: "url('wallpapers/user-wallpaper-20.webp')" },
    { id: 'user-21', category: 'life', name: '窗边人物', bg: "url('wallpapers/user-wallpaper-21.webp')" },
    { id: 'user-22', category: 'space', name: '蓝色地球', bg: "url('wallpapers/user-wallpaper-22.webp')" },
    { id: 'user-23', category: 'space', name: '日食星环', bg: "url('wallpapers/user-wallpaper-23.webp')" },
    { id: 'user-24', category: 'space', name: '月面地升', bg: "url('wallpapers/user-wallpaper-24.webp')" },
    { id: 'user-25', category: 'space', name: '月弧深空', bg: "url('wallpapers/user-wallpaper-25.webp')" },
    { id: 'user-26', category: 'space', name: '暗星掠影', bg: "url('wallpapers/user-wallpaper-26.webp')" },
    { id: 'user-27', category: 'space', name: '半影地球', bg: "url('wallpapers/user-wallpaper-27.webp')" }
  ];

  const GENERATED_WALLPAPERS = [
    { id: 'nature-aurora', category: 'nature', name: '极光湖面', bg: 'radial-gradient(circle at 26% 18%, rgba(123,255,217,.72), transparent 24%), radial-gradient(circle at 78% 12%, rgba(80,104,255,.46), transparent 28%), linear-gradient(145deg, #07111c 0%, #102e38 48%, #05070d 100%)' },
    { id: 'nature-mist', category: 'nature', name: '晨雾山脊', bg: 'radial-gradient(circle at 50% 18%, rgba(255,255,255,.48), transparent 18%), linear-gradient(160deg, #c9d8d1 0%, #8fa59e 42%, #3d5961 100%)' },
    { id: 'nature-reef', category: 'nature', name: '浅海珊瑚', bg: 'radial-gradient(circle at 78% 70%, rgba(255,150,114,.65), transparent 23%), radial-gradient(circle at 24% 30%, rgba(98,225,212,.72), transparent 30%), linear-gradient(145deg, #063047, #0b7580 55%, #f2d18b)' },
    { id: 'nature-forest', category: 'nature', name: '密林光束', bg: 'radial-gradient(circle at 30% 8%, rgba(218,255,176,.58), transparent 28%), linear-gradient(135deg, #082415 0%, #1f5c35 52%, #0b1711 100%)' },
    { id: 'nature-snow', category: 'nature', name: '雪原蓝影', bg: 'radial-gradient(circle at 18% 20%, rgba(255,255,255,.8), transparent 20%), linear-gradient(145deg, #eef7ff 0%, #aac4df 48%, #2d4c70 100%)' },
    { id: 'nature-dune', category: 'nature', name: '风沙曲线', bg: 'radial-gradient(circle at 24% 20%, rgba(255,245,200,.55), transparent 24%), linear-gradient(160deg, #f0d49a 0%, #c38e51 46%, #442c24 100%)' },
    { id: 'nature-rain', category: 'nature', name: '雨后玻璃', bg: 'radial-gradient(circle at 16% 24%, rgba(255,255,255,.55), transparent 10%), radial-gradient(circle at 70% 60%, rgba(119,198,255,.45), transparent 22%), linear-gradient(135deg, #1b2c38, #6c8799)' },
    { id: 'nature-sunset', category: 'nature', name: '暮色海岸', bg: 'radial-gradient(circle at 70% 22%, rgba(255,226,134,.72), transparent 18%), linear-gradient(160deg, #1d3150 0%, #d7745a 52%, #20162b 100%)' },
    { id: 'nature-leaf', category: 'nature', name: '叶脉微光', bg: 'radial-gradient(circle at 28% 64%, rgba(168,255,134,.62), transparent 22%), linear-gradient(135deg, #10291a, #326044 56%, #09110d)' },
    { id: 'nature-cosmos', category: 'nature', name: '深空月弧', bg: 'radial-gradient(circle at 72% 30%, rgba(224,235,255,.9), transparent 8%), radial-gradient(circle at 76% 34%, #05070d 0 9%, transparent 10%), linear-gradient(150deg, #03050b 0%, #111d38 56%, #07080e 100%)' },
    { id: 'art-wash', category: 'art', name: '水彩留白', bg: 'radial-gradient(circle at 20% 24%, rgba(255,129,114,.72), transparent 18%), radial-gradient(circle at 76% 68%, rgba(62,169,255,.58), transparent 28%), linear-gradient(135deg, #fff5e8, #d7efff)' },
    { id: 'art-ink', category: 'art', name: '墨色扩散', bg: 'radial-gradient(circle at 35% 38%, rgba(0,0,0,.62), transparent 28%), radial-gradient(circle at 70% 64%, rgba(92,92,92,.45), transparent 22%), linear-gradient(145deg, #f5f5f0, #c8c8bf)' },
    { id: 'art-coral', category: 'art', name: '珊瑚纸面', bg: 'radial-gradient(circle at 78% 26%, rgba(255,91,91,.78), transparent 16%), radial-gradient(circle at 24% 74%, rgba(255,188,120,.62), transparent 24%), linear-gradient(135deg, #fff0e6, #ffd0c0)' },
    { id: 'art-indigo', category: 'art', name: '靛蓝笔触', bg: 'radial-gradient(circle at 72% 72%, rgba(82,119,255,.72), transparent 24%), linear-gradient(135deg, #111631, #3f4d96 52%, #c3d5ff)' },
    { id: 'art-sakura', category: 'art', name: '樱色噪点', bg: 'radial-gradient(circle at 24% 22%, rgba(255,175,212,.7), transparent 20%), radial-gradient(circle at 76% 78%, rgba(255,244,177,.55), transparent 24%), linear-gradient(145deg, #fff7fb, #efc7d7)' },
    { id: 'art-mint', category: 'art', name: '薄荷渐层', bg: 'radial-gradient(circle at 22% 70%, rgba(236,255,199,.74), transparent 28%), linear-gradient(140deg, #d8fff3, #83ddc7 46%, #0f6072)' },
    { id: 'art-neon', category: 'art', name: '霓虹幕布', bg: 'radial-gradient(circle at 18% 26%, rgba(255,0,128,.58), transparent 20%), radial-gradient(circle at 78% 64%, rgba(0,229,255,.55), transparent 24%), linear-gradient(135deg, #090415, #17152d)' },
    { id: 'art-cream', category: 'art', name: '奶油光晕', bg: 'radial-gradient(circle at 30% 32%, rgba(255,255,255,.84), transparent 24%), radial-gradient(circle at 80% 70%, rgba(255,194,137,.58), transparent 28%), linear-gradient(135deg, #f3dfc6, #e5c4a8)' },
    { id: 'art-lilac', category: 'art', name: '淡紫流光', bg: 'radial-gradient(circle at 20% 76%, rgba(177,255,225,.62), transparent 24%), linear-gradient(135deg, #e8dcff, #9b8be0 48%, #453867)' },
    { id: 'art-paper', category: 'art', name: '棉纸天空', bg: 'radial-gradient(circle at 68% 20%, rgba(116,201,255,.48), transparent 22%), linear-gradient(160deg, #f8fbff, #d9eaf8 48%, #9db7cd)' },
    { id: 'architecture-glass', category: 'architecture', name: '玻璃立面', bg: 'linear-gradient(120deg, rgba(255,255,255,.28) 0 12%, transparent 12% 24%, rgba(255,255,255,.18) 24% 36%, transparent 36% 48%), linear-gradient(145deg, #102033, #6f93a6)' },
    { id: 'architecture-concrete', category: 'architecture', name: '清水混凝土', bg: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,.28), transparent 20%), linear-gradient(135deg, #dad9d2, #8f918d 54%, #4d514f)' },
    { id: 'architecture-arch', category: 'architecture', name: '拱廊暖影', bg: 'radial-gradient(ellipse at 50% 105%, rgba(255,227,176,.72), transparent 42%), linear-gradient(135deg, #3c322f, #9d7456 52%, #e6c69e)' },
    { id: 'architecture-grid', category: 'architecture', name: '城市网格', bg: 'linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(135deg, #111a24, #244154)' },
    { id: 'architecture-night', category: 'architecture', name: '夜幕天际线', bg: 'linear-gradient(180deg, transparent 0 58%, rgba(0,0,0,.65) 58%), radial-gradient(circle at 74% 18%, rgba(255,233,158,.7), transparent 12%), linear-gradient(145deg, #11172d, #273a61)' },
    { id: 'architecture-marble', category: 'architecture', name: '白石空间', bg: 'radial-gradient(circle at 18% 22%, rgba(150,170,190,.28), transparent 20%), linear-gradient(120deg, #fbfbf8 0%, #dfe2df 45%, #b4b9b5 100%)' },
    { id: 'architecture-copper', category: 'architecture', name: '铜色墙面', bg: 'radial-gradient(circle at 68% 28%, rgba(255,192,110,.48), transparent 20%), linear-gradient(135deg, #281b18, #a86a3d 52%, #e0aa73)' },
    { id: 'life-coffee', category: 'life', name: '咖啡晨光', bg: 'radial-gradient(circle at 24% 26%, rgba(255,232,184,.65), transparent 22%), linear-gradient(135deg, #261b16, #75503b 54%, #d6b38b)' },
    { id: 'life-desk', category: 'life', name: '安静桌面', bg: 'radial-gradient(circle at 78% 30%, rgba(255,255,255,.54), transparent 18%), linear-gradient(135deg, #d8e3e1, #8ba2a2 50%, #34494e)' },
    { id: 'life-window', category: 'life', name: '窗边午后', bg: 'linear-gradient(120deg, rgba(255,255,255,.54) 0 18%, transparent 18% 32%, rgba(255,255,255,.38) 32% 48%, transparent 48%), linear-gradient(145deg, #f0dcc1, #9dbbc7)' },
    { id: 'life-book', category: 'life', name: '纸页温度', bg: 'radial-gradient(circle at 22% 72%, rgba(255,255,255,.62), transparent 24%), linear-gradient(135deg, #f6ead4, #cba87b 56%, #5a4330)' },
    { id: 'life-plant', category: 'life', name: '绿植角落', bg: 'radial-gradient(circle at 72% 72%, rgba(124,223,128,.58), transparent 24%), linear-gradient(135deg, #f0f4e9, #8aa578 52%, #243824)' },
    { id: 'life-lamp', category: 'life', name: '暖灯微尘', bg: 'radial-gradient(circle at 64% 28%, rgba(255,220,126,.75), transparent 18%), linear-gradient(135deg, #17120f, #553e2e 55%, #c9945e)' },
    { id: 'life-studio', category: 'life', name: '创作工作室', bg: 'radial-gradient(circle at 28% 34%, rgba(105,183,255,.42), transparent 20%), radial-gradient(circle at 80% 76%, rgba(255,125,94,.36), transparent 22%), linear-gradient(145deg, #20232b, #3c4657)' },
    { id: 'texture-silk', category: 'texture', name: '丝绸暗纹', bg: 'radial-gradient(circle at 24% 28%, rgba(255,255,255,.22), transparent 18%), linear-gradient(115deg, #12151f, #30374c 45%, #0b0d13)' },
    { id: 'texture-grain', category: 'texture', name: '细砂颗粒', bg: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,.34), transparent 12%), radial-gradient(circle at 70% 76%, rgba(0,0,0,.18), transparent 20%), linear-gradient(135deg, #d7c8ad, #8f826f)' },
    { id: 'texture-wave', category: 'texture', name: '波纹玻璃', bg: 'radial-gradient(ellipse at 30% 60%, rgba(150,255,230,.46), transparent 28%), linear-gradient(135deg, #0e3440, #23768b 52%, #a6e4e0)' },
    { id: 'texture-carbon', category: 'texture', name: '碳黑网格', bg: 'linear-gradient(45deg, rgba(255,255,255,.05) 25%, transparent 25% 50%, rgba(255,255,255,.05) 50% 75%, transparent 75%), linear-gradient(135deg, #050607, #222831)' },
    { id: 'texture-clay', category: 'texture', name: '陶土肌理', bg: 'radial-gradient(circle at 70% 24%, rgba(255,178,130,.48), transparent 18%), linear-gradient(135deg, #f2b28d, #bf6549 52%, #5a2c29)' },
    { id: 'texture-frost', category: 'texture', name: '磨砂冰面', bg: 'radial-gradient(circle at 16% 20%, rgba(255,255,255,.78), transparent 20%), linear-gradient(135deg, #eefcff, #a6cbd6 50%, #476b7a)' },
    { id: 'texture-linen', category: 'texture', name: '亚麻浅灰', bg: 'linear-gradient(90deg, rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,.28) 1px, transparent 1px), linear-gradient(135deg, #e7e2d7, #bdb7aa)' },
    { id: 'texture-prism', category: 'texture', name: '棱镜薄雾', bg: 'radial-gradient(circle at 26% 30%, rgba(255,105,180,.38), transparent 22%), radial-gradient(circle at 76% 70%, rgba(50,215,255,.44), transparent 24%), linear-gradient(135deg, #f7f8ff, #c9d2ef)' },
    { id: 'other-midnight', category: 'other', name: '午夜蓝', bg: 'radial-gradient(circle at 72% 24%, rgba(72,126,255,.56), transparent 22%), linear-gradient(135deg, #050816, #14213d 55%, #070b12)' },
    { id: 'other-sunrise', category: 'other', name: '日出橙', bg: 'radial-gradient(circle at 28% 26%, rgba(255,226,111,.72), transparent 22%), linear-gradient(145deg, #381f2c, #f37b52 50%, #ffd18a)' },
    { id: 'other-cyan', category: 'other', name: '青色深呼吸', bg: 'radial-gradient(circle at 20% 70%, rgba(154,255,219,.58), transparent 22%), linear-gradient(135deg, #051f2b, #0e8790 54%, #c4fff1)' },
    { id: 'other-ruby', category: 'other', name: '红宝石夜', bg: 'radial-gradient(circle at 70% 30%, rgba(255,72,104,.66), transparent 22%), linear-gradient(135deg, #130710, #4d1428 54%, #b7344c)' },
    { id: 'other-olive', category: 'other', name: '橄榄灰绿', bg: 'radial-gradient(circle at 78% 76%, rgba(203,229,143,.48), transparent 24%), linear-gradient(135deg, #20261e, #65705b 52%, #d5d8c4)' },
    { id: 'other-plum', category: 'other', name: '梅子暮色', bg: 'radial-gradient(circle at 34% 24%, rgba(218,129,255,.5), transparent 20%), linear-gradient(135deg, #1a1022, #57365f 52%, #c39ad6)' },
    { id: 'other-blueprint', category: 'other', name: '蓝图', bg: 'linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(135deg, #0b2440, #2c76a8)' },
    { id: 'other-minimal', category: 'other', name: '极简灰', bg: 'radial-gradient(circle at 78% 20%, rgba(255,255,255,.6), transparent 18%), linear-gradient(135deg, #f2f4f6, #aeb6bd 54%, #4c5962)' }
  ];

  const BUILTIN_WALLPAPERS = [...USER_WALLPAPERS, ...GENERATED_WALLPAPERS];

  function getDefaultSettings() {
    return Storage.DEFAULT_DATA.settings;
  }

  function getSettings() {
    return { ...getDefaultSettings(), ...(appData?.settings || {}), ...settings };
  }
  window.getSettings = getSettings;

  function normalizePageWidth(value) {
    return value === '1188px' ? '1200px' : (value || '1200px');
  }

  function showToast(message, type = 'info') {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    wrap.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
  }
  window._showToast = showToast;

  async function init() {
    appData = await Storage.load();
    settings = getSettings();
    await applyAutoWallpaperIfNeeded();
    settings = getSettings();
    applySettings();

    SearchEngine.init();
    DragManager.init();
    PanelManager.init(appData, refreshAll);
    SidebarManager.init(refreshAll);

    bindChrome();
    bindModals();
    bindTopMenu();
    bindSettings();
    let lastDesktopGridCols = getDesktopGridCols();
    window.addEventListener('resize', () => {
      const current = getDesktopGridCols();
      if (current !== lastDesktopGridCols) {
        lastDesktopGridCols = current;
        if (getSettings().collectionMode === 'desktop') refreshAll();
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') exitDesktopEditMode();
    });
    document.addEventListener('click', event => {
      if (!desktopEditing || getSettings().collectionMode !== 'desktop') return;
      if (event.target.closest('.desktop-tile, .context-menu, .drawer, .modal, .topbar, .sidebar, .desktop-folder-modal')) return;
      exitDesktopEditMode();
    });
    refreshAll();

    // 初始化云端同步
    if (typeof initSync === 'function') initSync();

    if (getSettings().autoFocus) {
      setTimeout(() => document.getElementById('searchInput')?.focus(), 100);
    }
  }

  let _refreshAllTimer = null;
function refreshAll() {
  clearTimeout(_refreshAllTimer);
  _refreshAllTimer = setTimeout(() => refreshAllNow(), 80);
}
function refreshAllNow() {
    applySettings();
    renderBookmarks();
    renderRecentDock();
    ensureRecentAddButton();
    renderMemoDock();
    SidebarManager.render();
  }


  function getColumnCount() {
    if (window.matchMedia('(max-width: 560px)').matches) return 1;
    if (window.matchMedia('(max-width: 940px)').matches) return 2;
    if (window.matchMedia('(max-width: 1180px)').matches) return 4;
    return 5;
  }

  function renderBookmarks() {
    const panel = PanelManager.getActivePanel();
    const grid = document.getElementById('masonryGrid');
    if (!grid) return;
    grid.innerHTML = '';
    grid.className = 'masonry-grid';

    if ((getSettings().collectionMode || 'cards') === 'desktop') {
      renderDesktopIcons(panel, grid);
      return;
    }

    const columnCount = getColumnCount();
    const columns = Array.from({ length: columnCount }, (_, index) => {
      const column = document.createElement('section');
      column.className = 'bookmark-column';
      column.dataset.columnIndex = String(index);
      grid.appendChild(column);
      DragManager.setupColumnDrop(column, index, getColumnCount);
      return column;
    });

    (panel.cards || []).forEach((card, cardIndex) => {
      const cardEl = document.createElement('article');
      cardEl.className = 'card';
      cardEl.dataset.cardId = card.id;
      cardEl.dataset.cardIndex = String(cardIndex);
      applyCardStyle(cardEl, card.style);
      cardEl.innerHTML = `
        <div class="card-header">
          <span class="card-grid-handle" title="拖拽模块">${icons.handle}</span>
          <button class="card-title" title="双击可执行偏好设置中的快捷操作">${escapeHtml(card.name)}</button>
          <button class="card-menu-btn" title="模块菜单">${icons.moreText}</button>
        </div>
        <div class="card-body ${card.collapsed ? 'collapsed' : ''}"></div>
      `;

      const body = cardEl.querySelector('.card-body');
      (card.bookmarks || []).forEach((bm, bmIndex) => body.appendChild(createBookmarkItem(card, bm, bmIndex)));

      cardEl.querySelector('.card-menu-btn').addEventListener('click', event => showCardMenu(event, card));
      cardEl.querySelector('.card-title').addEventListener('dblclick', () => handleCardTitleDblClick(card));
      const savedColumn = Number.isInteger(card.column) ? card.column : cardIndex % columnCount;
      columns[Math.max(0, Math.min(savedColumn, columnCount - 1))].appendChild(cardEl);
      DragManager.setupCardDrag(cardEl, card.id);
      DragManager.setupCardBodyDrop(cardEl, card.id);
    });

    columns.forEach(column => {
      const columnIndex = Number(column.dataset.columnIndex) || 0;
      const footer = document.createElement('div');
      footer.className = 'column-footer';
      footer.innerHTML = `
        <button class="column-add-module" title="添加模块" aria-label="添加模块">
          ${icons.addModule}
        </button>
        <span class="column-add-tip">添加模块</span>
      `;
      footer.querySelector('.column-add-module').addEventListener('click', () => openAddModuleModal(columnIndex));
      column.appendChild(footer);
    });
  }

  function renderDesktopIcons(panel, grid) {
    grid.className = 'masonry-grid desktop-icon-grid';
    grid.style.setProperty('--desktop-grid-cols', getDesktopGridCols());
    grid.addEventListener('dragover', event => {
      if (
        event.dataTransfer?.types?.includes('application/x-heima-bookmark') ||
        event.dataTransfer?.types?.includes('application/x-heima-card')
      ) {
        event.preventDefault();
        if (event.dataTransfer?.types?.includes('application/x-heima-card')) grid.classList.add('desktop-grid-drag-over');
      }
    });
    grid.addEventListener('dragleave', event => {
      if (!grid.contains(event.relatedTarget)) grid.classList.remove('desktop-grid-drag-over');
    });
    grid.addEventListener('drop', event => {
      grid.classList.remove('desktop-grid-drag-over');
      const bookmarkRaw = event.dataTransfer?.getData('application/x-heima-bookmark');
      const cardRaw = event.dataTransfer?.getData('application/x-heima-card');
      if (!bookmarkRaw && !cardRaw) return;
      event.preventDefault();
      try {
        if (cardRaw && !event.target.closest('.desktop-tile')) {
          const payload = JSON.parse(cardRaw);
          const last = [...grid.querySelectorAll('.desktop-tile[data-card-id]:not(.desktop-add-tile)')].pop();
          if (payload?.cardId && last?.dataset.cardId && payload.cardId !== last.dataset.cardId) {
            PanelManager.reorderCards(payload.cardId, last.dataset.cardId);
          }
          return;
        }
        const payload = JSON.parse(bookmarkRaw);
        if (payload?.type === 'release-bookmark') {
          closeDesktopFolder();
          PanelManager.releaseBookmark(payload.cardId, Number(payload.index));
        }
      } catch (error) {
        console.warn('Failed to release bookmark', error);
      }
    });
    const cards = panel.cards || [];
    if (!cards.length) {
      const empty = document.createElement('div');
      empty.className = 'desktop-empty-state';
      empty.innerHTML = '<strong>还没有图标</strong><span>点击“添加图标”创建你的第一个收纳入口。</span>';
      grid.appendChild(empty);
    }
    cards.forEach(card => grid.appendChild(createDesktopTile(card)));
    grid.appendChild(createDesktopAddTile());
  }

  function createDesktopTile(card) {
    const bookmarks = card.bookmarks || [];
    const single = bookmarks.length === 1;
    const layout = desktopLayout(card.desktopLayout || autoDesktopLayout(bookmarks.length));
    const tile = document.createElement(single ? 'a' : 'button');
    tile.className = `desktop-tile ${single ? 'desktop-shortcut' : 'desktop-folder'}`;
    tile.dataset.cardId = card.id;
    tile.dataset.layout = layout.key;
    const gridCols = getDesktopGridCols();
    const spanCols = Math.min(layout.cols, gridCols);
    const cappedLayout = spanCols !== layout.cols ? { ...layout, cols: spanCols } : layout;
    tile.style.gridColumn = `span ${spanCols}`;
    tile.style.gridRow = `span ${layout.rows}`;
    applyDesktopTileDimensions(tile, single, cappedLayout);
    if (!single) tile.type = 'button';
    setupDesktopTileDrag(tile, card.id);

    if (single) {
      const bm = bookmarks[0];
      tile.href = normalizeUrl(bm.url || '#');
      const s = getSettings();
      if (s.linkNewWindow !== false) {
        tile.target = '_blank';
        tile.rel = 'noopener noreferrer';
      }
      tile.addEventListener('click', event => {
        if (event.defaultPrevented || event.button !== 0) return;
        recordRecentLink(bm);
      });
      tile.addEventListener('contextmenu', event => {
        event.preventDefault();
        showDesktopShortcutMenu(event, card, bm, 0);
      });
    } else {
      tile.addEventListener('click', () => openDesktopFolder(card.id));
      tile.addEventListener('contextmenu', event => {
        event.preventDefault();
        showDesktopFolderMenu(event, card);
      });
    }

    const title = single ? (bookmarks[0].name || bookmarks[0].url || card.name) : card.name;
    tile.innerHTML = `
      <span class="desktop-icon-box ${single ? '' : 'folder'}">
        ${single ? desktopShortcutIconHtml(bookmarks[0]) : desktopFolderPreviewHtml(card)}
      </span>
      <span class="desktop-tile-name">${escapeHtml(title || '未命名')}</span>
    `;
    if (desktopEditing) tile.appendChild(createDesktopDeleteButton(card));
    attachDesktopIconFallbacks(tile, card);
    return tile;
  }

  function setupDesktopTileDrag(tile, cardId) {
    if (tile.classList.contains('desktop-add-tile')) return;
    tile.draggable = true;
    tile.addEventListener('dragstart', event => {
      desktopDragCardId = cardId;
      tile.classList.add('desktop-dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('application/x-heima-card', JSON.stringify({ type: 'card', cardId }));
      event.dataTransfer.setData('text/plain', cardId);
    });
    tile.addEventListener('dragover', event => {
      if (!desktopDragCardId || desktopDragCardId === cardId) return;
      event.preventDefault();
      tile.classList.add('desktop-drop-target');
    });
    tile.addEventListener('dragleave', () => tile.classList.remove('desktop-drop-target'));
    tile.addEventListener('drop', event => {
      if (!desktopDragCardId || desktopDragCardId === cardId) return;
      event.preventDefault();
      event.stopPropagation();
      tile.classList.remove('desktop-drop-target');
      PanelManager.reorderCards(desktopDragCardId, cardId);
    });
    tile.addEventListener('dragend', () => {
      desktopDragCardId = null;
      tile.classList.remove('desktop-dragging');
      document.querySelectorAll('.desktop-drop-target, .desktop-grid-drag-over').forEach(el => {
        el.classList.remove('desktop-drop-target', 'desktop-grid-drag-over');
      });
    });
  }

  function desktopLayout(value) {
    const layouts = {
      '1x1': { key: '1x1', cols: 1, rows: 1 },
      '1x2': { key: '1x2', cols: 1, rows: 2 },
      '2x1': { key: '2x1', cols: 2, rows: 1 },
      '2x2': { key: '2x2', cols: 2, rows: 2 },
      '2x4': { key: '2x4', cols: 4, rows: 2 }
    };
    return layouts[value] || layouts['1x1'];
  }

  function autoDesktopLayout(bookmarkCount) {
    if (bookmarkCount <= 2) return '1x1';
    if (bookmarkCount <= 5) return '2x1';
    if (bookmarkCount <= 10) return '2x2';
    return '2x4';
  }

  function getDesktopGridCols() {
    if (window.matchMedia('(max-width: 480px)').matches) return 2;
    if (window.matchMedia('(max-width: 740px)').matches) return 4;
    if (window.matchMedia('(max-width: 940px)').matches) return 6;
    return 9;
  }

  function applyDesktopTileDimensions(tile, single, layout) {
    const s = getSettings();
    const gap = clampNumber(s.desktopIconGap, 8, 32, 14);
    const baseW = single
      ? clampNumber(s.desktopShortcutWidth, 56, 120, 72)
      : clampNumber(s.desktopFolderWidth, 56, 120, 72);
    const baseH = single
      ? clampNumber(s.desktopShortcutHeight, 56, 120, 72)
      : clampNumber(s.desktopFolderHeight, 56, 120, 72);
    const iconWidth = baseW * layout.cols + gap * (layout.cols - 1);
    const iconHeight = baseH * layout.rows + gap * (layout.rows - 1);
    tile.style.setProperty('--tile-icon-width', `${iconWidth}px`);
    tile.style.setProperty('--tile-icon-height', `${iconHeight}px`);
  }

  function createDesktopDeleteButton(card) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'desktop-delete-badge';
    button.setAttribute('aria-label', '删除');
    button.innerHTML = '&times;';
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      if (confirm(`确定删除“${card.name || '图标'}”吗？`)) PanelManager.deleteCard(card.id);
    });
    return button;
  }

  function createDesktopAddTile() {
    const tile = document.createElement('button');
    tile.className = 'desktop-tile desktop-add-tile';
    tile.type = 'button';
    tile.innerHTML = `
      <span class="desktop-icon-box add"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></span>
      <span class="desktop-tile-name">添加图标</span>
    `;
    tile.addEventListener('click', event => showDesktopAddMenu(event));
    return tile;
  }

  function desktopShortcutIconHtml(bm) {
    const icon = bm.icon || faviconFor(bm.url);
    return `<img src="${escapeAttr(icon)}" alt="">`;
  }

  function desktopFolderPreviewHtml(card) {
    const layout = desktopLayout(card.desktopLayout);
    const slotByLayout = { '1x1': 4, '1x2': 3, '2x1': 3, '2x2': 7, '2x4': 8 };
    const slots = slotByLayout[layout.key] || 4;
    const allBookmarks = card.bookmarks || [];
    if (!allBookmarks.length) return `<span class="desktop-folder-empty">${icons.addModule}</span>`;
    const visibleCount = allBookmarks.length > slots ? slots - 1 : Math.min(allBookmarks.length, slots);
    const iconsHtml = allBookmarks.slice(0, visibleCount).map((bm, index) => {
      const icon = bm.icon || faviconFor(bm.url);
      return `<span class="desktop-mini-icon slot-${index}" data-bm-index="${index}"><img src="${escapeAttr(icon)}" alt=""></span>`;
    }).join('');
    const moreHtml = allBookmarks.length > slots
      ? `<span class="desktop-mini-icon desktop-more-icon" aria-label="更多">${icons.more}</span>`
      : '';
    return `
      <span class="desktop-folder-preview itab-preview layout-${layout.key} count-${Math.min(allBookmarks.length, slots)}">${iconsHtml}${moreHtml}</span>
    `;
  }

  function attachDesktopIconFallbacks(tile, card) {
    const bookmarks = card.bookmarks || [];
    const singleImg = tile.matches('.desktop-shortcut') ? tile.querySelector('.desktop-icon-box > img') : null;
    if (singleImg && bookmarks[0]) {
      attachIconFallback(singleImg, tile.querySelector('.desktop-icon-box'), bookmarks[0].url, iconInitial(bookmarks[0]), bookmarks[0].icon);
      return;
    }
    tile.querySelectorAll('.desktop-mini-icon img').forEach(img => {
      const index = Number(img.closest('.desktop-mini-icon')?.dataset.bmIndex) || 0;
      const bm = bookmarks[index];
      if (bm) attachIconFallback(img, img.closest('.desktop-mini-icon'), bm.url, iconInitial(bm), bm.icon);
    });
  }

  function iconInitial(bm) {
    return (bm.name || bm.url || '?').trim().charAt(0).toUpperCase() || '?';
  }

  function renderDesktopFolderGrid(grid, card, query = '') {
    const bookmarks = card.bookmarks || [];
    const keyword = query.trim().toLowerCase();
    const filtered = bookmarks
      .map((bm, index) => ({ bm, index }))
      .filter(({ bm }) => {
        if (!keyword) return true;
        return [bm.name, bm.url, bm.remark].some(value => String(value || '').toLowerCase().includes(keyword));
      });
    grid.innerHTML = filtered.map(({ bm, index }) => `
      <a class="desktop-folder-link" href="${escapeAttr(normalizeUrl(bm.url || '#'))}" data-index="${index}" draggable="true" ${getSettings().linkNewWindow !== false ? 'target="_blank" rel="noopener noreferrer"' : ''}>
        <span class="desktop-folder-link-icon"><img src="${escapeAttr(bm.icon || faviconFor(bm.url))}" alt=""></span>
        <span>${escapeHtml(bm.name || bm.url || '未命名链接')}</span>
      </a>
    `).join('') || `
      <button class="desktop-folder-add-link" type="button">
        ${keyword ? '没有找到匹配标签' : '添加链接'}
      </button>
    `;
    grid.querySelectorAll('.desktop-folder-link').forEach(link => {
      const bm = bookmarks[Number(link.dataset.index)];
      link.addEventListener('click', () => recordRecentLink(bm));
      link.addEventListener('contextmenu', event => {
        event.preventDefault();
        showBookmarkMenu(event, card, bm, Number(link.dataset.index));
      });
      link.addEventListener('dragstart', event => {
        event.dataTransfer?.setData('application/x-heima-bookmark', JSON.stringify({
          type: 'release-bookmark',
          cardId: card.id,
          index: Number(link.dataset.index)
        }));
        event.dataTransfer.effectAllowed = 'move';
      });
      attachIconFallback(link.querySelector('img'), link.querySelector('.desktop-folder-link-icon'), bm?.url, iconInitial(bm || {}), bm?.icon);
    });
    grid.querySelector('.desktop-folder-add-link')?.addEventListener('click', () => {
      if (keyword) return;
      closeDesktopFolder();
      openAddBookmarkModal(card.id, card.name);
    });
  }

  function openDesktopFolder(cardId) {
    const card = PanelManager.findCard ? PanelManager.findCard(cardId) : (PanelManager.getActivePanel().cards || []).find(item => item.id === cardId);
    if (!card) return;
    ensureDesktopFolderModal();
    const modal = document.getElementById('desktopFolderModal');
    const overlay = document.getElementById('desktopFolderOverlay');
    const title = modal.querySelector('.desktop-folder-title');
    const grid = modal.querySelector('.desktop-folder-grid');
    const search = modal.querySelector('.desktop-folder-search-input');
    if (title) title.textContent = card.name || '未命名收纳';
    if (search) {
      search.value = '';
      search.oninput = () => renderDesktopFolderGrid(grid, card, search.value);
    }
    if (title) title.ondblclick = () => startDesktopFolderTitleEdit(title, card);
    if (title) title.textContent = card.name || '未命名收纳';
    if (grid) {
      const bookmarks = card.bookmarks || [];
      grid.innerHTML = bookmarks.map((bm, index) => `
        <a class="desktop-folder-link" href="${escapeAttr(normalizeUrl(bm.url || '#'))}" data-index="${index}" draggable="true" ${getSettings().linkNewWindow !== false ? 'target="_blank" rel="noopener noreferrer"' : ''}>
          <span class="desktop-folder-link-icon"><img src="${escapeAttr(bm.icon || faviconFor(bm.url))}" alt=""></span>
          <span>${escapeHtml(bm.name || bm.url || '未命名链接')}</span>
        </a>
      `).join('') || '<button class="desktop-folder-add-link" type="button">添加链接</button>';
      grid.querySelectorAll('.desktop-folder-link').forEach(link => {
        const bm = bookmarks[Number(link.dataset.index)];
        link.addEventListener('click', () => recordRecentLink(bm));
        link.addEventListener('contextmenu', event => {
          event.preventDefault();
          showBookmarkMenu(event, card, bm, Number(link.dataset.index));
        });
        link.addEventListener('dragstart', event => {
          event.dataTransfer?.setData('application/x-heima-bookmark', JSON.stringify({
            type: 'release-bookmark',
            cardId: card.id,
            index: Number(link.dataset.index)
          }));
          event.dataTransfer.effectAllowed = 'move';
        });
        attachIconFallback(link.querySelector('img'), link.querySelector('.desktop-folder-link-icon'), bm?.url, iconInitial(bm || {}), bm?.icon);
      });
      grid.querySelector('.desktop-folder-add-link')?.addEventListener('click', () => {
        closeDesktopFolder();
        openAddBookmarkModal(card.id, card.name);
      });
    }
    if (grid) renderDesktopFolderGrid(grid, card);
    if (title) title.textContent = card.name || '未命名收纳';
    const addButton = modal.querySelector('.desktop-folder-add');
    if (addButton) {
      addButton.onclick = () => {
        closeDesktopFolder();
        openAddBookmarkModal(card.id, card.name);
      };
    }
    overlay?.classList.add('active');
    modal?.classList.add('active');
  }

  function ensureDesktopFolderModal() {
    if (document.getElementById('desktopFolderModal')) return;
    const overlay = document.createElement('div');
    overlay.id = 'desktopFolderOverlay';
    overlay.className = 'desktop-folder-overlay';
    const modal = document.createElement('section');
    modal.id = 'desktopFolderModal';
    modal.className = 'desktop-folder-modal';
    modal.innerHTML = `
      <div class="desktop-folder-head">
        <h3 class="desktop-folder-title"></h3>
        <div>
          <input class="desktop-folder-search-input" type="search" placeholder="搜索文件夹内标签">
          <button class="desktop-folder-add" type="button">添加链接</button>
          <button class="desktop-folder-close" type="button" aria-label="关闭"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg></button>
        </div>
      </div>
      <div class="desktop-folder-grid"></div>
    `;
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    overlay.addEventListener('click', closeDesktopFolder);
    modal.querySelector('.desktop-folder-close')?.addEventListener('click', closeDesktopFolder);
  }

  function closeDesktopFolder() {
    document.getElementById('desktopFolderOverlay')?.classList.remove('active');
    document.getElementById('desktopFolderModal')?.classList.remove('active');
  }

  function startDesktopFolderTitleEdit(titleEl, card) {
    if (!titleEl || titleEl.dataset.editing === 'true') return;
    const before = card.name || titleEl.textContent || '';
    titleEl.dataset.editing = 'true';
    titleEl.contentEditable = 'true';
    titleEl.classList.add('editing');
    titleEl.focus();
    const range = document.createRange();
    range.selectNodeContents(titleEl);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    const finish = save => {
      const next = titleEl.textContent.trim();
      titleEl.contentEditable = 'false';
      delete titleEl.dataset.editing;
      titleEl.classList.remove('editing');
      titleEl.removeEventListener('blur', onBlur);
      titleEl.removeEventListener('keydown', onKeydown);
      if (save && next && next !== before) {
        card.name = next;
        Storage.save(appData).then(() => refreshAll());
      } else {
        titleEl.textContent = before;
      }
    };
    const onBlur = () => finish(true);
    const onKeydown = event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        finish(true);
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        finish(false);
      }
    };
    titleEl.addEventListener('blur', onBlur);
    titleEl.addEventListener('keydown', onKeydown);
  }

  function createBookmarkItem(card, bm, bmIndex) {
    const item = document.createElement('a');
    const s = getSettings();
    item.className = 'bookmark-item';
    item.href = normalizeUrl(bm.url || '#');
    if (s.linkNewWindow !== false) {
      item.target = '_blank';
      item.rel = 'noopener noreferrer';
    }
    item.dataset.cardId = card.id;
    item.dataset.bmIndex = String(bmIndex);

    const titleClass = s.singleLine ? 'bm-title single-line' : 'bm-title';
    const linkNoteMode = ['always', 'hover', 'none'].includes(s.linkNote) ? s.linkNote : 'none';
    const descClass = `bm-desc ${linkNoteMode}`;
    const remarkText = (bm.remark || '').trim();
    const initial = (bm.name || '?').trim().charAt(0).toUpperCase() || '?';
    const iconUrl = bm.icon || faviconFor(bm.url);
    item.innerHTML = `
      <span class="bm-drag-handle" title="拖拽链接">${icons.handle}</span>
      <span class="bm-icon">
        <img src="${escapeAttr(iconUrl)}" alt="">
      </span>
      <span class="bm-text">
        <span class="${titleClass}">${escapeHtml(bm.name || bm.url || '未命名链接')}</span>
        <span class="${descClass}">${escapeHtml(remarkText)}</span>
      </span>
      <button type="button" class="bm-menu-btn" title="链接菜单">${icons.more}</button>
    `;
    const img = item.querySelector('img');
    attachIconFallback(img, item.querySelector('.bm-icon'), bm.url, initial, iconUrl);
    item.querySelector('.bm-menu-btn').addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      showBookmarkMenu(event, card, bm, bmIndex);
    });
    item.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0) return;
      recordRecentLink(bm);
    });
    DragManager.setupBookmarkDrag(item, card.id, bmIndex);
    return item;
  }

  function renderRecentDock() {
    const dock = document.getElementById('recentDock');
    if (!dock) return;
    const recent = normalizeRecentLinks(appData?.recentLinks).slice(0, 24);
    dock.classList.toggle('empty', recent.length === 0);
    if (!recent.length) {
      dock.innerHTML = '<span class="recent-empty">点击常用网站后会显示在这里</span>';
      return;
    }
    dock.innerHTML = `
      <span class="recent-label">最近</span>
      <div class="recent-list">
        ${recent.map(link => recentDockItemHtml(link)).join('')}
      </div>
    `;
    dock.querySelectorAll('.recent-item').forEach(item => {
      item.addEventListener('click', () => {
        const link = recent.find(row => row.url === item.dataset.url);
        if (link) recordRecentLink(link, false);
      });
      const img = item.querySelector('img');
      const link = recent.find(row => row.url === item.dataset.url);
      attachIconFallback(img, item.querySelector('.recent-icon'), link?.url, (link?.name || '?').trim().charAt(0).toUpperCase() || '?', link?.icon);
      item.addEventListener('contextmenu', event => {
        event.preventDefault();
        event.stopPropagation();
        if (link) showRecentMenu(event, link);
      });
    });
    ensureRecentAddButton(dock);
  }

  function recentDockItemHtml(link) {
    const name = link.name || domainOf(link.url) || link.url;
    const iconUrl = link.icon || faviconFor(link.url);
    const target = getSettings().linkNewWindow !== false ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `
      <a class="recent-item" href="${escapeAttr(normalizeUrl(link.url))}" data-url="${escapeAttr(link.url)}" title="${escapeAttr(name)}"${target}>
        <span class="recent-icon"><img src="${escapeAttr(iconUrl)}" alt=""></span>
        <span class="recent-tip">${escapeHtml(name)}</span>
      </a>
    `;
  }

  function ensureRecentAddButton(dock = document.getElementById('recentDock')) {
    if (!dock || dock.querySelector('.recent-add-btn')) return;
    const target = dock.querySelector('.recent-list') || dock;
    const button = document.createElement('button');
    button.className = 'recent-add-btn';
    button.type = 'button';
    button.title = '添加最近使用';
    button.setAttribute('aria-label', '添加最近使用');
    button.innerHTML = icons.menuAddLink;
    button.addEventListener('click', event => showAddRecentMenu(event));
    target.appendChild(button);
  }

  function recordRecentLink(link, rerender = true) {
    if (!appData || !link?.url) return;
    const url = normalizeUrl(link.url);
    const name = link.name || domainOf(url) || url;
    const icon = link.icon || faviconFor(url);
    const current = normalizeRecentLinks(appData.recentLinks);
    const previous = current.find(item => normalizeUrl(item.url) === url);
    const next = current.filter(item => normalizeUrl(item.url) !== url);
    next.unshift({ name, url, icon, usedAt: Date.now(), count: Number(previous?.count || link.count || 0) + 1 });
    appData.recentLinks = next.slice(0, 32);
    Storage.save(appData);
    if (rerender) renderRecentDock();
  }

  function removeRecentLink(url) {
    if (!appData || !url) return;
    const normalized = normalizeUrl(url);
    appData.recentLinks = normalizeRecentLinks(appData.recentLinks)
      .filter(item => normalizeUrl(item.url) !== normalized);
    Storage.save(appData);
    renderRecentDock();
    showToast('已从最近使用中删除', 'success');
  }

  function showRecentMenu(event, link) {
    showContextMenu(event, [
      ['添加最近使用', () => setTimeout(() => showAddRecentMenu(event), 0), '', icons.menuAddLink],
      ['删除', () => removeRecentLink(link.url), 'danger', icons.menuTrash]
    ]);
  }

  function showAddRecentMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    const bookmarks = collectBookmarkOptions();
    if (!bookmarks.length) {
      showToast('当前没有可添加的收藏标签', 'error');
      return;
    }
    showSearchableBookmarkMenu(event, bookmarks, item => recordRecentLink(item), '搜索标签');
  }

  function collectBookmarkOptions() {
    const map = new Map();
    const panels = typeof PanelManager.getPanels === 'function' ? PanelManager.getPanels() : (appData?.panels || []);
    (panels || []).forEach(panel => {
      (panel.cards || []).forEach(card => {
        (card.bookmarks || []).forEach(bookmark => {
          if (!bookmark?.url) return;
          const url = normalizeUrl(bookmark.url);
          if (map.has(url)) return;
          map.set(url, {
            name: bookmark.name || domainOf(url) || url,
            url,
            icon: bookmark.icon || faviconFor(url),
            cardName: card.name || '',
            panelName: panel.name || ''
          });
        });
      });
    });
    return Array.from(map.values()).sort((a, b) => String(a.name).localeCompare(String(b.name), 'zh-CN'));
  }

  function filterBookmarkOptions(bookmarks, query, limit = 80) {
    const keyword = String(query || '').trim().toLowerCase();
    const source = Array.isArray(bookmarks) ? bookmarks : collectBookmarkOptions();
    const filtered = keyword
      ? source.filter(item => `${item.name || ''}\n${item.url || ''}\n${item.cardName || ''}\n${item.panelName || ''}`.toLowerCase().includes(keyword))
      : source;
    return filtered.slice(0, limit);
  }

  function showSearchableBookmarkMenu(event, bookmarks, onSelect, placeholder = '搜索标签') {
    closeContextMenu();
    activeContextMenu = document.createElement('div');
    activeContextMenu.className = 'context-menu bookmark-picker-menu';
    activeContextMenu.innerHTML = `
      <div class="bookmark-picker-search">
        <input type="text" placeholder="${escapeAttr(placeholder)}" autocomplete="off">
      </div>
      <div class="bookmark-picker-list"></div>
    `;
    const input = activeContextMenu.querySelector('input');
    const list = activeContextMenu.querySelector('.bookmark-picker-list');
    const render = () => {
      const rows = filterBookmarkOptions(bookmarks, input.value, 80);
      list.innerHTML = rows.length ? rows.map((item, index) => bookmarkPickerItemHtml(item, index)).join('') : '<div class="bookmark-picker-empty">没有匹配的标签</div>';
      list.querySelectorAll('.bookmark-picker-item').forEach(button => {
        button.addEventListener('click', () => {
          const item = rows[Number(button.dataset.index)];
          closeContextMenu();
          if (item) onSelect(item);
        });
      });
    };
    activeContextMenu.addEventListener('click', event => event.stopPropagation());
    activeContextMenu.addEventListener('mousedown', event => event.stopPropagation());
    input.addEventListener('input', render);
    input.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeContextMenu();
      if (event.key === 'Enter') {
        event.preventDefault();
        const item = filterBookmarkOptions(bookmarks, input.value, 1)[0];
        if (item) {
          closeContextMenu();
          onSelect(item);
        }
      }
    });
    render();
    document.body.appendChild(activeContextMenu);
    placeContextMenu(event);
    setTimeout(() => input.focus(), 0);
    setTimeout(() => document.addEventListener('click', closeContextMenu, { once: true }), 0);
  }

  function bookmarkPickerItemHtml(item, index) {
    const name = item.name || domainOf(item.url) || item.url;
    const meta = [item.cardName, domainOf(item.url)].filter(Boolean).join(' · ');
    const icon = item.icon || faviconFor(item.url);
    return `
      <button class="bookmark-picker-item" data-index="${index}" type="button">
        <span class="context-icon"><img src="${escapeAttr(icon)}" alt=""></span>
        <span class="bookmark-picker-text">
          <strong>${escapeHtml(name)}</strong>
          <small>${escapeHtml(meta)}</small>
        </span>
      </button>
    `;
  }

  function bindBookmarkSearchBox() {
    const input = document.getElementById('searchInput');
    const box = document.getElementById('searchForm');
    if (!input || !box) return;
    input.addEventListener('input', () => renderBookmarkSearchResults());
    input.addEventListener('focus', () => renderBookmarkSearchResults());
    input.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeBookmarkSearchResults();
      if (event.key === 'ArrowDown') {
        const first = document.querySelector('.bookmark-search-result');
        if (first) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    window.addEventListener('resize', closeBookmarkSearchResults);
    document.addEventListener('click', event => {
      const panel = document.getElementById('bookmarkSearchPopover');
      if (!panel) return;
      if (panel.contains(event.target) || box.contains(event.target)) return;
      closeBookmarkSearchResults();
    });
  }

  function renderBookmarkSearchResults() {
    const input = document.getElementById('searchInput');
    const box = document.getElementById('searchForm');
    if (!input || !box) return;
    const query = input.value.trim();
    if (query.length < 1) {
      closeBookmarkSearchResults();
      return;
    }
    const rows = filterBookmarkOptions(collectBookmarkOptions(), query, 18);
    if (!rows.length) {
      closeBookmarkSearchResults();
      return;
    }
    let panel = document.getElementById('bookmarkSearchPopover');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'bookmarkSearchPopover';
      panel.className = 'bookmark-search-popover';
      document.body.appendChild(panel);
    }
    const rect = box.getBoundingClientRect();
    panel.style.left = `${rect.left}px`;
    panel.style.top = `${rect.bottom + 8}px`;
    panel.style.width = `${rect.width}px`;
    panel.innerHTML = `
      <div class="bookmark-search-head">标签搜索</div>
      ${rows.map((item, index) => bookmarkSearchItemHtml(item, index)).join('')}
    `;
    panel.querySelectorAll('.bookmark-search-result').forEach(button => {
      button.addEventListener('click', () => {
        const item = rows[Number(button.dataset.index)];
        if (item) openBookmarkFromSearch(item);
      });
      button.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          closeBookmarkSearchResults();
          input.focus();
        }
        if (event.key === 'Enter') {
          event.preventDefault();
          const item = rows[Number(button.dataset.index)];
          if (item) openBookmarkFromSearch(item);
        }
      });
    });
  }

  function bookmarkSearchItemHtml(item, index) {
    const name = item.name || domainOf(item.url) || item.url;
    const meta = [item.cardName, domainOf(item.url)].filter(Boolean).join(' · ');
    const icon = item.icon || faviconFor(item.url);
    return `
      <button class="bookmark-search-result" data-index="${index}" type="button">
        <span class="bookmark-search-icon"><img src="${escapeAttr(icon)}" alt=""></span>
        <span>
          <strong>${escapeHtml(name)}</strong>
          <small>${escapeHtml(meta)}</small>
        </span>
      </button>
    `;
  }

  function openBookmarkFromSearch(item) {
    if (!item?.url) return;
    closeBookmarkSearchResults();
    recordRecentLink(item);
    const target = getSettings().linkNewWindow !== false ? '_blank' : '_self';
    window.open(normalizeUrl(item.url), target, 'noopener,noreferrer');
  }

  function closeBookmarkSearchResults() {
    document.getElementById('bookmarkSearchPopover')?.remove();
  }

  function normalizeRecentLinks(list) {
    return (Array.isArray(list) ? list : [])
      .filter(item => item && item.url)
      .map(item => ({
        name: item.name || domainOf(item.url) || item.url,
        url: normalizeUrl(item.url),
        icon: item.icon || faviconFor(item.url),
        usedAt: Number(item.usedAt) || 0,
        count: Number(item.count) || 0
      }))
      .sort((a, b) => b.usedAt - a.usedAt);
  }

  function cssEscapeValue(value) {
    if (window.CSS && typeof CSS.escape === 'function') return CSS.escape(String(value));
    return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function toggleCardImmediate(card) {
    if (!card) return;
    const nextCollapsed = !card.collapsed;
    const cardEl = document.querySelector(`.card[data-card-id="${cssEscapeValue(card.id)}"]`);
    const body = cardEl?.querySelector('.card-body');
    if (body) body.classList.toggle('collapsed', nextCollapsed);
    PanelManager.toggleCard(card.id);
  }

  function showCardMenu(event, card) {
    showContextMenu(event, [
      ['添加链接', () => openAddBookmarkModal(card.id, card.name), '', icons.menuAddLink],
      ['模块设置', () => openEditCardModal(card), '', icons.menuEdit],
      [card.collapsed ? '展开模块' : '折叠模块', () => toggleCardImmediate(card), '', icons.menuCollapse],
      ['删除模块', () => PanelManager.deleteCard(card.id), 'danger', icons.menuTrash]
    ]);
  }

  function showBookmarkMenu(event, card, bm, bmIndex) {
    if (getSettings().collectionMode === 'desktop') {
      showContextMenu(event, [
        ['在新标签页打开', () => {
          window.open(normalizeUrl(bm.url || '#'), '_blank', 'noopener,noreferrer');
          recordRecentLink(bm);
        }, '', icons.menuAddLink],
        ['编辑', () => openEditBookmarkModal(card.id, bmIndex, bm), '', icons.menuEdit],
        ['删除', () => {
          if (confirm(`确定删除“${bm.name || bm.url || '标签'}”吗？`)) PanelManager.removeBookmark(card.id, bmIndex);
        }, 'danger', icons.menuTrash],
        ['移动到桌面', () => PanelManager.releaseBookmark(card.id, bmIndex), '', icons.menuRelease || icons.menuAddLink]
      ]);
      return;
    }
    const items = [
      ['编辑链接', () => openEditBookmarkModal(card.id, bmIndex, bm), '', icons.menuEdit],
      ['复制网址', () => copyText(bm.url), '', icons.menuCopy],
      ...(((getSettings().collectionMode === 'desktop') && (card.bookmarks || []).length > 1)
        ? [['释放为独立图标', () => PanelManager.releaseBookmark(card.id, bmIndex), '', icons.menuRelease || icons.menuAddLink]]
        : []),
      ['删除链接', () => {
        if (confirm(`确定删除“${bm.name}”吗？`)) PanelManager.removeBookmark(card.id, bmIndex);
      }, 'danger', icons.menuTrash]
    ];
    showContextMenu(event, items);
  }

  function showDesktopAddMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    showContextMenu(event, [
      ['添加组件', () => openAddModuleModal(0), '', icons.menuPanels || icons.menuAddLink],
      ['添加网址', () => openAddStandaloneLinkModal(), '', icons.menuAddLink]
    ]);
  }

  function showDesktopShortcutMenu(event, card, bm, bmIndex) {
    closeContextMenu();
    activeContextMenu = document.createElement('div');
    activeContextMenu.className = 'context-menu desktop-folder-context';
    activeContextMenu.innerHTML = `
      <div class="context-section-title"><span class="context-icon">${icons.menuLayout || icons.menuPanels || ''}</span><span>布局</span></div>
      <div class="context-layout-grid">
        ${['1x1', '1x2', '2x1', '2x2', '2x4'].map(layout => `
          <button class="${(card.desktopLayout || '1x1') === layout ? 'active' : ''}" data-layout="${layout}" type="button">${layout}</button>
        `).join('')}
      </div>
      <button data-action="open" type="button"><span class="context-icon">${icons.menuAddLink || ''}</span><span>打开</span></button>
      <button data-action="edit-home" type="button"><span class="context-icon">${icons.menuEdit}</span><span>编辑主页</span></button>
      <button data-action="edit-link" type="button"><span class="context-icon">${icons.menuEdit}</span><span>编辑链接</span></button>
      <button data-action="copy" type="button"><span class="context-icon">${icons.menuCopy}</span><span>复制网址</span></button>
      <button data-action="delete" type="button"><span class="context-icon">${icons.menuTrash}</span><span>删除</span></button>
    `;
    activeContextMenu.querySelectorAll('[data-layout]').forEach(button => {
      button.addEventListener('click', () => {
        closeContextMenu();
        PanelManager.setCardDesktopLayout(card.id, button.dataset.layout);
      });
    });
    activeContextMenu.querySelector('[data-action="open"]')?.addEventListener('click', () => {
      closeContextMenu();
      window.open(normalizeUrl(bm.url || '#'), getSettings().linkNewWindow !== false ? '_blank' : '_self');
      recordRecentLink(bm);
    });
    activeContextMenu.querySelector('[data-action="edit-home"]')?.addEventListener('click', () => {
      closeContextMenu();
      enterDesktopEditMode();
    });
    activeContextMenu.querySelector('[data-action="edit-link"]')?.addEventListener('click', () => {
      closeContextMenu();
      openDesktopIconSettings();
    });
    activeContextMenu.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
      closeContextMenu();
      copyText(bm.url);
    });
    activeContextMenu.querySelector('[data-action="delete"]')?.addEventListener('click', () => {
      closeContextMenu();
      PanelManager.deleteCard(card.id);
    });
    document.body.appendChild(activeContextMenu);
    placeContextMenu(event);
    setTimeout(() => document.addEventListener('click', closeContextMenu, { once: true }), 0);
  }

  function showDesktopFolderMenu(event, card) {
    closeContextMenu();
    activeContextMenu = document.createElement('div');
    activeContextMenu.className = 'context-menu desktop-folder-context';
    activeContextMenu.innerHTML = `
      <div class="context-section-title"><span class="context-icon">${icons.menuLayout || icons.menuPanels || ''}</span><span>布局</span></div>
      <div class="context-layout-grid">
        ${['1x1', '1x2', '2x1', '2x2', '2x4'].map(layout => `
          <button class="${(card.desktopLayout || '1x1') === layout ? 'active' : ''}" data-layout="${layout}" type="button">${layout}</button>
        `).join('')}
      </div>
      <button data-action="edit" type="button"><span class="context-icon">${icons.menuEdit}</span><span>编辑主页</span></button>
      <button data-action="delete" type="button"><span class="context-icon">${icons.menuTrash}</span><span>删除</span></button>
      <button data-action="release" type="button"><span class="context-icon">${icons.menuRelease || icons.menuAddLink}</span><span>释放</span></button>
    `;
    activeContextMenu.querySelectorAll('[data-layout]').forEach(button => {
      button.addEventListener('click', () => {
        closeContextMenu();
        PanelManager.setCardDesktopLayout(card.id, button.dataset.layout);
      });
    });
    activeContextMenu.querySelector('[data-action="edit"]')?.addEventListener('click', () => {
      closeContextMenu();
      enterDesktopEditMode();
    });
    activeContextMenu.querySelector('[data-action="delete"]')?.addEventListener('click', () => {
      closeContextMenu();
      PanelManager.deleteCard(card.id);
    });
    activeContextMenu.querySelector('[data-action="release"]')?.addEventListener('click', () => {
      closeContextMenu();
      if (confirm(`确定释放“${card.name}”里的所有标签吗？`)) {
        PanelManager.releaseCardBookmarks(card.id);
      }
    });
    document.body.appendChild(activeContextMenu);
    placeContextMenu(event);
    setTimeout(() => document.addEventListener('click', closeContextMenu, { once: true }), 0);
  }

  function showDesktopShortcutMenu(event, card, bm, bmIndex) {
    closeContextMenu();
    activeContextMenu = document.createElement('div');
    activeContextMenu.className = 'context-menu desktop-folder-context itab-context-menu';
    activeContextMenu.innerHTML = `
      <button data-action="open-new" type="button"><span class="context-icon">${icons.menuAddLink || ''}</span><span>在新标签页打开</span></button>
      <div class="context-section-title"><span class="context-icon">${icons.menuLayout || icons.menuPanels || ''}</span><span>布局</span></div>
      <div class="context-layout-grid">
        ${['1x1', '1x2', '2x1', '2x2', '2x4'].map(layout => `
          <button class="${(card.desktopLayout || '1x1') === layout ? 'active' : ''}" data-layout="${layout}" type="button">${layout}</button>
        `).join('')}
      </div>
      <button data-action="edit-link" type="button"><span class="context-icon">${icons.menuEdit}</span><span>编辑图标</span></button>
      <button data-action="edit-home" type="button"><span class="context-icon">${icons.menuEdit}</span><span>编辑主页</span></button>
      <button data-action="copy" type="button"><span class="context-icon">${icons.menuCopy}</span><span>复制网址</span></button>
      <button data-action="delete" type="button"><span class="context-icon">${icons.menuTrash}</span><span>删除</span></button>
    `;
    activeContextMenu.querySelectorAll('[data-layout]').forEach(button => {
      button.addEventListener('click', () => {
        closeContextMenu();
        PanelManager.setCardDesktopLayout(card.id, button.dataset.layout);
      });
    });
    activeContextMenu.querySelector('[data-action="open-new"]')?.addEventListener('click', () => {
      closeContextMenu();
      window.open(normalizeUrl(bm.url || '#'), '_blank', 'noopener,noreferrer');
      recordRecentLink(bm);
    });
    activeContextMenu.querySelector('[data-action="edit-home"]')?.addEventListener('click', () => {
      closeContextMenu();
      enterDesktopEditMode();
    });
    activeContextMenu.querySelector('[data-action="edit-link"]')?.addEventListener('click', () => {
      closeContextMenu();
      openDesktopIconSettings();
    });
    activeContextMenu.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
      closeContextMenu();
      copyText(bm.url);
    });
    activeContextMenu.querySelector('[data-action="delete"]')?.addEventListener('click', () => {
      closeContextMenu();
      PanelManager.deleteCard(card.id);
    });
    document.body.appendChild(activeContextMenu);
    placeContextMenu(event);
    setTimeout(() => document.addEventListener('click', closeContextMenu, { once: true }), 0);
  }

  function showDesktopFolderMenu(event, card) {
    closeContextMenu();
    activeContextMenu = document.createElement('div');
    activeContextMenu.className = 'context-menu desktop-folder-context itab-context-menu';
    activeContextMenu.innerHTML = `
      <div class="context-section-title"><span class="context-icon">${icons.menuLayout || icons.menuPanels || ''}</span><span>布局</span></div>
      <div class="context-layout-grid">
        ${['1x1', '1x2', '2x1', '2x2', '2x4'].map(layout => `
          <button class="${(card.desktopLayout || '1x1') === layout ? 'active' : ''}" data-layout="${layout}" type="button">${layout}</button>
        `).join('')}
      </div>
      <button data-action="edit-card" type="button"><span class="context-icon">${icons.menuEdit}</span><span>编辑图标</span></button>
      <button data-action="edit-home" type="button"><span class="context-icon">${icons.menuEdit}</span><span>编辑主页</span></button>
      <button data-action="delete" type="button"><span class="context-icon">${icons.menuTrash}</span><span>删除</span></button>
      <button data-action="release" type="button"><span class="context-icon">${icons.menuRelease || icons.menuAddLink}</span><span>释放</span></button>
    `;
    activeContextMenu.querySelectorAll('[data-layout]').forEach(button => {
      button.addEventListener('click', () => {
        closeContextMenu();
        PanelManager.setCardDesktopLayout(card.id, button.dataset.layout);
      });
    });
    activeContextMenu.querySelector('[data-action="edit-card"]')?.addEventListener('click', () => {
      closeContextMenu();
      openDesktopIconSettings();
    });
    activeContextMenu.querySelector('[data-action="edit-home"]')?.addEventListener('click', () => {
      closeContextMenu();
      enterDesktopEditMode();
    });
    activeContextMenu.querySelector('[data-action="delete"]')?.addEventListener('click', () => {
      closeContextMenu();
      PanelManager.deleteCard(card.id);
    });
    activeContextMenu.querySelector('[data-action="release"]')?.addEventListener('click', () => {
      closeContextMenu();
      if (confirm(`确定释放“${card.name || '分组'}”里的所有标签吗？`)) {
        PanelManager.releaseCardBookmarks(card.id);
      }
    });
    document.body.appendChild(activeContextMenu);
    placeContextMenu(event);
    setTimeout(() => document.addEventListener('click', closeContextMenu, { once: true }), 0);
  }

  function showContextMenu(event, items) {
    closeContextMenu();
    activeContextMenu = document.createElement('div');
    activeContextMenu.className = `context-menu${getSettings().collectionMode === 'desktop' ? ' itab-context-menu' : ''}`;
    items.forEach(([label, action, danger, icon]) => {
      const button = document.createElement('button');
      button.innerHTML = `<span class="context-icon">${icon || ''}</span><span>${escapeHtml(label)}</span>`;
      if (danger) button.className = 'danger-text';
      button.addEventListener('click', menuEvent => {
        menuEvent.preventDefault();
        menuEvent.stopPropagation();
        closeContextMenu();
        action();
      });
      activeContextMenu.appendChild(button);
    });
    document.body.appendChild(activeContextMenu);
    placeContextMenu(event);
    setTimeout(() => document.addEventListener('click', closeContextMenu, { once: true }), 0);
  }

  function placeContextMenu(event) {
    const rect = activeContextMenu.getBoundingClientRect();
    activeContextMenu.style.left = `${Math.max(8, Math.min(event.clientX, window.innerWidth - rect.width - 8))}px`;
    activeContextMenu.style.top = `${Math.max(8, Math.min(event.clientY, window.innerHeight - rect.height - 8))}px`;
  }

  function closeContextMenu() {
    activeContextMenu?.remove();
    activeContextMenu = null;
  }

  function handleCardTitleDblClick(card) {
    switch (getSettings().dblClick) {
      case 'edit': openEditCardModal(card); break;
      case 'collapse': toggleCardImmediate(card); break;
      case 'addlink': openAddBookmarkModal(card.id, card.name); break;
      default: break;
    }
  }

  function openAddBookmarkModal(cardId, cardName) {
    document.getElementById('addLinkTitle').textContent = `添加链接到：${cardName}`;
    document.getElementById('addLinkCardId').value = cardId;
    document.getElementById('addLinkUrl').value = '';
    document.getElementById('addLinkName').value = '';
    document.getElementById('addLinkName').dataset.autoTitle = '1';
    document.getElementById('addLinkRemark').value = '';
    document.getElementById('addLinkIcon').value = '';
    showModal('addLinkModal');
    setTimeout(() => document.getElementById('addLinkUrl')?.focus(), 40);
  }

  function openAddStandaloneLinkModal() {
    document.getElementById('addLinkTitle').textContent = '添加网址';
    document.getElementById('addLinkCardId').value = '__standalone__';
    document.getElementById('addLinkUrl').value = '';
    document.getElementById('addLinkName').value = '';
    document.getElementById('addLinkName').dataset.autoTitle = '1';
    document.getElementById('addLinkRemark').value = '';
    document.getElementById('addLinkIcon').value = '';
    showModal('addLinkModal');
    setTimeout(() => document.getElementById('addLinkUrl')?.focus(), 40);
  }

  function enterDesktopEditMode() {
    desktopEditing = true;
    document.body.dataset.desktopEditing = 'true';
    refreshAll();
    showToast('已进入主页编辑模式，点击右上角 × 可删除，按 Esc 退出。', 'success');
  }

  function exitDesktopEditMode() {
    if (!desktopEditing) return;
    desktopEditing = false;
    delete document.body.dataset.desktopEditing;
    refreshAll();
  }

  function openEditCardModal(card) {
    document.getElementById('modalTitle').textContent = `编辑模块 - ${card.name}`;
    document.getElementById('cardNameField').style.display = '';
    document.getElementById('cardName').value = card.name || '';
    document.getElementById('cardBookmarks').value = formatBookmarks(card.bookmarks || []);
    document.getElementById('cardEditIndex').value = card.id;
    fillCardStyleFields(card.style);
    ensureBulkMoveControls();
    renderBulkMoveTargets(card.id);
    renderBulkBookmarkList();
    showModal('cardModal');
  }

  function openAddModuleModal(columnIndex) {
    const count = getColumnCount();
    const selected = Math.max(0, Math.min(Number(columnIndex) || 0, count - 1));
    const picker = document.getElementById('newModuleColumnPicker');
    document.getElementById('newModuleName').value = '';
    document.getElementById('newModuleColumn').value = String(selected);
    if (picker) {
      picker.innerHTML = Array.from({ length: count }, (_, index) => `
        <button type="button" class="column-choice${index === selected ? ' active' : ''}" data-column="${index}">列${index + 1}</button>
      `).join('');
      picker.querySelectorAll('.column-choice').forEach(button => {
        button.addEventListener('click', () => {
          picker.querySelectorAll('.column-choice').forEach(item => item.classList.remove('active'));
          button.classList.add('active');
          document.getElementById('newModuleColumn').value = button.dataset.column;
        });
      });
    }
    showModal('addModuleModal');
    setTimeout(() => document.getElementById('newModuleName')?.focus(), 40);
  }

  function saveAddModuleModal() {
    const name = document.getElementById('newModuleName').value.trim();
    if (!name) {
      showToast('请输入模块名称', 'error');
      document.getElementById('newModuleName').focus();
      return;
    }
    PanelManager.addCardAtColumn(name, Number(document.getElementById('newModuleColumn').value), getColumnCount());
    hideModals();
    showToast('模块已添加', 'success');
  }

  async function saveAddLinkModal() {
    const cardId = document.getElementById('addLinkCardId').value;
    const url = normalizeUrl(document.getElementById('addLinkUrl').value.trim());
    const remark = document.getElementById('addLinkRemark').value.trim().slice(0, 100);
    let name = document.getElementById('addLinkName').value.trim();
    let icon = document.getElementById('addLinkIcon').value || faviconFor(url);
    if (!url) {
      showToast('请输入 URL', 'error');
      document.getElementById('addLinkUrl').focus();
      return;
    }
    const domain = domainOf(url);
    if (document.getElementById('addLinkName').dataset.autoTitle !== '0' && (!name || name === domain)) {
      const meta = await resolveLinkMeta(url);
      name = meta.name || name;
      icon = meta.icon || icon;
    }
    if (!name) name = domainOf(url) || url;
    if (cardId === '__standalone__') {
      const card = PanelManager.addCard(name, [{ name, url, remark, icon }]);
      if (card) {
        card.desktopLayout = '1x1';
        Storage.save(appData).then(() => refreshAll());
      }
    } else {
      PanelManager.addBookmark(cardId, name, url, remark, icon);
    }
    hideModals();
    showToast('链接已添加', 'success');
  }

  async function fillLinkTitleFromUrl() {
    const urlEl = document.getElementById('addLinkUrl');
    const titleEl = document.getElementById('addLinkName');
    const iconEl = document.getElementById('addLinkIcon');
    const raw = urlEl.value.trim();
    if (!raw || titleEl.dataset.autoTitle === '0') return;
    const url = normalizeUrl(raw);
    const meta = await resolveLinkMeta(url);
    if (titleEl.dataset.autoTitle !== '0') {
      titleEl.value = meta.name || domainOf(url);
    }
    iconEl.value = meta.icon || faviconFor(url);
  }

  function openEditBookmarkModal(cardId, bmIndex, bm) {
    document.getElementById('editBmName').value = bm.name || '';
    document.getElementById('editBmUrl').value = bm.url || '';
    document.getElementById('editBmRemark').value = bm.remark || '';
    document.getElementById('editBmIcon').value = bm.icon || '';
    const fileInput = document.getElementById('editBmIconFile');
    if (fileInput) fileInput.value = '';
    updateEditIconPreview(bm.icon || faviconFor(bm.url), bm.name || bm.url);
    document.getElementById('editBmCardId').value = cardId;
    document.getElementById('editBmIndex').value = String(bmIndex);
    showModal('editBookmarkModal');
  }

  function updateEditIconPreview(icon, fallbackText) {
    const preview = document.getElementById('editBmIconPreview');
    if (!preview) return;
    const fallback = (fallbackText || '?').trim().charAt(0).toUpperCase() || '?';
    if (icon) {
      preview.innerHTML = `<img src="${escapeAttr(icon)}" alt="">`;
      const img = preview.querySelector('img');
      attachIconFallback(img, preview, '', fallback, icon);
      return;
    }
    preview.textContent = fallback;
  }

  function handleEditIconUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件', 'error');
      event.target.value = '';
      return;
    }
    if (file.size > 256 * 1024) {
      showToast('图标图片请控制在 256KB 以内', 'error');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result || '');
      document.getElementById('editBmIcon').value = value;
      updateEditIconPreview(value, document.getElementById('editBmName').value);
    };
    reader.readAsDataURL(file);
  }

  function resetEditIcon() {
    const url = document.getElementById('editBmUrl').value.trim();
    const name = document.getElementById('editBmName').value.trim();
    const fileInput = document.getElementById('editBmIconFile');
    if (fileInput) fileInput.value = '';
    document.getElementById('editBmIcon').value = '';
    updateEditIconPreview(faviconFor(url), name || url);
  }

  function saveCardModal() {
    const name = document.getElementById('cardName').value.trim();
    const cardId = document.getElementById('cardEditIndex').value;
    const existingCard = getCardById(cardId);
    const bookmarks = parseBookmarks(document.getElementById('cardBookmarks').value, existingCard?.bookmarks || []);
    const style = readCardStyleFields();
    if (!name) {
      showToast('请输入模块名称', 'error');
      return;
    }
    const syncedCount = syncStyleToOtherCards(cardId, style);
    if (cardId && cardId !== '-1') PanelManager.editCard(cardId, name, bookmarks, style);
    else PanelManager.addCard(name, bookmarks, style);
    hideModals();
    showToast(syncedCount ? `模块已保存，已同步 ${syncedCount} 个分组` : '模块已保存', 'success');
  }

  function saveBookmarkModal() {
    const cardId = document.getElementById('editBmCardId').value;
    const index = Number(document.getElementById('editBmIndex').value);
    const name = document.getElementById('editBmName').value.trim();
    const url = normalizeUrl(document.getElementById('editBmUrl').value.trim());
    const remark = document.getElementById('editBmRemark').value.trim().slice(0, 100);
    const icon = document.getElementById('editBmIcon').value || faviconFor(url);
    if (!name || !url) {
      showToast('标题和链接不能为空', 'error');
      return;
    }
    PanelManager.updateBookmark(cardId, index, name, url, remark, icon);
    hideModals();
    showToast('链接已更新', 'success');
  }

  function getCardById(cardId) {
    return (PanelManager.getActivePanel()?.cards || []).find(card => card.id === cardId);
  }

  function formatBookmarks(bookmarks) {
    return (bookmarks || []).map(bm => {
      const name = bm.name || '';
      const url = bm.url || '';
      const remark = bm.remark || '';
      return remark ? `${name}|${url}|${remark}` : `${name}|${url}`;
    }).join('\n');
  }

  function parseBookmarkLine(line, existingByUrl = new Map()) {
    const parts = String(line || '').split('|');
    const name = (parts[0] || '').trim();
    const rawUrl = (parts[1] || '').trim();
    const remark = parts.slice(2).join('|').trim().slice(0, 100);
    const url = normalizeUrl(rawUrl);
    const existing = existingByUrl.get(url);
    if (!name || !url) return null;
    return {
      name,
      url,
      remark,
      icon: existing?.icon || faviconFor(url)
    };
  }

  function parseBookmarks(text, existingBookmarks = []) {
    const existingByUrl = new Map((existingBookmarks || [])
      .filter(bm => bm?.url)
      .map(bm => [normalizeUrl(bm.url), bm]));
    return text.split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => parseBookmarkLine(line, existingByUrl))
      .filter(Boolean);
  }

  function ensureBulkMoveControls() {
    const actions = document.querySelector('#bulkBookmarkTools .bulk-head > div');
    if (!actions || document.getElementById('bulkMoveSelected')) return;
    const select = document.createElement('select');
    select.id = 'bulkMoveTarget';
    select.className = 'bulk-move-select';
    select.title = '移动到分组';
    const moveButton = document.createElement('button');
    moveButton.id = 'bulkMoveSelected';
    moveButton.type = 'button';
    moveButton.className = 'ghost-btn';
    moveButton.textContent = '移动';
    actions.prepend(moveButton);
    actions.prepend(select);
  }

  function renderBulkMoveTargets(currentCardId) {
    const select = document.getElementById('bulkMoveTarget');
    if (!select) return;
    const cards = PanelManager.getActivePanel()?.cards || [];
    const targets = cards.filter(card => card.id !== currentCardId);
    select.innerHTML = targets.length
      ? targets.map(card => `<option value="${escapeAttr(card.id)}">${escapeHtml(card.name || '未命名模块')}</option>`).join('')
      : '<option value="">无其他分组</option>';
    select.disabled = targets.length === 0;
  }

  function renderBulkBookmarkList() {
    const textarea = document.getElementById('cardBookmarks');
    const list = document.getElementById('bulkBookmarkList');
    if (!textarea || !list) return;
    const rows = textarea.value.split(/\r?\n/)
      .map((line, index) => ({ line: line.trim(), index }))
      .filter(row => row.line)
      .map(row => ({ ...row, item: parseBookmarkLine(row.line) }))
      .filter(row => row.item);
    if (!rows.length) {
      list.innerHTML = '<div class="bulk-empty">暂无可批量编辑的标签</div>';
      return;
    }
    list.innerHTML = rows.map(row => `
      <label class="bulk-bookmark-row">
        <input type="checkbox" data-line-index="${row.index}">
        <span>
          <span class="bulk-bookmark-title">${escapeHtml(row.item.name)}</span>
          <span class="bulk-bookmark-meta">${escapeHtml(row.item.remark || '')}</span>
        </span>
      </label>
    `).join('');
  }

  function selectAllBulkBookmarks() {
    document.querySelectorAll('#bulkBookmarkList input[type="checkbox"]').forEach(input => {
      input.checked = true;
    });
  }

  function deleteSelectedBulkBookmarks() {
    const textarea = document.getElementById('cardBookmarks');
    if (!textarea) return;
    const selected = new Set(Array.from(document.querySelectorAll('#bulkBookmarkList input[type="checkbox"]:checked'))
      .map(input => Number(input.dataset.lineIndex)));
    if (!selected.size) {
      showToast('请选择要删除的标签', 'error');
      return;
    }
    textarea.value = textarea.value.split(/\r?\n/)
      .filter((line, index) => !selected.has(index))
      .join('\n');
    renderBulkBookmarkList();
  }

  function moveSelectedBulkBookmarks() {
    const textarea = document.getElementById('cardBookmarks');
    const sourceId = document.getElementById('cardEditIndex')?.value;
    const targetId = document.getElementById('bulkMoveTarget')?.value;
    const sourceCard = getCardById(sourceId);
    const targetCard = getCardById(targetId);
    if (!textarea || !sourceCard || !targetCard || sourceId === targetId) {
      showToast('请选择要移动到的其他分组', 'error');
      return;
    }
    const selected = new Set(Array.from(document.querySelectorAll('#bulkBookmarkList input[type="checkbox"]:checked'))
      .map(input => Number(input.dataset.lineIndex)));
    if (!selected.size) {
      showToast('请选择要移动的标签', 'error');
      return;
    }

    const existingByUrl = new Map((sourceCard.bookmarks || [])
      .filter(bm => bm?.url)
      .map(bm => [normalizeUrl(bm.url), bm]));
    const lines = textarea.value.split(/\r?\n/);
    const moved = [];
    const remainingLines = [];
    lines.forEach((line, index) => {
      if (!line.trim()) return;
      if (selected.has(index)) {
        const item = parseBookmarkLine(line, existingByUrl);
        if (item) moved.push(item);
      } else {
        remainingLines.push(line);
      }
    });
    if (!moved.length) {
      showToast('没有可移动的标签', 'error');
      return;
    }

    textarea.value = remainingLines.join('\n');
    sourceCard.name = document.getElementById('cardName')?.value.trim() || sourceCard.name;
    sourceCard.bookmarks = parseBookmarks(textarea.value, sourceCard.bookmarks || []);
    sourceCard.style = readCardStyleFields();
    if (!Array.isArray(targetCard.bookmarks)) targetCard.bookmarks = [];
    targetCard.bookmarks.push(...moved);
    PanelManager.savePanel();
    refreshAll();
    renderBulkBookmarkList();
    renderBulkMoveTargets(sourceId);
    showToast(`已移动 ${moved.length} 个标签`, 'success');
  }

  function readCardStyleFields() {
    return normalizeCardStyle({
      borderColor: valueOf('cardBorderColor'),
      borderOpacity: Number(valueOf('cardBorderOpacity')),
      bodyOpacity: Number(valueOf('cardBodyOpacity')),
      titleFontColor: checkedOf('cardTitleFontAuto') ? '' : valueOf('cardTitleFontColor'),
      fontColor: valueOf('cardFontColor'),
      fontSize: Number(valueOf('cardFontSize'))
    });
  }

  function fillCardStyleFields(style) {
    const next = normalizeCardStyle(style);
    setValue('cardBorderColor', next.borderColor);
    setValue('cardBorderOpacity', String(next.borderOpacity));
    setValue('cardBodyOpacity', String(next.bodyOpacity));
    setValue('cardTitleFontColor', next.titleFontColor || readableTextColor(next.borderColor));
    setChecked('cardTitleFontAuto', !next.titleFontColor);
    const titleFontColor = document.getElementById('cardTitleFontColor');
    if (titleFontColor) titleFontColor.disabled = !next.titleFontColor;
    setValue('cardFontColor', resolveCardFontColor(next.fontColor));
    setValue('cardFontSize', String(next.fontSize));
    setChecked('syncStyleEnabled', false);
    ['syncHeaderStyle', 'syncBodyBackground', 'syncTitleFontColor', 'syncLinkFontColor'].forEach(id => setChecked(id, true));
  }

  function normalizeCardStyle(style = {}) {
    const borderColor = isHexColor(style.borderColor) ? style.borderColor : '#8fb5d1';
    const borderOpacity = clampNumber(style.borderOpacity, 0, 1, 0);
    const bodyOpacity = clampNumber(style.bodyOpacity, 0, 1, 1);
    const titleFontColor = isHexColor(style.titleFontColor) ? style.titleFontColor : '';
    const fontColor = isHexColor(style.fontColor) ? style.fontColor : '';
    const fontSize = Math.round(clampNumber(style.fontSize, 12, 20, 15));
    return { borderColor, borderOpacity, bodyOpacity, titleFontColor, fontColor, fontSize };
  }

  function syncStyleToOtherCards(cardId, style) {
    if (!checkedOf('syncStyleEnabled')) return 0;
    const panel = PanelManager.getActivePanel();
    const cards = panel?.cards || [];
    let changed = 0;
    cards.forEach(card => {
      if (!card || card.id === cardId) return;
      const next = normalizeCardStyle(card.style || {});
      if (checkedOf('syncHeaderStyle')) {
        next.borderColor = style.borderColor;
        next.borderOpacity = style.borderOpacity;
      }
      if (checkedOf('syncBodyBackground')) {
        next.bodyOpacity = style.bodyOpacity;
      }
      if (checkedOf('syncTitleFontColor')) {
        next.titleFontColor = style.titleFontColor;
      }
      if (checkedOf('syncLinkFontColor')) {
        next.fontColor = style.fontColor;
        next.fontSize = style.fontSize;
      }
      card.style = { ...(card.style || {}), ...next };
      changed += 1;
    });
    return changed;
  }

  function applyCardStyle(cardEl, style) {
    const next = normalizeCardStyle(style);
    const linkTextColor = resolveCardFontColor(next.fontColor);
    const headerOpacity = next.borderOpacity;
    cardEl.style.setProperty('--card-body-bg-color', cardSurfaceRgba(next.bodyOpacity));
    cardEl.style.setProperty('--card-body-hover-bg-color', cardSurfaceRgba(Math.min(1, next.bodyOpacity + 0.08)));
    const textColor = next.titleFontColor || readableTextColor(next.borderColor);
    const darkText = colorLuminance(textColor) < 0.5;
    cardEl.style.setProperty('--card-header-bg-color', hexToRgba(next.borderColor, headerOpacity));
    cardEl.style.setProperty('--card-header-solid-color', next.borderColor);
    cardEl.style.setProperty('--card-header-text-color', textColor);
    cardEl.style.setProperty('--card-header-soft-color', darkText ? 'rgba(0,0,0,.18)' : 'rgba(255,255,255,.32)');
    cardEl.style.setProperty('--card-header-hover-color', darkText ? 'rgba(0,0,0,.56)' : 'rgba(255,255,255,.82)');
    cardEl.style.setProperty('--card-header-hover-bg', darkText ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.14)');
    cardEl.style.setProperty('--card-header-more-color', darkText ? 'rgba(0,0,0,.52)' : 'rgba(255,255,255,.72)');
    cardEl.style.setProperty('--card-font-color', linkTextColor);
    cardEl.style.setProperty('--card-font-size', `${next.fontSize}px`);
  }

  function resolveCardFontColor(color) {
    if (isHexColor(color) && !isThemeDefaultCardFont(color)) return color;
    return isResolvedLightTheme() ? '#263244' : '#d8d8d8';
  }

  function isThemeDefaultCardFont(color) {
    return [
      '#ffffff', '#f8fafc', '#f1f5f9', '#eeeeee', '#e6e6e6', '#d8d8d8',
      '#30333a', '#263244', '#202939', '#111827'
    ].includes(String(color || '').toLowerCase());
  }

  function cardSurfaceRgba(opacity) {
    return isResolvedLightTheme() ? `rgba(255, 255, 255, ${opacity})` : `rgba(32, 34, 35, ${opacity})`;
  }

  function isResolvedLightTheme() {
    const theme = getSettings().theme || 'dark';
    const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return theme === 'light' || (theme === 'system' && !systemDark);
  }

  function readableTextColor(hex) {
    return colorLuminance(hex) > 0.58 ? '#111111' : '#ffffff';
  }

  function colorLuminance(hex) {
    const value = hex.replace('#', '');
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  function hexToRgba(hex, opacity) {
    const value = hex.replace('#', '');
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${clampNumber(opacity, 0, 1, 0)})`;
  }

  function isHexColor(value) {
    return /^#[0-9a-f]{6}$/i.test(String(value || ''));
  }

  function clampNumber(value, min, max, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.max(min, Math.min(max, number));
  }

  function normalizeMemos() {
    if (!Array.isArray(appData.memos)) appData.memos = [];
    appData.memos.forEach(memo => {
      if (!memo.id) memo.id = `memo_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      if (!memo.title) memo.title = '未命名备忘录';
      if (typeof memo.content !== 'string') memo.content = '';
      memo.completed = memo.completed === true;
      if (!memo.createdAt) memo.createdAt = new Date().toISOString();
      if (!memo.updatedAt) memo.updatedAt = memo.createdAt;
    });
    return appData.memos;
  }

  function getCurrentMemo() {
    return normalizeMemos().find(memo => !memo.completed) || null;
  }

  function getDockMemo() {
    const memos = normalizeMemos();
    const selectedId = activeMemoId || getSettings().memoDockActiveId;
    return memos.find(memo => memo.id === selectedId)
      || memos.find(memo => !memo.completed)
      || memos[0]
      || null;
  }

  function renderMemoDock() {
    const dock = document.getElementById('memoDock');
    const title = document.getElementById('memoCurrentTitle');
    const currentButton = document.getElementById('memoOpenBtn');
    const titleInput = document.getElementById('memoDockTitleInput');
    const contentInput = document.getElementById('memoDockContentInput');
    const meta = document.getElementById('memoDockMeta');
    if (!dock || !title || !appData) return;
    ensureMemoDockShell(dock);
    const memo = getDockMemo();
    document.body.dataset.memoVisible = 'true';
    dock.hidden = false;
    dock.classList.toggle('collapsed', getSettings().memoDockCollapsed === true);
    const isTop = getSettings().memoDockPosition === 'top';
    const collapseBtn = document.getElementById('memoDockCollapseBtn');
    if (collapseBtn) collapseBtn.style.display = '';
    renderMemoDockSelect(memo);
    renderMemoDockList();
    const excerpt = ensureMemoDockExcerpt(currentButton);
    dock.classList.toggle('empty', !memo);
    const completeBtn = document.getElementById('memoCompleteBtn');
    if (completeBtn) completeBtn.disabled = !memo;
    if (!memo) {
      delete dock.dataset.memoId;
      if (excerpt) excerpt.textContent = '点击打开备忘录，新建或查看内容';
      title.textContent = '暂无备忘录';
      setValueUnlessFocused(titleInput, '');
      setValueUnlessFocused(contentInput, '');
      if (titleInput) titleInput.disabled = true;
      if (contentInput) contentInput.disabled = true;
      if (meta) meta.textContent = '点击 + 新增备忘录';
      return;
    }
    dock.dataset.memoId = memo.id;
    activeMemoId = memo.id;
    if (excerpt) excerpt.textContent = compactText(memo.content || '', 120) || '暂无正文';
    title.textContent = memo.title || '未命名备忘录';
    setValueUnlessFocused(titleInput, memo.title || '');
    setValueUnlessFocused(contentInput, memo.content || '');
    if (titleInput) titleInput.disabled = false;
    if (contentInput) contentInput.disabled = false;
    if (meta) meta.textContent = `最后编辑：${formatMemoTime(memo.updatedAt)}`;
  }

  function ensureMemoDockShell(dock) {
    if (!dock) return;
    const tools = dock.querySelector('.memo-dock-tools');
    let header = dock.querySelector('.memo-dock-header');
    if (!header) {
      header = document.createElement('div');
      header.className = 'memo-dock-header';
      header.innerHTML = `
        <select id="memoDockSelect" class="memo-dock-select" title="切换备忘录"></select>
        <button id="memoDockPinBtn" class="memo-mini-btn memo-pin-btn" type="button" title="固定到顶部" aria-label="固定到顶部">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M7 8h10M8 3h8"></path></svg>
        </button>
        <button id="memoDockCollapseBtn" class="memo-mini-btn memo-complete-btn" type="button" title="完成当前备忘录" aria-label="完成当前备忘录">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg>
        </button>
      `;
      header.addEventListener('pointerdown', startMemoDockDrag);
      header.querySelector('#memoDockSelect')?.addEventListener('change', selectMemoFromDock);
      header.querySelector('#memoDockPinBtn')?.addEventListener('click', toggleMemoDockPinned);
      header.querySelector('#memoDockCollapseBtn')?.addEventListener('click', completeCurrentMemo);
      dock.addEventListener('mouseup', () => saveMemoDockBounds());
      dock.addEventListener('touchend', () => saveMemoDockBounds());
    }
    dock.prepend(header);
    if (tools && !header.contains(tools)) header.appendChild(tools);
    const addButton = header.querySelector('#memoDockAddBtn');
    if (addButton && addButton.dataset.iconReady !== 'true') {
      addButton.dataset.iconReady = 'true';
      addButton.title = '展开到侧边编辑';
      addButton.setAttribute('aria-label', '展开到侧边编辑');
      addButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"></path><path d="M9 5v14"></path><path d="M13 9l3 3-3 3"></path></svg>';
    }
    const sideEditButton = header.querySelector('#memoDockOpenFull');
    if (sideEditButton && sideEditButton.dataset.sideIconReady !== 'true') {
      sideEditButton.dataset.sideIconReady = 'true';
      sideEditButton.title = '侧边编辑';
      sideEditButton.setAttribute('aria-label', '侧边编辑');
      sideEditButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"></path><path d="M15 5v14"></path><path d="M10 9l-3 3 3 3"></path></svg>';
    }
    updateMemoDockToolbar();
    finalizeMemoDockToolbar();
    finalizeMemoDockToolbarState();
    let panel = dock.querySelector('#memoDockPanel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'memoDockPanel';
      panel.className = 'memo-dock-panel';
      panel.innerHTML = `
        <div class="memo-dock-panel-head">
          <strong>备忘录</strong>
          <button id="memoDockPanelAdd" class="memo-add-btn" type="button" title="新增备忘录" aria-label="新增备忘录">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>
          </button>
        </div>
        <label class="memo-dock-position-row">
          <span>固定位置</span>
          <select id="memoDockInlinePosition">
            <option value="left">左侧</option>
            <option value="right">右侧</option>
          </select>
        </label>
        <input id="memoDockSearchInput" class="memo-search memo-dock-search" type="text" placeholder="search" autocomplete="off">
        <div id="memoDockList" class="memo-list memo-dock-list"></div>
      `;
      dock.insertBefore(panel, document.getElementById('memoDockTitleInput'));
      panel.querySelector('#memoDockPanelAdd')?.addEventListener('click', addMemo);
      panel.querySelector('#memoDockSearchInput')?.addEventListener('input', renderMemoDockList);
      panel.querySelector('#memoDockInlinePosition')?.addEventListener('change', saveMemoDockInlineSettings);
    }
    const titleInput = document.getElementById('memoDockTitleInput');
    if (titleInput && panel.nextElementSibling !== titleInput) dock.insertBefore(panel, titleInput);
    const inlinePosition = panel.querySelector('#memoDockInlinePosition');
    if (inlinePosition) inlinePosition.value = ['left', 'right'].includes(getSettings().memoDockPosition) ? getSettings().memoDockPosition : getMemoDockPreferredSide();
  }

  function updateMemoDockToolbar() {
    const position = getSettings().memoDockPosition;
    const buttons = [
      {
        id: 'memoDockCollapseBtn',
        label: '完成当前备忘录',
        disabled: false,
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg>'
      },
      {
        id: 'memoDockPinBtn',
        label: '固定到顶部',
        disabled: position === 'top',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11"></path><path d="M7 8h10"></path><path d="M8 4h8"></path><path d="M9 15h6"></path><path d="M12 15v5"></path></svg>'
      },
      {
        id: 'memoDockAddBtn',
        label: '切换到左侧',
        disabled: position === 'left',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"></path><path d="M10 5v14"></path><path d="M15 9l-3 3 3 3"></path></svg>'
      },
      {
        id: 'memoDockOpenFull',
        label: '切换到右侧',
        disabled: position === 'right',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"></path><path d="M14 5v14"></path><path d="M9 9l3 3-3 3"></path></svg>'
      }
    ];
    buttons.forEach(({ id, label, disabled, icon }) => {
      const button = document.getElementById(id);
      if (!button) return;
      button.title = label;
      button.setAttribute('aria-label', label);
      button.disabled = Boolean(disabled);
      button.innerHTML = icon;
    });
  }

  function finalizeMemoDockToolbar() {
    const position = getSettings().memoDockPosition;
    const switchToLeft = position === 'right';
    const buttons = [
      ['memoDockCollapseBtn', '完成当前备忘录', false, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"></path></svg>'],
      ['memoDockPinBtn', '固定到顶部', position === 'top', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11"></path><path d="M7 8h10"></path><path d="M8 4h8"></path><path d="M9 15h6"></path><path d="M12 15v5"></path></svg>'],
      ['memoDockAddBtn', '新增备忘录', false, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>'],
      ['memoDockOpenFull', switchToLeft ? '切换到左侧' : '切换到右侧', false, switchToLeft
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"></path><path d="M10 5v14"></path><path d="M15 9l-3 3 3 3"></path></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"></path><path d="M14 5v14"></path><path d="M9 9l3 3-3 3"></path></svg>']
    ];
    buttons.forEach(([id, label, disabled, icon]) => {
      const button = document.getElementById(id);
      if (!button) return;
      button.title = label;
      button.setAttribute('aria-label', label);
      button.disabled = Boolean(disabled);
      button.innerHTML = icon;
    });
  }

  function finalizeMemoDockToolbarState() {
    const position = getSettings().memoDockPosition;
    const addButton = document.getElementById('memoDockAddBtn');
    if (addButton) {
      const topMode = position === 'top';
      addButton.disabled = false;
      addButton.classList.toggle('is-side-switch', topMode);
      addButton.title = topMode ? '切换到左侧' : '新增备忘录';
      addButton.setAttribute('aria-label', addButton.title);
      addButton.innerHTML = topMode
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"></path><path d="M10 5v14"></path><path d="M15 9l-3 3 3 3"></path></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>';
    }
    const sideButton = document.getElementById('memoDockOpenFull');
    if (sideButton) {
      const switchToLeft = position === 'right';
      sideButton.disabled = false;
      sideButton.title = switchToLeft ? '切换到左侧' : '切换到右侧';
      sideButton.setAttribute('aria-label', sideButton.title);
      sideButton.innerHTML = switchToLeft
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"></path><path d="M10 5v14"></path><path d="M15 9l-3 3 3 3"></path></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"></path><path d="M14 5v14"></path><path d="M9 9l3 3-3 3"></path></svg>';
    }
  }

  function renderMemoDockSelect(currentMemo) {
    const select = document.getElementById('memoDockSelect');
    if (!select) return;
    const memos = normalizeMemos()
      .slice()
      .sort((a, b) => Number(a.completed) - Number(b.completed) || String(b.updatedAt).localeCompare(String(a.updatedAt)));
    select.innerHTML = memos.length
      ? memos.map(memo => `<option value="${escapeAttr(memo.id)}">${escapeHtml(compactText(`${memo.completed ? '✓ ' : ''}${memo.title || '未命名备忘录'}`, 28))}</option>`).join('')
      : '<option value="">暂无备忘录</option>';
    select.value = currentMemo?.id || '';
  }

  async function selectMemoFromDock(event) {
    const id = event.target.value;
    activeMemoId = id || null;
    appData.settings = { ...getSettings(), memoDockActiveId: id };
    await Storage.save(appData);
    renderMemoDock();
  }

  async function collapseMemoDock(event) {
    event?.preventDefault();
    event?.stopPropagation();
    appData.settings = { ...getSettings(), memoDockPosition: 'top', memoDockCollapsed: false };
    settings = appData.settings;
    await Storage.save(appData);
    applySettings();
    renderMemoDock();
  }

  async function switchMemoDockToLeft(event) {
    event?.preventDefault();
    event?.stopPropagation();
    const current = getSettings();
    if (current.memoDockPosition === 'left') {
      await addMemo();
      return;
    }
    appData.settings = { ...current, memoDockPosition: 'left', memoDockCollapsed: false };
    settings = appData.settings;
    await Storage.save(appData);
    applySettings();
    renderMemoDock();
  }

  async function expandMemoDock() {
    appData.settings = { ...getSettings(), memoDockCollapsed: false };
    settings = appData.settings;
    await Storage.save(appData);
    applySettings();
    renderMemoDock();
  }

  async function toggleMemoDockPinned(event) {
    event?.preventDefault();
    event?.stopPropagation();
    const current = getSettings();
    const side = ['left', 'right'].includes(current.memoDockPosition) ? current.memoDockPosition : getMemoDockPreferredSide();
    appData.settings = { ...current, memoDockPosition: 'top', memoDockLastSide: side, memoDockCollapsed: false };
    settings = appData.settings;
    await Storage.save(appData);
    applySettings();
    renderMemoDock();
  }

  async function switchMemoDockSide(side, event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (!['left', 'right'].includes(side)) return;
    appData.settings = {
      ...getSettings(),
      memoDockPosition: side,
      memoDockLastSide: side,
      memoDockCollapsed: false
    };
    settings = appData.settings;
    await Storage.save(appData);
    applySettings();
    renderMemoDock();
    setTimeout(() => document.getElementById('memoDockContentInput')?.focus?.(), 0);
  }

  function startMemoDockDrag(event) {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest('button, select, input, textarea')) return;
    const dock = document.getElementById('memoDock');
    if (!dock || getSettings().memoDockCollapsed === true) return;
    event.preventDefault();
    const rect = dock.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;
    dock.classList.add('dragging');
    dock.style.left = `${rect.left}px`;
    dock.style.top = `${rect.top}px`;
    dock.style.width = `${rect.width}px`;
    dock.style.height = `${rect.height}px`;
    document.body.dataset.memoDockPosition = 'free';

    const onMove = moveEvent => {
      const width = dock.offsetWidth;
      const height = dock.offsetHeight;
      const x = clampNumber(moveEvent.clientX - offsetX, 8, Math.max(8, window.innerWidth - width - 8), rect.left);
      const y = clampNumber(moveEvent.clientY - offsetY, 8, Math.max(8, window.innerHeight - height - 8), rect.top);
      dock.style.left = `${x}px`;
      dock.style.top = `${y}px`;
    };
    const onUp = async () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      dock.classList.remove('dragging');
      await saveMemoDockBounds('free');
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  async function saveMemoDockBounds(forcePosition) {
    const dock = document.getElementById('memoDock');
    if (!dock || dock.hidden || getSettings().memoDockCollapsed === true) return;
    const rect = dock.getBoundingClientRect();
    const current = getSettings();
    const position = forcePosition || current.memoDockPosition;
    if (!['free', 'left', 'right'].includes(position)) return;
    appData.settings = {
      ...current,
      memoDockPosition: position,
      memoDockWidth: clampNumber(Math.round(rect.width), 320, 860, 420),
      memoDockHeight: clampNumber(Math.round(rect.height), 320, 860, 620),
      memoDockX: clampNumber(Math.round(rect.left), 8, Math.max(8, window.innerWidth - rect.width - 8), 76),
      memoDockY: clampNumber(Math.round(rect.top), 8, Math.max(8, window.innerHeight - rect.height - 8), 96)
    };
    settings = appData.settings;
    await Storage.save(appData);
    applySettings();
  }

  function ensureMemoDockExcerpt(currentButton) {
    if (!currentButton) return null;
    let excerpt = currentButton.querySelector('#memoCurrentExcerpt');
    if (!excerpt) {
      excerpt = document.createElement('span');
      excerpt.id = 'memoCurrentExcerpt';
      excerpt.className = 'memo-current-excerpt';
      currentButton.appendChild(excerpt);
    }
    return excerpt;
  }

  function compactText(value, maxLength = 120) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
  }

  async function completeCurrentMemo(event) {
    event?.preventDefault();
    event?.stopPropagation();
    const memo = getDockMemo();
    if (!memo) return;
    memo.completed = true;
    memo.updatedAt = new Date().toISOString();
    await Storage.save(appData);
    renderMemoDock();
  }

  function openMemoModal(memoId) {
    normalizeMemos();
    activeMemoId = memoId || getCurrentMemo()?.id || appData.memos[0]?.id || null;
    renderMemoModal();
    showModal('memoModal');
  }

  function renderMemoModal() {
    ensureMemoDockControls();
    renderMemoList();
    renderMemoEditor();
  }

  function ensureMemoDockControls() {
    const sidebar = document.querySelector('.memo-sidebar');
    const search = document.getElementById('memoSearchInput');
    if (!sidebar || !search) return;
    let controls = document.getElementById('memoDockControls');
    if (!controls) {
      controls = document.createElement('div');
      controls.id = 'memoDockControls';
      controls.className = 'memo-dock-controls';
      controls.innerHTML = `
        <label class="memo-control-row">
          <span>固定位置</span>
          <select id="memoDockPosition">
            <option value="left">左侧</option>
            <option value="right">右侧</option>
          </select>
        </label>
      `;
      sidebar.insertBefore(controls, search);
      document.getElementById('memoDockPosition')?.addEventListener('change', saveMemoDockSettings);
    }
    const s = getSettings();
    setValue('memoDockPosition', ['left', 'right'].includes(s.memoDockPosition) ? s.memoDockPosition : 'left');
    
  }

  async function saveMemoDockSettings() {
    const side = valueOf('memoDockPosition') || 'left';
    appData.settings = {
      ...getSettings(),
      memoDockPosition: side,
      memoDockLastSide: side,
      memoDockCollapsed: false
    };
    settings = appData.settings;
    await Storage.save(appData);
    applySettings();
    renderMemoDock();
  }


  function renderMemoList() {
    const list = document.getElementById('memoList');
    if (!list || !appData) return;
    const keyword = (document.getElementById('memoSearchInput')?.value || '').trim().toLowerCase();
    const memos = normalizeMemos()
      .filter(memo => !keyword || `${memo.title}\n${memo.content}`.toLowerCase().includes(keyword))
      .sort((a, b) => Number(a.completed) - Number(b.completed) || String(b.updatedAt).localeCompare(String(a.updatedAt)));
    if (!activeMemoId && memos[0]) activeMemoId = memos[0].id;
    list.innerHTML = memos.length ? memos.map(memo => `
      <button class="memo-list-item ${memo.id === activeMemoId ? 'active' : ''} ${memo.completed ? 'done' : ''}" data-id="${escapeAttr(memo.id)}" type="button">
        <strong>${escapeHtml(memo.title || '未命名备忘录')}</strong>
        <span>${memo.completed ? '已完成' : formatMemoTime(memo.updatedAt)}</span>
      </button>
    `).join('') : '<p class="memo-empty">暂无备忘录</p>';
    list.querySelectorAll('.memo-list-item').forEach(button => {
      button.addEventListener('click', () => {
        activeMemoId = button.dataset.id;
        renderMemoModal();
      });
    });
  }

  function renderMemoDockList() {
    const list = document.getElementById('memoDockList');
    if (!list || !appData) return;
    const keyword = (document.getElementById('memoDockSearchInput')?.value || '').trim().toLowerCase();
    const memos = normalizeMemos()
      .filter(memo => !keyword || `${memo.title}\n${memo.content}`.toLowerCase().includes(keyword))
      .sort((a, b) => Number(a.completed) - Number(b.completed) || String(b.updatedAt).localeCompare(String(a.updatedAt)));
    if (!activeMemoId && memos[0]) activeMemoId = memos[0].id;
    list.innerHTML = memos.length ? memos.map(memo => `
      <button class="memo-list-item ${memo.id === activeMemoId ? 'active' : ''} ${memo.completed ? 'done' : ''}" data-id="${escapeAttr(memo.id)}" type="button">
        <strong>${escapeHtml(memo.title || '未命名备忘录')}</strong>
        <span>${memo.completed ? '已完成' : formatMemoTime(memo.updatedAt)}</span>
      </button>
    `).join('') : '<p class="memo-empty">暂无备忘录</p>';
    list.querySelectorAll('.memo-list-item').forEach(button => {
      button.addEventListener('click', async () => {
        activeMemoId = button.dataset.id;
        appData.settings = { ...getSettings(), memoDockActiveId: activeMemoId };
        settings = appData.settings;
        await Storage.save(appData);
        renderMemoDock();
      });
    });
  }

  function getMemoDockPreferredSide() {
    const current = getSettings();
    if (['left', 'right'].includes(current.memoDockPosition)) return current.memoDockPosition;
    if (['left', 'right'].includes(current.memoDockLastSide)) return current.memoDockLastSide;
    return 'left';
  }

  async function openMemoDockSide(event) {
    event?.preventDefault();
    event?.stopPropagation();
    const side = getMemoDockPreferredSide();
    appData.settings = {
      ...getSettings(),
      memoDockPosition: side,
      memoDockLastSide: side,
      memoDockCollapsed: false
    };
    settings = appData.settings;
    await Storage.save(appData);
    applySettings();
    renderMemoDock();
    setTimeout(() => document.getElementById('memoDockContentInput')?.focus?.(), 0);
  }

  async function saveMemoDockInlineSettings() {
    const side = document.getElementById('memoDockInlinePosition')?.value || 'left';
    appData.settings = {
      ...getSettings(),
      memoDockPosition: side,
      memoDockLastSide: side,
      memoDockCollapsed: false
    };
    settings = appData.settings;
    await Storage.save(appData);
    applySettings();
    renderMemoDock();
  }

  function renderMemoEditor() {
    const titleInput = document.getElementById('memoTitleInput');
    const contentInput = document.getElementById('memoContentInput');
    const meta = document.getElementById('memoMeta');
    const doneBtn = document.getElementById('memoToggleDone');
    const deleteBtn = document.getElementById('memoDeleteBtn');
    const memo = normalizeMemos().find(item => item.id === activeMemoId) || null;
    [titleInput, contentInput, doneBtn, deleteBtn].forEach(el => { if (el) el.disabled = !memo; });
    if (!memo) {
      if (titleInput) titleInput.value = '';
      if (contentInput) contentInput.value = '';
      if (meta) meta.textContent = '点击左侧 + 新增备忘录';
      return;
    }
    setValueUnlessFocused(titleInput, memo.title || '');
    setValueUnlessFocused(contentInput, memo.content || '');
    if (doneBtn) doneBtn.classList.toggle('active', memo.completed);
    if (meta) meta.textContent = `最后编辑：${formatMemoTime(memo.updatedAt)}，创建：${formatMemoTime(memo.createdAt)}`;
  }

  async function addMemo() {
    const now = new Date().toISOString();
    const memo = {
      id: `memo_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      title: '新的备忘录',
      content: '',
      completed: false,
      createdAt: now,
      updatedAt: now
    };
    normalizeMemos().unshift(memo);
    activeMemoId = memo.id;
    await Storage.save(appData);
    renderMemoDock();
    const modalOpen = document.getElementById('memoModal')?.classList.contains('active');
    if (modalOpen) renderMemoModal();
    setTimeout(() => {
      const target = modalOpen ? document.getElementById('memoTitleInput') : document.getElementById('memoDockTitleInput');
      target?.select?.();
      target?.focus?.();
    }, 0);
  }

  function scheduleMemoSave() {
    clearTimeout(memoSaveTimer);
    memoSaveTimer = setTimeout(saveActiveMemo, 240);
  }

  function scheduleMemoDockSave() {
    clearTimeout(memoDockSaveTimer);
    memoDockSaveTimer = setTimeout(saveDockMemo, 240);
  }

  async function saveDockMemo() {
    const memo = getDockMemo();
    if (!memo) return;
    memo.title = (document.getElementById('memoDockTitleInput')?.value || '').trim() || '未命名备忘录';
    memo.content = document.getElementById('memoDockContentInput')?.value || '';
    memo.updatedAt = new Date().toISOString();
    activeMemoId = memo.id;
    await Storage.save(appData);
    renderMemoDock();
    renderMemoDockList();
  }

  async function saveActiveMemo() {
    const memo = normalizeMemos().find(item => item.id === activeMemoId);
    if (!memo) return;
    memo.title = (document.getElementById('memoTitleInput')?.value || '').trim() || '未命名备忘录';
    memo.content = document.getElementById('memoContentInput')?.value || '';
    memo.updatedAt = new Date().toISOString();
    await Storage.save(appData);
    renderMemoDock();
    renderMemoList();
    renderMemoDockList();
    const meta = document.getElementById('memoMeta');
    if (meta) meta.textContent = `最后编辑：${formatMemoTime(memo.updatedAt)}，创建：${formatMemoTime(memo.createdAt)}`;
  }

  async function toggleActiveMemoDone() {
    const memo = normalizeMemos().find(item => item.id === activeMemoId);
    if (!memo) return;
    memo.completed = !memo.completed;
    memo.updatedAt = new Date().toISOString();
    await Storage.save(appData);
    renderMemoDock();
    renderMemoDockList();
    if (document.getElementById('memoModal')?.classList.contains('active')) renderMemoModal();
  }

  async function deleteActiveMemo() {
    const memos = normalizeMemos();
    const index = memos.findIndex(item => item.id === activeMemoId);
    if (index < 0) return;
    memos.splice(index, 1);
    activeMemoId = memos[index]?.id || memos[index - 1]?.id || memos[0]?.id || null;
    await Storage.save(appData);
    renderMemoDock();
    renderMemoDockList();
    if (document.getElementById('memoModal')?.classList.contains('active')) renderMemoModal();
  }

  function formatMemoTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const pad = number => String(number).padStart(2, '0');
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function bindChrome() {
    bindBookmarkSearchBox();
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderBookmarks, 120);
    });
    window.addEventListener('search-engine-change', event => {
      const engine = event.detail?.engine;
      if (!engine || !appData?.settings) return;
      appData.settings.searchEngine = engine;
      settings = getSettings();
    });
    document.addEventListener('click', event => {
      const menu = document.getElementById('menuModal');
      if (!menu?.classList.contains('active')) return;
      if (menu.contains(event.target) || document.getElementById('dockMenuBtn')?.contains(event.target)) return;
      closeTopMenu();
    });
    document.querySelector('.panel-dock')?.addEventListener('wheel', event => {
      if (getSettings().sidebarWheelSwitch === false) return;
      const panels = PanelManager.getPanels ? PanelManager.getPanels() : [];
      if (panels.length <= 1) return;
      event.preventDefault();
      const active = PanelManager.getActiveIndex ? PanelManager.getActiveIndex() : 0;
      const next = event.deltaY > 0 ? (active + 1) % panels.length : (active - 1 + panels.length) % panels.length;
      PanelManager.switchPanel(next);
    }, { passive: false });
  }

  function bindModals() {
    const closeIds = ['modalClose', 'modalCancel', 'addModuleCancel', 'addLinkCancel', 'editBmClose', 'editBmCancel', 'settingsModalClose', 'settingsCancel', 'panelManagerClose', 'memoClose'];
    closeIds.forEach(id => document.getElementById(id)?.addEventListener('click', hideModals));
    document.getElementById('modalOverlay')?.addEventListener('click', hideModals);
    ensureCardStyleControls();
    relabelCardStyleFields();
    document.getElementById('modalSave')?.addEventListener('click', saveCardModal);
    document.getElementById('addModuleSubmit')?.addEventListener('click', saveAddModuleModal);
    document.getElementById('addLinkSubmit')?.addEventListener('click', saveAddLinkModal);
    document.getElementById('editBmSave')?.addEventListener('click', saveBookmarkModal);
    document.getElementById('editBmIconFile')?.addEventListener('change', handleEditIconUpload);
    document.getElementById('editBmIconReset')?.addEventListener('click', resetEditIcon);
    ensureBulkMoveControls();
    document.getElementById('cardBookmarks')?.closest('.field')?.classList.add('hidden-bookmark-field');
    document.getElementById('cardBookmarks')?.addEventListener('input', renderBulkBookmarkList);
    document.getElementById('bulkSelectAll')?.addEventListener('click', selectAllBulkBookmarks);
    document.getElementById('bulkDeleteSelected')?.addEventListener('click', deleteSelectedBulkBookmarks);
    document.getElementById('bulkMoveSelected')?.addEventListener('click', moveSelectedBulkBookmarks);
    document.getElementById('cardBorderColor')?.addEventListener('input', () => {
      const opacity = document.getElementById('cardBorderOpacity');
      if (opacity && Number(opacity.value) === 0) opacity.value = '1';
      if (checkedOf('cardTitleFontAuto')) setValue('cardTitleFontColor', readableTextColor(valueOf('cardBorderColor')));
    });
    document.getElementById('cardTitleFontAuto')?.addEventListener('change', event => {
      const input = document.getElementById('cardTitleFontColor');
      if (!input) return;
      input.disabled = event.target.checked;
      if (event.target.checked) input.value = readableTextColor(valueOf('cardBorderColor'));
    });
    document.getElementById('newModuleName')?.addEventListener('keydown', event => { if (event.key === 'Enter') saveAddModuleModal(); });
    document.getElementById('addLinkName')?.addEventListener('input', () => { document.getElementById('addLinkName').dataset.autoTitle = '0'; });
    document.getElementById('addLinkUrl')?.addEventListener('input', () => {
      const titleEl = document.getElementById('addLinkName');
      if (!titleEl.value.trim()) titleEl.dataset.autoTitle = '1';
      clearTimeout(linkMetaTimer);
      linkMetaTimer = setTimeout(fillLinkTitleFromUrl, 650);
    });
    document.getElementById('addLinkUrl')?.addEventListener('blur', fillLinkTitleFromUrl);
    document.getElementById('panelManagerAdd')?.addEventListener('click', () => {
      hideModals();
      PanelManager.addPanel();
      renderPanelManager();
    });
    document.getElementById('memoOpenBtn')?.addEventListener('click', () => {
      if (getSettings().memoDockCollapsed === true) {
        expandMemoDock();
        return;
      }
      openMemoDockSide();
    });
    document.getElementById('memoDockOpenFull')?.addEventListener('click', event => {
      const nextSide = getSettings().memoDockPosition === 'right' ? 'left' : 'right';
      switchMemoDockSide(nextSide, event);
    });
    document.getElementById('memoDockAddBtn')?.addEventListener('click', event => {
      if (getSettings().memoDockPosition === 'top') {
        switchMemoDockSide('left', event);
        return;
      }
      event?.preventDefault?.();
      event?.stopPropagation?.();
      addMemo();
    });
    document.getElementById('memoDockTitleInput')?.addEventListener('input', scheduleMemoDockSave);
    document.getElementById('memoDockContentInput')?.addEventListener('input', scheduleMemoDockSave);
    document.getElementById('memoCompleteBtn')?.addEventListener('click', completeCurrentMemo);
    document.getElementById('memoAddBtn')?.addEventListener('click', addMemo);
    document.getElementById('memoSearchInput')?.addEventListener('input', renderMemoList);
    document.getElementById('memoTitleInput')?.addEventListener('input', scheduleMemoSave);
    document.getElementById('memoContentInput')?.addEventListener('input', scheduleMemoSave);
    document.getElementById('memoToggleDone')?.addEventListener('click', toggleActiveMemoDone);
    document.getElementById('memoDeleteBtn')?.addEventListener('click', deleteActiveMemo);
  }

  function ensureCardStyleControls() {
    const grid = document.querySelector('.card-style-grid');
    if (!grid) return;
    if (!document.getElementById('cardTitleFontColor')) {
      const field = document.createElement('label');
      field.className = 'field';
      field.innerHTML = `
        <span>标题字体颜色</span>
        <input id="cardTitleFontColor" type="color" value="#111111">
        <label class="inline-check inline-switch title-auto-check"><input id="cardTitleFontAuto" class="mini-switch-input" type="checkbox" checked> 自动适配</label>
      `;
      const linkFontField = document.getElementById('cardFontColor')?.closest('.field');
      grid.insertBefore(field, linkFontField || null);
    }
    if (!document.getElementById('syncStyleEnabled')) {
      const syncPanel = document.createElement('div');
      syncPanel.className = 'style-sync-panel';
      syncPanel.innerHTML = `
        <label class="inline-check inline-switch sync-main"><input id="syncStyleEnabled" class="mini-switch-input" type="checkbox"> 保存时同步到其他分组</label>
        <div class="style-sync-options">
          <label class="inline-check inline-switch"><input id="syncHeaderStyle" class="mini-switch-input" type="checkbox" checked> 标题背景</label>
          <label class="inline-check inline-switch"><input id="syncBodyBackground" class="mini-switch-input" type="checkbox" checked> 标签背景</label>
          <label class="inline-check inline-switch"><input id="syncTitleFontColor" class="mini-switch-input" type="checkbox" checked> 标题字体</label>
          <label class="inline-check inline-switch"><input id="syncLinkFontColor" class="mini-switch-input" type="checkbox" checked> 链接字体颜色/大小</label>
        </div>
      `;
      grid.insertAdjacentElement('afterend', syncPanel);
    }
  }

  function relabelCardStyleFields() {
    const labels = [
      ['cardBorderColor', '标题背景颜色'],
      ['cardBorderOpacity', '标题透明度'],
      ['cardBodyOpacity', '标签背景透明度'],
      ['cardFontColor', '链接字体颜色'],
      ['cardFontSize', '链接字体大小']
    ];
    labels.forEach(([id, text]) => {
      const label = document.getElementById(id)?.closest('.field');
      const span = label?.querySelector('span');
      if (span) span.textContent = text;
    });
  }

  function bindTopMenu() {
    ensureAuthMenuButton();
    document.getElementById('dockMenuBtn')?.addEventListener('click', event => {
      event.stopPropagation();
      toggleTopMenu();
    });
    document.getElementById('menuDrawerClose')?.addEventListener('click', closeTopMenu);
    document.getElementById('modeCardsBtn')?.addEventListener('click', () => setCollectionMode('cards'));
    document.getElementById('modeDesktopBtn')?.addEventListener('click', () => setCollectionMode('desktop'));
    bindDrawerMenu('menuSettings', 'settings');
    bindDrawerMenu('menuAccountSync', 'account');
    bindDrawerMenu('menuPanels', 'panels');
    bindDrawerMenu('menuSearchEngines', 'search');
    bindDrawerMenu('menuThemeWallpaper', 'themeWallpaper');
    bindDrawerMenu('menuDesktopIcons', 'desktopIcons');
    bindDrawerMenu('menuSidebarSettings', 'sidebar');
    bindDrawerMenu('menuBackupRestore', 'backup');
    document.getElementById('importFileInput')?.addEventListener('change', importData);
    document.getElementById('wallpaperFileInput')?.addEventListener('change', importWallpaper);
    document.getElementById('wallpaperQuickBtn')?.addEventListener('click', openWallpaperLibrary);
    renderDrawerHome();
  }

  function bindDrawerMenu(id, panel) {
    document.getElementById(id)?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      renderDrawerPanel(panel);
    });
  }

  function ensureAuthMenuButton() {
    if (document.getElementById('menuAccountSync')) return;
    const list = document.querySelector('.top-menu-list');
    if (!list) return;
    const button = document.createElement('button');
    button.id = 'menuAccountSync';
    button.type = 'button';
    button.innerHTML = `
      <span class="top-menu-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="3"></circle>
          <path d="M6 21v-2a6 6 0 0 1 12 0v2"></path>
          <path d="M18.5 9.5a3.5 3.5 0 0 0-6.72-1.35A3 3 0 0 0 8 11h10.5a1.5 1.5 0 0 0 0-3Z"></path>
        </svg>
      </span>账号同步
    `;
    const anchor = document.getElementById('menuSettings');
    if (anchor?.nextSibling) list.insertBefore(button, anchor.nextSibling);
    else list.prepend(button);
  }

  function toggleTopMenu() {
    const menu = document.getElementById('menuModal');
    if (!menu) return;
    const shouldOpen = !menu.classList.contains('active');
    menu.classList.toggle('active', shouldOpen);
    menu.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
    if (shouldOpen) {
      renderDrawerPanel(document.querySelector('.top-menu-list button.active')?.dataset.panel || 'settings');
    }
  }

  function closeTopMenu() {
    const menu = document.getElementById('menuModal');
    if (!menu) return;
    menu.classList.remove('active');
    menu.setAttribute('aria-hidden', 'true');
  }

  function renderDrawerHome() {
    renderDrawerPanel('settings');
  }

  function openDesktopIconSettings() {
    const menu = document.getElementById('menuModal');
    renderDrawerPanel('desktopIcons');
    requestAnimationFrame(() => {
      menu?.classList.add('active');
      renderDrawerPanel('desktopIcons');
    });
  }

  function renderDrawerPanel(panel) {
    updateCollectionModeUi();
    const buttons = {
      settings: 'menuSettings',
      account: 'menuAccountSync',
      panels: 'menuPanels',
      search: 'menuSearchEngines',
      themeWallpaper: 'menuThemeWallpaper',
      desktopIcons: 'menuDesktopIcons',
      sidebar: 'menuSidebarSettings',
      backup: 'menuBackupRestore'
    };
    Object.entries(buttons).forEach(([key, id]) => {
      const button = document.getElementById(id);
      if (!button) return;
      button.dataset.panel = key;
      button.classList.toggle('active', key === panel);
    });
    switch (panel) {
      case 'panels': renderDrawerPanels(); break;
      case 'account': renderDrawerAccount(); break;
      case 'search': renderDrawerSearch(); break;
      case 'themeWallpaper': renderDrawerThemeWallpaper(); break;
      case 'desktopIcons': renderDrawerDesktopIconsV2(); break;
      case 'sidebar': renderDrawerSidebar(); break;
      case 'backup': renderDrawerBackup(); break;
      case 'settings':
      default: renderDrawerSettings(); break;
    }
  }

  async function setCollectionMode(mode) {
    const next = mode === 'desktop' ? 'desktop' : 'cards';
    appData.settings = { ...getSettings(), collectionMode: next };
    settings = appData.settings;
    await Storage.save(appData);
    applySettings();
    updateCollectionModeUi();
    refreshAll();
    const activePanel = document.querySelector('.top-menu-list button.active')?.dataset.panel;
    if (next !== 'desktop' && activePanel === 'desktopIcons') renderDrawerPanel('settings');
  }

  function updateCollectionModeUi() {
    const mode = getSettings().collectionMode === 'desktop' ? 'desktop' : 'cards';
    document.getElementById('modeCardsBtn')?.classList.toggle('active', mode === 'cards');
    document.getElementById('modeDesktopBtn')?.classList.toggle('active', mode === 'desktop');
    document.getElementById('menuDesktopIcons')?.classList.toggle('hidden', mode !== 'desktop');
  }

  function setDrawerContent(title, intro, html, onReady) {
    const content = document.querySelector('.top-menu-content');
    if (!content) return;
    content.innerHTML = `
      <div class="drawer-content-head">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(intro)}</p>
      </div>
      <div class="drawer-content-body">${html}</div>
    `;
    onReady?.(content);
  }

  function renderDrawerSettings() {
    const s = getSettings();
    setDrawerContent('偏好设置', '调整模块链接行为和搜索习惯。', `
      <div class="drawer-form">
        <section class="drawer-section">
          <h4>模块和链接</h4>
          <label class="drawer-row"><span>在新窗口中打开链接</span><input id="drawerSettingLinkNewWindow" class="switch-input" type="checkbox"></label>
          <label class="drawer-row"><span>链接标题显示为单行</span><input id="drawerSettingSingleLine" class="switch-input" type="checkbox"></label>
          <label class="drawer-row"><span>链接备注</span><select id="drawerSettingLinkNote"><option value="always">始终显示</option><option value="hover">悬停显示</option><option value="none">不显示</option></select></label>
          <label class="drawer-row"><span>双击模块标题快捷操作</span><select id="drawerSettingDblClick"><option value="none">无</option><option value="edit">编辑模块</option><option value="collapse">折叠模块</option><option value="addlink">添加链接</option></select></label>
          <label class="drawer-row"><span>添加链接位于列表的</span><select id="drawerSettingAddPos"><option value="bottom">底部</option><option value="top">顶部</option></select></label>
        </section>
        <section class="drawer-section">
          <h4>搜索</h4>
          <label class="drawer-row"><span>在新窗口中打开搜索结果</span><input id="drawerSettingSearchNewWindow" class="switch-input" type="checkbox"></label>
          <label class="drawer-row"><span>页面加载后自动聚焦搜索框</span><input id="drawerSettingAutoFocus" class="switch-input" type="checkbox"></label>
        </section>
        <button id="drawerSettingsSave" class="drawer-primary-btn" type="button">保存设置</button>
      </div>
    `, () => {
      setChecked('drawerSettingLinkNewWindow', s.linkNewWindow !== false);
      setChecked('drawerSettingSingleLine', s.singleLine === true);
      setValue('drawerSettingLinkNote', s.linkNote || 'none');
      setValue('drawerSettingDblClick', s.dblClick || 'none');
      setValue('drawerSettingAddPos', s.addPos || 'bottom');
      setChecked('drawerSettingSearchNewWindow', s.searchNewWindow !== false);
      setChecked('drawerSettingAutoFocus', s.autoFocus !== false);
      document.getElementById('drawerSettingsSave')?.addEventListener('click', saveDrawerSettings);
      ['drawerSettingLinkNewWindow', 'drawerSettingSingleLine', 'drawerSettingLinkNote', 'drawerSettingDblClick', 'drawerSettingAddPos', 'drawerSettingSearchNewWindow', 'drawerSettingAutoFocus'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => saveDrawerSettings(false));
      });
    });
  }

  async function saveDrawerSettings(showMessage = true) {
    const current = getSettings();
    appData.settings = {
      ...current,
      theme: current.theme || 'dark',
      pageWidth: normalizePageWidth(current.pageWidth),
      searchEngine: current.searchEngine || 'baidu',
      searchNewWindow: checkedOf('drawerSettingSearchNewWindow'),
      linkNewWindow: checkedOf('drawerSettingLinkNewWindow'),
      singleLine: checkedOf('drawerSettingSingleLine'),
      linkNote: valueOf('drawerSettingLinkNote') || 'none',
      dblClick: valueOf('drawerSettingDblClick') || 'none',
      addPos: valueOf('drawerSettingAddPos') || 'bottom',
      autoFocus: checkedOf('drawerSettingAutoFocus')
    };
    settings = appData.settings;
    await Storage.save(appData);
    applySettings();
    refreshAll();
    if (!showMessage) return;
    showToast('设置已保存', 'success');
  }

  function renderDrawerPanels() {
    const panels = PanelManager.getPanels ? PanelManager.getPanels() : [];
    const active = PanelManager.getActiveIndex ? PanelManager.getActiveIndex() : 0;
    setDrawerContent('面板管理', '切换、删除或新增面板，所有操作会直接保存。', `
      <div class="drawer-panel-list">
        ${panels.map((panel, index) => `
          <div class="drawer-panel-item ${index === active ? 'active' : ''}">
            <button class="drawer-panel-switch" data-index="${index}" type="button">${escapeHtml(panel.name)}</button>
            <button class="drawer-panel-delete" data-index="${index}" type="button" ${panels.length <= 1 ? 'disabled' : ''}>删除</button>
          </div>
        `).join('')}
      </div>
      <button id="drawerPanelAdd" class="drawer-primary-btn" type="button">添加面板</button>
    `, content => {
      content.querySelectorAll('.drawer-panel-switch').forEach(button => {
        button.addEventListener('click', () => {
          PanelManager.switchPanel(Number(button.dataset.index));
          renderDrawerPanels();
        });
      });
      content.querySelectorAll('.drawer-panel-delete').forEach(button => {
        button.addEventListener('click', () => {
          PanelManager.deletePanel(Number(button.dataset.index));
          renderDrawerPanels();
        });
      });
      document.getElementById('drawerPanelAdd')?.addEventListener('click', () => {
        PanelManager.addPanel();
        renderDrawerPanels();
      });
    });
  }

  function renderDrawerSearch() {
    const engines = SearchEngine.ENGINES || {};
    const current = SearchEngine.getEngine ? SearchEngine.getEngine() : getSettings().searchEngine;
    setDrawerContent('搜索引擎', '选择地址栏搜索时使用的搜索服务。', `
      <div class="drawer-choice-list">
        ${Object.entries(engines).map(([key, engine]) => `
          <button class="drawer-choice ${key === current ? 'active' : ''}" data-engine="${key}" type="button">
            <span class="drawer-choice-main">
              <span class="drawer-choice-icon"><img src="${escapeAttr(engine.icon || faviconFor(engine.url))}" alt=""></span>
              <span>${escapeHtml(engine.name)}</span>
            </span>
            <small>${key === current ? '当前使用' : '点击切换'}</small>
          </button>
        `).join('')}
      </div>
    `, content => {
      content.querySelectorAll('.drawer-choice-icon img').forEach(img => {
        img.addEventListener('error', () => {
          const key = img.closest('.drawer-choice')?.dataset.engine;
          const engine = engines[key] || {};
          const icon = img.parentElement;
          if (icon) icon.textContent = engine.mark || String(engine.name || key || '').slice(0, 1);
        });
      });
      content.querySelectorAll('.drawer-choice').forEach(button => {
        button.addEventListener('click', () => {
          const key = button.dataset.engine;
          SearchEngine.setEngine(key);
          if (appData?.settings) appData.settings.searchEngine = key;
          settings = getSettings();
          renderDrawerSearch();
          showToast(`搜索引擎已切换为 ${(engines[key] || {}).name || key}`, 'success');
        });
      });
    });
  }

  function renderDrawerThemeWallpaper() {
    const s = getSettings();
    const colors = ['#1d74ff', '#f5b12f', '#ff4d4f', '#2fc878', '#39c5bb', '#8a56d6', '#f2c200', '#f0831e', '#e64b35', '#7f9db8'];
    const currentColor = isHexColor(s.themeColor) ? s.themeColor : '#1d74ff';
    const wallpaper = s.wallpaper || '';
    const isDark = (s.theme || 'dark') === 'dark';
    const isSystem = (s.theme || 'dark') === 'system';
    setDrawerContent('主题/壁纸', '深色模式、主题色', `
      <div class="drawer-visual-stack">
        <section class="drawer-visual-card">
          <label class="visual-row"><span>深色模式</span><input id="themeDarkMode" class="switch-input" type="checkbox"></label>
          <label class="visual-row"><span>跟随系统</span><input id="themeFollowSystem" class="switch-input" type="checkbox"></label>
          <label class="visual-row"><span>页面宽度</span><select id="themePageWidth"><option value="960px">窄(960px)</option><option value="1200px">默认(1200px)</option><option value="1440px">宽(1440px)</option><option value="100%">铺满(100%)</option></select></label>
          <div class="visual-divider"></div>
          <div class="visual-label">主题色</div>
          <div class="theme-color-row">
            ${colors.map(color => `<button class="theme-color-dot${color.toLowerCase() === currentColor.toLowerCase() ? ' active' : ''}" data-color="${color}" type="button" style="--dot-color:${color}"></button>`).join('')}
          </div>
        </section>
        <section class="drawer-visual-card">
          <div class="visual-label">壁纸</div>
          <div class="wallpaper-preview${wallpaper ? '' : ' empty'}" style="${wallpaper ? `background-image:${escapeAttr(wallpaperToCssImage(wallpaper))}` : ''}">
            <div class="wallpaper-actions">
              <button id="changeWallpaper" type="button">壁纸库</button>
              <button id="uploadWallpaper" type="button">本地上传</button>
              <button id="downloadWallpaper" type="button">下载壁纸</button>
            </div>
          </div>
          <label class="visual-slider"><span>遮罩浓度</span><input id="wallpaperMask" type="range" min="0" max="1" step="0.01"><em id="wallpaperMaskValue">0.00 %</em></label>
          <label class="visual-slider"><span>模糊度</span><input id="wallpaperBlur" type="range" min="0" max="20" step="1"><em id="wallpaperBlurValue">0 %</em></label>
        </section>
        <section class="drawer-visual-card compact">
          <label class="visual-row"><span>自动壁纸</span><select id="wallpaperAutoSwitch"><option value="none">不自动切换</option><option value="daily">每天切换</option><option value="hourly">每小时切换</option></select></label>
        </section>
        <section class="drawer-visual-card compact">
          <label class="visual-row"><span>桌面显示壁纸切换按钮</span><input id="wallpaperButton" class="switch-input" type="checkbox"></label>
        </section>
      </div>
    `, content => {
      setChecked('themeDarkMode', isDark);
      setChecked('themeFollowSystem', isSystem);
      setValue('themePageWidth', normalizePageWidth(s.pageWidth));
      setValue('wallpaperMask', String(clampNumber(s.wallpaperMask, 0, 1, 0)));
      setValue('wallpaperBlur', String(clampNumber(s.wallpaperBlur, 0, 20, 0)));
      setValue('wallpaperAutoSwitch', s.wallpaperAutoSwitch || 'none');
      setChecked('wallpaperButton', s.wallpaperButton === true);
      updateThemeWallpaperReadouts();
      content.querySelectorAll('.theme-color-dot').forEach(button => {
        button.addEventListener('click', () => {
          content.querySelectorAll('.theme-color-dot').forEach(item => item.classList.remove('active'));
          button.classList.add('active');
          appData.settings = { ...getSettings(), themeColor: button.dataset.color };
          settings = appData.settings;
          Storage.save(appData);
          applySettings();
        });
      });
      document.getElementById('themeDarkMode')?.addEventListener('change', () => {
        setChecked('themeFollowSystem', false);
        saveThemeWallpaperSettings();
      });
      document.getElementById('themeFollowSystem')?.addEventListener('change', () => {
        if (checkedOf('themeFollowSystem')) {
          setChecked('themeDarkMode', window.matchMedia?.('(prefers-color-scheme: dark)').matches === true);
        }
        saveThemeWallpaperSettings();
      });
      ['themePageWidth', 'wallpaperAutoSwitch', 'wallpaperButton'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', saveThemeWallpaperSettings);
      });
      ['wallpaperMask', 'wallpaperBlur'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', saveThemeWallpaperSettings);
        document.getElementById(id)?.addEventListener('change', saveThemeWallpaperSettings);
      });
      document.getElementById('changeWallpaper')?.addEventListener('click', openWallpaperLibrary);
      document.getElementById('uploadWallpaper')?.addEventListener('click', () => document.getElementById('wallpaperFileInput')?.click());
      document.getElementById('downloadWallpaper')?.addEventListener('click', downloadWallpaper);
    });
  }

  function updateThemeWallpaperReadouts() {
    const mask = clampNumber(valueOf('wallpaperMask'), 0, 1, 0);
    const blur = clampNumber(valueOf('wallpaperBlur'), 0, 20, 0);
    const maskText = document.getElementById('wallpaperMaskValue');
    const blurText = document.getElementById('wallpaperBlurValue');
    if (maskText) maskText.textContent = `${(mask * 100).toFixed(2)} %`;
    if (blurText) blurText.textContent = `${blur} %`;
  }

  async function saveThemeWallpaperSettings() {
    const currentSettings = getSettings();
    const previousTheme = currentSettings.theme || 'dark';
    const previousAutoSwitch = currentSettings.wallpaperAutoSwitch || 'none';
    const followSystem = checkedOf('themeFollowSystem');
    const theme = followSystem ? 'system' : (checkedOf('themeDarkMode') ? 'dark' : 'light');
    appData.settings = {
      ...currentSettings,
      theme,
      pageWidth: normalizePageWidth(valueOf('themePageWidth')),
      wallpaperMask: clampNumber(valueOf('wallpaperMask'), 0, 1, 0),
      wallpaperBlur: clampNumber(valueOf('wallpaperBlur'), 0, 20, 0),
      wallpaperAutoSwitch: valueOf('wallpaperAutoSwitch') || 'none',
      wallpaperButton: checkedOf('wallpaperButton')
    };
    settings = appData.settings;
    updateThemeWallpaperReadouts();
    await Storage.save(appData);
    await applyAutoWallpaperIfNeeded(previousAutoSwitch !== appData.settings.wallpaperAutoSwitch);
    applySettings();
    if (previousTheme !== theme) refreshAll();
  }

  async function applyAutoWallpaperIfNeeded(force = false) {
    const s = { ...getDefaultSettings(), ...(appData?.settings || {}) };
    const mode = s.wallpaperAutoSwitch || 'none';
    if (!['daily', 'hourly'].includes(mode) || !BUILTIN_WALLPAPERS.length) return false;
    const interval = mode === 'daily' ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
    const now = Date.now();
    const lastChanged = Number(s.wallpaperAutoChangedAt) || 0;
    if (!force && s.wallpaper && lastChanged && now - lastChanged < interval) return false;
    const currentIndex = BUILTIN_WALLPAPERS.findIndex(item => item.bg === s.wallpaper);
    const nextIndex = currentIndex >= 0
      ? (currentIndex + 1) % BUILTIN_WALLPAPERS.length
      : Math.floor(now / interval) % BUILTIN_WALLPAPERS.length;
    appData.settings = {
      ...s,
      wallpaper: BUILTIN_WALLPAPERS[nextIndex].bg,
      wallpaperAutoChangedAt: now
    };
    settings = appData.settings;
    await Storage.save(appData);
    return true;
  }

  function openWallpaperLibrary() {
    closeTopMenu();
    ensureWallpaperLibrary();
    renderWallpaperLibrary(activeWallpaperCategory || 'all');
    document.getElementById('wallpaperLibraryOverlay')?.classList.add('active');
    document.getElementById('wallpaperLibraryModal')?.classList.add('active');
    document.body.classList.add('wallpaper-library-open');
  }

  function closeWallpaperLibrary() {
    document.getElementById('wallpaperLibraryOverlay')?.classList.remove('active');
    document.getElementById('wallpaperLibraryModal')?.classList.remove('active');
    document.body.classList.remove('wallpaper-library-open');
  }

  function ensureWallpaperLibrary() {
    if (document.getElementById('wallpaperLibraryModal')) return;
    const overlay = document.createElement('div');
    overlay.id = 'wallpaperLibraryOverlay';
    overlay.className = 'wallpaper-library-overlay';
    const modal = document.createElement('section');
    modal.id = 'wallpaperLibraryModal';
    modal.className = 'wallpaper-library-modal';
    modal.setAttribute('aria-label', '壁纸库');
    modal.innerHTML = `
      <aside class="wallpaper-library-side">
        <h3>壁纸库</h3>
        <button class="wallpaper-side-item active" data-category="all" type="button">官方壁纸</button>
        <button class="wallpaper-side-item" data-action="upload" type="button">自定义壁纸</button>
        <button class="wallpaper-side-item" data-action="clear" type="button">清除壁纸</button>
      </aside>
      <section class="wallpaper-library-main">
        <div class="wallpaper-library-head">
          <div class="wallpaper-library-tabs"></div>
          <div class="wallpaper-library-actions">
            <button id="wallpaperLibraryClose" class="wallpaper-library-close" type="button" title="关闭" aria-label="关闭">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg>
            </button>
          </div>
        </div>
        <div class="wallpaper-library-grid"></div>
      </section>
    `;
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    overlay.addEventListener('click', closeWallpaperLibrary);
    modal.querySelector('#wallpaperLibraryClose')?.addEventListener('click', closeWallpaperLibrary);
    modal.querySelectorAll('[data-category]').forEach(button => {
      button.addEventListener('click', () => renderWallpaperLibrary(button.dataset.category || 'all'));
    });
    modal.querySelector('[data-action="upload"]')?.addEventListener('click', () => document.getElementById('wallpaperFileInput')?.click());
    modal.querySelector('[data-action="clear"]')?.addEventListener('click', clearWallpaper);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeWallpaperLibrary();
    });
  }

  function renderWallpaperLibrary(category = 'all') {
    activeWallpaperCategory = category;
    const modal = document.getElementById('wallpaperLibraryModal');
    if (!modal) return;
    const tabs = modal.querySelector('.wallpaper-library-tabs');
    const grid = modal.querySelector('.wallpaper-library-grid');
    const current = getSettings().wallpaper || '';
    modal.querySelectorAll('[data-category]').forEach(button => {
      button.classList.toggle('active', button.dataset.category === category || (button.dataset.category === 'all' && category === 'all'));
    });
    if (tabs) {
      tabs.innerHTML = WALLPAPER_CATEGORIES.map(item => `
        <button class="wallpaper-filter${item.key === category ? ' active' : ''}" data-filter="${item.key}" type="button">${escapeHtml(item.label)}</button>
      `).join('');
      tabs.querySelectorAll('.wallpaper-filter').forEach(button => {
        button.addEventListener('click', () => renderWallpaperLibrary(button.dataset.filter || 'all'));
      });
    }
    const wallpapers = category === 'all'
      ? BUILTIN_WALLPAPERS
      : BUILTIN_WALLPAPERS.filter(item => item.category === category);
    if (grid) {
      grid.innerHTML = wallpapers.map(item => {
        const active = item.bg === current;
        return `
          <button class="wallpaper-tile${active ? ' active' : ''}" data-wallpaper-id="${escapeAttr(item.id)}" type="button">
            <span class="wallpaper-thumb" style="background-image:${escapeAttr(item.bg)}"></span>
            <span class="wallpaper-name">${escapeHtml(item.name)}</span>
          </button>
        `;
      }).join('');
      grid.querySelectorAll('.wallpaper-tile').forEach(button => {
        button.addEventListener('click', () => applyBuiltinWallpaper(button.dataset.wallpaperId));
      });
    }
  }

  async function applyBuiltinWallpaper(id) {
    const wallpaper = BUILTIN_WALLPAPERS.find(item => item.id === id);
    if (!wallpaper) return;
    appData.settings = { ...getSettings(), wallpaper: wallpaper.bg, wallpaperAutoChangedAt: Date.now() };
    settings = appData.settings;
    await Storage.save(appData);
    applySettings();
    renderWallpaperLibrary(activeWallpaperCategory);
    if (document.getElementById('menuThemeWallpaper')?.classList.contains('active')) {
      renderDrawerThemeWallpaper();
    }
    showToast(`已应用壁纸：${wallpaper.name}`, 'success');
  }

  async function clearWallpaper() {
    appData.settings = { ...getSettings(), wallpaper: '', wallpaperAutoSwitch: 'none', wallpaperAutoChangedAt: 0 };
    settings = appData.settings;
    await Storage.save(appData);
    applySettings();
    renderWallpaperLibrary(activeWallpaperCategory);
    if (document.getElementById('menuThemeWallpaper')?.classList.contains('active')) {
      renderDrawerThemeWallpaper();
    }
    showToast('壁纸已清除', 'success');
  }

  function wallpaperToCssImage(value) {
    const wallpaper = String(value || '').trim();
    if (!wallpaper) return 'none';
    if (/^(linear|radial|conic)-gradient\(/i.test(wallpaper)) {
      return wallpaper;
    }
    const urlMatch = wallpaper.match(/^url\((['"]?)(.*?)\1\)$/i);
    const source = urlMatch ? urlMatch[2] : wallpaper;
    return `url("${resolveWallpaperUrl(source)}")`;
  }

  function resolveWallpaperUrl(value) {
    const url = String(value || '').trim();
    if (!url) return '';
    if (/^(https?:|data:|chrome-extension:|moz-extension:)/i.test(url)) {
      return url.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '');
    }
    const clean = url.replace(/^\.?\//, '');
    const resolved = window.chrome?.runtime?.getURL ? chrome.runtime.getURL(clean) : clean;
    return resolved.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '');
  }

  function renderDrawerSidebar() {
    const s = getSettings();
    const position = s.sidebarPosition === 'right' ? 'right' : 'left';
    setDrawerContent('侧边栏', '侧边栏位置、是否隐藏、宽度', `
      <div class="drawer-visual-stack">
        <section class="drawer-visual-card">
          <div class="sidebar-layout-choice">
            <button class="sidebar-position-card ${position === 'left' ? 'active' : ''}" data-position="left" type="button">
              <span class="sidebar-preview left"></span><strong>左侧</strong>
            </button>
            <button class="sidebar-position-card ${position === 'right' ? 'active' : ''}" data-position="right" type="button">
              <span class="sidebar-preview right"></span><strong>右侧</strong>
            </button>
          </div>
          <div class="visual-divider"></div>
          <label class="visual-row"><span>自动隐藏</span><input id="sidebarAutoHide" class="switch-input" type="checkbox"></label>
          <label class="visual-row"><span>记住上次分组</span><input id="sidebarRememberPanel" class="switch-input" type="checkbox"></label>
          <label class="visual-row"><span>鼠标滚轮滚动分组</span><input id="sidebarWheelSwitch" class="switch-input" type="checkbox"></label>
          <label class="visual-slider"><span>透明度</span><input id="sidebarOpacity" type="range" min="0.2" max="1" step="0.01"><em id="sidebarOpacityValue">0.92</em></label>
          <label class="visual-slider"><span>宽度</span><input id="sidebarWidth" type="range" min="42" max="90" step="1"><em id="sidebarWidthValue">48 px</em></label>
        </section>
      </div>
    `, content => {
      setChecked('sidebarAutoHide', s.sidebarAutoHide === true);
      setChecked('sidebarRememberPanel', s.sidebarRememberPanel !== false);
      setChecked('sidebarWheelSwitch', s.sidebarWheelSwitch !== false);
      setValue('sidebarOpacity', String(clampNumber(s.sidebarOpacity, 0.2, 1, 0.92)));
      setValue('sidebarWidth', String(clampNumber(s.sidebarWidth, 42, 90, 48)));
      updateSidebarReadouts();
      content.querySelectorAll('.sidebar-position-card').forEach(button => {
        button.addEventListener('click', () => {
          content.querySelectorAll('.sidebar-position-card').forEach(item => item.classList.remove('active'));
          button.classList.add('active');
          saveSidebarSettings(button.dataset.position);
        });
      });
      ['sidebarAutoHide', 'sidebarRememberPanel', 'sidebarWheelSwitch', 'sidebarOpacity', 'sidebarWidth'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', () => saveSidebarSettings());
        document.getElementById(id)?.addEventListener('change', () => saveSidebarSettings());
      });
    });
  }

  function updateSidebarReadouts() {
    const opacity = clampNumber(valueOf('sidebarOpacity'), 0.2, 1, 0.92);
    const width = clampNumber(valueOf('sidebarWidth'), 42, 90, 48);
    const opacityText = document.getElementById('sidebarOpacityValue');
    const widthText = document.getElementById('sidebarWidthValue');
    if (opacityText) opacityText.textContent = opacity.toFixed(2);
    if (widthText) widthText.textContent = `${Math.round(width)} px`;
  }

  async function saveSidebarSettings(position) {
    const current = getSettings();
    appData.settings = {
      ...current,
      sidebarPosition: position || current.sidebarPosition || 'left',
      sidebarAutoHide: checkedOf('sidebarAutoHide'),
      sidebarRememberPanel: checkedOf('sidebarRememberPanel'),
      sidebarWheelSwitch: checkedOf('sidebarWheelSwitch'),
      sidebarOpacity: clampNumber(valueOf('sidebarOpacity'), 0.2, 1, 0.92),
      sidebarWidth: clampNumber(valueOf('sidebarWidth'), 42, 90, 48)
    };
    settings = appData.settings;
    updateSidebarReadouts();
    await Storage.save(appData);
    applySettings();
  }

  function renderDrawerDesktopIconsV2() {
    const s = getSettings();
    const labelColor = isHexColor(s.desktopIconLabelColor) ? s.desktopIconLabelColor : '#ffffff';
    const iconBgColor = isHexColor(s.desktopIconBgColor) ? s.desktopIconBgColor : '#ffffff';
    const labelColors = ['#ffffff', '#202939', '#2fc878', '#39c5bb', '#8a56d6', '#f2c200', '#f0831e', '#e64b35'];
    const bgColors = ['#ffffff', '#202939', '#8fa0ad', '#2fc878', '#39c5bb', '#8a56d6', '#f2c200', '#f0831e', '#e64b35'];
    setDrawerContent('图标', '桌面图标收纳模式的图标样式、间距和名称。', `
      <div class="drawer-visual-stack">
        <section class="drawer-visual-card">
          <div class="desktop-icon-settings-preview">
            <span class="desktop-settings-icon" style="--preview-radius:${clampNumber(s.desktopIconRadius, 0, 30, 18)}px; --preview-opacity:${clampNumber(s.desktopIconOpacity, 0.2, 1, 1)}; --preview-bg:${hexToRgba(iconBgColor, clampNumber(s.desktopIconBgOpacity, 0.2, 1, 0.96))}">
              <img src="icons/horse-logo.png" alt="">
            </span>
            <span>预览图标</span>
          </div>
          <label class="visual-slider"><span>图标大小</span><input id="desktopIconSize" type="range" min="40" max="82" step="1"><em id="desktopIconSizeValue">58 px</em></label>
          <label class="visual-slider"><span>图标圆角</span><input id="desktopIconRadius" type="range" min="0" max="30" step="1"><em id="desktopIconRadiusValue">18 px</em></label>
          <label class="visual-slider"><span>不透明度</span><input id="desktopIconOpacity" type="range" min="0.2" max="1" step="0.01"><em id="desktopIconOpacityValue">1.00</em></label>
          <label class="visual-slider"><span>背景透明度</span><input id="desktopIconBgOpacity" type="range" min="0.2" max="1" step="0.01"><em id="desktopIconBgOpacityValue">0.96</em></label>
          <div class="visual-label">图标背景</div>
          <div class="theme-color-row desktop-bg-colors">
            ${bgColors.map(color => `<button class="theme-color-dot${color.toLowerCase() === iconBgColor.toLowerCase() ? ' active' : ''}" data-color="${color}" type="button" style="--dot-color:${color}"></button>`).join('')}
          </div>
        </section>
        <section class="drawer-visual-card">
          <label class="visual-slider"><span>图标间距</span><input id="desktopIconGap" type="range" min="8" max="32" step="1"><em id="desktopIconGapValue">14 px</em></label>
          <label class="visual-slider"><span>标签宽度</span><input id="desktopShortcutWidth" type="range" min="56" max="120" step="2"><em id="desktopShortcutWidthValue">72 px</em></label>
          <label class="visual-slider"><span>标签高度</span><input id="desktopShortcutHeight" type="range" min="56" max="120" step="2"><em id="desktopShortcutHeightValue">72 px</em></label>
          <label class="visual-slider"><span>分组宽度</span><input id="desktopFolderWidth" type="range" min="56" max="120" step="2"><em id="desktopFolderWidthValue">72 px</em></label>
          <label class="visual-slider"><span>分组高度</span><input id="desktopFolderHeight" type="range" min="56" max="120" step="2"><em id="desktopFolderHeightValue">72 px</em></label>
          <label class="visual-slider"><span>分组透明度</span><input id="desktopFolderBgOpacity" type="range" min="0.2" max="1" step="0.01"><em id="desktopFolderBgOpacityValue">0.74</em></label>
        </section>
        <section class="drawer-visual-card">
          <label class="visual-row"><span>图标名称</span><input id="desktopIconShowName" class="switch-input" type="checkbox"></label>
          <label class="visual-slider"><span>文字大小</span><input id="desktopIconFontSize" type="range" min="10" max="16" step="1"><em id="desktopIconFontSizeValue">12 px</em></label>
          <div class="visual-label">名称颜色</div>
          <div class="theme-color-row desktop-label-colors">
            ${labelColors.map(color => `<button class="theme-color-dot${color.toLowerCase() === labelColor.toLowerCase() ? ' active' : ''}" data-color="${color}" type="button" style="--dot-color:${color}"></button>`).join('')}
            <button class="theme-color-dot auto-color${!isHexColor(s.desktopIconLabelColor) ? ' active' : ''}" data-color="" type="button" title="自动颜色"></button>
          </div>
        </section>
        <button id="resetDesktopIcons" class="drawer-danger-btn soft" type="button">重置图标布局</button>
      </div>
    `, content => {
      setValue('desktopIconSize', String(clampNumber(s.desktopIconSize, 40, 82, 58)));
      setValue('desktopIconBgOpacity', String(clampNumber(s.desktopIconBgOpacity, 0.2, 1, 0.96)));
      setValue('desktopShortcutWidth', String(clampNumber(s.desktopShortcutWidth, 56, 120, 72)));
      setValue('desktopShortcutHeight', String(clampNumber(s.desktopShortcutHeight, 56, 120, 72)));
      setValue('desktopFolderWidth', String(clampNumber(s.desktopFolderWidth, 56, 120, 72)));
      setValue('desktopFolderHeight', String(clampNumber(s.desktopFolderHeight, 56, 120, 72)));
      setValue('desktopFolderBgOpacity', String(clampNumber(s.desktopFolderBgOpacity, 0.2, 1, 0.74)));
      setValue('desktopIconRadius', String(clampNumber(s.desktopIconRadius, 0, 30, 18)));
      setValue('desktopIconOpacity', String(clampNumber(s.desktopIconOpacity, 0.2, 1, 1)));
      setValue('desktopIconGap', String(clampNumber(s.desktopIconGap, 8, 32, 14)));
      setChecked('desktopIconShowName', s.desktopIconShowName !== false);
      setValue('desktopIconFontSize', String(clampNumber(s.desktopIconFontSize, 10, 16, 12)));
      updateDesktopIconReadouts();
      ['desktopIconSize', 'desktopIconBgOpacity', 'desktopShortcutWidth', 'desktopShortcutHeight', 'desktopFolderWidth', 'desktopFolderHeight', 'desktopFolderBgOpacity', 'desktopIconRadius', 'desktopIconOpacity', 'desktopIconGap', 'desktopIconShowName', 'desktopIconFontSize'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', saveDesktopIconSettings);
        document.getElementById(id)?.addEventListener('change', saveDesktopIconSettings);
      });
      content.querySelectorAll('.desktop-bg-colors .theme-color-dot').forEach(button => {
        button.addEventListener('click', () => {
          content.querySelectorAll('.desktop-bg-colors .theme-color-dot').forEach(item => item.classList.remove('active'));
          button.classList.add('active');
          saveDesktopIconSettings(undefined, button.dataset.color || '#ffffff');
        });
      });
      content.querySelectorAll('.desktop-label-colors .theme-color-dot').forEach(button => {
        button.addEventListener('click', () => {
          content.querySelectorAll('.desktop-label-colors .theme-color-dot').forEach(item => item.classList.remove('active'));
          button.classList.add('active');
          saveDesktopIconSettings(button.dataset.color || '');
        });
      });
      document.getElementById('resetDesktopIcons')?.addEventListener('click', resetDesktopIconSettings);
    });
  }

  function updateDesktopIconReadouts() {
    const pairs = [
      ['desktopIconSize', 'desktopIconSizeValue', ' px'],
      ['desktopShortcutWidth', 'desktopShortcutWidthValue', ' px'],
      ['desktopShortcutHeight', 'desktopShortcutHeightValue', ' px'],
      ['desktopFolderWidth', 'desktopFolderWidthValue', ' px'],
      ['desktopFolderHeight', 'desktopFolderHeightValue', ' px'],
      ['desktopIconRadius', 'desktopIconRadiusValue', ' px'],
      ['desktopIconGap', 'desktopIconGapValue', ' px'],
      ['desktopIconFontSize', 'desktopIconFontSizeValue', ' px']
    ];
    pairs.forEach(([inputId, textId, suffix]) => {
      const text = document.getElementById(textId);
      if (text) text.textContent = `${valueOf(inputId) || 0}${suffix}`;
    });
    const opacityText = document.getElementById('desktopIconOpacityValue');
    if (opacityText) opacityText.textContent = Number(valueOf('desktopIconOpacity') || 1).toFixed(2);
    const bgOpacityText = document.getElementById('desktopIconBgOpacityValue');
    if (bgOpacityText) bgOpacityText.textContent = Number(valueOf('desktopIconBgOpacity') || 0.96).toFixed(2);
    const folderOpacityText = document.getElementById('desktopFolderBgOpacityValue');
    if (folderOpacityText) folderOpacityText.textContent = Number(valueOf('desktopFolderBgOpacity') || 0.74).toFixed(2);
  }

  async function saveDesktopIconSettings(labelColor, iconBgColor) {
    const current = getSettings();
    appData.settings = {
      ...current,
      desktopIconSize: clampNumber(valueOf('desktopIconSize'), 40, 82, 58),
      desktopIconBgColor: isHexColor(iconBgColor) ? iconBgColor : (isHexColor(current.desktopIconBgColor) ? current.desktopIconBgColor : '#ffffff'),
      desktopIconBgOpacity: clampNumber(valueOf('desktopIconBgOpacity'), 0.2, 1, 0.96),
      desktopShortcutWidth: clampNumber(valueOf('desktopShortcutWidth'), 56, 120, 72),
      desktopShortcutHeight: clampNumber(valueOf('desktopShortcutHeight'), 56, 120, 72),
      desktopFolderWidth: clampNumber(valueOf('desktopFolderWidth'), 56, 120, 72),
      desktopFolderHeight: clampNumber(valueOf('desktopFolderHeight'), 56, 120, 72),
      desktopFolderBgOpacity: clampNumber(valueOf('desktopFolderBgOpacity'), 0.2, 1, 0.74),
      desktopIconRadius: clampNumber(valueOf('desktopIconRadius'), 0, 30, 18),
      desktopIconOpacity: clampNumber(valueOf('desktopIconOpacity'), 0.2, 1, 1),
      desktopIconGap: clampNumber(valueOf('desktopIconGap'), 8, 32, 14),
      desktopIconShowName: checkedOf('desktopIconShowName'),
      desktopIconFontSize: clampNumber(valueOf('desktopIconFontSize'), 10, 16, 12),
      desktopIconLabelColor: typeof labelColor === 'string' ? labelColor : current.desktopIconLabelColor
    };
    settings = appData.settings;
    updateDesktopIconReadouts();
    await Storage.save(appData);
    applySettings();
    refreshAll();
  }

  function resetDesktopIconSettings() {
    setValue('desktopIconSize', '58');
    setValue('desktopIconBgOpacity', '0.96');
    setValue('desktopShortcutWidth', '72');
    setValue('desktopShortcutHeight', '72');
    setValue('desktopFolderWidth', '72');
    setValue('desktopFolderHeight', '72');
    setValue('desktopFolderBgOpacity', '0.74');
    setValue('desktopIconRadius', '18');
    setValue('desktopIconOpacity', '1');
    setValue('desktopIconGap', '14');
    setChecked('desktopIconShowName', true);
    setValue('desktopIconFontSize', '12');
    saveDesktopIconSettings('', '#ffffff');
  }

  function getAuthState() {
    const defaults = Storage.DEFAULT_DATA?.auth || { apiBase: '', token: '', user: null, lastLoginAt: 0 };
    const raw = appData?.auth && typeof appData.auth === 'object' ? appData.auth : {};
    return {
      ...defaults,
      ...raw,
      apiBase: typeof raw.apiBase === 'string' ? raw.apiBase : defaults.apiBase,
      token: typeof raw.token === 'string' ? raw.token : defaults.token,
      user: raw.user && typeof raw.user === 'object' ? raw.user : null,
      lastLoginAt: Number(raw.lastLoginAt) || 0
    };
  }

  async function saveAuthState(nextAuth, rerender = false) {
    appData.auth = {
      ...getAuthState(),
      ...nextAuth
    };
    await Storage.save(appData);
    if (rerender) renderDrawerAccount();
  }

  function authEndpoint(path) {
    const base = (valueOf('authApiBase') || getAuthState().apiBase || '').trim().replace(/\/+$/, '');
    if (!base) throw new Error('请先填写服务器 API 地址');
    if (!/^https?:\/\//i.test(base)) throw new Error('服务器 API 地址需要以 http:// 或 https:// 开头');
    const suffix = path.startsWith('/') ? path : `/${path}`;
    return `${base}${suffix}`;
  }

  async function authApiRequest(path, payload = null, method = 'POST') {
    const auth = getAuthState();
    const upperMethod = method.toUpperCase();
    const headers = { Accept: 'application/json' };
    if (upperMethod !== 'GET') headers['Content-Type'] = 'application/json';
    if (auth.token) headers.Authorization = `Bearer ${auth.token}`;
    const response = await fetch(authEndpoint(path), {
      method: upperMethod,
      headers,
      body: upperMethod === 'GET' ? undefined : JSON.stringify(payload || {})
    });
    const text = await response.text();
    let body = {};
    if (text) {
      try {
        body = JSON.parse(text);
      } catch (error) {
        body = { message: text };
      }
    }
    if (!response.ok) {
      throw new Error(body.message || body.error || `请求失败：${response.status}`);
    }
    return body && typeof body === 'object' && body.data && typeof body.data === 'object' ? body.data : body;
  }

  function extractAuthPayload(data) {
    const payload = data && typeof data === 'object' && data.data && typeof data.data === 'object' ? data.data : data;
    if (!payload || typeof payload !== 'object') return {};
    return {
      token: payload.token || payload.accessToken || payload.jwt || '',
      user: payload.user || payload.profile || payload.account || null
    };
  }

  function renderDrawerAccount() {
    const isLoggedIn = Sync.isLoggedIn && Sync.isLoggedIn();
    const displayName = isLoggedIn ? Sync.getUserDisplayName() : '';
    const statusText = isLoggedIn ? `已登录：${displayName}` : '未登录';
    const loginTime = getAuthState().lastLoginAt ? formatBackupTime(getAuthState().lastLoginAt) : '暂无';
    setDrawerContent('账号同步', '邮箱注册/登录，数据自动同步到云端。换设备登录即可恢复所有书签和设置。', `
      <div class="auth-stack">
        <section class="auth-status-card">
          <div>
            <strong>${escapeHtml(statusText)}</strong>
            <span>最近登录：${escapeHtml(loginTime)}</span>
          </div>
          <button id="authLogoutBtn" class="auth-secondary-btn" type="button" ${isLoggedIn ? '' : 'disabled'}>退出登录</button>
        </section>

        <section class="auth-card">
          <h4>邮箱账号</h4>
          <div class="auth-form-grid">
            <label class="auth-field"><span>邮箱</span><input id="authEmail" type="email" autocomplete="email" placeholder="name@example.com"></label>
            <label class="auth-field"><span>密码</span><input id="authPassword" type="password" autocomplete="current-password" placeholder="至少 6 位"></label>
            <label class="auth-field auth-field-full"><span>昵称（注册可选）</span><input id="authNickname" type="text" autocomplete="nickname" placeholder="黑马总裁用户"></label>
          </div>
          <div class="auth-actions">
            <button id="authLoginBtn" class="drawer-primary-btn" type="button">邮箱登录</button>
            <button id="authRegisterBtn" class="auth-secondary-btn" type="button">注册账号</button>
            <button id="authResetBtn" class="auth-secondary-btn" type="button">忘记密码</button>
          </div>
        </section>

        <section class="auth-card">
          <h4>第三方登录</h4>
          <div class="auth-actions">
            <button id="authGitHubBtn" class="drawer-primary-btn" type="button" style="background:#24292e;">GitHub 登录</button>
          </div>
        </section>
      </div>
    `, content => {
      document.getElementById('authLoginBtn')?.addEventListener('click', () => handleEmailAuth('login'));
      document.getElementById('authRegisterBtn')?.addEventListener('click', () => handleEmailAuth('register'));
      document.getElementById('authResetBtn')?.addEventListener('click', handleResetPassword);
      document.getElementById('authLogoutBtn')?.addEventListener('click', logoutAuth);
      document.getElementById('authGitHubBtn')?.addEventListener('click', () => {
        Sync.loginWithGitHub().then(r => {
          if (!r.success) window._showToast('GitHub 登录失败: ' + r.error, 'error');
        });
      });
    });
  }

  async function handleEmailAuth(mode) {
    const email = valueOf('authEmail').trim();
    const password = valueOf('authPassword');
    const nickname = valueOf('authNickname').trim();
    if (!email || !password) return showToast('请填写邮箱和密码', 'error');
    if (password.length < 6) return showToast('密码至少需要 6 位', 'error');
    const buttons = [document.getElementById('authLoginBtn'), document.getElementById('authRegisterBtn'), document.getElementById('authResetBtn')];
    buttons.forEach(button => { if (button) button.disabled = true; });
    try {
      if (mode === 'register') {
        const result = await Sync.registerWithEmail(email, password, nickname);
        if (!result.success) throw new Error(result.error);
        showToast('注册成功，请查收验证邮件并确认', 'success');
      } else {
        const result = await Sync.loginWithEmail(email, password);
        if (!result.success) throw new Error(result.error);
        showToast('登录成功', 'success');
        const syncResult = await Sync.syncFromCloud();
        if (syncResult.success) {
          showToast('云端数据已同步到本地，即将刷新...', 'success');
          setTimeout(() => window.location.reload(), 1500);
        } else if (!syncResult.isEmpty) {
          showToast(syncResult.error || '同步数据失败', 'info');
        }
      }
    } catch (error) {
      showToast(error.message || '账号请求失败', 'error');
    } finally {
      buttons.forEach(button => { if (button) button.disabled = false; });
    }
  }

  async function handleResetPassword() {
    const email = valueOf('authEmail').trim();
    if (!email) return showToast('请先填写邮箱地址', 'error');
    const btn = document.getElementById('authResetBtn');
    if (btn) btn.disabled = true;
    try {
      const result = await Sync.resetPassword(email);
      if (!result.success) throw new Error(result.error);
      showToast('密码重置邮件已发送，请查收', 'success');
    } catch (error) {
      showToast(error.message || '重置失败', 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  async function handleWechatLogin() {
    const apiBase = valueOf('authApiBase').trim();
    await saveAuthState({ apiBase });
    const box = document.getElementById('authWechatQr');
    if (box) box.innerHTML = '<span>正在获取二维码...</span>';
    try {
      const data = await authApiRequest('/auth/wechat/qrcode', {}, 'POST');
      const qr = data.qrCodeUrl || data.qrcodeUrl || data.qrCode || data.qrcode || data.url || '';
      authWechatSceneId = data.sceneId || data.ticket || data.state || data.uuid || '';
      if (box) {
        box.innerHTML = qr
          ? `<img src="${escapeAttr(qr)}" alt="微信登录二维码"><span>扫码后点击“检查扫码状态”</span>`
          : '<span>服务器未返回二维码地址</span>';
      }
      showToast('微信二维码已获取', 'success');
    } catch (error) {
      if (box) box.innerHTML = '<span>二维码获取失败</span>';
      showToast(error.message || '微信二维码获取失败', 'error');
    }
  }

  async function handleWechatStatus() {
    try {
      const query = authWechatSceneId ? `?sceneId=${encodeURIComponent(authWechatSceneId)}` : '';
      const data = await authApiRequest(`/auth/wechat/status${query}`, null, 'GET');
      const payload = extractAuthPayload(data);
      if (!payload.token) {
        showToast(data.message || data.status || '尚未完成扫码确认', 'info');
        return;
      }
      await saveAuthState({ token: payload.token, user: payload.user, lastLoginAt: Date.now() }, true);
      showToast('微信登录成功', 'success');
    } catch (error) {
      showToast(error.message || '微信登录状态检查失败', 'error');
    }
  }

  async function logoutAuth() {
    await Sync.logout();
    await saveAuthState({ token: '', user: null, lastLoginAt: 0 }, true);
    showToast('已退出登录', 'success');
  }

  function renderDrawerBackup() {
    const backup = appData?.localBackup;
    const backupTime = backup?.createdAt ? formatBackupTime(backup.createdAt) : '暂无备份';
    const content = document.querySelector('.top-menu-content');
    if (!content) return;
    content.innerHTML = `
      <div class="drawer-backup-stack">
        <button id="drawerBackupNow" class="drawer-backup-sync" type="button">创建本地备份</button>
        <div class="drawer-backup-time">上次备份：${escapeHtml(backupTime)}</div>
        <div class="drawer-backup-card">
          <button id="drawerRestoreBackup" class="drawer-backup-link" type="button">恢复历史数据</button>
          <button id="drawerExportLocal" class="drawer-backup-link" type="button">导出本地数据</button>
          <button id="drawerImportBackup" class="drawer-backup-link" type="button">导入备份数据</button>
          <button id="drawerImportBookmarks" class="drawer-backup-link" type="button">导入浏览器收藏夹</button>
        </div>
        <div class="drawer-backup-card danger">
          <div class="drawer-danger-copy">
            <strong>重置所有数据</strong>
            <span>清空当前所有面板、分组和自定义设置。建议先导出备份，再执行重置。</span>
          </div>
          <button id="drawerResetAllFromBackup" class="drawer-danger-btn" type="button">确认重置所有数据</button>
        </div>
      </div>
    `;
    document.getElementById('drawerBackupNow')?.addEventListener('click', () => createLocalBackup('已完成本地备份'));
    document.getElementById('drawerRestoreBackup')?.addEventListener('click', restoreLocalBackup);
    document.getElementById('drawerExportLocal')?.addEventListener('click', exportData);
    document.getElementById('drawerImportBackup')?.addEventListener('click', () => document.getElementById('importFileInput')?.click());
    document.getElementById('drawerImportBookmarks')?.addEventListener('click', importBrowserBookmarks);
    document.getElementById('drawerResetAllFromBackup')?.addEventListener('click', resetAllData);
  }

  function formatBackupTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '暂无备份';
    const pad = number => String(number).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function createBackupSnapshot() {
    const snapshot = JSON.parse(JSON.stringify(appData || {}));
    delete snapshot.localBackup;
    return snapshot;
  }

  async function createLocalBackup(message = '已完成本地备份') {
    hydrateBookmarkIcons(appData);
    appData.localBackup = {
      createdAt: Date.now(),
      data: createBackupSnapshot()
    };
    await Storage.save(appData);
    renderDrawerBackup();
    showToast(message, 'success');
  }

  async function restoreLocalBackup() {
    const backup = appData?.localBackup;
    if (!backup?.data) return showToast('暂无可恢复的本地备份', 'error');
    if (!confirm('确定恢复历史备份吗？当前数据会被备份内容覆盖。')) return;
    appData = {
      ...JSON.parse(JSON.stringify(backup.data)),
      localBackup: backup
    };
    hydrateBookmarkIcons(appData);
    settings = getSettings();
    await Storage.save(appData);
    applySettings();
    PanelManager.init(appData, refreshAll);
    refreshAll();
    renderDrawerBackup();
    showToast('已恢复历史数据', 'success');
  }

  function renderDrawerBookmarks() {
    setDrawerContent('导入浏览器收藏夹', '一键把浏览器收藏夹按文件夹导入当前面板。', `
      <div class="drawer-action-card">
        <h4>导入收藏夹</h4>
        <p>会读取浏览器收藏夹栏，并按文件夹生成分组；已有链接会自动跳过。</p>
        <button id="drawerImportBookmarks" class="drawer-primary-btn" type="button">开始导入</button>
      </div>
    `, () => document.getElementById('drawerImportBookmarks')?.addEventListener('click', importBrowserBookmarks));
  }

  function renderDrawerExport() {
    setDrawerContent('数据导出', '导出当前面板、分组、链接、样式和最近访问数据。', `
      <div class="drawer-action-card">
        <h4>导出备份</h4>
        <p>生成 JSON 文件，后续可在数据导入中恢复。</p>
        <button id="drawerExportData" class="drawer-primary-btn" type="button">导出数据</button>
      </div>
    `, () => document.getElementById('drawerExportData')?.addEventListener('click', exportData));
  }

  function renderDrawerImport() {
    setDrawerContent('数据导入', '从之前导出的 JSON 文件恢复数据。', `
      <div class="drawer-action-card">
        <h4>导入备份</h4>
        <p>导入会覆盖当前扩展内的数据，请先确认文件来源可靠。</p>
        <button id="drawerImportData" class="drawer-primary-btn" type="button">选择 JSON 文件</button>
      </div>
    `, () => document.getElementById('drawerImportData')?.addEventListener('click', () => document.getElementById('importFileInput').click()));
  }

  async function resetAllData() {
    if (!confirm('确定重置所有数据吗？此操作不可恢复。')) return;
    appData = await Storage.reset();
    settings = getSettings();
    applySettings();
    PanelManager.init(appData, refreshAll);
    refreshAll();
    renderDrawerPanel('settings');
    showToast('数据已重置', 'success');
  }

  function openSearchEnginePicker(event) {
    const engines = SearchEngine.ENGINES || {};
    const current = SearchEngine.getEngine ? SearchEngine.getEngine() : getSettings().searchEngine;
    const buttonRect = document.getElementById('dockMenuBtn')?.getBoundingClientRect();
    const fromDrawer = document.getElementById('menuModal')?.contains(event.target);
    const menuEvent = {
      clientX: fromDrawer ? event.clientX : (buttonRect ? buttonRect.right + 8 : event.clientX),
      clientY: fromDrawer ? event.clientY : (buttonRect ? buttonRect.top : event.clientY)
    };
    showContextMenu(menuEvent, Object.entries(engines).map(([key, engine]) => [
      `${engine.name}${key === current ? ' ✓' : ''}`,
      () => {
        SearchEngine.setEngine(key);
        if (appData?.settings) appData.settings.searchEngine = key;
        settings = getSettings();
        showToast(`搜索引擎已切换为 ${engine.name}`, 'success');
      },
      '',
      ''
    ]));
  }

  function openPanelManagerModal() {
    renderPanelManager();
    showModal('panelManagerModal');
  }

  function renderPanelManager() {
    const list = document.getElementById('panelManagerList');
    if (!list) return;
    const panels = PanelManager.getPanels ? PanelManager.getPanels() : [];
    const active = PanelManager.getActiveIndex ? PanelManager.getActiveIndex() : 0;
    list.innerHTML = panels.map((panel, index) => `
      <div class="panel-manager-item ${index === active ? 'active' : ''}">
        <button class="panel-switch" data-index="${index}">${escapeHtml(panel.name)}</button>
        <button class="panel-delete" data-index="${index}" ${panels.length <= 1 ? 'disabled' : ''}>删除</button>
      </div>
    `).join('');
    list.querySelectorAll('.panel-switch').forEach(button => {
      button.addEventListener('click', () => {
        PanelManager.switchPanel(Number(button.dataset.index));
        renderPanelManager();
      });
    });
    list.querySelectorAll('.panel-delete').forEach(button => {
      button.addEventListener('click', () => {
        PanelManager.deletePanel(Number(button.dataset.index));
        renderPanelManager();
      });
    });
  }

  function ensureSettingsLayout() {
    const modal = document.getElementById('settingsModal');
    const body = modal?.querySelector('.modal-body');
    if (!body || body.dataset.rebuilt === '1') return;
    body.dataset.rebuilt = '1';
    body.className = 'modal-body settings-panel';
    body.innerHTML = `
      <section class="settings-section">
        <h4 class="settings-section-title">模块和链接</h4>
        <label class="setting-row"><span>在新窗口中打开链接</span><input id="settingLinkNewWindow" type="checkbox"></label>
        <label class="setting-row"><span>链接标题显示为单行</span><input id="settingSingleLine" type="checkbox"></label>
        <label class="setting-row"><span>链接备注</span><select id="settingLinkNote"><option value="always">始终显示</option><option value="hover">悬停显示</option><option value="none">不显示</option></select></label>
        <label class="setting-row"><span>双击模块标题快捷操作</span><select id="settingDblClick"><option value="none">无</option><option value="edit">编辑模块</option><option value="collapse">折叠模块</option><option value="addlink">添加链接</option></select></label>
        <label class="setting-row"><span>添加链接位于列表的</span><select id="settingAddPos"><option value="bottom">底部</option><option value="top">顶部</option></select></label>
      </section>
      <section class="settings-section">
        <h4 class="settings-section-title">搜索</h4>
        <label class="setting-row"><span>在新窗口中打开搜索结果</span><input id="settingSearchNewWindow" type="checkbox"></label>
        <label class="setting-row"><span>页面加载后自动聚焦搜索框</span><input id="settingAutoFocus" type="checkbox"></label>
      </section>
    `;
  }

  function bindSettings() {
    ensureSettingsLayout();
    document.getElementById('settingsSave')?.addEventListener('click', async () => {
      const current = getSettings();
      appData.settings = {
        ...current,
        theme: current.theme || 'dark',
        pageWidth: normalizePageWidth(current.pageWidth),
        searchEngine: current.searchEngine || 'baidu',
        searchNewWindow: checkedOf('settingSearchNewWindow'),
        linkNewWindow: checkedOf('settingLinkNewWindow'),
        singleLine: checkedOf('settingSingleLine'),
        linkNote: valueOf('settingLinkNote') || 'none',
        dblClick: valueOf('settingDblClick') || 'none',
        addPos: valueOf('settingAddPos') || 'bottom',
        autoFocus: checkedOf('settingAutoFocus')
      };
      settings = appData.settings;
      await Storage.save(appData);
      applySettings();
      refreshAll();
      hideModals();
      showToast('设置已保存', 'success');
    });
  }

  function openSettingsModal() {
    ensureSettingsLayout();
    const s = getSettings();
    setChecked('settingSearchNewWindow', s.searchNewWindow !== false);
    setChecked('settingLinkNewWindow', s.linkNewWindow !== false);
    setChecked('settingSingleLine', s.singleLine === true);
    setValue('settingLinkNote', s.linkNote || 'none');
    setValue('settingDblClick', s.dblClick || 'none');
    setValue('settingAddPos', s.addPos || 'bottom');
    setChecked('settingAutoFocus', s.autoFocus !== false);
    ['settingSearchNewWindow', 'settingLinkNewWindow', 'settingSingleLine', 'settingLinkNote', 'settingDblClick', 'settingAddPos', 'settingAutoFocus'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.onchange = saveSettingsInline;
    });
    showModal('settingsModal');
  }

  async function saveSettingsInline() {
    const current = getSettings();
    appData.settings = {
      ...current,
      theme: current.theme || 'dark',
      pageWidth: normalizePageWidth(current.pageWidth),
      searchEngine: current.searchEngine || 'baidu',
      searchNewWindow: checkedOf('settingSearchNewWindow'),
      linkNewWindow: checkedOf('settingLinkNewWindow'),
      singleLine: checkedOf('settingSingleLine'),
      linkNote: valueOf('settingLinkNote') || 'none',
      dblClick: valueOf('settingDblClick') || 'none',
      addPos: valueOf('settingAddPos') || 'bottom',
      autoFocus: checkedOf('settingAutoFocus')
    };
    settings = appData.settings;
    await Storage.save(appData);
    applySettings();
    refreshAll();
  }

  function applySettings() {
    const s = getSettings();
    const root = document.documentElement;
    const themeColor = isHexColor(s.themeColor) ? s.themeColor : '#1d74ff';
    const followsSystem = (s.theme || 'dark') === 'system';
    const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const resolvedDark = followsSystem ? systemDark : (s.theme || 'dark') === 'dark';
    const themeColorLuminance = colorLuminance(themeColor);
    const colorIsDark = themeColorLuminance < 0.38;
    const colorIsLight = themeColorLuminance > 0.72;
    const menuDark = resolvedDark;
    const menuAccentText = colorIsLight ? '#111827' : (menuDark && colorIsDark ? '#f8fafc' : themeColor);
    root.style.setProperty('--page-width', normalizePageWidth(s.pageWidth));
    root.style.setProperty('--theme-color', themeColor);
    root.style.setProperty('--theme-on-color', readableTextColor(themeColor));
    root.style.setProperty('--accent', themeColor);
    root.style.setProperty('--menu-accent-text', menuAccentText);
    root.style.setProperty('--wallpaper-image', wallpaperToCssImage(s.wallpaper));
    root.style.setProperty('--wallpaper-mask', String(clampNumber(s.wallpaperMask, 0, 1, 0)));
    root.style.setProperty('--wallpaper-blur', `${clampNumber(s.wallpaperBlur, 0, 20, 0)}px`);
    const memoDockWidth = clampNumber(s.memoDockWidth, 320, Math.min(860, Math.max(320, window.innerWidth - 56)), 420);
    const memoDockHeight = clampNumber(s.memoDockHeight, 320, Math.min(860, Math.max(320, window.innerHeight - 56)), 620);
    root.style.setProperty('--memo-dock-height', `${memoDockHeight}px`);
    root.style.setProperty('--memo-dock-width', `${memoDockWidth}px`);
    root.style.setProperty('--memo-dock-x', `${clampNumber(s.memoDockX, 8, Math.max(8, window.innerWidth - memoDockWidth - 8), 76)}px`);
    root.style.setProperty('--memo-dock-y', `${clampNumber(s.memoDockY, 8, Math.max(8, window.innerHeight - memoDockHeight - 8), 96)}px`);
    root.style.setProperty('--dock-width', `${clampNumber(s.sidebarWidth, 42, 90, 48)}px`);
    root.style.setProperty('--dock-opacity', String(clampNumber(s.sidebarOpacity, 0.2, 1, 0.92)));
    const panelSurfaceOpacity = getPanelSurfaceOpacity();
    root.style.setProperty('--panel-surface-opacity', String(panelSurfaceOpacity));
    root.style.setProperty('--panel-surface-bg', resolvedDark
      ? `rgba(32, 34, 35, ${panelSurfaceOpacity})`
      : `rgba(255, 255, 255, ${panelSurfaceOpacity})`);
    root.style.setProperty('--desktop-icon-size', `${clampNumber(s.desktopIconSize, 40, 82, 58)}px`);
    root.style.setProperty('--desktop-icon-bg', hexToRgba(isHexColor(s.desktopIconBgColor) ? s.desktopIconBgColor : '#ffffff', clampNumber(s.desktopIconBgOpacity, 0.2, 1, 0.96)));
    root.style.setProperty('--desktop-shortcut-width', `${clampNumber(s.desktopShortcutWidth, 56, 120, 72)}px`);
    root.style.setProperty('--desktop-shortcut-height', `${clampNumber(s.desktopShortcutHeight, 56, 120, 72)}px`);
    root.style.setProperty('--desktop-folder-width', `${clampNumber(s.desktopFolderWidth, 56, 120, 72)}px`);
    root.style.setProperty('--desktop-folder-height', `${clampNumber(s.desktopFolderHeight, 56, 120, 72)}px`);
    const folderOpacityRaw = Number(s.desktopFolderBgOpacity);
    const folderSurfaceOpacity = folderOpacityRaw === 0.82
      ? (resolvedDark ? 0.74 : 0.78)
      : clampNumber(s.desktopFolderBgOpacity, 0.2, 1, resolvedDark ? 0.74 : 0.78);
    root.style.setProperty('--desktop-folder-bg-opacity', String(folderSurfaceOpacity));
    root.style.setProperty('--desktop-folder-bg', hexToRgba(resolvedDark ? '#202224' : '#ffffff', folderSurfaceOpacity));
    root.style.setProperty('--desktop-icon-radius', `${clampNumber(s.desktopIconRadius, 0, 30, 18)}px`);
    root.style.setProperty('--desktop-icon-opacity', String(clampNumber(s.desktopIconOpacity, 0.2, 1, 1)));
    root.style.setProperty('--desktop-icon-gap', `${clampNumber(s.desktopIconGap, 8, 32, 14)}px`);
    root.style.setProperty('--desktop-icon-font-size', `${clampNumber(s.desktopIconFontSize, 10, 16, 12)}px`);
    root.style.setProperty('--desktop-icon-label-color', isHexColor(s.desktopIconLabelColor) ? s.desktopIconLabelColor : (resolvedDark ? '#ffffff' : '#202939'));
    root.style.setProperty('--menu-bg', menuDark ? '#0b0c0d' : '#f2f2f6');
    root.style.setProperty('--menu-side-bg', menuDark ? 'rgba(18,20,22,.98)' : '#ffffff');
    root.style.setProperty('--menu-card-bg', menuDark ? 'rgba(31,33,35,.98)' : '#ffffff');
    root.style.setProperty('--menu-card-soft', menuDark ? 'rgba(255,255,255,.06)' : '#f8f9fb');
    root.style.setProperty('--menu-text', menuDark ? '#f3f5f7' : '#273142');
    root.style.setProperty('--menu-muted', menuDark ? '#9ca3af' : '#7b8494');
    root.style.setProperty('--menu-line', menuDark ? 'rgba(255,255,255,.10)' : '#eef0f4');
    root.style.setProperty('--menu-hover', menuDark ? hexToRgba(themeColor, 0.18) : hexToRgba(themeColor, 0.1));
    root.style.setProperty('--menu-icon-bg', menuDark ? 'rgba(255,255,255,.09)' : 'rgba(16,24,40,.07)');
    root.style.setProperty('--menu-icon-color', menuDark ? '#f8fafc' : '#667085');
    root.style.setProperty('--menu-select-bg', menuDark ? '#2f3032' : '#ffffff');
    root.style.setProperty('--menu-select-text', menuDark ? '#f3f5f7' : '#111827');
    root.style.setProperty('--menu-shadow', menuDark ? 'rgba(0,0,0,.48)' : 'rgba(0,0,0,.28)');
    document.body.dataset.theme = s.theme || 'dark';
    document.body.dataset.resolvedTheme = resolvedDark ? 'dark' : 'light';
    document.body.dataset.collectionMode = s.collectionMode === 'desktop' ? 'desktop' : 'cards';
    document.body.dataset.desktopIconName = s.desktopIconShowName === false ? 'hidden' : 'visible';
    document.body.dataset.sidebarPosition = s.sidebarPosition === 'right' ? 'right' : 'left';
    document.body.dataset.sidebarAutoHide = s.sidebarAutoHide === true ? 'true' : 'false';
    document.body.dataset.wallpaperActive = s.wallpaper ? 'true' : 'false';
    document.body.dataset.wallpaperButton = s.wallpaperButton === true ? 'true' : 'false';
    document.body.dataset.memoDockPosition = ['left', 'right', 'free'].includes(s.memoDockPosition) ? s.memoDockPosition : 'top';
    document.body.dataset.memoDockCollapsed = s.memoDockCollapsed === true ? 'true' : 'false';
  }

  function getPanelSurfaceOpacity() {
    let panel = null;
    try {
      panel = PanelManager.getActivePanel?.();
    } catch (error) {
      panel = appData?.panels?.[appData?.activePanelIndex || 0] || appData?.panels?.[0] || null;
    }
    const card = (panel?.cards || []).find(item => item?.style && Number.isFinite(Number(item.style.bodyOpacity)));
    return clampNumber(card?.style?.bodyOpacity, 0, 1, 1);
  }

  function needsPortableIcon(icon) {
    const value = String(icon || '').trim();
    if (!value) return true;
    return /^(blob:|file:|chrome-extension:)/i.test(value);
  }

  function hydrateBookmarkIcons(data) {
    let changed = false;
    const visit = item => {
      if (!item || !item.url || !needsPortableIcon(item.icon)) return;
      item.icon = faviconFor(item.url);
      changed = true;
    };

    (data?.panels || []).forEach(panel => {
      (panel?.cards || []).forEach(card => {
        (card?.bookmarks || []).forEach(visit);
      });
    });
    (data?.collectionBox || []).forEach(visit);
    (data?.recentLinks || []).forEach(visit);

    return changed;
  }

  async function exportData() {
    if (hydrateBookmarkIcons(appData)) {
      await Storage.save(appData);
    }
    const blob = new Blob([await Storage.exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `heimazongcai_label_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('数据已导出', 'success');
  }

  async function importBrowserBookmarks() {
    if (!window.chrome?.bookmarks?.getTree) {
      showToast('当前环境无法读取浏览器收藏夹，请重新加载扩展并允许收藏夹权限', 'error');
      return;
    }
    try {
      const tree = await new Promise((resolve, reject) => {
        chrome.bookmarks.getTree(result => {
          const error = chrome.runtime?.lastError;
          if (error) reject(new Error(error.message));
          else resolve(result || []);
        });
      });
      const root = tree[0];
      const bookmarksBar = findBookmarksBar(root);
      const cards = buildCardsFromBookmarksBar(bookmarksBar);
      if (!cards.length) {
        showToast('收藏夹栏里没有可导入的链接', 'error');
        return;
      }
      const imported = PanelManager.importCards(cards, getColumnCount());
      showToast(imported ? `已导入 ${imported} 个收藏夹链接` : '没有新的收藏夹链接可导入', imported ? 'success' : 'info');
    } catch (error) {
      showToast('导入浏览器收藏夹失败：' + (error.message || error), 'error');
    }
  }

  function findBookmarksBar(root) {
    const children = root?.children || [];
    return children.find(node => {
      const title = node.title || '';
      return node.children && /收藏夹栏|书签栏|Bookmarks bar|Favorites bar/i.test(title);
    }) || children.find(node => node.children) || root;
  }

  function buildCardsFromBookmarksBar(bookmarksBar) {
    const cards = [];
    const direct = [];
    (bookmarksBar?.children || []).forEach(node => {
      if (node.url) {
        direct.push(bookmarkNodeToItem(node));
        return;
      }
      const bookmarks = flattenBookmarkNode(node);
      if (bookmarks.length) cards.push({ name: node.title || '未命名文件夹', bookmarks });
    });
    if (direct.length) cards.unshift({ name: bookmarksBar?.title || '收藏夹栏', bookmarks: direct });
    return cards;
  }

  function flattenBookmarkNode(node) {
    const result = [];
    (node?.children || []).forEach(child => {
      if (child.url) result.push(bookmarkNodeToItem(child));
      else result.push(...flattenBookmarkNode(child));
    });
    return result;
  }

  function bookmarkNodeToItem(node) {
    return {
      name: node.title || domainOf(node.url) || node.url,
      url: node.url,
      remark: '',
      icon: faviconFor(node.url)
    };
  }

  function importData(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const result = await Storage.importData(reader.result);
      if (result.success) {
        appData = result.data;
        if (hydrateBookmarkIcons(appData)) {
          await Storage.save(appData);
        }
        settings = getSettings();
        applySettings();
        PanelManager.init(appData, refreshAll);
        refreshAll();
        if (document.getElementById('menuBackupRestore')?.classList.contains('active')) {
          renderDrawerBackup();
        }
        showToast('数据导入成功', 'success');
      } else {
        showToast('导入失败：' + result.error, 'error');
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  }

  function importWallpaper(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件', 'error');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      appData.settings = { ...getSettings(), wallpaper: reader.result };
      settings = appData.settings;
      await Storage.save(appData);
      applySettings();
      if (document.getElementById('menuThemeWallpaper')?.classList.contains('active')) {
        renderDrawerThemeWallpaper();
      }
      if (document.getElementById('wallpaperLibraryModal')?.classList.contains('active')) {
        renderWallpaperLibrary(activeWallpaperCategory);
      }
      showToast('壁纸已更新', 'success');
      event.target.value = '';
    };
    reader.readAsDataURL(file);
  }

  function downloadWallpaper() {
    const wallpaper = getSettings().wallpaper;
    if (!wallpaper) return showToast('当前没有可下载的壁纸', 'error');
    if (/^(linear|radial|conic)-gradient\(/i.test(String(wallpaper).trim())) {
      return showToast('内置壁纸已保存在插件中，无需下载', 'info');
    }
    const source = wallpaperDownloadUrl(wallpaper);
    if (!source) return showToast('当前壁纸无法下载', 'error');
    const link = document.createElement('a');
    link.href = source;
    link.download = `heimazongcai_wallpaper_${new Date().toISOString().slice(0, 10)}${wallpaperFileExt(source)}`;
    link.click();
  }

  function wallpaperDownloadUrl(value) {
    const wallpaper = String(value || '').trim();
    const match = wallpaper.match(/^url\((['"]?)(.*?)\1\)$/i);
    return match ? match[2] : wallpaper;
  }

  function wallpaperFileExt(source) {
    const clean = String(source || '').split('?')[0].split('#')[0].toLowerCase();
    const match = clean.match(/\.(webp|png|jpe?g|gif)$/);
    return match ? `.${match[1] === 'jpeg' ? 'jpg' : match[1]}` : '.png';
  }

  function showModal(id) {
    closeTopMenu();
    document.getElementById('modalOverlay')?.classList.add('active');
    document.getElementById(id)?.classList.add('active');
  }

  function hideModals() {
    document.getElementById('modalOverlay')?.classList.remove('active');
    document.querySelectorAll('.modal.active').forEach(modal => modal.classList.remove('active'));
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text || '');
      showToast('网址已复制', 'success');
    } catch (error) {
      showToast('复制失败', 'error');
    }
  }

  function normalizeUrl(url) {
    if (!url) return '';
    return /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : 'https://' + url;
  }

  function domainOf(url) {
    try {
      return new URL(normalizeUrl(url)).hostname.replace(/^www\./, '');
    } catch (error) {
      return url || '';
    }
  }

  async function resolveLinkMeta(rawUrl) {
    const url = normalizeUrl(rawUrl);
    const fallbackName = domainOf(url) || url;
    const fallbackIcon = faviconFor(url);
    if (!/^https?:\/\//i.test(url)) {
      return { name: fallbackName, icon: fallbackIcon };
    }
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(url, { signal: controller.signal, credentials: 'omit' });
      clearTimeout(timer);
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html')) return { name: fallbackName, icon: fallbackIcon };
      const html = await response.text();
      const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const title = match ? decodeHtml(match[1].replace(/\s+/g, ' ').trim()).slice(0, 80) : '';
      return {
        name: title || fallbackName,
        icon: extractIconUrl(html, url) || fallbackIcon
      };
    } catch (error) {
      return { name: fallbackName, icon: fallbackIcon };
    }
  }

  function attachIconFallback(img, holder, url, fallbackText, preferred) {
    if (!img || !holder) return;
    const candidates = faviconCandidates(url, preferred);
    let index = Math.max(0, candidates.indexOf(img.getAttribute('src') || candidates[0]));
    if (candidates.length && img.getAttribute('src') !== candidates[index]) {
      img.src = candidates[index];
    }
    img.addEventListener('error', () => {
      index += 1;
      if (candidates[index]) {
        img.src = candidates[index];
        return;
      }
      img.remove();
      holder.textContent = fallbackText || '?';
    });
  }

  function faviconCandidates(url, preferred) {
    const normalized = normalizeUrl(url || '');
    const host = domainOf(normalized).replace(/^www\./, '');
    const candidates = [];
    if (preferred) candidates.push(preferred);
    if (host && /^https?:\/\//i.test(normalized)) {
      candidates.push(
        `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`,
        `https://icons.duckduckgo.com/ip3/${encodeURIComponent(host)}.ico`
      );
    }
    return [...new Set(candidates.filter(Boolean))];
  }

  function faviconFor(url) {
    const host = domainOf(url).replace(/^www\./, '');
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host || url || '')}&sz=64`;
  }

  function extractIconUrl(html, pageUrl) {
    const links = html.match(/<link\b[^>]*>/gi) || [];
    for (const tag of links) {
      const rel = attrOf(tag, 'rel').toLowerCase();
      if (!/(^|\s)(shortcut\s+icon|icon|apple-touch-icon)(\s|$)/.test(rel)) continue;
      const href = attrOf(tag, 'href');
      if (!href) continue;
      try {
        return new URL(decodeHtml(href), pageUrl).href;
      } catch (error) {
        return '';
      }
    }
    return '';
  }

  function attrOf(tag, name) {
    const match = tag.match(new RegExp(`${name}\\\\s*=\\\\s*(\"([^\"]*)\"|'([^']*)'|([^\\\\s>]+))`, 'i'));
    return match ? (match[2] || match[3] || match[4] || '') : '';
  }

  function decodeHtml(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  function valueOf(id) {
    return document.getElementById(id)?.value;
  }

  function checkedOf(id) {
    return document.getElementById(id)?.checked === true;
  }

  function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
  }

  function setValueUnlessFocused(el, value) {
    if (!el || document.activeElement === el) return;
    el.value = value;
  }

  function setChecked(id, value) {
    const el = document.getElementById(id);
    if (el) el.checked = value;
  }

  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value || '';
    return div.innerHTML;
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

  const icons = {
    handle: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="4" cy="4" r="2" fill="currentColor" stroke="none"/><circle cx="12" cy="4" r="2" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/></svg>',
    more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.7" fill="currentColor" stroke="none"/></svg>',
    moreText: '<span class="more-dots">···</span>',
    addModule: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="12" height="14" rx="2"></rect><path d="M9 9h6M12 12v5M9.5 14.5h5"></path></svg>',
    menuAddLink: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>',
    menuLayout: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.5"></rect><rect x="13" y="4" width="7" height="7" rx="1.5"></rect><rect x="4" y="13" width="7" height="7" rx="1.5"></rect><rect x="13" y="13" width="7" height="7" rx="1.5"></rect></svg>',
    menuEdit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4Z"></path><path d="M13 7l4 4"></path></svg>',
    menuCollapse: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9h12M6 15h12"></path></svg>',
    menuCopy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M5 15V5h10"></path></svg>',
    menuTrash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"></path></svg>'
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


/* ── First-load card entrance only; routine drag/collapse refreshes stay still. ── */
(function initCardEntrance() {
  let played = false;
  function animateCards() {
    if (played || document.body.classList.contains('is-dragging-links') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    played = true;
    const cards = document.querySelectorAll('.masonry-grid .card');
    cards.forEach(function(card, i) {
      card.classList.add('entering');
      card.style.animationDelay = (i * 18) + 'ms';
    });
    setTimeout(function() {
      cards.forEach(function(card) {
        card.classList.remove('entering');
        card.style.animationDelay = '';
      });
    }, 500);
  }
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(animateCards, 100);
  });
})();


// ====== 云端同步功能 ======
function initSync() {
  if (typeof Sync === 'undefined') return;
  const ready = Sync.init();
  if (!ready) return;
  Sync.onAuthStateChange(async (event, user) => {
    renderSyncUI();
    if (user) {
      const result = await Sync.syncFromCloud();
      if (result.success) {
        window._showToast('云端数据已同步到本地', 'success');
        setTimeout(() => window.location.reload(), 1200);
      }
    }
  });
  addSyncMenuListener();
  Sync.getCurrentUser().then(user => { renderSyncUI(); });
}

function renderSyncUI() {
  const avatarMenu = document.getElementById('userAvatarMenu');
  if (!avatarMenu) return;
  avatarMenu.hidden = false;
  const avatarImg = document.getElementById('userAvatarImg');
  const avatarName = document.getElementById('userAvatarName');
  const avatarEmail = document.getElementById('userAvatarEmail');
  const dropdown = document.getElementById('userAvatarDropdown');
  const btn = document.getElementById('userAvatarBtn');
  const isReady = Sync.isReady && Sync.isReady();
  if (!isReady) { avatarMenu.hidden = true; return; }
  const isLoggedIn = Sync.isLoggedIn && Sync.isLoggedIn();
  if (isLoggedIn) {
    avatarImg.src = Sync.getUserAvatar() || 'icons/horse-logo.png';
    avatarName.textContent = Sync.getUserDisplayName() || '用户';
    avatarEmail.textContent = '';
    btn.title = '点击打开个人菜单';
  } else {
    avatarImg.src = 'icons/horse-logo.png';
    avatarName.textContent = '未登录';
    avatarEmail.textContent = '';
    btn.title = '点击登录';
  }
  btn.onclick = () => { dropdown.hidden = !dropdown.hidden; };
  document.addEventListener('click', (e) => { if (!avatarMenu.contains(e.target)) dropdown.hidden = true; });
  document.getElementById('avatarMenuProfile')?.addEventListener('click', () => { dropdown.hidden = true; closeTopMenu(); renderDrawerPanel('account'); });
  document.getElementById('avatarMenuSync')?.addEventListener('click', () => { dropdown.hidden = true; if (isLoggedIn) { Sync.syncToCloud().then(r => { window._showToast(r.success ? '已同步到云端' : '同步失败: ' + r.error, r.success ? 'success' : 'error'); }); } else { closeTopMenu(); renderDrawerPanel('account'); } });
  document.getElementById('avatarMenuLogout')?.addEventListener('click', () => { dropdown.hidden = true; if (isLoggedIn) { Sync.logout().then(() => { logoutAuth(); }); } else { closeTopMenu(); renderDrawerPanel('account'); } });
}

function addSyncMenuListener() {
  const btn = document.getElementById('menuAccountSync');
  if (!btn) return;
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    if (Sync.isReady && !Sync.isReady()) { window._showToast('云端同步未配置', 'error'); return; }
    if (Sync.isLoggedIn && Sync.isLoggedIn()) { Sync.syncToCloud().then(r => { window._showToast(r.success ? '已同步到云端' : '同步失败: ' + r.error, r.success ? 'success' : 'error'); }); }
    else { renderDrawerPanel('account'); }
  });
}

// initSync 在 IIFE 内部通过 hook 调用，这里不做覆盖
// initSync() 会在 DOMContentLoaded 事件触发后通过 _origInit 调用

