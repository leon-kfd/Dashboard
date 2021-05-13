const AdmZip = require('adm-zip');
const zip = new AdmZip();
zip.addLocalFolder('crx');
zip.writeZip('dist/howdy-dashboard.crx');
console.log('build crx file success!');
