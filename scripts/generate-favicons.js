import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const jpegPath = path.resolve('public', 'browser-logo.jpeg');
const publicDir = path.resolve('public');

async function createFavicon(size) {
  const logoSize = Math.round(size * 0.80);
  const padding = Math.round((size - logoSize) / 2);
  
  // Render the logo SVG/JPEG to target size
  const logoResized = await sharp(jpegPath)
    .resize(logoSize, logoSize)
    .png()
    .toBuffer();

  // Create a premium white background canvas
  const whiteCanvas = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([{ input: logoResized, top: padding, left: padding }])
  .png()
  .toBuffer();

  // Create a premium white squarcle (rounded square) background SVG mask
  const rx = Math.round(size * 0.22); // 22% radius makes a perfect squarcle (similar to iOS app icons)
  const squarcleMask = Buffer.from(
    `<svg width="${size}" height="${size}">
       <rect width="${size}" height="${size}" rx="${rx}" ry="${rx}" fill="#ffffff" />
     </svg>`
  );

  // Composite the white canvas with the squarcle mask using dest-in to round the corners
  return sharp(whiteCanvas)
    .composite([{ input: squarcleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function main() {
  console.log('Generating squarcle-shaped search-engine optimized favicons...');

  try {
    // 1. Generate squarcle PNG sizes
    const png48 = await createFavicon(48);
    await fs.promises.writeFile(path.join(publicDir, 'icon-48.png'), png48);
    console.log('✔ Generated squarcle icon-48.png');

    const png192 = await createFavicon(192);
    await fs.promises.writeFile(path.join(publicDir, 'icon-192.png'), png192);
    console.log('✔ Generated squarcle icon-192.png');

    const png512 = await createFavicon(512);
    await fs.promises.writeFile(path.join(publicDir, 'icon-512.png'), png512);
    console.log('✔ Generated squarcle icon-512.png');

    // 2. Generate standard favicon.ico (fallback as 48x48 PNG)
    await fs.promises.writeFile(path.join(publicDir, 'favicon.ico'), png48);
    console.log('✔ Generated squarcle favicon.ico');

    console.log('Favicon generation completed successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

main();
