const { app, BrowserWindow, Menu, shell } = require('electron')

function createWindow () {
  Menu.setApplicationMenu(null)
  const win = new BrowserWindow({
    // fullscreen: true,
    width: 1024,
    height: 768,
    // frame: false,
    useContentSize: true,
    titleBarStyle: 'hidden',
    show: false,
    icon: 'crx/favicon.ico'
  })
  win.maximize()
  win.show()
  // win.webContents.openDevTools()
  win.loadFile('crx/index.html')
  // 拦截新窗口打开使用系统默认浏览器打开
  win.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    shell.openExternal(url);
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
