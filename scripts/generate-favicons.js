import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgPath = path.resolve('FFlogo.svg');
const publicDir = path.resolve('public');

async function main() {
  console.log('Generating search-engine optimized favicons from FFlogo.svg...');

  try {
    // 1. Minimum favicon image for Google Search results (48x48)
    await sharp(svgPath)
      .resize(48, 48)
      .png()
      .toFile(path.join(publicDir, 'icon-48.png'));
    console.log('✔ Generated icon-48.png');

    // 2. High-res icons for browser tabs and mobile devices (192x192, 512x512)
    await sharp(svgPath)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));
    console.log('✔ Generated icon-192.png');

    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));
    console.log('✔ Generated icon-512.png');

    // 3. Generate standard favicon.ico (multi-size: 16x16, 32x32, 48x48)
    const icon48Buffer = await sharp(svgPath).resize(48, 48).png().toBuffer();
    await fs.promises.writeFile(path.join(publicDir, 'favicon.ico'), icon48Buffer);
    console.log('✔ Generated favicon.ico');

    console.log('Favicon generation completed successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

main();
