/**
 * 黑马总裁 Label - 云端同步模块
 * 基于 Supabase 实现跨设备数据同步
 */

const Sync = (() => {
  // ====== Supabase 配置 ======
  const SUPABASE_URL = 'https://exntapkjzgmnrfdrpdsm.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_6gbR3BHByc9-6DazmX9KVw_srkV6LMB';

  let supabase = null;
  let currentUser = null;

  function init() {
    if (typeof window.supabase === 'undefined') {
      console.warn('[Sync] Supabase CDN not loaded yet');
      return false;
    }
    try {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
      });
      return true;
    } catch (e) {
      console.error('[Sync] Init failed:', e);
      return false;
    }
  }

  // ====== 登录 / 登出 ======
  async function loginWithGitHub() {
    if (!supabase) return { success: false, error: 'Supabase not initialized' };
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github', options: { redirectTo: window.location.href }
      });
      if (error) throw error;
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async function logout() {
    if (!supabase) return { success: false, error: 'Supabase not initialized' };
    try {
      await supabase.auth.signOut();
      currentUser = null;
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async function getCurrentUser() {
    if (!supabase) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      currentUser = user;
      return user;
    } catch (e) { return null; }
  }

  // ====== 邮箱注册 / 登录 / 重置密码 ======
  async function registerWithEmail(email, password, nickname) {
    if (!supabase) return { success: false, error: 'Supabase not initialized' };
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { data: { nickname: nickname || '' } }
      });
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (e) { return { success: false, error: e.message }; }
  }

  async function loginWithEmail(email, password) {
    if (!supabase) return { success: false, error: 'Supabase not initialized' };
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      currentUser = data.user;
      return { success: true, user: data.user };
    } catch (e) { return { success: false, error: e.message }; }
  }

  async function resetPassword(email) {
    if (!supabase) return { success: false, error: 'Supabase not initialized' };
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.href });
      if (error) throw error;
      return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
  }

  async function updatePassword(newPassword) {
    if (!supabase) return { success: false, error: 'Supabase not initialized' };
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
  }

  // 监听登录状态变化
  function onAuthStateChange(callback) {
    if (!supabase) return;
    supabase.auth.onAuthStateChange((event, session) => {
      currentUser = session?.user || null;
      callback(event, currentUser);
    });
  }

  // ====== 数据同步 ======
  async function uploadData(data) {
    if (!supabase || !currentUser) return { success: false, error: 'Not logged in' };
    try {
      const { error } = await supabase.from('user_data').upsert({
        id: currentUser.id, data: JSON.stringify(data), updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
      if (error) throw error;
      return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
  }

  async function downloadData() {
    if (!supabase || !currentUser) return { success: false, error: 'Not logged in' };
    try {
      const { data, error } = await supabase.from('user_data').select('data, updated_at').eq('id', currentUser.id).single();
      if (error) throw error;
      return { success: true, data: JSON.parse(data.data || '{}'), updated_at: data.updated_at };
    } catch (e) {
      if (e.message?.includes('JSON') || e.message?.includes('null')) return { success: false, error: 'No cloud data found', isEmpty: true };
      return { success: false, error: e.message };
    }
  }

  async function mergeData(localData, cloudData) {
    if (!cloudData || !cloudData.updated_at) return localData;
    const localTime = localData?.localBackup?.updated_at || 0;
    const cloudTime = new Date(cloudData.updated_at).getTime();
    if (cloudTime > localTime) return cloudData.data;
    return localData;
  }

  async function syncToCloud() {
    if (!supabase || !currentUser) return { success: false, error: '请先登录' };
    const localData = await Storage.load();
    return await uploadData(localData);
  }

  async function syncFromCloud() {
    if (!supabase || !currentUser) return { success: false, error: '请先登录' };
    const result = await downloadData();
    if (!result.success) return result;
    const localData = await Storage.load();
    const merged = await mergeData(localData, result);
    await Storage.save(merged);
    return { success: true, message: '数据已同步到本地' };
  }

  // ====== UI 状态 ======
  function isReady() { return !!supabase; }
  function isLoggedIn() { return !!currentUser; }
  function getUserDisplayName() {
    return currentUser?.user_metadata?.name || currentUser?.user_metadata?.nickname || currentUser?.email || '用户';
  }
  function getUserAvatar() { return currentUser?.user_metadata?.avatar_url || ''; }

  return {
    init, loginWithGitHub, registerWithEmail, loginWithEmail, resetPassword, updatePassword,
    logout, getCurrentUser, onAuthStateChange, uploadData, downloadData, syncToCloud, syncFromCloud,
    isReady, isLoggedIn, getUserDisplayName, getUserAvatar
  };
})();
