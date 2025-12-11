// scripts/set-env.js
const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');

const env = {
  production: true,
  apiUrl: process.env.API_URL || 'https://example.com',
  otherKey: process.env.OTHER_KEY || ''
};

const fileContent = `export const environment = ${JSON.stringify(env, null, 2)};\n`;

fs.writeFileSync(targetPath, fileContent, { encoding: 'utf8' });
console.log('Wrote', targetPath);
