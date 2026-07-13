const fs = require('fs');

let dataTs = fs.readFileSync('lib/data.ts', 'utf8');

// We need to parse the products array
// It's assigned to `export const products = [ ... ];`
const productsStart = dataTs.indexOf('export const products = [');
const faqsStart = dataTs.indexOf('export const faqs = [');

let productsCode = dataTs.substring(productsStart, faqsStart);
let restCode = dataTs.substring(faqsStart);

// Let's replace the variants array inside the productsCode
// It looks like: variants: [{"id":"1v","name":"1x Vial","price":13,"savingsLabel":""},{"id":"5v","name":"5x Vials","price":58.5,"savingsLabel":"Save £10"}],
productsCode = productsCode.replace(/variants: (\[.*?\])/g, (match, variantsJson) => {
    try {
        let variants = JSON.parse(variantsJson);
        // Check if there's a 1x Vial or similar
        let baseVariant = variants.find(v => v.id === '1v' || v.name.toLowerCase().includes('1x vial'));
        if (baseVariant) {
            // Check if 10v already exists
            if (!variants.find(v => v.id === '10v' || v.name === '10x Vials')) {
                let price10 = baseVariant.price * 10;
                let discountPrice = price10 * 0.75;
                variants.push({
                    id: '10v',
                    name: '10x Vials',
                    price: discountPrice,
                    savingsLabel: `Save £${(price10 - discountPrice).toFixed(2)}`
                });
            }
        }
        return `variants: ${JSON.stringify(variants)}`;
    } catch(e) {
        return match;
    }
});

// Also update blogPosts to use some product images
const images = [
    "https://growthguys.is/wp-content/uploads/Tirz-10-Red-1024x930.jpg",
    "https://peptidelabuk.co.uk/wp-content/uploads/2026/04/68c153351d1a646053b66e98_Retatrutide-5MG-With-Pen-1-scaled.jpg"
];

restCode = restCode.replace(/image: "\/hero.webp"/g, () => `image: "${images[0]}"`);
restCode = restCode.replace(/image: "\/hero2.webp"/g, () => `image: "${images[1]}"`);

fs.writeFileSync('lib/data.ts', productsCode + restCode);
console.log("Updated data.ts");
