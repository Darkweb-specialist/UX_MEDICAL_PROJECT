const Jimp = require('jimp-compact');
const path = require('path');

async function createAssets() {
  const assetsDir = path.join(__dirname, '../assets');

  // 1. App Icon (1024x1024 Teal #0D9488)
  const icon = new Jimp(1024, 1024, 0x0D9488FF);
  await icon.writeAsync(path.join(assetsDir, 'icon.png'));
  console.log('Created icon.png');

  // 2. Adaptive Icon (1024x1024)
  const adaptiveIcon = new Jimp(1024, 1024, 0x0D9488FF);
  await adaptiveIcon.writeAsync(path.join(assetsDir, 'adaptive-icon.png'));
  console.log('Created adaptive-icon.png');

  // 3. Splash Screen (1242x2436)
  const splash = new Jimp(1242, 2436, 0x0D9488FF);
  await splash.writeAsync(path.join(assetsDir, 'splash.png'));
  console.log('Created splash.png');

  // 4. Favicon (48x48)
  const favicon = new Jimp(48, 48, 0x0D9488FF);
  await favicon.writeAsync(path.join(assetsDir, 'favicon.png'));
  console.log('Created favicon.png');

  console.log('All image assets created with valid Jimp PNG encoding!');
}

createAssets().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
