const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

async function bundle() {
  try {
    // 1. 运行构建命令
    console.log('🚀 Starting build...');
    execSync('npm run build', { stdio: 'inherit' });

    const standaloneDir = path.join(process.cwd(), '.next', 'standalone');
    const publicDir = path.join(process.cwd(), 'public');
    const staticDir = path.join(process.cwd(), '.next', 'static');

    // 2. 检查 standalone 目录
    if (!fs.existsSync(standaloneDir)) {
      throw new Error('.next/standalone directory not found. Please ensure "output: standalone" is configured in next.config.ts');
    }

    console.log('📦 Standalone directory found. Organizing files...');

    // 3. 自动归位
    // 复制 public 到 standalone
    console.log('📂 Copying public files...');
    await fs.copy(publicDir, path.join(standaloneDir, 'public'));

    // 在 standalone 下创建 .next 并复制 static
    console.log('📂 Copying static assets...');
    const standaloneStaticDir = path.join(standaloneDir, '.next', 'static');
    await fs.ensureDir(standaloneStaticDir);
    await fs.copy(staticDir, standaloneStaticDir);

    console.log('📂 Copying deployment scripts...');
    const scriptsToInclude = ['start.sh', 'stop.sh'];
    for (const scriptName of scriptsToInclude) {
        const srcPath = path.join(process.cwd(), scriptName);
        const destPath = path.join(standaloneDir, scriptName);
        
        if (fs.existsSync(srcPath)) {
            await fs.copy(srcPath, destPath);
            console.log(`   - Included ${scriptName}`);
        } else {
            console.warn(`   - Warning: ${scriptName} not found in project root`);
        }
    }
    
    // 4. 压缩
    console.log('🗜️ Compressing to deploy.zip...');
    await zipDirectory(standaloneDir, path.join(process.cwd(), 'deploy.zip'));

    // 5. 清理与提示
    const stats = fs.statSync(path.join(process.cwd(), 'deploy.zip'));
    const fileSizeInMegabytes = stats.size / (1024 * 1024);
    
    console.log('✅ Bundle completed!');
    console.log(`🎁 Created deploy.zip (${fileSizeInMegabytes.toFixed(2)} MB)`);

  } catch (error) {
    console.error('❌ Bundle failed:', error.message);
    process.exit(1);
  }
}

/**
 * @param {string} sourceDir
 * @param {string} outPath
 * @returns {Promise<void>}
 */
function zipDirectory(sourceDir, outPath) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

bundle();
