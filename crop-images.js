const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const winesDir = './public/wines';

async function cropImage(filename) {
  const inputPath = path.join(winesDir, filename);
  const outputPath = path.join(winesDir, filename.replace('.png', '-cropped.png'));
  
  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`Processing ${filename}: ${metadata.width}x${metadata.height}`);
    
    // Trim whitespace and extract to get bounding box
    const trimmed = await sharp(inputPath)
      .trim({ threshold: 10 })
      .toBuffer({ resolveWithObject: true });
    
    console.log(`  Trimmed to: ${trimmed.info.width}x${trimmed.info.height}`);
    
    // Resize to consistent height while maintaining aspect ratio
    await sharp(trimmed.data)
      .resize({ height: 800, fit: 'inside' })
      .png()
      .toFile(outputPath);
    
    console.log(`  Saved: ${outputPath}`);
    
    // Replace original with cropped version
    fs.unlinkSync(inputPath);
    fs.renameSync(outputPath, inputPath);
    console.log(`  Replaced original`);
    
  } catch (err) {
    console.error(`Error processing ${filename}:`, err.message);
  }
}

async function main() {
  const files = fs.readdirSync(winesDir).filter(f => f.endsWith('.png') && !f.includes('-cropped'));
  console.log('Found files:', files);
  
  for (const file of files) {
    await cropImage(file);
  }
  
  console.log('\nDone! All images cropped.');
}

main();
