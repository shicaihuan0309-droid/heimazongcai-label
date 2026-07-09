/**
 * 黑马总裁 Label - 个人中心模块
 * 包含：头像上传、昵称修改、密码修改、数据同步、绑定账号
 */

const Profile = (() => {
  let profileModal = null;
  let avatarFileInput = null;
  let currentAvatarUrl = '';
  let currentNickname = '';

  function init() {
    createProfileModalIfNeeded();
    bindEvents();
    updateSyncIndicator();
  }

  function createProfileModalIfNeeded() {
    if (document.getElementById('profileModal')) return;

    profileModal = document.createElement('section');
    profileModal.id = 'profileModal';
    profileModal.className = 'modal profile-modal';
    profileModal.innerHTML = `
      <div class="modal-head">
        <h3>个人中心</h3>
        <button id="profileModalClose" class="icon-btn" type="button" title="关闭">
          <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"></path></svg>
        </button>
      </div>
      <div class="modal-body profile-body">
        <div class="profile-avatar-section">
          <div class="profile-avatar-wrap">
            <img id="profileAvatarImg" src="icons/horse-logo.png" alt="">
            <button id="profileAvatarUploadBtn" type="button" class="profile-avatar-upload">更换</button>
            <input id="profileAvatarFile" type="file" accept="image/*" hidden>
          </div>
          <div class="profile-avatar-info">
            <h4 id="profileDisplayName">未登录</h4>
            <p id="profileEmail">-</p>
            <span id="profileProviderBadge" class="profile-provider-badge">-</span>
          </div>
        </div>
        <div class="profile-form">
          <label class="field">
            <span>昵称</span>
            <div class="profile-nickname-wrap">
              <input id="profileNickname" type="text" placeholder="输入昵称">
              <button id="profileSaveNickname" type="button" class="primary-btn">保存</button>
            </div>
          </label>
          <div class="profile-section" id="profilePasswordSection" style="display:none">
            <h4>修改密码</h4>
            <label class="field">
              <span>新密码</span>
              <input id="profileNewPassword" type="password" placeholder="输入新密码（至少6位）">
            </label>
            <label class="field">
              <span>确认密码</span>
              <input id="profileConfirmPassword" type="password" placeholder="再次输入新密码">
            </label>
            <button id="profileChangePasswordBtn" type="button" class="primary-btn">修改密码</button>
          </div>
          <div class="profile-section">
            <h4>数据同步</h4>
            <div class="profile-sync-status-row">
              <span class="profile-sync-label">同步状态：</span>
              <span id="profileSyncStatusText" class="profile-sync-status-text">未登录</span>
            </div>
            <div class="profile-sync-status-row">
              <span class="profile-sync-label">上次同步：</span>
              <span id="profileSyncTime">-</span>
            </div>
            <div class="profile-sync-actions">
              <button id="profileSyncToCloud" type="button" class="primary-btn">同步到云端</button>
              <button id="profileSyncFromCloud" type="button" class="ghost-btn">从云端恢复</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(profileModal);
  }

  function bindEvents() {
    // 顶栏头像下拉菜单 - 个人设置
    const avatarMenuProfile = document.getElementById('avatarMenuProfile');
    if (avatarMenuProfile) {
      avatarMenuProfile.addEventListener('click', () => {
        hideDropdown();
        openProfile();
      });
    }

    // 关闭按钮
    document.getElementById('profileModalClose')?.addEventListener('click', closeProfile);

    // 头像上传
    avatarFileInput = document.getElementById('profileAvatarFile');
    document.getElementById('profileAvatarUploadBtn')?.addEventListener('click', () => {
      avatarFileInput?.click();
    });
    avatarFileInput?.addEventListener('change', handleAvatarUpload);

    // 保存昵称
    document.getElementById('profileSaveNickname')?.addEventListener('click', saveNickname);

    // 修改密码
    document.getElementById('profileChangePasswordBtn')?.addEventListener('click', changePassword);

    // 同步按钮
    document.getElementById('profileSyncToCloud')?.addEventListener('click', syncToCloudHandler);
    document.getElementById('profileSyncFromCloud')?.addEventListener('click', syncFromCloudHandler);

    // 监听登录状态变化
    if (typeof Sync !== 'undefined' && Sync.onAuthStateChange) {
      Sync.onAuthStateChange((event, user) => {
        updateUI(user);
        if (event === 'SIGNED_IN') {
          checkSyncOnLogin();
        }
      });
    }
  }

  function hideDropdown() {
    const dropdown = document.getElementById('userAvatarDropdown');
    if (dropdown) dropdown.hidden = true;
  }

  function openProfile() {
    const user = Sync?.getCurrentUser?.();
    if (!user) {
      showToast('请先登录', 'error');
      return;
    }
    updateUI(user);
    showModal('profileModal');
  }

  function closeProfile() {
    hideModals?.();
  }

  function updateUI(user) {
    if (!user) return;
    const nickname = user.user_metadata?.nickname || user.user_metadata?.name || user.email?.split('@')[0] || '用户';
    const email = user.email || '-';
    const avatar = user.user_metadata?.avatar_url || 'icons/horse-logo.png';
    const provider = getProviderName(user);

    const displayNameEl = document.getElementById('profileDisplayName');
    const emailEl = document.getElementById('profileEmail');
    const avatarImg = document.getElementById('profileAvatarImg');
    const nicknameInput = document.getElementById('profileNickname');
    const badge = document.getElementById('profileProviderBadge');
    const passwordSection = document.getElementById('profilePasswordSection');

    if (displayNameEl) displayNameEl.textContent = nickname;
    if (emailEl) emailEl.textContent = email;
    if (avatarImg) { avatarImg.src = avatar; avatarImg.onerror = () => { avatarImg.src = 'icons/horse-logo.png'; }; }
    if (nicknameInput) nicknameInput.value = nickname;
    if (badge) { badge.textContent = provider; badge.className = `profile-provider-badge provider-${provider}`; }
    if (passwordSection) passwordSection.style.display = provider === '邮箱' ? 'block' : 'none';

    currentAvatarUrl = avatar;
    currentNickname = nickname;
    updateSyncStatusUI();
  }

  function getProviderName(user) {
    if (!user) return '-';
    const identities = user.identities || [];
    if (identities.some(i => i.provider === 'github')) return 'GitHub';
    if (user.app_metadata?.provider === 'email' || user.email) return '邮箱';
    return '未知';
  }

  async function handleAvatarUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件', 'error');
      event.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('头像图片请控制在 2MB 以内', 'error');
      event.target.value = '';
      return;
    }

    // 本地预览
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.getElementById('profileAvatarImg');
      if (img) img.src = reader.result;
    };
    reader.readAsDataURL(file);

    // 上传到 Supabase Storage
    if (typeof Sync !== 'undefined' && Sync.uploadAvatar) {
      const result = await Sync.uploadAvatar(file);
      if (result.success) {
        currentAvatarUrl = result.url;
        // 更新顶栏头像
        const topAvatar = document.getElementById('userAvatarImg');
        if (topAvatar) topAvatar.src = result.url;
        showToast('头像上传成功', 'success');
      } else {
        showToast('头像上传失败: ' + result.error, 'error');
      }
    }
    event.target.value = '';
  }

  async function saveNickname() {
    const input = document.getElementById('profileNickname');
    const nickname = input?.value.trim();
    if (!nickname) {
      showToast('请输入昵称', 'error');
      return;
    }
    if (typeof Sync !== 'undefined' && Sync.updateUserMetadata) {
      const result = await Sync.updateUserMetadata({ nickname });
      if (result.success) {
        currentNickname = nickname;
        const displayNameEl = document.getElementById('profileDisplayName');
        if (displayNameEl) displayNameEl.textContent = nickname;
        // 更新顶栏显示
        const nameEl = document.getElementById('userAvatarName');
        if (nameEl) nameEl.textContent = nickname;
        showToast('昵称已保存', 'success');
      } else {
        showToast('保存失败: ' + result.error, 'error');
      }
    }
  }

  async function changePassword() {
    const newPw = document.getElementById('profileNewPassword')?.value;
    const confirmPw = document.getElementById('profileConfirmPassword')?.value;
    if (!newPw || newPw.length < 6) {
      showToast('密码至少6位', 'error');
      return;
    }
    if (newPw !== confirmPw) {
      showToast('两次密码不一致', 'error');
      return;
    }
    if (typeof Sync !== 'undefined' && Sync.updatePassword) {
      const result = await Sync.updatePassword(newPw);
      if (result.success) {
        document.getElementById('profileNewPassword').value = '';
        document.getElementById('profileConfirmPassword').value = '';
        showToast('密码已修改，请使用新密码重新登录', 'success');
      } else {
        showToast('修改失败: ' + result.error, 'error');
      }
    }
  }

  async function syncToCloudHandler() {
    if (typeof Sync !== 'undefined' && Sync.syncToCloud) {
      showToast('正在同步到云端...', 'info');
      const result = await Sync.syncToCloud();
      if (result.success) {
        setLastSyncTime();
        updateSyncStatusUI();
        showToast('数据已同步到云端', 'success');
      } else {
        showToast('同步失败: ' + result.error, 'error');
      }
    }
  }

  async function syncFromCloudHandler() {
    if (typeof Sync !== 'undefined' && Sync.syncFromCloud) {
      showToast('正在从云端恢复...', 'info');
      const result = await Sync.syncFromCloud();
      if (result.success) {
        setLastSyncTime();
        updateSyncStatusUI();
        showToast('数据已恢复到本地', 'success');
        // 刷新页面数据
        if (typeof refreshAll === 'function') refreshAll();
      } else {
        showToast('恢复失败: ' + result.error, 'error');
      }
    }
  }

  async function checkSyncOnLogin() {
    const user = Sync?.getCurrentUser?.();
    if (!user) return;

    // 检查本地数据是否有变化
    const localData = await Storage?.load?.();
    const hasLocalData = localData && (localData.panels?.length > 0 || localData.memos?.length > 0);

    // 检查云端数据
    if (typeof Sync !== 'undefined' && Sync.downloadData) {
      const cloudResult = await Sync.downloadData();
      const hasCloudData = cloudResult.success && cloudResult.data && Object.keys(cloudResult.data).length > 0;

      if (hasLocalData && !hasCloudData) {
        // 本地有数据，云端没有，提示上传
        if (confirm('检测到本地有数据，是否同步到云端？')) {
          await syncToCloudHandler();
        }
      } else if (hasCloudData && hasLocalData) {
        // 两边都有数据，检查时间戳
        const localTime = localData?.localBackup?.updated_at || 0;
        const cloudTime = new Date(cloudResult.updated_at || 0).getTime();
        if (cloudTime > localTime + 60000) {
          // 云端数据更新（差1分钟以上），提示恢复
          if (confirm('检测到云端有更新的数据，是否恢复到本地？')) {
            await syncFromCloudHandler();
          }
        }
      } else if (hasCloudData && !hasLocalData) {
        // 云端有数据，本地没有，自动恢复
        await syncFromCloudHandler();
      }
    }
  }

  function updateSyncIndicator() {
    const indicator = document.getElementById('syncStatusIndicator');
    if (!indicator) {
      // 创建同步状态指示器
      const avatarBtn = document.getElementById('userAvatarBtn');
      if (avatarBtn && !avatarBtn.querySelector('.sync-status-indicator')) {
        const dot = document.createElement('span');
        dot.id = 'syncStatusIndicator';
        dot.className = 'sync-status-indicator';
        dot.title = '同步状态';
        avatarBtn.appendChild(dot);
      }
    }
    updateSyncStatusUI();
  }

  function updateSyncStatusUI() {
    const user = Sync?.getCurrentUser?.();
    const isLoggedIn = !!user;
    const lastSync = getLastSyncTime();
    const hasSynced = lastSync > 0;

    // 更新顶栏指示器
    const indicator = document.getElementById('syncStatusIndicator');
    if (indicator) {
      indicator.className = 'sync-status-indicator';
      if (!isLoggedIn) {
        indicator.classList.add('offline');
      } else if (hasSynced) {
        indicator.classList.add('synced');
      } else {
        indicator.classList.add('pending');
      }
    }

    // 更新个人中心同步状态文本
    const statusText = document.getElementById('profileSyncStatusText');
    const timeText = document.getElementById('profileSyncTime');
    if (statusText) {
      if (!isLoggedIn) statusText.textContent = '未登录';
      else if (hasSynced) statusText.textContent = '已同步';
      else statusText.textContent = '未同步';
    }
    if (timeText) {
      timeText.textContent = hasSynced ? formatSyncTime(lastSync) : '-';
    }
  }

  function getLastSyncTime() {
    try {
      return Number(localStorage.getItem('heima_last_sync_time') || 0);
    } catch { return 0; }
  }

  function setLastSyncTime() {
    try {
      localStorage.setItem('heima_last_sync_time', String(Date.now()));
    } catch {}
  }

  function formatSyncTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  return { init, openProfile, closeProfile, updateSyncStatusUI };
})();

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Profile.init());
} else {
  Profile.init();
}
