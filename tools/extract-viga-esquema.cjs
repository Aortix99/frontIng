const fs = require('fs');
const path = require('path');

const transcriptPath =
  process.argv[2] ||
  path.join(
    process.env.USERPROFILE || '',
    '.cursor',
    'projects',
    'c-Users-usuario1-Desktop-ing',
    'agent-transcripts',
    '365ba517-5acc-4ddb-8303-3486d2c72908',
    '365ba517-5acc-4ddb-8303-3486d2c72908.jsonl'
  );

const outPath =
  process.argv[3] ||
  path.join(__dirname, '..', 'src', 'assets', 'img', 'viga-amarre-esquema.png');

const raw = fs.readFileSync(transcriptPath, 'utf8');
const line = raw.split('\n').find((l) => l.includes('AABgAAAAQACAI'));
if (!line) {
  console.error('Transcript line with image not found');
  process.exit(1);
}
const o = JSON.parse(line);
const t = o.message.content[0].text;
const idx = t.indexOf('data:image/png;base64,');
if (idx < 0) {
  console.error('data URL not found');
  process.exit(1);
}
let end = t.indexOf('\n\nubicala', idx);
if (end < 0) end = t.length;
const dataUrl = t.slice(idx, end).trim();
const b64 = dataUrl.replace(/^data:image\/png;base64,/, '');
const buf = Buffer.from(b64, 'base64');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, buf);
console.log('Wrote', outPath, buf.length, 'bytes');
