const fs = require('fs');

async function scrape() {
  console.log("Fetching data...");
  const res = await fetch('https://reta-lab.co.uk/products', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });
  const html = await res.text();

  // Extract all Next.js data chunks
  const chunks = [];
  const regex = /self\.__next_f\.push\(\[1,"(.*?)"]\)/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      const unescaped = JSON.parse('"' + match[1] + '"');
      chunks.push(unescaped);
    } catch(e) {}
  }

  const fullText = chunks.join('');
  
  // Find the products array
  const startIdx = fullText.indexOf('[{"slug":"buy-alluvi-retatrutide');
  if (startIdx === -1) {
    console.log("Products not found in joined chunks. Falling back to raw regex...");
    
    // Fallback: extract using raw regex directly from HTML text if it's there
    const fallbackRegex = /\[\{"slug":"buy-alluvi-retatrutide.*?\}\]\}\]/;
    const fallbackMatch = html.match(fallbackRegex);
    if (fallbackMatch) {
       console.log("Found using fallback regex. Parse might be messy.");
    }
    return;
  }

  let depth = 0;
  let endIdx = -1;
  for (let i = startIdx; i < fullText.length; i++) {
    if (fullText[i] === '[') depth++;
    if (fullText[i] === ']') {
      depth--;
      if (depth === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }

  if (endIdx === -1) return console.log("Could not find end of array");

  const productsJson = fullText.substring(startIdx, endIdx);
  const products = JSON.parse(productsJson);

  let out = `export const products = [\n`;
  products.forEach(p => {
    out += `  {\n`;
    out += `    id: ${JSON.stringify(p.slug)},\n`;
    out += `    name: ${JSON.stringify(p.name)},\n`;
    out += `    slug: ${JSON.stringify(p.slug)},\n`;
    out += `    tag: ${JSON.stringify(p.tag)},\n`;
    out += `    description: ${JSON.stringify(p.description || '')},\n`;
    out += `    priceFrom: ${p.variants && p.variants[0] ? p.variants[0].price : 0},\n`;
    out += `    variants: ${JSON.stringify(p.variants)},\n`;
    out += `    image: ${JSON.stringify(p.image)},\n`;
    out += `    thumbnails: []\n`;
    out += `  },\n`;
  });
  out += `];\n\n`;

  const dataTs = fs.readFileSync('lib/data.ts', 'utf8');
  const otherExports = dataTs.substring(dataTs.indexOf('export const faqs'));

  fs.writeFileSync('lib/data.ts', out + otherExports);
  console.log("Success! Saved " + products.length + " products.");
}

scrape().catch(console.error);
