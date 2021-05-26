const fs = require('fs')
try {
  fs.renameSync('install/howdy-dashboard.exe', 'dist/howdy-dashboard.exe')
  fs.renameSync('install/howdy-dashboard.zip', 'dist/howdy-dashboard.zip')
  console.log('move electorn package success!')
} catch (e) {
  console.error(e)
}
