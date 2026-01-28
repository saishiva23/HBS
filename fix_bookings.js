const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend', 'src', 'pages', 'Bookings.jsx');

// Read the file
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log(`Original line count: ${lines.length}`);

// Keep lines 0-510 (indices 0-509) and lines 648+ (index 647+)
// This removes lines 511-647 (indices 510-646) - that's 137 lines
const newLines = [...lines.slice(0, 510), ...lines.slice(647)];

console.log(`New line count: ${newLines.length}`);
console.log(`Lines removed: ${lines.length - newLines.length}`);

// Write back
fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');

console.log('✅ Successfully removed old modal code from Bookings.jsx');
