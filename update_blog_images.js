const fs = require('fs');
let data = fs.readFileSync('lib/data.ts', 'utf8');

const images = [
    "https://peptidelabuk.co.uk/wp-content/uploads/2026/04/68c153351d1a646053b66e98_Retatrutide-5MG-With-Pen-1-scaled.jpg",
    "https://growthguys.is/wp-content/uploads/Tirz-10-Red-1024x930.jpg"
];

// Add image field to blog posts
data = data.replace(/slug: 'where-to-buy-retatrutide-australia',\n    title:/, `slug: 'where-to-buy-retatrutide-australia',\n    image: '${images[0]}',\n    title:`);
data = data.replace(/slug: 'peptide-reconstitution-guide',\n    title:/, `slug: 'peptide-reconstitution-guide',\n    image: '${images[1]}',\n    title:`);

fs.writeFileSync('lib/data.ts', data);
