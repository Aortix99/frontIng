const fs = require('fs');
const path = require('path');

const pngPath = path.join(__dirname, '..', 'src', 'assets', 'img', 'viga-amarre-esquema.png');
const imgTsPath = path.join(__dirname, '..', 'src', 'app', 'imgBase64', 'img.ts');

const b64 = fs.readFileSync(pngPath).toString('base64');
const line = `export const IMG_VIGA_AMARRE_ESQUEMA = '${b64}';\n`;
fs.appendFileSync(imgTsPath, line);
console.log('Appended IMG_VIGA_AMARRE_ESQUEMA to img.ts,', b64.length, 'base64 chars');
