// 获取当前活动标签页的信息
function getCurrentTabInfo() {
  // 查询当前活动标签页
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log('tabs:', tabs);
    if (tabs.length > 0) {
      const tab = tabs[0];
      updateFormWithTabInfo(tab);
    } else {
      showError('无法获取当前标签页信息');
    }
  });
}

// 使用标签页信息更新表单
function updateFormWithTabInfo(tab) {
  const titleInput = document.getElementById('title');
  const urlInput = document.getElementById('url');
  const faviconImg = document.getElementById('favicon');
  const websiteUrlDiv = document.getElementById('website-url');

  // 设置标题（如果有）
  if (tab.title) {
    titleInput.value = tab.title;
  }
  
  // 设置URL
  if (tab.url) {
    urlInput.value = tab.url;
    websiteUrlDiv.textContent = tab.url;
    
    // 获取并设置网站图标
    const faviconUrl = tab.favIconUrl || getFaviconUrl(tab.url);
    faviconImg.src = faviconUrl;
    faviconImg.alt = `${tab.title || '网站'}图标`;
    
    // 如果图标加载失败，使用默认图标
    faviconImg.onerror = function() {
      this.src = `https://kongfandong.cn/api/icon/v2?url=${encodeURIComponent(tab.url.replace(/http(s)?:\/\//, ''))}`;
    };
  }
}

// 获取网站图标的URL
function getFaviconUrl(url) {
  try {
    const urlObj = new URL(url);
    // 尝试使用Google的favicon服务作为备用
    return `https://kongfandong.cn/api/icon/v2?url=${encodeURIComponent(url.replace(/http(s)?:\/\//, ''))}`;
  } catch (e) {
    console.error('解析URL失败:', e);
    return 'favicon.ico'; // 使用扩展自身的图标作为默认值
  }
}

// 显示错误信息
function showError(message) {
  const websiteUrlDiv = document.getElementById('website-url');
  websiteUrlDiv.innerHTML = `<span class="error-message">${message}</span>`;
}

// 处理表单提交
function handleFormSubmit(event) {
  event.preventDefault();
  
  const title = document.getElementById('title').value.trim();
  const url = document.getElementById('url').value.trim();
  const favicon = document.getElementById('favicon').src;
  
  if (!title || !url) {
    showError('请填写完整信息');
    return;
  }
  
  // 表单提交逻辑将由用户自行实现
  // 此处仅作基本验证
  console.log('表单提交:', { title, url, favicon });

  const config = JSON.parse(localStorage.getItem('config') || '{}') || {};
  const findMaterial = config.list.find(item => item.material === 'Bookmark') || config.affix.find(item => item.material === 'Bookmark');

  if (!findMaterial) {
    showError('未从起始页中找到Bookmark物料');
    return;
  }

  const bookmarkArray = findMaterial.componentSetting.bookmark;
  const formData = {
    id: Math.random().toString(16).slice(2),
    type: 'icon',
    title,
    url,
    iconType: 'network',
    iconPath: favicon,
    iconText: '',
    bgColor: 'rgba(241, 243, 244, 1)'
  }
  bookmarkArray.push(formData);
  localStorage.setItem('config', JSON.stringify(config));
  
  // 关闭popup窗口
  window.close();
}

// 处理取消按钮点击
function handleCancel() {
  window.close();
}

// 初始化函数
function init() {
  // 获取当前标签页信息
  getCurrentTabInfo();
  
  // 添加表单提交事件监听
  const form = document.getElementById('save-form');
  form.addEventListener('submit', handleFormSubmit);
  
  // 添加取消按钮点击事件监听
  const cancelBtn = document.getElementById('cancel-btn');
  cancelBtn.addEventListener('click', handleCancel);
}

// 当DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', init);