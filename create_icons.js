const fs = require('fs');

// Function to create a simple colored square with a letter as icon
function createSimpleIcon(size, color, letter) {
  // Create an SVG content
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${color}" />
    <text x="${size / 2}" y="${size / 2 + size * 0.05}" 
      font-family="Arial" font-weight="bold" font-size="${size * 0.7}" 
      fill="white" text-anchor="middle" dominant-baseline="middle">${letter}</text>
    <rect x="${size * 0.1}" y="${size * 0.1}" width="${size * 0.8}" height="${size * 0.8}" 
      fill="none" stroke="white" stroke-width="${Math.max(1, size * 0.05)}" />
  </svg>`;
  
  return svg;
}

// Create icons of different sizes
const sizes = [16, 48, 128];
sizes.forEach(size => {
  try {
    // Create images directory if it doesn't exist
    if (!fs.existsSync('images')) {
      fs.mkdirSync('images');
    }
    
    // Create SVG icon
    const svg = createSimpleIcon(size, '#4285f4', 'U');
    
    // Write SVG to file
    fs.writeFileSync(`images/icon${size}.svg`, svg);
    console.log(`Created icon${size}.svg`);
  } catch (err) {
    console.error(`Error creating icon${size}.svg:`, err.message);
  }
});