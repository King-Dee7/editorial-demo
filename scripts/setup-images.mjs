import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
const imagesDir = path.resolve('public/images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const files = fs.readdirSync(publicDir);
console.log('Files found in public:', files);

// Map of identified files based on timestamp / content:
const mapping = {
  '02_14_38': 'section1-vanity.png',
  '02_15_18': 'section2-fashion-thumb.png',
  '02_15_30': 'section2-gradient-banner.png',
  '02_15_38': 'section3-unleash-model.png',
  '02_15_45': 'section2-editorial-tall.png',
  '02_16_01': 'section5-hide-portrait.png',
  '02_16_19': 'gradient-circle.png',
  '02_52_40': 'social-stamp.png',
  '02_38_49': 'section1-vanity-blob.png',
  '02_34_52': 'special-issue-badge.png',
};

for (const file of files) {
  for (const [key, targetName] of Object.entries(mapping)) {
    if (file.includes(key)) {
      const srcPath = path.join(publicDir, file);
      const destPath = path.join(imagesDir, targetName);
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file} -> images/${targetName}`);
      
      // Also copy with .jpg extension just in case
      if (targetName.endsWith('.png')) {
        const jpgDest = path.join(imagesDir, targetName.replace('.png', '.jpg'));
        fs.copyFileSync(srcPath, jpgDest);
      }
    }
  }
}

console.log('Image setup complete.');
