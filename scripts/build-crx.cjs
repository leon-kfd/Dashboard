const AdmZip = require('adm-zip');
const zip = new AdmZip();
zip.addLocalFolder('crx');
zip.writeZip('dist/howdz-dashboard.crx');
zip.writeZip('dist/howdz-dashboard.zip');
console.log('build crx file success!');
