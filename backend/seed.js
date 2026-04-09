// seed.js — Run once to populate MongoDB with categories + products
// Usage: node seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product  = require('./models/Product');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑  Cleared old data');

    // ── CATEGORIES ──────────────────────────────────────────────────
    const catDefs = [
      { name:'Casuals',      description:'Comfortable everyday fashion for every woman',        image_url:'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80' },
      { name:'Formals',      description:'Sharp and professional outfits for the workplace',    image_url:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80' },
      { name:'Western',      description:'Trendy western styles — dresses, tops and more',      image_url:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80' },
      { name:'Ethnic',       description:'Kurtas, salwars, sarees and Indian fusion wear',      image_url:'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&q=80' },
      { name:'Traditional',  description:'Classic traditional wear for festivals and weddings', image_url:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80' },
      { name:'Party Wear',   description:'Glam and glamorous outfits for special occasions',    image_url:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80' },
      { name:'Dresses',      description:'Elegant and casual dresses for every occasion',       image_url:'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=80' },
      { name:'Tops',         description:'Trendy tops, blouses and shirts',                     image_url:'https://images.unsplash.com/photo-1551803091-e20673f15770?w=400&q=80' },
      { name:'Accessories',  description:'Jewellery, bags, scarves and more',                   image_url:'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=400&q=80' },
    ];

    const savedCats = await Category.insertMany(catDefs);
    const C = {};
    savedCats.forEach(c => { C[c.name] = c._id; });
    console.log(`✅ Inserted ${savedCats.length} categories`);

    // ── PRODUCTS ────────────────────────────────────────────────────
    const products = [
      // CASUALS
      {
        name:'Wide-Leg Palazzo', description:'Flowy wide-leg palazzo pants in breathable fabric. Comfortable and stylish for everyday wear.',
        price:1199, original_price:1699, category_id:C['Casuals'], category_name:'Casuals',
        image_url:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80',
        sizes:'XS,S,M,L,XL,XXL', colors:'Black,Navy,Olive,White', stock:70, is_featured:false, is_new:false
      },
      {
        name:'Printed Coord Set', description:'Matching co-ordinate set with abstract tropical print. Mix and match for multiple looks.',
        price:1699, original_price:null, category_id:C['Casuals'], category_name:'Casuals',
        image_url:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80',
        sizes:'XS,S,M,L,XL', colors:'Blue Abstract,Pink Floral,Green Tropical', stock:40, is_featured:true, is_new:true
      },
      {
        name:'Candy Stripe Co-ord', description:'Fun candy stripe co-ordinate set in soft cotton. Playful and trendy for casual outings.',
        price:1299, original_price:null, category_id:C['Casuals'], category_name:'Casuals',
        image_url:'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=500&q=80',
        sizes:'S,M,L,XL', colors:'Pink-White,Blue-White,Red-White', stock:50, is_featured:false, is_new:true
      },
      {
        name:'Slip Midi Skirt', description:'Versatile slip midi skirt in satin finish. Dress it up or down for any occasion.',
        price:899, original_price:1199, category_id:C['Casuals'], category_name:'Casuals',
        image_url:'https://images.unsplash.com/photo-1551803091-e20673f15770?w=500&q=80',
        sizes:'XS,S,M,L,XL', colors:'Black,Champagne,Dusty Rose', stock:60, is_featured:false, is_new:false
      },

      // FORMALS
      {
        name:'Tailored Blazer Dress', description:'Sharp tailored blazer dress perfect for boardroom meetings and office events. Powerful and polished.',
        price:2499, original_price:3299, category_id:C['Formals'], category_name:'Formals',
        image_url:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80',
        sizes:'XS,S,M,L,XL', colors:'Black,Navy,Charcoal', stock:30, is_featured:true, is_new:true
      },
      {
        name:'Pencil Skirt Set', description:'Classic pencil skirt with a matching fitted blouse. Perfect for formal office wear.',
        price:1899, original_price:2499, category_id:C['Formals'], category_name:'Formals',
        image_url:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80',
        sizes:'XS,S,M,L,XL', colors:'Black,Ivory,Camel', stock:25, is_featured:false, is_new:false
      },
      {
        name:'Structured Shirt Dress', description:'Crisp structured shirt dress in premium cotton blend. Elevated workwear that transitions seamlessly from desk to dinner.',
        price:2199, original_price:2999, category_id:C['Formals'], category_name:'Formals',
        image_url:'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=500&q=80',
        sizes:'XS,S,M,L,XL', colors:'White,Light Blue,Stripe', stock:30, is_featured:false, is_new:true
      },
      {
        name:'High-Waist Trouser Set', description:'Tailored high-waist trousers with a matching fitted blazer. Power dressing at its finest for the modern professional woman.',
        price:2799, original_price:3699, category_id:C['Formals'], category_name:'Formals',
        image_url:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80',
        sizes:'XS,S,M,L,XL,XXL', colors:'Charcoal,Camel,Ivory', stock:22, is_featured:true, is_new:true
      },

      // WESTERN
      {
        name:'Pastel Wrap Dress', description:'Beautiful pastel wrap dress with a flattering V-neckline and tie waist. Perfect for summer.',
        price:1499, original_price:2100, category_id:C['Western'], category_name:'Western',
        image_url:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80',
        sizes:'XS,S,M,L,XL', colors:'Blush Pink,Mint,Lilac', stock:50, is_featured:true, is_new:false
      },
      {
        name:'Satin Slip Dress', description:'Elegant satin slip dress with a bias cut. Perfect for evening events and date nights.',
        price:2099, original_price:2999, category_id:C['Western'], category_name:'Western',
        image_url:'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&q=80',
        sizes:'XS,S,M,L', colors:'Black,Champagne,Navy', stock:30, is_featured:true, is_new:false
      },
      {
        name:'Ruffle Crop Top', description:'Flirty ruffle crop top with off-shoulder design. Pairs perfectly with high-waisted bottoms.',
        price:799, original_price:null, category_id:C['Western'], category_name:'Western',
        image_url:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80',
        sizes:'XS,S,M,L', colors:'White,Pink,Lilac', stock:80, is_featured:true, is_new:true
      },
      {
        name:'Boho Maxi Dress', description:'Free-spirited bohemian maxi dress with flowy fabric and intricate prints.',
        price:1799, original_price:null, category_id:C['Western'], category_name:'Western',
        image_url:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80',
        sizes:'S,M,L,XL', colors:'Multicolor,Blue,Terra Cotta', stock:40, is_featured:false, is_new:true
      },

      // ETHNIC
      {
        name:'Floral Anarkali Set', description:'Stunning floral Anarkali suit with dupatta. Intricate embroidery and rich fabric for festive occasions.',
        price:1899, original_price:2799, category_id:C['Ethnic'], category_name:'Ethnic',
        image_url:'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=500&q=80',
        sizes:'XS,S,M,L,XL,XXL', colors:'Red,Royal Blue,Emerald', stock:35, is_featured:true, is_new:true
      },
      {
        name:'Embroidered Kurti', description:'Elegant Lucknowi chikankari kurti with fine hand embroidery. A timeless classic.',
        price:1349, original_price:null, category_id:C['Ethnic'], category_name:'Ethnic',
        image_url:'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=500&q=80',
        sizes:'XS,S,M,L,XL,XXL', colors:'White,Peach,Mint', stock:55, is_featured:false, is_new:true
      },
      {
        name:'Off-Shoulder Blouse', description:'Elegant off-shoulder blouse with delicate lace detailing. Versatile for work or evenings.',
        price:949, original_price:1299, category_id:C['Ethnic'], category_name:'Ethnic',
        image_url:'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=500&q=80',
        sizes:'XS,S,M,L,XL', colors:'White,Cream,Sky Blue', stock:45, is_featured:false, is_new:false
      },

      // TRADITIONAL
      {
        name:'Bandhani Dupatta Set', description:'Traditional Bandhani print salwar set from Rajasthan. Vibrant colours and soft fabric.',
        price:2299, original_price:3199, category_id:C['Traditional'], category_name:'Traditional',
        image_url:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80',
        sizes:'S,M,L,XL', colors:'Pink-Yellow,Red-Green,Blue-Orange', stock:20, is_featured:true, is_new:false
      },
      {
        name:'Ikat Print Saree', description:'Handwoven Ikat saree with geometric prints. Perfect for festive occasions and weddings.',
        price:2499, original_price:3299, category_id:C['Traditional'], category_name:'Traditional',
        image_url:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80',
        sizes:'Free Size', colors:'Teal,Maroon,Purple', stock:15, is_featured:false, is_new:true
      },
      {
        name:'Straight-Cut Salwar', description:'Clean straight-cut salwar suit in soft cotton. Comfortable and elegantly dressed.',
        price:1099, original_price:1499, category_id:C['Traditional'], category_name:'Traditional',
        image_url:'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500&q=80',
        sizes:'XS,S,M,L,XL,XXL', colors:'Powder Blue,Off White,Lavender', stock:60, is_featured:false, is_new:false
      },

      // PARTY WEAR
      {
        name:'Sequin Party Top', description:'Dazzling sequin top that catches the light. Style with trousers or a mini skirt.',
        price:1099, original_price:1499, category_id:C['Party Wear'], category_name:'Party Wear',
        image_url:'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&q=80',
        sizes:'XS,S,M,L', colors:'Gold,Silver,Rose Gold', stock:25, is_featured:true, is_new:false
      },
      {
        name:'Velvet Lehenga Set', description:'Luxurious velvet lehenga with heavy zari embroidery and dupatta. For weddings and festivities.',
        price:4999, original_price:6500, category_id:C['Party Wear'], category_name:'Party Wear',
        image_url:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80',
        sizes:'XS,S,M,L,XL', colors:'Royal Blue,Deep Maroon,Forest Green', stock:10, is_featured:true, is_new:false
      },
      {
        name:'Shimmer Cocktail Dress', description:'Dazzling all-over shimmer cocktail dress with a figure-flattering silhouette. Turn heads at every party.',
        price:2799, original_price:3799, category_id:C['Party Wear'], category_name:'Party Wear',
        image_url:'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=500&q=80',
        sizes:'XS,S,M,L,XL', colors:'Gold,Silver,Black', stock:20, is_featured:true, is_new:true
      },
      {
        name:'Embellished Cape Gown', description:'Elegant embellished cape gown with statement shoulder detailing. Perfect for receptions, galas and sangeet nights.',
        price:3999, original_price:5299, category_id:C['Party Wear'], category_name:'Party Wear',
        image_url:'https://images.unsplash.com/photo-1566174181878-d4d4b9c1d265?w=500&q=80',
        sizes:'XS,S,M,L,XL', colors:'Midnight Blue,Emerald,Rose Gold', stock:12, is_featured:true, is_new:true
      },

      // DRESSES
      {
        name:'Linen Shirt Dress', description:'Casual yet chic linen shirt dress. Breathable and comfortable for hot weather.',
        price:1599, original_price:2100, category_id:C['Dresses'], category_name:'Dresses',
        image_url:'https://images.unsplash.com/photo-1551803091-e20673f15770?w=500&q=80',
        sizes:'XS,S,M,L,XL,XXL', colors:'White,Beige,Sage Green', stock:60, is_featured:false, is_new:false
      },
      {
        name:'Floral Midi Wrap Dress', description:'Romantic floral print midi wrap dress with a flattering V-neckline and tie-waist. Perfect for brunch or beach outings.',
        price:1799, original_price:2499, category_id:C['Dresses'], category_name:'Dresses',
        image_url:'https://images.unsplash.com/photo-1496217590455-aa63a8550c23?w=500&q=80',
        sizes:'XS,S,M,L,XL', colors:'Pink Floral,Blue Floral,Yellow Floral', stock:45, is_featured:true, is_new:true
      },
      {
        name:'Black Bodycon Dress', description:'Sleek black bodycon dress with subtle ruching. A wardrobe essential for evenings and parties.',
        price:1399, original_price:1899, category_id:C['Dresses'], category_name:'Dresses',
        image_url:'https://images.unsplash.com/photo-1566206091558-7f218b696731?w=500&q=80',
        sizes:'XS,S,M,L,XL', colors:'Black,Burgundy,Cobalt Blue', stock:40, is_featured:true, is_new:false
      },
      {
        name:'Halter Neck Sundress', description:'Breezy halter neck sundress in light cotton. Ideal for summer outings, vacations and casual days out.',
        price:1099, original_price:null, category_id:C['Dresses'], category_name:'Dresses',
        image_url:'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=500&q=80',
        sizes:'XS,S,M,L,XL', colors:'White,Coral,Sky Blue', stock:55, is_featured:false, is_new:true
      },

      // TOPS
      {
        name:'Tie-Dye Tee', description:'Trendy tie-dye t-shirt with a relaxed oversized fit. Great for casual everyday wear.',
        price:599, original_price:null, category_id:C['Tops'], category_name:'Tops',
        image_url:'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=500&q=80',
        sizes:'S,M,L,XL,XXL', colors:'Pink-Purple,Blue-Green,Orange-Yellow', stock:100, is_featured:false, is_new:true
      },
      {
        name:'Puff Sleeve Crop Top', description:'Trendy puff-sleeve crop top with smocked detailing at the back. Pairs beautifully with high-waisted skirts or jeans.',
        price:849, original_price:1199, category_id:C['Tops'], category_name:'Tops',
        image_url:'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=500&q=80',
        sizes:'XS,S,M,L,XL', colors:'Lilac,White,Sage Green', stock:70, is_featured:true, is_new:true
      },
      {
        name:'Printed Georgette Blouse', description:'Lightweight georgette blouse with an allover print. Elegant enough for office, easy enough for everyday.',
        price:749, original_price:999, category_id:C['Tops'], category_name:'Tops',
        image_url:'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500&q=80',
        sizes:'XS,S,M,L,XL,XXL', colors:'Peach Print,Navy Print,Mint Print', stock:80, is_featured:false, is_new:false
      },
      {
        name:'Embroidered Lace Top', description:'Delicate lace top with floral embroidery at the hem and neckline. A feminine wardrobe staple.',
        price:999, original_price:1399, category_id:C['Tops'], category_name:'Tops',
        image_url:'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&q=80',
        sizes:'XS,S,M,L,XL', colors:'White,Ivory,Blush Pink', stock:50, is_featured:true, is_new:false
      },

      // ACCESSORIES — jewellery, bags, scarves and more
      {
        name:'Layered Gold Necklace Set', description:'Elegant 3-layer gold-toned necklace set with delicate chains and pearl accents. Perfect for festive and casual wear.',
        price:699, original_price:999, category_id:C['Accessories'], category_name:'Accessories',
        image_url:'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=80',
        sizes:'Free Size', colors:'Gold,Silver,Rose Gold', stock:80, is_featured:true, is_new:true
      },
      {
        name:'Kundan Jhumka Earrings', description:'Traditional Kundan-work jhumka earrings with colourful stones. A classic Indian jewellery staple for festive occasions.',
        price:549, original_price:799, category_id:C['Accessories'], category_name:'Accessories',
        image_url:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80',
        sizes:'Free Size', colors:'Gold-Red,Gold-Green,Gold-Blue', stock:100, is_featured:true, is_new:false
      },
      {
        name:'Oxidised Silver Bangles Set', description:'Set of 6 oxidised silver bangles with intricate floral motifs. Pairs beautifully with ethnic and fusion looks.',
        price:399, original_price:599, category_id:C['Accessories'], category_name:'Accessories',
        image_url:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80',
        sizes:'2.4,2.6,2.8', colors:'Oxidised Silver,Antique Gold', stock:120, is_featured:false, is_new:true
      },
      {
        name:'Pearl Choker Necklace', description:'Delicate faux-pearl choker with a dainty pendant. Timeless, elegant and versatile for all occasions.',
        price:499, original_price:null, category_id:C['Accessories'], category_name:'Accessories',
        image_url:'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&q=80',
        sizes:'Free Size', colors:'White Pearl,Pink Pearl,Cream Pearl', stock:60, is_featured:true, is_new:true
      },
      {
        name:'Kundan Maang Tikka Set', description:'Stunning Kundan maang tikka with matching earrings and matha patti. Perfect for bridal, wedding and festive styling.',
        price:899, original_price:1299, category_id:C['Accessories'], category_name:'Accessories',
        image_url:'https://images.unsplash.com/photo-1601612628452-9e99ced43524?w=500&q=80',
        sizes:'Free Size', colors:'Gold-Red,Gold-Green,Gold-White', stock:35, is_featured:true, is_new:false
      },
      {
        name:'Beaded Tassel Earrings', description:'Handcrafted beaded tassel earrings in vibrant colours. Lightweight and perfect for summer festivals and casual wear.',
        price:299, original_price:null, category_id:C['Accessories'], category_name:'Accessories',
        image_url:'https://images.unsplash.com/photo-1588444650733-d0d3d43f0e6e?w=500&q=80',
        sizes:'Free Size', colors:'Multicolor,Coral,Teal', stock:150, is_featured:false, is_new:true
      },
      {
        name:'Silk Block-Print Stole', description:'Lightweight silk-blend stole with vibrant block-print pattern. Versatile as a dupatta, scarf, or beach cover-up.',
        price:649, original_price:899, category_id:C['Accessories'], category_name:'Accessories',
        image_url:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80',
        sizes:'Free Size', colors:'Blue-Gold,Pink-Silver,Green-Gold', stock:70, is_featured:false, is_new:false
      },
      {
        name:'Embroidered Potli Bag', description:'Traditional potli bag with zari embroidery and drawstring closure. The perfect ethnic occasion accessory.',
        price:799, original_price:1099, category_id:C['Accessories'], category_name:'Accessories',
        image_url:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
        sizes:'Free Size', colors:'Maroon-Gold,Navy-Silver,Emerald-Gold', stock:45, is_featured:true, is_new:false
      },
      {
        name:'Stackable Stone Rings Set', description:'Set of 5 delicate stackable rings with semi-precious stone accents — mix and match to create your own look.',
        price:449, original_price:649, category_id:C['Accessories'], category_name:'Accessories',
        image_url:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80',
        sizes:'6,7,8', colors:'Gold,Silver,Rose Gold', stock:90, is_featured:false, is_new:true
      },
      {
        name:'Woven Raffia Tote Bag', description:'Chic handwoven raffia tote with leather handles and inner zip pouch. The must-have summer bag.',
        price:1199, original_price:1599, category_id:C['Accessories'], category_name:'Accessories',
        image_url:'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&q=80',
        sizes:'Free Size', colors:'Natural,Tan,Black', stock:30, is_featured:false, is_new:false
      },
      {
        name:'Meenakari Cuff Bracelet', description:'Hand-painted Meenakari enamel cuff bracelet with traditional Rajasthani floral motifs. A wearable piece of art.',
        price:599, original_price:849, category_id:C['Accessories'], category_name:'Accessories',
        image_url:'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=500&q=80',
        sizes:'Free Size', colors:'Blue-Gold,Green-Gold,Red-Gold', stock:50, is_featured:true, is_new:true
      },
      {
        name:'Long Tassel Pendant Necklace', description:'Statement long tassel pendant necklace with stone detailing. Instantly elevates any casual or party outfit.',
        price:449, original_price:null, category_id:C['Accessories'], category_name:'Accessories',
        image_url:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80',
        sizes:'Free Size', colors:'Gold,Oxidised Silver,Rose Gold', stock:75, is_featured:false, is_new:false
      },

      // ETHNIC WEAR — additional rich items
      {
        name:'Banarasi Silk Kurta Set', description:'Luxurious Banarasi silk kurta with intricate woven gold zari border. Comes with matching palazzo and dupatta.',
        price:3499, original_price:4999, category_id:C['Ethnic'], category_name:'Ethnic',
        image_url:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80',
        sizes:'XS,S,M,L,XL,XXL', colors:'Peacock Blue,Deep Maroon,Forest Green', stock:20, is_featured:true, is_new:true
      },
      {
        name:'Chanderi Sharara Set', description:'Elegant Chanderi fabric sharara set with hand-block print and delicate mirror work. A festive wear favourite.',
        price:2799, original_price:3799, category_id:C['Ethnic'], category_name:'Ethnic',
        image_url:'https://images.unsplash.com/photo-1583391099995-99218ee73b87?w=500&q=80',
        sizes:'XS,S,M,L,XL', colors:'Ivory-Gold,Sage-Silver,Blush-Rose', stock:25, is_featured:true, is_new:true
      },
      {
        name:'Phulkari Dupatta', description:'Traditional Punjabi Phulkari dupatta with hand-embroidered floral thread work on pure cotton. A heirloom piece.',
        price:1299, original_price:1799, category_id:C['Ethnic'], category_name:'Ethnic',
        image_url:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80',
        sizes:'Free Size', colors:'Red,Orange,Pink', stock:40, is_featured:false, is_new:false
      },
      {
        name:'Kalamkari Cotton Kurti', description:'Hand-painted Kalamkari art kurti on pure cotton. Each piece is a one-of-a-kind work of traditional Indian art.',
        price:1599, original_price:null, category_id:C['Ethnic'], category_name:'Ethnic',
        image_url:'https://images.unsplash.com/photo-1559563458-527698bf5295?w=500&q=80',
        sizes:'XS,S,M,L,XL,XXL', colors:'Off-White,Rust,Indigo', stock:30, is_featured:true, is_new:true
      },
      {
        name:'Silk Saree with Blouse', description:'Premium pure silk saree with contrast pallu and matching unstitched blouse piece. For weddings and grand occasions.',
        price:5499, original_price:7499, category_id:C['Traditional'], category_name:'Traditional',
        image_url:'https://images.unsplash.com/photo-1583391099995-99218ee73b87?w=500&q=80',
        sizes:'Free Size', colors:'Royal Blue-Gold,Maroon-Gold,Green-Zari', stock:12, is_featured:true, is_new:false
      },
    ];

    const saved = await Product.insertMany(products);
    console.log(`✅ Inserted ${saved.length} products\n`);
    console.log('🌸 ─────────────────────────────────────────────');
    console.log(`   ${savedCats.length} categories  |  ${saved.length} products saved to MongoDB`);
    console.log('\n   Categories added:');
    savedCats.forEach(c => console.log(`   → ${c.name}`));
    console.log('\n▶  Now run: npm run dev');
    console.log('   Open:    http://localhost:4200/admin\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
