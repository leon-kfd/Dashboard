const { app, BrowserWindow, Menu } = require('electron')

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
    icon: 'public/favicon.ico'
  })
  win.maximize()
  win.show()
  // win.webContents.openDevTools()
  win.loadFile('crx/index.html')
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
