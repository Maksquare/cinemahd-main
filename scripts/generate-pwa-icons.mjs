import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const iconsDir = path.join(publicDir, 'icons');
const svgPath = path.join(publicDir, 'new', 'favicon.svg');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];

async function generateIcons() {
  console.log('Generating PWA icons from:', svgPath);
  const svgBuffer = fs.readFileSync(svgPath);

  // 1. Generate standard square icons
  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outputPath);
    console.log(`✓ Generated: public/icons/icon-${size}x${size}.png`);
  }

  // 2. Generate Apple Touch Icon (180x180 with solid brand background #0b0b0d)
  const appleTouchPath = path.join(iconsDir, 'apple-touch-icon.png');
  const innerSize = Math.round(180 * 0.78);
  const padding = Math.round((180 - innerSize) / 2);
  const resizedInner = await sharp(svgBuffer)
    .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 11, g: 11, b: 13, alpha: 1 }, // #0b0b0d
    },
  })
    .composite([{ input: resizedInner, top: padding, left: padding }])
    .png({ quality: 100 })
    .toFile(appleTouchPath);
  console.log('✓ Generated: public/icons/apple-touch-icon.png');

  // Also write to public/apple-touch-icon.png for standard browser detection
  fs.copyFileSync(appleTouchPath, path.join(publicDir, 'apple-touch-icon.png'));

  // 3. Generate 512x512 Maskable Icon (with 20% safe zone padding and solid brand background)
  const maskablePath = path.join(iconsDir, 'icon-maskable-512x512.png');
  const maskableInnerSize = Math.round(512 * 0.65);
  const maskablePadding = Math.round((512 - maskableInnerSize) / 2);
  const resizedMaskableInner = await sharp(svgBuffer)
    .resize(maskableInnerSize, maskableInnerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 11, g: 11, b: 13, alpha: 1 }, // #0b0b0d
    },
  })
    .composite([{ input: resizedMaskableInner, top: maskablePadding, left: maskablePadding }])
    .png({ quality: 100 })
    .toFile(maskablePath);
  console.log('✓ Generated: public/icons/icon-maskable-512x512.png');

  // 4. Generate 192x192 Maskable Icon
  const maskable192Path = path.join(iconsDir, 'icon-maskable-192x192.png');
  const maskable192InnerSize = Math.round(192 * 0.65);
  const maskable192Padding = Math.round((192 - maskable192InnerSize) / 2);
  const resized192MaskableInner = await sharp(svgBuffer)
    .resize(maskable192InnerSize, maskable192InnerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 11, g: 11, b: 13, alpha: 1 },
    },
  })
    .composite([{ input: resized192MaskableInner, top: maskable192Padding, left: maskable192Padding }])
    .png({ quality: 100 })
    .toFile(maskable192Path);
  console.log('✓ Generated: public/icons/icon-maskable-192x192.png');

  console.log('All PWA icons generated successfully!');
}

generateIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
