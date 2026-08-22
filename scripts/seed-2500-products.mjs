import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this script.');
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

const categories = {
  Electronics: ['smartphones','tablets','laptops','monitors','keyboards','mice','headphones','speakers','projectors','routers'],
  Fashion: ['hoodies','denim jackets','linen shirts','cargo trousers','chinos','cardigans','tracksuits','blazers','jumpsuits','sweaters'],
  Footwear: ['running shoes','walking shoes','loafers','sneakers','boots','sandals','slides','heels','flats','trail shoes'],
  'Home & Kitchen': ['air fryers','blenders','rice cookers','coffee makers','toasters','cookware sets','storage racks','water filters','knife sets','food processors'],
  Beauty: ['face cleansers','moisturizers','serums','toners','body lotions','hair masks','shampoos','conditioners','makeup brushes','lip balms'],
  Watches: ['chronographs','field watches','dress watches','diver watches','digital watches','fitness watches','skeleton watches','pilot watches','minimal watches','sport watches'],
  Travel: ['carry-on cases','travel backpacks','packing cubes','passport holders','neck pillows','toiletry bags','luggage straps','duffel bags','travel adapters','weekend bags'],
  'Sports & Fitness': ['yoga mats','dumbbells','kettlebells','resistance bands','gym gloves','foam rollers','jump ropes','fitness benches','hydration belts','training cones'],
  'Outdoor & Camping': ['camping tents','sleeping bags','camp chairs','lanterns','camp stoves','hiking poles','cooler boxes','dry bags','headlamps','picnic blankets'],
  'Automotive': ['dash cameras','car chargers','seat organizers','phone mounts','air compressors','jump starters','floor mats','sun shades','car vacuums','tool kits'],
  'Phones & Accessories': ['phone cases','screen protectors','wireless chargers','power banks','USB cables','car mounts','camera lenses','stylus pens','phone grips','charging docks'],
  'Computers & Accessories': ['USB hubs','webcams','laptop stands','docking stations','external SSDs','flash drives','graphics tablets','cooling pads','cable organizers','card readers'],
  'Gaming': ['game controllers','gaming headsets','mechanical keyboards','gaming mice','racing wheels','capture cards','gaming chairs','desk mats','console stands','VR accessories'],
  'Audio & Music': ['studio headphones','microphones','audio interfaces','MIDI controllers','mixers','turntables','soundbars','earbuds','instrument cables','portable recorders'],
  'Cameras & Photography': ['mirrorless cameras','action cameras','tripods','camera bags','LED panels','memory cards','camera straps','gimbals','lens filters','photo printers'],
  'Office Supplies': ['notebooks','desk organizers','filing boxes','staplers','label makers','paper cutters','whiteboards','pens','document folders','desk lamps'],
  'Furniture': ['office chairs','study desks','coffee tables','bookshelves','bedside tables','dining chairs','shoe cabinets','TV consoles','storage benches','sideboards'],
  'Jewelry & Accessories': ['necklaces','bracelets','rings','earrings','cufflinks','brooches','anklets','pendants','hair clips','jewelry boxes'],
  'Kids & Toys': ['building sets','remote cars','puzzles','art kits','plush toys','science kits','board games','doll houses','toy kitchens','learning cards'],
  'Baby Products': ['strollers','baby carriers','bottle warmers','changing mats','feeding sets','crib sheets','baby monitors','teething toys','swaddles','diaper bags'],
  'Pet Supplies': ['dog beds','cat trees','pet bowls','leashes','collars','grooming kits','pet carriers','training pads','scratching posts','interactive toys'],
  'Garden & Tools': ['pruning shears','garden hoses','hand trowels','rakes','sprinklers','plant pots','tool boxes','screwdriver sets','drill bits','work gloves'],
  'Health & Wellness': ['massage guns','heat pads','digital scales','posture supports','sleep masks','aromatherapy diffusers','water bottles','wellness journals','balance boards','stretch straps'],
  'Groceries & Pantry': ['coffee beans','tea blends','granola','pasta','rice varieties','spice sets','baking mixes','cooking oils','snack boxes','breakfast cereals'],
  'Lighting & Decor': ['table lamps','floor lamps','wall lights','pendant lights','LED strips','picture frames','mirrors','vases','candle holders','decor clocks'],
  'Books & Learning': ['business books','fiction collections','cookbooks','language guides','study planners','career guides','art books','history books','science readers','activity books']
};

const finishes = ['Classic','Nova','Prime','Elite','Urban','Luxe','Core','Pro','Select','Signature'];
const materials = ['Series A','Series B','Series C','Series D','Series E','Series F','Series G','Series H','Series I','Series J'];
const brands = ['MartCart Select','NovaWorks','UrbanEdge','PrimeHouse','Aurelia','Vertex','Everline','Northstar','LumaCraft','Coreline'];
const currencies = ['USD'];

function slugify(value) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
function price(categoryIndex, itemIndex, variantIndex) { return Number((9.99 + categoryIndex * 2.73 + itemIndex * 4.17 + variantIndex * 6.31).toFixed(2)); }

async function ensureCategories() {
  const rows = Object.keys(categories).map(name => ({ name, slug: slugify(name) }));
  const { data, error } = await supabase.from('categories').upsert(rows, { onConflict: 'slug' }).select('id,name,slug');
  if (error) throw error;
  return new Map(data.map(row => [row.name, row.id]));
}

async function main() {
  const categoryIds = await ensureCategories();
  const rows = [];
  let globalIndex = 1;
  let categoryIndex = 0;

  for (const [category, products] of Object.entries(categories)) {
    for (let itemIndex = 0; itemIndex < products.length; itemIndex++) {
      for (let variantIndex = 0; variantIndex < 10; variantIndex++) {
        const productType = products[itemIndex];
        const finish = finishes[variantIndex];
        const series = materials[(itemIndex + variantIndex) % materials.length];
        const name = `${finish} ${series} ${productType}`;
        const slug = `${slugify(category)}-${slugify(productType)}-${slugify(finish)}-${variantIndex + 1}`;
        rows.push({
          name,
          slug,
          description: `${name} from ${category}. A carefully selected MartCart catalog item with practical features, dependable build quality and a modern finish.`,
          price: price(categoryIndex, itemIndex, variantIndex),
          currency: currencies[0],
          main_image_url: null,
          stock_quantity: 10 + ((globalIndex * 7) % 91),
          is_active: true,
          brand: brands[(categoryIndex + variantIndex) % brands.length],
          rating: Number((4 + ((globalIndex % 10) / 10)).toFixed(2)),
          review_count: (globalIndex * 13) % 480,
          category_id: categoryIds.get(category)
        });
        globalIndex++;
      }
    }
    categoryIndex++;
  }

  if (rows.length !== 2500) throw new Error(`Expected 2500 products, generated ${rows.length}`);
  for (let i = 0; i < rows.length; i += 250) {
    const batch = rows.slice(i, i + 250);
    const { error } = await supabase.from('products').upsert(batch, { onConflict: 'slug' });
    if (error) throw error;
    console.log(`Seeded ${Math.min(i + batch.length, rows.length)}/2500 products`);
  }
  console.log('MartCart catalog seed complete: 2500 unique products across 25 categories.');
}

main().catch(error => { console.error(error); process.exit(1); });
