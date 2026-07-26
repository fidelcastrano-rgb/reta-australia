const fs = require('fs');

const dataContent = fs.readFileSync('./lib/data.ts', 'utf8');

// Match the products array
const productsMatch = dataContent.match(/export const products = (\[[\s\S]*?\]);/);
if (!productsMatch) {
  console.error("Could not find products array");
  process.exit(1);
}

const products = JSON.parse(productsMatch[1]);

console.log(`Loaded ${products.length} products.`);

const updatedProducts = products.map(p => {
  const isAlluvi = p.tag === 'ALLUVI';
  const isTabletOrWater = p.id === 'bpc-157-arginate-tablets' || p.id === 'bacteriostatic-water-pfizer';
  const isVial = !isAlluvi && !isTabletOrWater;

  if (isVial) {
    // Find 10v variant price if available, or base 10x price
    let base10Price = p.priceFrom * 10;
    const v10 = p.variants.find(v => v.id === '10v' || v.name.includes('10x'));
    if (v10) {
      base10Price = v10.price;
    } else if (p.variants.length > 0) {
      base10Price = p.variants[p.variants.length - 1].price;
    }

    const price20 = Math.round(base10Price * 2 * 0.95 * 100) / 100;
    const price50 = Math.round(base10Price * 5 * 0.90 * 100) / 100;
    const price100 = Math.round(base10Price * 10 * 0.85 * 100) / 100;

    const isKit = p.id.includes('kit');
    const unitLabel = isKit ? 'Kit (10 Vials)' : 'Vials';

    return {
      ...p,
      isVial: true,
      priceFrom: base10Price,
      variants: [
        { id: '10v', name: `10x ${unitLabel}`, price: base10Price, savingsLabel: 'Min Order (10 Vials)' },
        { id: '20v', name: `20x ${unitLabel}`, price: price20, savingsLabel: 'Save 5%' },
        { id: '50v', name: `50x ${unitLabel}`, price: price50, savingsLabel: 'Save 10%' },
        { id: '100v', name: `100x ${unitLabel}`, price: price100, savingsLabel: 'Save 15%' }
      ]
    };
  } else if (isAlluvi) {
    const basePrice = p.priceFrom;
    const price2 = Math.round(basePrice * 2 * 0.95 * 100) / 100;
    const price5 = Math.round(basePrice * 5 * 0.90 * 100) / 100;
    const price10 = Math.round(basePrice * 10 * 0.85 * 100) / 100;

    return {
      ...p,
      isVial: false,
      variants: [
        { id: '1item', name: '1 Device', price: basePrice, savingsLabel: '' },
        { id: '2items', name: '2 Devices', price: price2, savingsLabel: 'Save 5%' },
        { id: '5items', name: '5 Devices', price: price5, savingsLabel: 'Save 10%' },
        { id: '10items', name: '10 Devices', price: price10, savingsLabel: 'Save 15%' }
      ]
    };
  } else {
    // Water or Tablets
    return {
      ...p,
      isVial: false
    };
  }
});

console.log("Sample updated vial product:", JSON.stringify(updatedProducts.find(p => p.isVial), null, 2));

// Reconstruct lib/data.ts keeping faqs and blogPosts
const faqsMatch = dataContent.match(/export const faqs = [\s\S]*/);

const newContent = `export const products = ${JSON.stringify(updatedProducts, null, 2)};\n\n${faqsMatch[0]}`;

fs.writeFileSync('./lib/data.ts', newContent);
console.log("Successfully updated lib/data.ts!");
