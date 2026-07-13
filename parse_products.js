const fs = require('fs');

const rawHtml = fs.readFileSync('scrape.html', 'utf8');
const match = rawHtml.match(/\[\{"slug":"buy-alluvi-retatrutide.*?\]\}\]/);
if (match) {
  let products;
  try {
    products = JSON.parse(match[0]);
  } catch (e) {
    console.log("Parse error:", e);
    // Try to find the exact json
    const start = rawHtml.indexOf('[{"slug":"buy-alluvi-retatrutide');
    if (start > -1) {
        const endStr = '}]}]';
        const end = rawHtml.indexOf(endStr, start) + endStr.length - 1; // get to the end of }]}
        try {
            products = JSON.parse(rawHtml.substring(start, end));
        } catch(e2) {
            console.log(e2);
        }
    }
  }

  if (products && Array.isArray(products)) {
      let out = `export const products = [\n`;
      products.forEach(p => {
        out += `  {\n`;
        out += `    id: ${JSON.stringify(p.slug)},\n`;
        out += `    name: ${JSON.stringify(p.name)},\n`;
        out += `    slug: ${JSON.stringify(p.slug)},\n`;
        out += `    tag: ${JSON.stringify(p.tag)},\n`;
        out += `    description: ${JSON.stringify(p.description || '')},\n`;
        out += `    priceFrom: ${p.variants && p.variants[0] ? p.variants[0].price : 0},\n`;
        out += `    variants: [\n`;
        if (p.variants) {
            p.variants.forEach(v => {
                out += `      { name: ${JSON.stringify(v.name)}, price: ${v.price}, savings: ${JSON.stringify(v.savingsLabel || '')} },\n`;
            });
        }
        out += `    ],\n`;
        out += `    image: ${JSON.stringify(p.image)},\n`;
        out += `    thumbnails: []\n`;
        out += `  },\n`;
      });
      out += `];\n\n`;

      const dataTs = fs.readFileSync('lib/data.ts', 'utf8');
      const otherExports = dataTs.substring(dataTs.indexOf('export const faqs'));
      
      fs.writeFileSync('lib/data.ts', out + otherExports);
      console.log("Updated lib/data.ts");
  } else {
      console.log("Could not extract products");
  }
} else {
  console.log("Could not find products JSON");
}
