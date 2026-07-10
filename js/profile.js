const Profile = (() => {
  let profileModal = null;
  let avatarFileInput = null;
  let currentAvatarUrl = '';
  let currentNickname = '';

  function init() {
    createProfileModalIfNeeded();
    bindEvents();
    updateSyncIndicator();
    updateTopbarAvatar();
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
    const avatarBtn = document.getElementById('userAvatarBtn');
    if (avatarBtn) {
      avatarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById('userAvatarDropdown');
        if (dropdown) dropdown.hidden = !dropdown.hidden;
      });
    }

    document.addEventListener('click', () => {
      const dropdown = document.getElementById('userAvatarDropdown');
      if (dropdown) dropdown.hidden = true;
    });

    const avatarMenuProfile = document.getElementById('avatarMenuProfile');
    if (avatarMenuProfile) {
      avatarMenuProfile.addEventListener('click', () => {
        hideDropdown();
        openProfile();
      });
    }

    const avatarMenuSync = document.getElementById('avatarMenuSync');
    if (avatarMenuSync) {
      avatarMenuSync.addEventListener('click', () => {
        hideDropdown();
        syncToCloudHandler();
      });
    }

    const avatarMenuLogout = document.getElementById('avatarMenuLogout');
    if (avatarMenuLogout) {
      avatarMenuLogout.addEventListener('click', () => {
        hideDropdown();
        if (typeof Sync !== 'undefined' && Sync.logout) {
          Sync.logout().then(() => {
            _showToast('已退出登录', 'info');
            updateTopbarAvatar();
          });
        }
      });
    }

    document.getElementById('profileModalClose')?.addEventListener('click', closeProfile);

    avatarFileInput = document.getElementById('profileAvatarFile');
    document.getElementById('profileAvatarUploadBtn')?.addEventListener('click', () => {
      avatarFileInput?.click();
    });
    avatarFileInput?.addEventListener('change', handleAvatarUpload);

    document.getElementById('profileSaveNickname')?.addEventListener('click', saveNickname);
    document.getElementById('profileChangePasswordBtn')?.addEventListener('click', changePassword);
    document.getElementById('profileSyncToCloud')?.addEventListener('click', syncToCloudHandler);
    document.getElementById('profileSyncFromCloud')?.addEventListener('click', syncFromCloudHandler);

    if (typeof Sync !== 'undefined' && Sync.onAuthStateChange) {
      Sync.onAuthStateChange((event, user) => {
        updateTopbarAvatar();
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

  async function updateTopbarAvatar() {
    const user = typeof Sync !== 'undefined' ? await Sync.getCurrentUser() : null;
    const menu = document.getElementById('userAvatarMenu');
    const img = document.getElementById('userAvatarImg');
    const nameEl = document.getElementById('userAvatarName');
    const emailEl = document.getElementById('userAvatarEmail');

    if (menu) menu.hidden = false;
    if (img) {
      img.src = user?.user_metadata?.avatar_url || 'icons/horse-logo.png';
    }
    if (nameEl) {
      nameEl.textContent = user?.user_metadata?.nickname || user?.email?.split('@')[0] || '未登录';
    }
    if (emailEl) {
      emailEl.textContent = user?.email || '';
    }
  }

  function openProfile() {
    if (typeof Sync === 'undefined') {
      _showToast('同步模块未加载', 'error');
      return;
    }
    Sync.getCurrentUser().then((user) => {
      if (!user) {
        _showToast('请先登录', 'error');
        return;
      }
      updateUI(user);
      _showModal('profileModal');
    });
  }

  function closeProfile() {
    if (typeof _hideModals === 'function') _hideModals();
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
      _showToast('请选择图片文件', 'error');
      event.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      _showToast('头像图片请控制在 2MB 以内', 'error');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = document.getElementById('profileAvatarImg');
      if (img) img.src = reader.result;
    };
    reader.readAsDataURL(file);

    if (typeof Sync !== 'undefined' && Sync.uploadAvatar) {
      const result = await Sync.uploadAvatar(file);
      if (result.success) {
        currentAvatarUrl = result.url;
        const topAvatar = document.getElementById('userAvatarImg');
        if (topAvatar) topAvatar.src = result.url;
        _showToast('头像上传成功', 'success');
      } else {
        _showToast('头像上传失败: ' + result.error, 'error');
      }
    }
    event.target.value = '';
  }

  async function saveNickname() {
    const input = document.getElementById('profileNickname');
    const nickname = input?.value.trim();
    if (!nickname) {
      _showToast('请输入昵称', 'error');
      return;
    }
    if (typeof Sync !== 'undefined' && Sync.updateUserMetadata) {
      const result = await Sync.updateUserMetadata({ nickname });
      if (result.success) {
        currentNickname = nickname;
        const displayNameEl = document.getElementById('profileDisplayName');
        if (displayNameEl) displayNameEl.textContent = nickname;
        const nameEl = document.getElementById('userAvatarName');
        if (nameEl) nameEl.textContent = nickname;
        _showToast('昵称已保存', 'success');
      } else {
        _showToast('保存失败: ' + result.error, 'error');
      }
    }
  }

  async function changePassword() {
    const newPw = document.getElementById('profileNewPassword')?.value;
    const confirmPw = document.getElementById('profileConfirmPassword')?.value;
    if (!newPw || newPw.length < 6) {
      _showToast('密码至少6位', 'error');
      return;
    }
    if (newPw !== confirmPw) {
      _showToast('两次密码不一致', 'error');
      return;
    }
    if (typeof Sync !== 'undefined' && Sync.updatePassword) {
      const result = await Sync.updatePassword(newPw);
      if (result.success) {
        document.getElementById('profileNewPassword').value = '';
        document.getElementById('profileConfirmPassword').value = '';
        _showToast('密码已修改，请使用新密码重新登录', 'success');
      } else {
        _showToast('修改失败: ' + result.error, 'error');
      }
    }
  }

  async function syncToCloudHandler() {
    if (typeof Sync !== 'undefined' && Sync.syncToCloud) {
      _showToast('正在同步到云端...', 'info');
      const result = await Sync.syncToCloud();
      if (result.success) {
        setLastSyncTime();
        updateSyncStatusUI();
        _showToast('数据已同步到云端', 'success');
      } else {
        _showToast('同步失败: ' + result.error, 'error');
      }
    }
  }

  async function syncFromCloudHandler() {
    if (typeof Sync !== 'undefined' && Sync.syncFromCloud) {
      _showToast('正在从云端恢复...', 'info');
      const result = await Sync.syncFromCloud();
      if (result.success) {
        setLastSyncTime();
        updateSyncStatusUI();
        _showToast('数据已恢复到本地', 'success');
        if (typeof _refreshAll === 'function') _refreshAll();
      } else {
        _showToast('恢复失败: ' + result.error, 'error');
      }
    }
  }

  async function checkSyncOnLogin() {
    const user = typeof Sync !== 'undefined' ? await Sync.getCurrentUser() : null;
    if (!user) return;

    const localData = typeof Storage !== 'undefined' && Storage.load ? await Storage.load() : null;
    const hasLocalData = localData && (localData.panels?.length > 0 || localData.memos?.length > 0);

    if (typeof Sync !== 'undefined' && Sync.downloadData) {
      const cloudResult = await Sync.downloadData();
      const hasCloudData = cloudResult.success && cloudResult.data && Object.keys(cloudResult.data).length > 0;

      if (hasLocalData && !hasCloudData) {
        if (confirm('检测到本地有数据，是否同步到云端？')) {
          await syncToCloudHandler();
        }
      } else if (hasCloudData && hasLocalData) {
        const localTime = localData?.localBackup?.updated_at || 0;
        const cloudTime = new Date(cloudResult.updated_at || 0).getTime();
        if (cloudTime > localTime + 60000) {
          if (confirm('检测到云端有更新的数据，是否恢复到本地？')) {
            await syncFromCloudHandler();
          }
        }
      } else if (hasCloudData && !hasLocalData) {
        await syncFromCloudHandler();
      }
    }
  }

  function updateSyncIndicator() {
    const indicator = document.getElementById('syncStatusIndicator');
    if (!indicator) {
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
    if (typeof Sync === 'undefined') return;
    Sync.getCurrentUser().then((user) => {
      const isLoggedIn = !!user;
      const lastSync = getLastSyncTime();
      const hasSynced = lastSync > 0;

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
    });
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Profile.init());
} else {
  Profile.init();
}
