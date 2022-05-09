const AdmZip = require('adm-zip');
const fs = require('fs');

// the dist directory might not exist when this script gets invoked (when only `npm run build:crx` has been run)
const distDir = 'dist'
if (!fs.existsSync(distDir)){
  fs.mkdirSync(distDir);
}

const zip = new AdmZip();
zip.addLocalFolder('crx');
zip.writeZip('dist/howdz-dashboard.crx');
zip.writeZip('dist/howdz-dashboard.zip');
console.log('build crx file success!');
