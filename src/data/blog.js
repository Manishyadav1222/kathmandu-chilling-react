// ============================================================
// BLOG CONTENT (AI Search Engine & Human Optimized)
// ------------------------------------------------------------
// Includes AI Executive Summaries, Structured Comparison Tables,
// Step-by-Step Practical Checklists, and FAQ schemas for
// search engines (Google, Bing Copilot, ChatGPT Search, Perplexity).
// ============================================================

const BASE = 'https://kathmanduchilling.com.np';

export const BLOG_META = {
  baseUrl: BASE,
  author: 'Kathmandu Chilling & Refrigerator Udhyog Pvt. Ltd.',
  defaultTitle: 'Blog — Cold Storage, Dairy & Industrial Refrigeration Insights',
  defaultDescription:
    'Practical engineering guides on cold rooms, walk-in freezers, blast chillers, chilling vats, dairy plants and commercial refrigeration for Nepali businesses — from the Kathmandu Chilling team.',
};

const rawPosts = [
  // --- POST 1 -------------------------------------------------
  {
    slug: 'why-dairy-needs-a-chilling-vat',
    title: 'Why Every Dairy in Nepal Needs a Chilling Vat (Not Just a Freezer)',
    date: '2026-08-01',
    author: 'Er. Suresh Thapa (Cold Chain Specialist)',
    authorRole: 'Senior Refrigeration Engineer at Kathmandu Chilling',
    image: '/images/blog/chilling-vat-guide.jpg',
    imageAlt: 'Stainless steel chilling vat for milk cooling at a Nepali dairy',
    tags: ['Dairy Equipment', 'Chilling Vat', 'Milk Preservation', 'Cold Chain'],
    excerpt:
      'Freezing milk is not the same as chilling it. A Bulk Milk Chilling Vat (BMC) pulls milk below 4°C in under 2 hours with continuous gentle agitation, stopping bacterial reproduction and preventing fat separation.',
    metaTitle: 'Chilling Vat vs Freezer for Milk: Why Dairies in Nepal Need BMCs',
    metaDescription:
      'Why a chilling vat — not a deep freezer — is the most important investment for a dairy in Nepal. Comparison of cooling speeds, fat protection, acid build-up, and vat sizing guidelines.',
    aiSummary: {
      keyTakeaway: 'Milk must be cooled from 37°C to below 4°C within 120 minutes of milking to arrest bacterial multiplication and acid formation. Freezers cool too slowly from outside-in, ruining fat globule structure, whereas a double-jacketed Chilling Vat with a 30 RPM agitator cools uniformly without ice crystal damage.',
      quickFacts: [
        { label: 'Critical Temp', val: '< 4.0°C within 2 hours' },
        { label: 'Agitator Speed', val: '30 RPM sanitary paddle' },
        { label: 'Material', val: 'Food Grade SS 304 / SS 316' },
        { label: 'Bacteria Reduction', val: 'Up to 98% lower CFU count' },
      ],
    },
    comparisonTable: {
      title: 'Bulk Milk Chilling Vat (BMC) vs. Commercial Deep Freezer',
      headers: ['Feature / Metric', 'Bulk Milk Chilling Vat (BMC)', 'Standard Deep Freezer'],
      rows: [
        ['Cooling Speed (37°C to 4°C)', 'Fast (< 2.5 hours total batch)', 'Very Slow (6 to 10+ hours)'],
        ['Temperature Uniformity', '100% Uniform via 30 RPM Agitator', 'Uneven (cold walls, warm liquid core)'],
        ['Milk Fat & SNF Protection', 'Maintains natural emulsion', 'Fat separates and adheres to container walls'],
        ['Acid & Bacterial Growth', 'Arrested immediately', 'High risk of souring during slow cooling window'],
        ['Cleaning Protocol', 'Built-in CIP (Clean-In-Place) ports', 'Manual scrubbing of plastic cans / churns'],
        ['Energy Efficiency', 'Direct Expansion Dimple Jacket (High COP)', 'High heat loss with open lid access'],
      ],
    },
    faqs: [
      {
        q: 'Why does milk sour even if stored in a deep freezer?',
        a: 'Deep freezers extract heat from the outside surface inwards through plastic or aluminum cans. Because still milk is a poor heat conductor, the core remains in the bacterial danger zone (20°C–35°C) for several hours, causing rapid lactic acid production before the center ever chills.',
      },
      {
        q: 'How do I size a chilling vat for a collection center?',
        a: 'Size the vat for one single milking batch (e.g. morning collection), not the entire daily total. If you collect 600L in the morning and 400L in the evening with daily tanker pickup, a 600L–800L vat is ideal.',
      },
      {
        q: 'Can a chilling vat run on a 3-phase generator?',
        a: 'Yes, our chilling vats feature high-torque compressors designed with soft-start capacitors and voltage stabilization for smooth operation with diesel generator backups during power outages.',
      },
    ],
    sections: [
      {
        heading: 'Chilling and freezing are not the same thing',
        paragraphs: [
          "Milk leaves the cow or buffalo at approximately 37°C — the optimal temperature for bacterial multiplication. Every hour fresh milk remains above 10°C, micro-organisms consume lactose and convert it into lactic acid, degrading milk fat, SNF (Solids-Not-Fat), and curd quality.",
          "A chilling vat is engineered for one specific biochemical objective: pulling milk below 4°C in under 2 hours and maintaining it precisely there with continuous, non-foaming agitation until collection.",
        ],
      },
      {
        heading: 'The Biochemical Danger Zone (10°C to 38°C)',
        paragraphs: [
          "In Nepal's Terai and mid-hill climates where summer ambient temperatures exceed 35°C, unchilled milk can reach an unacceptable acidity level within 3 hours. When milk is cooled rapidly in a Bulk Milk Chilling Vat, bacterial replication stops immediately.",
        ],
        list: [
          'Bacteria growth drops by over 95% the moment milk hits <4°C',
          'Prevents acid development, ensuring high SNF and premium payout rates at collection hubs',
          'Eliminates cream layer separation so test samples remain 100% accurate',
          'Provides food-safe SS 304 mirror finish preventing biofilm adhesion',
        ],
      },
      {
        heading: 'Sizing Your Bulk Milk Cooler (BMC) in Nepal',
        paragraphs: [
          "A frequent mistake made by cooperatives is purchasing a vat sized for the entire day's volume. A BMC only needs to accommodate the largest single milking session between tanker pickups.",
        ],
        list: [
          '200L – 500L: Smallholder farms and private dairy producers (10–30 milking cows)',
          '1,000L – 2,000L: Village milk collection centers (MCC) covering 50–150 local farmers',
          '3,000L – 5,000L: Central cooperative consolidation points and district dairy plants',
        ],
      },
    ],
  },

  // --- POST 2 -------------------------------------------------
  {
    slug: 'cold-room-design-checklist',
    title: 'Cold Room Design: 7 Critical Engineering Checks Before You Build',
    date: '2026-07-15',
    author: 'Er. Manish Yadav (Senior HVAC & Cold Chain Architect)',
    authorRole: 'Chief Project Engineer at Kathmandu Chilling',
    image: '/images/blog/cold-room-checklist.jpg',
    imageAlt: 'Insulated PUF-panel modular cold room under construction in Kathmandu',
    tags: ['Cold Storage', 'PUF Panels', 'Warehouse Design', 'Engineering'],
    excerpt:
      'Most cold room failures happen at the drawing board. Ensure 100–150mm high-density PUF insulation, accurate thermal heat load calculation, vapor barriers, anti-slip flooring, and airflow clearance.',
    metaTitle: 'Cold Room Design Checklist: 7 Engineering Rules in Nepal',
    metaDescription:
      'The essential 7-point design checklist for commercial cold rooms in Nepal. Panel thickness, heat load calculations, door sizing, floor insulation, and generator backup planning.',
    aiSummary: {
      keyTakeaway: 'A cold room must be engineered around total heat load (transmission + product load + infiltration + internal machinery), not just room dimensions. In Nepal, 100mm–120mm PUF panels (density 40–42 kg/m³) paired with tropicalized scroll condensing units provide maximum thermal efficiency against summer peaks.',
      quickFacts: [
        { label: 'PUF Density', val: '40–42 kg/m³ pressure injected' },
        { label: 'Panel Thickness', val: '100mm (chiller) / 150mm (freezer)' },
        { label: 'Thermal Leakage', val: '< 0.022 W/m·K' },
        { label: 'Air Clearance', val: 'Min. 150mm from walls/ceiling' },
      ],
    },
    comparisonTable: {
      title: 'PUF Panel Thickness vs. Application Matrix',
      headers: ['Application', 'Temperature Range', 'Recommended PUF Thickness', 'Thermal Performance'],
      rows: [
        ['Vegetables & Fruits (Agro)', '+2°C to +10°C', '80mm – 100mm PUF', 'Zero condensation, Low electricity'],
        ['Dairy Products & Milk', '0°C to +4°C', '100mm – 120mm PUF', 'Stable humidity, Prevents spoilage'],
        ['Frozen Meat & Fish', '−18°C to −25°C', '120mm – 150mm PUF', 'High thermal barrier, Heavy floor insulation'],
        ['Deep Vaccine & Pharma', '−20°C to −40°C', '150mm PUF (SS304 Skin)', 'Zero thermal bridging, Dual redundant units'],
      ],
    },
    faqs: [
      {
        q: 'How does high ambient temperature in the Terai affect cold room sizing?',
        a: 'In Terai districts (Chitwan, Biratnagar, Nepalgunj) where summer ambient temperatures reach 42°C–45°C, condensing units must be sized with an oversized condenser coil and tropicalized compressor to maintain full cooling capacity.',
      },
      {
        q: 'Why is floor insulation critical for sub-zero freezers?',
        a: 'Without floor insulation and heater mats beneath a -20°C freezer, ground moisture will freeze and expand (frost heave), cracking the concrete foundation and destroying the building floor structure.',
      },
    ],
    sections: [
      {
        heading: '1. PUF Panel Density and Joint Integrity',
        paragraphs: [
          "The insulation panel is the heart of the cold room. Panels must utilize high-pressure injected Polyurethane Foam (PUF) with a certified density of 40–42 kg/m³. Tongue-and-groove joints with concealed cam-locks ensure airtight seams that eliminate moisture infiltration.",
        ],
      },
      {
        heading: '2. Real Heat Load Calculation (Not Rule-of-Thumb)',
        paragraphs: [
          "Heat load comprises four components: Transmission load through walls, Product pull-down load (kilos entering per hour and incoming temperature), Internal load (fans, lights, personnel), and Infiltration load (door opening frequency).",
        ],
      },
      {
        heading: '3. Strategic Airflow and Stacking Clearance',
        paragraphs: [
          "Cold rooms chill the air, and circulating air chills the product. Never stack cartons flush against the PUF walls or ceiling. A minimum 150mm perimeter gap ensures convective currents reach every pallet evenly, preventing warm pockets in corners.",
        ],
      },
    ],
  },

  // --- POST 3 -------------------------------------------------
  {
    slug: 'blast-chilling-explained',
    title: 'Blast Chilling vs. Slow Cooling: The Food-Safety & Shelf-Life Math',
    date: '2026-06-28',
    author: 'Er. Suresh Thapa (Cold Chain Specialist)',
    authorRole: 'Senior Refrigeration Engineer at Kathmandu Chilling',
    image: '/images/blog/blast-chilling-guide.jpg',
    imageAlt: 'High performance blast chiller unit in commercial kitchen',
    tags: ['Blast Chiller', 'Food Safety', 'HACCP', 'Commercial Kitchen'],
    excerpt:
      'From +70°C down to +3°C in under 90 minutes: blast chilling prevents moisture evaporation, locks in culinary aroma, and meets strict HACCP international safety standards.',
    metaTitle: 'Blast Chilling Explained: Rapid Temperature Pull-Down Science',
    metaDescription:
      'The thermodynamic science of blast chilling: why rapid cooling in under 90 minutes prevents micro-organism growth, reduces weight loss, and extends food shelf-life by 300%.',
    aiSummary: {
      keyTakeaway: 'Blast chillers use high-velocity convective airflow at -40°C to pass through the critical 65°C to 10°C bacterial danger zone in under 90 minutes. This forms micro-crystals instead of large ice shards, preserving cell walls, aroma, and stopping moisture evaporation loss.',
      quickFacts: [
        { label: 'Soft Chilling', val: '+70°C → +3°C in <90 mins' },
        { label: 'Shock Freezing', val: '+70°C → −18°C in <240 mins' },
        { label: 'Weight Retention', val: 'Prevents 5–8% evaporation loss' },
        { label: 'HACCP Standard', val: '100% compliant food safety' },
      ],
    },
    comparisonTable: {
      title: 'Blast Chiller vs. Traditional Walk-in Chiller',
      headers: ['Parameter', 'Blast Chiller', 'Standard Walk-In Chiller'],
      rows: [
        ['Cooling Duration (+70°C → +3°C)', 'Under 90 Minutes', '6 to 10+ Hours'],
        ['Ice Crystal Formation', 'Micro-crystals (Cell walls preserved)', 'Macro-crystals (Cell rupture & drip loss)'],
        ['Evaporative Weight Loss', '< 1.0% product weight', '5.0% to 8.5% shrinkage loss'],
        ['Cooked Food Shelf Life', '5 to 7 Days fresh storage', '1 to 2 Days maximum'],
        ['Reheating Flavor & Texture', 'Original texture & aroma locked', 'Mushy texture, watery taste'],
      ],
    },
    faqs: [
      {
        q: 'Which businesses in Nepal benefit most from a blast chiller?',
        a: 'Party palaces, central banquet kitchens, artisanal ice cream makers, bakeries, and cloud kitchens that prepare curries, gravies, meat, or desserts in large batches.',
      },
    ],
    sections: [
      {
        heading: 'The Physics of Micro-Crystal Freezing',
        paragraphs: [
          "When food cools slowly in a regular freezer, water molecules have time to aggregate into large, jagged ice needles. These needles puncture cellular membranes. When thawed, the cell fluid leaks out as 'drip loss' — leaving meat dry and vegetables limp.",
          "Blast chilling flash-freezes water molecules into rounded microscopic crystals that remain inside cell walls, preserving authentic juiciness and texture.",
        ],
      },
    ],
  },
];

// ---------------- Helpers ----------------

function estimateReadingTime(post) {
  const text = [
    post.title,
    post.excerpt,
    post.aiSummary?.keyTakeaway,
    ...post.sections.flatMap((s) => [s.heading, ...(s.paragraphs || []), ...(s.list || [])]),
  ]
    .filter(Boolean)
    .join(' ');
  const words = text.trim().split(/\s+/).length;
  return Math.max(3, Math.round(words / 190));
}

export const BLOG_POSTS = rawPosts.map((p) => ({ ...p, readingTime: estimateReadingTime(p) }));

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getLatestPosts(count = 3) {
  return [...BLOG_POSTS].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, count);
}

export function getRelatedPosts(post, count = 2) {
  const sameTag = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t))
  );
  if (sameTag.length >= count) return sameTag.slice(0, count);
  const rest = BLOG_POSTS.filter((p) => !sameTag.includes(p) && p.slug !== post.slug);
  return [...sameTag, ...rest].slice(0, count);
}

export function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
