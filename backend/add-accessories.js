// add-accessories.js
// Run this to add the Accessories category + 12 jewellery/accessory products
// to your existing MongoDB WITHOUT deleting any other data.
// Usage: node add-accessories.js

require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product  = require('./models/Product');

async function addAccessories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // ── 1. Find or create the Accessories category ──────────────────
    let accessoriesCat = await Category.findOne({ name: 'Accessories' });

    if (!accessoriesCat) {
      accessoriesCat = await Category.create({
        name: 'Accessories',
        description: 'Jewellery, bags, scarves and more',
        image_url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&q=80',
      });
      console.log('✅ Created Accessories category');
    } else {
      console.log('✅ Accessories category already exists — using it');
    }

    const catId = accessoriesCat._id;

    // ── 2. Remove any old Accessories products to avoid duplicates ──
    const deleted = await Product.deleteMany({ category_name: 'Accessories' });
    if (deleted.deletedCount > 0) {
      console.log(`🗑  Removed ${deleted.deletedCount} old Accessories products`);
    }

    // ── 3. Insert all 12 accessories products ───────────────────────
    const products = [
      {
        name: 'Layered Gold Necklace Set',
        description: 'Elegant 3-layer gold-toned necklace set with delicate chains and pearl accents. Perfect for festive and casual wear.',
        price: 699, original_price: 999,
        category_id: catId, category_name: 'Accessories',
        image_url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=80',
        sizes: 'Free Size', colors: 'Gold,Silver,Rose Gold',
        stock: 80, is_featured: true, is_new: true,
      },
      {
        name: 'Kundan Jhumka Earrings',
        description: 'Traditional Kundan-work jhumka earrings with colourful stones. A classic Indian jewellery staple for festive occasions.',
        price: 549, original_price: 799,
        category_id: catId, category_name: 'Accessories',
        image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80',
        sizes: 'Free Size', colors: 'Gold-Red,Gold-Green,Gold-Blue',
        stock: 100, is_featured: true, is_new: false,
      },
      {
        name: 'Oxidised Silver Bangles Set',
        description: 'Set of 6 oxidised silver bangles with intricate floral motifs. Pairs beautifully with ethnic and fusion looks.',
        price: 399, original_price: 599,
        category_id: catId, category_name: 'Accessories',
        image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80',
        sizes: '2.4,2.6,2.8', colors: 'Oxidised Silver,Antique Gold',
        stock: 120, is_featured: false, is_new: true,
      },
      {
        name: 'Pearl Choker Necklace',
        description: 'Delicate faux-pearl choker with a dainty pendant. Timeless, elegant and versatile for all occasions.',
        price: 499, original_price: null,
        category_id: catId, category_name: 'Accessories',
        image_url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&q=80',
        sizes: 'Free Size', colors: 'White Pearl,Pink Pearl,Cream Pearl',
        stock: 60, is_featured: true, is_new: true,
      },
      {
        name: 'Kundan Maang Tikka Set',
        description: 'Stunning Kundan maang tikka with matching earrings. Perfect for bridal, wedding and festive styling.',
        price: 899, original_price: 1299,
        category_id: catId, category_name: 'Accessories',
        image_url: 'https://images.unsplash.com/photo-1601612628452-9e99ced43524?w=500&q=80',
        sizes: 'Free Size', colors: 'Gold-Red,Gold-Green,Gold-White',
        stock: 35, is_featured: true, is_new: false,
      },
      {
        name: 'Beaded Tassel Earrings',
        description: 'Handcrafted beaded tassel earrings in vibrant colours. Lightweight and perfect for summer festivals.',
        price: 299, original_price: null,
        category_id: catId, category_name: 'Accessories',
        image_url: 'https://images.unsplash.com/photo-1588444650733-d0d3d43f0e6e?w=500&q=80',
        sizes: 'Free Size', colors: 'Multicolor,Coral,Teal',
        stock: 150, is_featured: false, is_new: true,
      },
      {
        name: 'Silk Block-Print Stole',
        description: 'Lightweight silk-blend stole with vibrant block-print pattern. Versatile as a dupatta, scarf or beach wrap.',
        price: 649, original_price: 899,
        category_id: catId, category_name: 'Accessories',
        image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80',
        sizes: 'Free Size', colors: 'Blue-Gold,Pink-Silver,Green-Gold',
        stock: 70, is_featured: false, is_new: false,
      },
      {
        name: 'Embroidered Potli Bag',
        description: 'Traditional potli bag with zari embroidery and drawstring closure. The perfect ethnic occasion accessory.',
        price: 799, original_price: 1099,
        category_id: catId, category_name: 'Accessories',
        image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
        sizes: 'Free Size', colors: 'Maroon-Gold,Navy-Silver,Emerald-Gold',
        stock: 45, is_featured: true, is_new: false,
      },
      {
        name: 'Stackable Stone Rings Set',
        description: 'Set of 5 delicate stackable rings with semi-precious stone accents. Mix and match to create your own look.',
        price: 449, original_price: 649,
        category_id: catId, category_name: 'Accessories',
        image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80',
        sizes: '6,7,8', colors: 'Gold,Silver,Rose Gold',
        stock: 90, is_featured: false, is_new: true,
      },
      {
        name: 'Woven Raffia Tote Bag',
        description: 'Chic handwoven raffia tote with leather handles and inner zip pouch. The must-have summer bag.',
        price: 1199, original_price: 1599,
        category_id: catId, category_name: 'Accessories',
        image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&q=80',
        sizes: 'Free Size', colors: 'Natural,Tan,Black',
        stock: 30, is_featured: false, is_new: false,
      },
      {
        name: 'Meenakari Cuff Bracelet',
        description: 'Hand-painted Meenakari enamel cuff bracelet with traditional Rajasthani floral motifs. A wearable piece of art.',
        price: 599, original_price: 849,
        category_id: catId, category_name: 'Accessories',
        image_url: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=500&q=80',
        sizes: 'Free Size', colors: 'Blue-Gold,Green-Gold,Red-Gold',
        stock: 50, is_featured: true, is_new: true,
      },
      {
        name: 'Long Tassel Pendant Necklace',
        description: 'Statement long tassel pendant necklace with stone detailing. Instantly elevates any casual or party outfit.',
        price: 449, original_price: null,
        category_id: catId, category_name: 'Accessories',
        image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80',
        sizes: 'Free Size', colors: 'Gold,Oxidised Silver,Rose Gold',
        stock: 75, is_featured: false, is_new: false,
      },
    ];

    const saved = await Product.insertMany(products);
    console.log(`\n✅ Successfully added ${saved.length} Accessories products:\n`);
    saved.forEach(p => console.log(`   → ${p.name}  ₹${p.price}`));

    console.log('\n🌸 ─────────────────────────────────────────────');
    console.log('   Done! Refresh your admin panel to see all accessories.');
    console.log('   They will appear under the Accessories category in the shop.\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
}

addAccessories();
