const fs = require('fs');
const path = require('path');

// Read your players file
const playersPath = path.join(__dirname, '../src/data/players.js');
const content = fs.readFileSync(playersPath, 'utf8');

// Extract the array
const match = content.match(/export const IPL_PLAYERS = \[([\s\S]*)\];/);
if (!match) {
  console.error('Could not find IPL_PLAYERS array');
  process.exit(1);
}

// Parse as JSON (clean up the array content)
const arrayContent = '[' + match[1] + ']';
const players = JSON.parse(arrayContent);

// Add tier based on basePrice
const playersWithTier = players.map(player => {
  let tier, tierLabel, stars;
  
  if (player.basePrice >= 2) {
    // Premium: Expensive players
    tier = 1;
    tierLabel = 'PREMIUM';
    stars = 5;
  } else if (player.basePrice >= 1) {
    // Mid-level
    tier = 2;
    tierLabel = 'STAR';
    stars = 4;
  } else {
    // Budget
    tier = 3;
    tierLabel = 'RISING';
    stars = 3;
  }
  
  return {
    ...player,
    tier,
    tierLabel,
    stars
  };
});

// Write back
const output = `export const IPL_PLAYERS = ${JSON.stringify(playersWithTier, null, 2)};`;
fs.writeFileSync(playersPath, output);

console.log(`✅ Added tier to ${playersWithTier.length} players`);
console.log(`Tier 1 (Premium): ${playersWithTier.filter(p => p.tier === 1).length} players`);
console.log(`Tier 2 (Star): ${playersWithTier.filter(p => p.tier === 2).length} players`);
console.log(`Tier 3 (Rising): ${playersWithTier.filter(p => p.tier === 3).length} players`);