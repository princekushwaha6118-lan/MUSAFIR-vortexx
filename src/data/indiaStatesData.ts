import type { IndiaStateUT } from '../types.ts';

export const IMG = {
  taj: '/src/assets/images/india_taj_mahal_1794982487231.jpg',
  agraFort: '/src/assets/images/india_agra_fort_1794982487266.jpg',
  jaipur: '/src/assets/images/india_jaipur_hawa_1794982490936.jpg',
  goldenTemple: '/src/assets/images/india_golden_temple_1794982490078.jpg',
  kashiGhats: '/src/assets/images/india_kashi_ghats_1794982488101.jpg',
  kashiTemple: '/src/assets/images/india_kashi_temple_1794982488435.jpg',
  kedarnath: '/src/assets/images/india_kedarnath_temple_1794982489180.jpg',
  rishikesh: '/src/assets/images/india_rishikesh_ganga_1794982488813.jpg',
  hampi: '/src/assets/images/india_hampi_chariot_1794982490213.jpg',
  meenakshi: '/src/assets/images/india_meenakshi_temple_1794982490447.jpg',
  kashmirDal: '/src/assets/images/dest_kashmir_1794981286401.jpg',
  gulmarg: '/src/assets/images/kashmir_gulmarg_meadow_1794982493657.jpg',
  manali: '/src/assets/images/dest_manali_1794981285289.jpg',
  solang: '/src/assets/images/manali_solang_valley_1794982490917.jpg',
  kerala: '/src/assets/images/india_kerala_backwaters_1795148777682.jpg',
  ladakh: '/src/assets/images/india_ladakh_pangong_1795148777645.jpg',
  meghalaya: '/src/assets/images/india_meghalaya_falls_1795148777574.jpg',
  goa: '/src/assets/images/india_goa_coast_1795148777446.jpg',
  andaman: '/src/assets/images/india_andaman_beach_1795148777215.jpg',
  mumbai: '/src/assets/images/india_mumbai_gateway_1795148778309.jpg',
  konark: '/src/assets/images/india_konark_temple_1795148777565.jpg',
  thali: '/src/assets/images/india_regional_thali_1795148777327.jpg',
};

export const MAP_WIDTH = 640;
export const MAP_HEIGHT = 700;

export function projectIndiaPoint(lat: number, lon: number): { x: number; y: number } {
  const minLon = 67.6;
  const maxLon = 98.0;
  const minLat = 6.2;
  const maxLat = 37.6;
  const padX = 26;
  const padY = 24;
  const x = padX + ((lon - minLon) / (maxLon - minLon)) * (MAP_WIDTH - padX * 2);
  const y = padY + ((maxLat - lat) / (maxLat - minLat)) * (MAP_HEIGHT - padY * 2);
  return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
}

// Clockwise mainland outline in [lon, lat]
const INDIA_MAINLAND_COORDS: Array<[number, number]> = [
  [73.9, 36.9],
  [75.8, 36.6],
  [77.6, 35.6],
  [79.3, 34.4],
  [78.9, 32.9],
  [78.9, 31.6],
  [80.8, 30.3],
  [80.2, 29.0],
  [81.3, 28.2],
  [83.8, 27.4],
  [86.5, 26.6],
  [88.1, 26.8],
  [88.1, 27.9],
  [88.8, 28.0],
  [88.9, 27.1],
  [89.9, 26.8],
  [91.6, 26.9],
  [92.0, 27.8],
  [94.2, 29.0],
  [96.2, 29.3],
  [97.4, 28.2],
  [96.8, 27.2],
  [95.3, 26.8],
  [94.9, 25.6],
  [94.6, 24.3],
  [93.9, 23.8],
  [93.4, 22.0],
  [92.7, 22.1],
  [92.3, 23.7],
  [91.3, 23.2],
  [91.2, 24.1],
  [92.4, 25.1],
  [89.9, 25.2],
  [88.9, 26.2],
  [88.8, 25.0],
  [88.5, 24.0],
  [89.0, 22.6],
  [89.1, 21.6],
  [87.6, 21.5],
  [86.9, 20.7],
  [85.7, 19.7],
  [84.5, 18.8],
  [83.3, 17.7],
  [82.3, 16.9],
  [81.0, 15.8],
  [80.1, 14.9],
  [80.3, 13.1],
  [79.8, 11.9],
  [79.9, 10.3],
  [79.2, 9.3],
  [78.2, 8.8],
  [77.55, 8.08],
  [76.8, 8.5],
  [76.2, 9.9],
  [75.4, 11.8],
  [74.8, 12.9],
  [74.3, 14.6],
  [73.7, 15.5],
  [73.3, 16.9],
  [72.8, 19.0],
  [72.7, 20.4],
  [72.6, 21.7],
  [71.4, 20.8],
  [70.1, 21.0],
  [69.0, 22.2],
  [69.9, 22.8],
  [68.2, 23.6],
  [69.0, 24.3],
  [71.1, 24.6],
  [70.5, 26.8],
  [69.6, 27.6],
  [71.2, 28.4],
  [73.9, 30.2],
  [74.5, 31.6],
  [75.3, 32.3],
  [74.1, 33.1],
  [73.6, 34.4],
  [74.0, 35.8],
];

export const INDIA_MAINLAND_PATH =
  INDIA_MAINLAND_COORDS.map(([lon, lat], idx) => {
    const pt = projectIndiaPoint(lat, lon);
    return `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`;
  }).join(' ') + ' Z';

export const ANDAMAN_ISLAND_POINTS: Array<{ lat: number; lon: number; r: number }> = [
  { lat: 13.2, lon: 92.9, r: 4.5 },
  { lat: 12.3, lon: 92.8, r: 5 },
  { lat: 11.6, lon: 92.7, r: 4.5 },
  { lat: 10.6, lon: 92.5, r: 3.5 },
  { lat: 8.1, lon: 93.5, r: 3.5 },
  { lat: 7.0, lon: 93.8, r: 4 },
];

export const LAKSHADWEEP_ISLAND_POINTS: Array<{ lat: number; lon: number; r: number }> = [
  { lat: 11.4, lon: 72.7, r: 2.8 },
  { lat: 10.6, lon: 72.6, r: 3.2 },
  { lat: 10.1, lon: 73.0, r: 2.6 },
  { lat: 8.3, lon: 73.0, r: 2.8 },
];

export const INDIA_STATES_AND_UTS: IndiaStateUT[] = [
  /* ===================== 28 VERIFIED STATES ===================== */
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    kind: 'State',
    capital: 'Amaravati',
    region: 'South',
    lat: 16.51,
    lon: 80.52,
    bestSeason: 'October – March',
    languages: 'Telugu',
    startingBudgetInr: 4800,
    imageUrl: IMG.konark,
    imageTitle: 'Ancient Dravidian & Coastal Temple Heritage',
    imageCaption:
      'Sunlit stone temple pavilions and sacred hills across Tirumala, Lepakshi, and Araku Valley.',
    gallery: [
      {
        title: 'Heritage Temple Craftsmanship',
        imageUrl: IMG.konark,
        caption: 'Intricately carved stone pillars and temple courtyards across Andhra heritage circuits.',
      },
      {
        title: 'Coastal Bay Shoreline',
        imageUrl: IMG.goa,
        caption: 'Visakhapatnam’s Rushikonda beaches and Dolphin’s Nose coastal headlands.',
      },
      {
        title: 'Authentic Andhra Thali',
        imageUrl: IMG.thali,
        caption: 'Steaming rice served with fiery gongura pachadi, pappu, and tangy rasam.',
      },
    ],
    overview:
      'Stretching along the Bay of Bengal, Andhra Pradesh pairs sacred Tirupati temple hills with misty Araku coffee valleys, ancient Buddhist stupas, and bold coastal cuisine.',
    famousPlaces: [
      {
        name: 'Tirumala Venkateswara Temple',
        city: 'Tirupati',
        category: 'Sacred Temple',
        bestTime: 'Early Morning',
        description: 'One of India’s most revered hilltop shrines nestled across the seven green Seshachalam hills.',
      },
      {
        name: 'Araku Valley & Borra Caves',
        city: 'Visakhapatnam',
        category: 'Hills & Nature',
        bestTime: 'Oct – Feb',
        description: 'Tribal coffee plantations, glass-dome Vistadome train rides, and million-year-old limestone caverns.',
      },
      {
        name: 'Lepakshi Veerabhadra Temple',
        city: 'Anantapur',
        category: 'Heritage Architecture',
        bestTime: 'Morning',
        description: 'Famous 16th-century Vijayanagara temple celebrated for its gravity-defying hanging pillar and monolithic Nandi.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Gongura Pachadi & Pulihora',
        type: 'Vegetarian',
        description: 'Tangy sorrel-leaf chutney paired with spiced tamarind temple rice and roasted peanuts.',
      },
      {
        name: 'Pesarattu Dosa & Upma',
        type: 'Classic',
        description: 'Crisp green moong-dal crepe stuffed with ginger-spiced semolina upma.',
      },
      {
        name: 'Pootharekulu',
        type: 'Dessert',
        description: 'Paper-thin rice-starch wafer rolls layered with melted ghee, jaggery, and cardamom.',
      },
    ],
  },
  {
    id: 'arunachal-pradesh',
    name: 'Arunachal Pradesh',
    kind: 'State',
    capital: 'Itanagar',
    region: 'Northeast',
    lat: 27.1,
    lon: 93.62,
    bestSeason: 'October – April',
    languages: 'English, Nyishi, Hindi',
    startingBudgetInr: 7800,
    imageUrl: IMG.ladakh,
    imageTitle: 'High-Altitude Himalayan Passes & Monasteries',
    imageCaption:
      'Prayer flags fluttering above alpine lakes and snow-clad eastern Himalayan valleys near Tawang and Sela Pass.',
    gallery: [
      {
        title: 'Sela Pass Alpine Waters',
        imageUrl: IMG.ladakh,
        caption: 'High-altitude turquoise mountain lakes surrounded by Buddhist prayer flags and snowy ridges.',
      },
      {
        title: 'Subtropical Valley Cascades',
        imageUrl: IMG.meghalaya,
        caption: 'Emerald river gorges and bamboo-lined misty hills across Ziro and Mechuka.',
      },
      {
        title: 'Warm Himalayan Kitchen',
        imageUrl: IMG.thali,
        caption: 'Steamed momos, bamboo-shoot curries, and hearty noodle bowls served hot in mountain homestays.',
      },
    ],
    overview:
      'Known as the Land of the Dawn-Lit Mountains, Arunachal Pradesh is India’s easternmost Himalayan jewel of 400-year-old monasteries, Ziro pine valleys, and serene glacial passes.',
    famousPlaces: [
      {
        name: 'Tawang Monastery',
        city: 'Tawang',
        category: 'Monastery',
        bestTime: 'Mar – May, Oct',
        description: 'India’s largest Buddhist monastery perched at 10,000 ft overlooking misty Himalayan valleys.',
      },
      {
        name: 'Ziro Valley',
        city: 'Lower Subansiri',
        category: 'UNESCO Landscape',
        bestTime: 'Sep – Nov',
        description: 'Lush terraced paddy fields, pine forests, and welcoming Apatani tribal villages.',
      },
      {
        name: 'Sela Pass & Madhuri Lake',
        city: 'West Kameng',
        category: 'Mountain Pass',
        bestTime: 'Oct – Apr',
        description: 'Dramatic 13,700-foot snow pass framing crystal-clear alpine lakes and Tibetan prayer flags.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Thukpa & Steamed Momos',
        type: 'Classic',
        description: 'Hand-pulled Tibetan noodle soup with mountain herbs and spiced chili-garlic dip.',
      },
      {
        name: 'Bamboo Shoot Stir-Fry (Khorisa)',
        type: 'Vegetarian',
        description: 'Tender fermented bamboo shoots cooked with local hill greens and smoked spices.',
      },
      {
        name: 'Apong Rice Beverage & Pika Pila',
        type: 'Classic',
        description: 'Traditional roasted-millet pairing served alongside spicy pickled bamboo shoots.',
      },
    ],
  },
  {
    id: 'assam',
    name: 'Assam',
    kind: 'State',
    capital: 'Dispur',
    region: 'Northeast',
    lat: 26.14,
    lon: 91.79,
    bestSeason: 'November – April',
    languages: 'Assamese, Bodo',
    startingBudgetInr: 5800,
    imageUrl: IMG.meghalaya,
    imageTitle: 'Mighty Brahmaputra & Tea Garden Hills',
    imageCaption:
      'Verdant river valleys, misty wildlife sanctuaries, and terraced Assam tea estates bordering Kaziranga.',
    gallery: [
      {
        title: 'Misty Tea & River Valleys',
        imageUrl: IMG.meghalaya,
        caption: 'Lush green Assam hillsides, bamboo groves, and emerald river basins.',
      },
      {
        title: 'Kamakhya Heritage Hill',
        imageUrl: IMG.kashiTemple,
        caption: 'Ancient stone temple architecture atop Nilachal Hill overlooking Guwahati.',
      },
      {
        title: 'Assamese Traditional Platter',
        imageUrl: IMG.thali,
        caption: 'Fragrant Joha rice served with masor tenga, aloo pitika, and khar.',
      },
    ],
    overview:
      'Cradled by the wide Brahmaputra river, Assam blends golden tea estates, the world’s largest river island Majuli, and one-horned rhinos roaming Kaziranga.',
    famousPlaces: [
      {
        name: 'Kaziranga National Park',
        city: 'Golaghat & Nagaon',
        category: 'UNESCO Wildlife',
        bestTime: 'Nov – Apr',
        description: 'Elephant-grass floodplains home to the world’s largest population of Indian one-horned rhinoceroses.',
      },
      {
        name: 'Majuli River Island',
        city: 'Jorhat',
        category: 'Cultural Island',
        bestTime: 'Oct – Mar',
        description: 'Serene Brahmaputra river island celebrated for centuries-old Satra monasteries and mask-making art.',
      },
      {
        name: 'Kamakhya Temple',
        city: 'Guwahati',
        category: 'Sacred Temple',
        bestTime: 'Morning',
        description: 'Historic hilltop Shakti Peetha shrine overlooking the sweeping Brahmaputra river.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Masor Tenga',
        type: 'Seafood',
        description: 'Light, tangy river-fish curry simmered with elephant apple (ou tenga) and fresh tomatoes.',
      },
      {
        name: 'Khar & Aloo Pitika',
        type: 'Vegetarian',
        description: 'Signature alkaline papaya starter paired with comforting mustard-oil mashed potatoes.',
      },
      {
        name: 'Assam Orthodox Tea & Pitha',
        type: 'Dessert',
        description: 'Malty single-estate tea served alongside sesame-and-jaggery stuffed rice cakes.',
      },
    ],
  },
  {
    id: 'bihar',
    name: 'Bihar',
    kind: 'State',
    capital: 'Patna',
    region: 'East',
    lat: 25.59,
    lon: 85.14,
    bestSeason: 'October – March',
    languages: 'Hindi, Bhojpuri, Maithili',
    startingBudgetInr: 3400,
    imageUrl: IMG.kashiGhats,
    imageTitle: 'Ancient Ganga Riverfronts & Bodh Gaya Heritage',
    imageCaption:
      'Timeless riverside stone steps, ancient university ruins, and peaceful Buddhist shrines along the Gangetic plains.',
    gallery: [
      {
        title: 'Sacred Gangetic Riverfront',
        imageUrl: IMG.kashiGhats,
        caption: 'Evening lamps and quiet stone ghats echoing centuries of Magadha and Mithila heritage.',
      },
      {
        title: 'Ancient Carved Sanctuary',
        imageUrl: IMG.kashiTemple,
        caption: 'Historic stone shrines and peaceful meditation gardens across Bodh Gaya and Rajgir.',
      },
      {
        title: 'Bihari Litti & Classic Feast',
        imageUrl: IMG.thali,
        caption: 'Charcoal-roasted sattu-stuffed litti served with smoky brinjal chokha and ghee.',
      },
    ],
    overview:
      'The cradle of Buddhism, Jainism, and ancient Mauryan empires—Bihar invites travelers to meditate beneath the Mahabodhi Tree, walk Nalanda’s ruins, and savor authentic Litti Chokha.',
    famousPlaces: [
      {
        name: 'Mahabodhi Temple Complex',
        city: 'Bodh Gaya',
        category: 'UNESCO Sacred Site',
        bestTime: 'Dawn & Dusk',
        description: 'Sacred shrine where Siddhartha Gautama attained enlightenment under the descendant Bodhi Tree.',
      },
      {
        name: 'Nalanda Mahavihara Ruins',
        city: 'Nalanda',
        category: 'UNESCO Heritage',
        bestTime: 'Oct – Mar',
        description: 'Vast red-brick remains of the 5th-century residential university that drew scholars across Asia.',
      },
      {
        name: 'Rajgir Vishwa Shanti Stupa',
        city: 'Rajgir',
        category: 'Hills & Heritage',
        bestTime: 'Morning',
        description: 'Marble peace pagoda atop Ratnagiri Hill accessible by scenic chairlift over green valleys.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Litti Chokha',
        type: 'Vegetarian',
        description: 'Whole-wheat spheres stuffed with spiced roasted gram flour (sattu), dipped in ghee with smoky eggplant mash.',
      },
      {
        name: 'Champaran Handi Curry',
        type: 'Classic',
        description: 'Slow-cooked earthen pot delicacy sealed with dough and whole aromatic spices.',
      },
      {
        name: 'Thekua & Khaja',
        type: 'Dessert',
        description: 'Crisp cardamom-jaggery wheat biscuits and flaky layered Silao pastries.',
      },
    ],
  },
  {
    id: 'chhattisgarh',
    name: 'Chhattisgarh',
    kind: 'State',
    capital: 'Raipur',
    region: 'Central',
    lat: 21.25,
    lon: 81.63,
    bestSeason: 'October – March',
    languages: 'Hindi, Chhattisgarhi',
    startingBudgetInr: 4200,
    imageUrl: IMG.meghalaya,
    imageTitle: 'Chitrakote Waterfalls & Bastar Forest Valleys',
    imageCaption:
      'Wide horseshoe cascades, limestone caves, and ancient terracotta craft villages nestled inside lush central forests.',
    gallery: [
      {
        title: 'Chitrakote & Forest Cascades',
        imageUrl: IMG.meghalaya,
        caption: 'India’s widest horseshoe waterfall roaring through verdant Bastar sandstone cliffs.',
      },
      {
        title: 'Sirpur Stone Heritage',
        imageUrl: IMG.konark,
        caption: 'Intricately sculpted ancient brick and sandstone temples along the Mahanadi basin.',
      },
      {
        title: 'Central Indian Rice Thali',
        imageUrl: IMG.thali,
        caption: 'Warm steamed rice-flour faraa, chana samosa, and earthy tribal forest greens.',
      },
    ],
    overview:
      'Known as India’s Rice Bowl, Chhattisgarh hides dramatic waterfalls like Chitrakote, ancient brick temples in Sirpur, and vibrant bell-metal Dhokra artisans in Bastar.',
    famousPlaces: [
      {
        name: 'Chitrakote Falls',
        city: 'Jagdalpur (Bastar)',
        category: 'Waterfall',
        bestTime: 'Jul – Feb',
        description: 'Often called the Niagara of India—a 985-foot wide Indravati river cascade framed by misty cliffs.',
      },
      {
        name: 'Kanger Valley National Park',
        city: 'Bastar',
        category: 'Caves & Wildlife',
        bestTime: 'Nov – Mar',
        description: 'Lush sal forests hiding Tirathgarh waterfall and subterranean Kutumsar limestone caves.',
      },
      {
        name: 'Bhoramdeo & Sirpur Temples',
        city: 'Kawardha & Mahasamund',
        category: 'Ancient Temples',
        bestTime: 'Morning',
        description: '11th-century carved stone temples beside serene forested lakes.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Chila & Faraa',
        type: 'Vegetarian',
        description: 'Steamed rice-flour dumplings tempered with sesame seeds and green chilies, served with tomato chutney.',
      },
      {
        name: 'Bafauri & Dubki Kadhi',
        type: 'Vegetarian',
        description: 'Oil-free steamed chana-dal dumplings and comforting spiced yogurt-lentil curry.',
      },
      {
        name: 'Dehrori',
        type: 'Dessert',
        description: 'Golden fermented-rice dumplings soaked in fragrant rose-cardamom sugar syrup.',
      },
    ],
  },
  {
    id: 'goa',
    name: 'Goa',
    kind: 'State',
    capital: 'Panaji',
    region: 'West',
    lat: 15.49,
    lon: 73.83,
    bestSeason: 'November – February',
    languages: 'Konkani, English, Marathi',
    startingBudgetInr: 5900,
    imageUrl: IMG.goa,
    imageTitle: 'Palm-Lined Golden Beaches & Laterite Forts',
    imageCaption:
      'Sunset waves curling beneath red laterite Aguada fort walls and swaying coconut groves in coastal Goa.',
    gallery: [
      {
        title: 'South Goa Palm Cove & Fort',
        imageUrl: IMG.goa,
        caption: 'Warm Arabian Sea sunset views from historic Portuguese-era laterite sea ramparts.',
      },
      {
        title: 'Spice Plantation & Backwaters',
        imageUrl: IMG.kerala,
        caption: 'Quiet emerald Mandovi tributaries and tropical spice estates inland from the coast.',
      },
      {
        title: 'Konkan Coastal Feast',
        imageUrl: IMG.thali,
        caption: 'Fresh coconut-tamarind fish curry, crisp rava-fried catch, and warm bebinca.',
      },
    ],
    overview:
      'Far beyond lively northern beaches, Goa charms travelers with pastel Fontainhas lanes, UNESCO Old Goa basilicas, quiet southern coves, and rich Konkani-Portuguese flavors.',
    famousPlaces: [
      {
        name: 'Fort Aguada & Chapora',
        city: 'North Goa',
        category: 'Coastal Fort',
        bestTime: 'Sunset (5:00 PM)',
        description: '17th-century red laterite sea fort overlooking the confluence of the Mandovi river and Arabian Sea.',
      },
      {
        name: 'Basilica of Bom Jesus & Fontainhas',
        city: 'Old Goa & Panaji',
        category: 'UNESCO Heritage',
        bestTime: 'Morning',
        description: 'Baroque churches and sunlit yellow-and-indigo heritage houses in India’s Latin Quarter.',
      },
      {
        name: 'Palolem & Dudhsagar Falls',
        city: 'South Goa',
        category: 'Beach & Waterfall',
        bestTime: 'Nov – Feb',
        description: 'Crescent palm-fringed bay paired with a towering four-tiered white waterfall in Bhagwan Mahaveer reserve.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Goan Fish Curry & Red Rice (Xit Kodi)',
        type: 'Seafood',
        description: 'Velvety roasted-coconut and kokum curry served over nutty unpolished Goan rice.',
      },
      {
        name: 'Prawn Balchão & Ros Omelette',
        type: 'Street Food',
        description: 'Fluffy evening omelette ladled with rich spiced coconut xacuti gravy and crusty poi bread.',
      },
      {
        name: 'Bebinca',
        type: 'Dessert',
        description: 'Iconic seven-to-sixteen layer caramelized coconut-milk and nutmeg pudding.',
      },
    ],
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    kind: 'State',
    capital: 'Gandhinagar',
    region: 'West',
    lat: 23.22,
    lon: 72.64,
    bestSeason: 'November – February',
    languages: 'Gujarati, Hindi',
    startingBudgetInr: 4900,
    imageUrl: IMG.jaipur,
    imageTitle: 'Intricate Stepwells, White Rann & Royal Palaces',
    imageCaption:
      'Carved sandstone heritage architecture, sunlit pol lanes of Ahmedabad, and the salt desert of Kutch.',
    gallery: [
      {
        title: 'Sandstone Heritage Architecture',
        imageUrl: IMG.jaipur,
        caption: 'Elaborate latticework facades and royal courtyards across Ahmedabad and Vadodara.',
      },
      {
        title: 'Somnath & Coastal Shores',
        imageUrl: IMG.goa,
        caption: 'Sacred Arabian Sea shore temples and calm coastal promenades of Saurashtra.',
      },
      {
        title: 'Traditional Gujarati Farsan Thali',
        imageUrl: IMG.thali,
        caption: 'Sweet-and-savory platter with dhokla, undhiyu, kadhi, phulka, and kesar shrikhand.',
      },
    ],
    overview:
      'From the shimmering white salt flats of Kutch and Asiatic lions of Gir to UNESCO Rani ki Vav stepwells and India’s most joyful vegetarian cuisine.',
    famousPlaces: [
      {
        name: 'Rann of Kutch',
        city: 'Dhordo, Kutch',
        category: 'Salt Desert',
        bestTime: 'Nov – Feb (Full Moon)',
        description: 'Surreal horizon of crisp white salt marshes glowing silver under winter moonlight.',
      },
      {
        name: 'Gir National Park',
        city: 'Junagadh',
        category: 'Wildlife Sanctuary',
        bestTime: 'Dec – Mar',
        description: 'The world’s only natural habitat of the majestic Asiatic lion amidst dry deciduous teak hills.',
      },
      {
        name: 'Rani ki Vav & Statue of Unity',
        city: 'Patan & Kevadia',
        category: 'UNESCO & Landmark',
        bestTime: 'Morning',
        description: '11th-century inverted seven-story subterranean stepwell paired with the monumental Narmada valley memorial.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Khaman Dhokla & Khandvi',
        type: 'Street Food',
        description: 'Fluffy steamed chickpea-flour squares and delicate rolled savory ribbons tempered with mustard seeds.',
      },
      {
        name: 'Undhiyu & Kathiawadi Thali',
        type: 'Vegetarian',
        description: 'Slow-cooked winter vegetable medley with muthiya dumplings, bajra rotla, and jaggery.',
      },
      {
        name: 'Fafda Jalebi',
        type: 'Street Food',
        description: 'Crisp peppery gram-flour strips paired with warm saffron-soaked spiral jalebis.',
      },
    ],
  },
  {
    id: 'haryana',
    name: 'Haryana',
    kind: 'State',
    capital: 'Chandigarh',
    region: 'North',
    lat: 29.06,
    lon: 76.09,
    bestSeason: 'October – March',
    languages: 'Hindi, Haryanvi',
    startingBudgetInr: 2999,
    imageUrl: IMG.agraFort,
    imageTitle: 'Kurukshetra Heritage & Aravalli Eco-Retreats',
    imageCaption:
      'Historic sandstone monuments, sacred Brahmsarovar pools, and rustic highway dhabas across Haryana.',
    gallery: [
      {
        title: 'Heritage Fort & Courtyards',
        imageUrl: IMG.agraFort,
        caption: 'Red sandstone Mughal and Rajput forts surrounding Pinjore Gardens and Panipat.',
      },
      {
        title: 'Morni Hills Pine Trails',
        imageUrl: IMG.manali,
        caption: 'Shivalik foothill lakes and breezy pine viewpoints just outside Panchkula.',
      },
      {
        title: 'Hearty Haryanvi Thali',
        imageUrl: IMG.thali,
        caption: 'Bajra khichdi with white butter, kadhi pakora, and tall glasses of sweet lassi.',
      },
    ],
    overview:
      'Steeped in Mahabharata history at Kurukshetra, Haryana blends serene Sultanpur bird wetlands, Pinjore Mughal terraces, and famously generous farm-fresh dhaba hospitality.',
    famousPlaces: [
      {
        name: 'Brahma Sarovar',
        city: 'Kurukshetra',
        category: 'Sacred Heritage',
        bestTime: 'Sunrise / Sunset',
        description: 'Vast tranquil temple-lined water tank revered across ancient Indian epics.',
      },
      {
        name: 'Sultanpur National Park',
        city: 'Gurugram',
        category: 'Bird Sanctuary',
        bestTime: 'Nov – Feb',
        description: 'Peaceful winter wetland welcoming over 250 migratory bird species along wooden watchtowers.',
      },
      {
        name: 'Yadavindra (Pinjore) Gardens',
        city: 'Panchkula',
        category: 'Mughal Garden',
        bestTime: 'Afternoon',
        description: 'Seven-tiered cascading fountain gardens dating back to the 17th century at the foot of Morni Hills.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Bajra Aloo Roti & Kachri Chutney',
        type: 'Vegetarian',
        description: 'Earthy pearl-millet flatbreads slathered in fresh churned white makkhan and tangy wild-melon chutney.',
      },
      {
        name: 'Kadhi Pakora & Besan Masala Roti',
        type: 'Classic',
        description: 'Slow-simmered gram-flour yogurt curry served with spiced wheat-gram rotis.',
      },
      {
        name: 'Churma & Malpua',
        type: 'Dessert',
        description: 'Coarsely crushed warm wheat sweet blended with pure desi ghee, cardamom, and jaggery.',
      },
    ],
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    kind: 'State',
    capital: 'Shimla',
    region: 'North',
    lat: 31.1,
    lon: 77.17,
    bestSeason: 'March – June, Oct – Dec',
    languages: 'Hindi, Pahari',
    startingBudgetInr: 4900,
    imageUrl: IMG.manali,
    imageTitle: 'Deodar Cedar Forests & Beas Mountain Streams',
    imageCaption:
      'Sun-dappled pine trails, snow-capped Pir Panjal ridges, and tranquil riverside villages across Manali, Shimla, and Spiti.',
    gallery: [
      {
        title: 'Manali Pine River Trail',
        imageUrl: IMG.manali,
        caption: 'Rushing snowmelt streams curving through tall deodar forests in Old Manali.',
      },
      {
        title: 'Solang Alpine Meadows',
        imageUrl: IMG.solang,
        caption: 'Open mountain pastures framed by dramatic snowy peaks and drifting clouds.',
      },
      {
        title: 'Himachali Dham Feast',
        imageUrl: IMG.thali,
        caption: 'Slow-cooked rajma madra, chana dal, and sweet saffron mittha served on leaf platters.',
      },
    ],
    overview:
      'From colonial-era Shimla ridge walks and Dharamshala monasteries to Manali cedar valleys and Spiti’s moonscape deserts, Himachal is India’s quintessential mountain sanctuary.',
    famousPlaces: [
      {
        name: 'Solang Valley & Rohtang Corridor',
        city: 'Manali',
        category: 'Alpine Valley',
        bestTime: 'Mar – Jun',
        description: 'Sweeping green meadows, paragliding slopes, and Atal Tunnel snow panoramas.',
      },
      {
        name: 'Key Monastery & Spiti Valley',
        city: 'Kaza',
        category: 'High-Altitude Monastery',
        bestTime: 'Jun – Sep',
        description: 'Thousand-year-old whitewashed Tibetan monastery perched dramatically above the Spiti river.',
      },
      {
        name: 'The Ridge & Jakhu Temple',
        city: 'Shimla',
        category: 'Hill Station',
        bestTime: 'Morning',
        description: 'Pedestrian-only mountain promenade lined with deodar pines and Himalayan views.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Kangri Dham & Chana Madra',
        type: 'Vegetarian',
        description: 'Festive yogurt-and-cardamom chickpea curry cooked slowly with ghee and dry fruits.',
      },
      {
        name: 'Siddu with Walnut Chutney',
        type: 'Classic',
        description: 'Pillow-soft steamed wheat bun stuffed with spiced poppy seeds and walnuts, served with hot ghee.',
      },
      {
        name: 'Babru & Meetha Chawal',
        type: 'Dessert',
        description: 'Crisp black-gram stuffed kachori paired with fragrant saffron-raisin festive rice.',
      },
    ],
  },
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    kind: 'State',
    capital: 'Ranchi',
    region: 'East',
    lat: 23.34,
    lon: 85.31,
    bestSeason: 'October – March',
    languages: 'Hindi, Santali, Nagpuri',
    startingBudgetInr: 3499,
    imageUrl: IMG.meghalaya,
    imageTitle: 'Hundru Falls & Chota Nagpur Forest Plateaus',
    imageCaption:
      'Dramatic 300-foot jungle waterfalls, sacred Parasnath hills, and sal-forest plateaus across Jharkhand.',
    gallery: [
      {
        title: 'Hundru & Dassam Waterfalls',
        imageUrl: IMG.meghalaya,
        caption: 'Roaring Subarnarekha river cascades surrounded by dense Chota Nagpur greenery.',
      },
      {
        title: 'Baidyanath & Hill Shrines',
        imageUrl: IMG.kedarnath,
        caption: 'Sacred temple spires and tranquil pilgrimage hills across Deoghar and Parasnath.',
      },
      {
        title: 'Rustic Jharkhand Platter',
        imageUrl: IMG.thali,
        caption: 'Crisp golden dhuska pancakes served with spiced black-chickpea ghugni curry.',
      },
    ],
    overview:
      'Named the Land of Forests, Jharkhand surprises visitors with thundering plateau waterfalls around Ranchi, Betla tiger reserve, and sacred Parasnath hills.',
    famousPlaces: [
      {
        name: 'Hundru & Dassam Falls',
        city: 'Ranchi',
        category: 'Waterfalls',
        bestTime: 'Aug – Feb',
        description: 'Spectacular 320-foot waterfall carved into granite boulders amidst misty green hills.',
      },
      {
        name: 'Baidyanath Dham',
        city: 'Deoghar',
        category: 'Jyotirlinga Temple',
        bestTime: 'Oct – Mar',
        description: 'One of India’s twelve revered Jyotirlinga shrines attracting pilgrims year-round.',
      },
      {
        name: 'Betla National Park & Netarhat',
        city: 'Latehar',
        category: 'Hills & Wildlife',
        bestTime: 'Nov – Mar',
        description: 'Known as the Queen of Chota Nagpur for pine-scented sunrises and dense wildlife safaris.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Dhuska & Aloo-Chana Ghugni',
        type: 'Street Food',
        description: 'Deep-fried golden rice-and-lentil pancakes served piping hot with spiced black chickpea curry.',
      },
      {
        name: 'Litti, Pittha & Rugra Curry',
        type: 'Vegetarian',
        description: 'Steamed stuffed rice dumplings and seasonal forest-mushroom delicacies.',
      },
      {
        name: 'Thekua & Tilkut',
        type: 'Dessert',
        description: 'Crunchy sesame-jaggery winter sweets and traditional festive wheat crisps.',
      },
    ],
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    kind: 'State',
    capital: 'Bengaluru',
    region: 'South',
    lat: 12.97,
    lon: 77.59,
    bestSeason: 'October – March',
    languages: 'Kannada',
    startingBudgetInr: 5400,
    imageUrl: IMG.hampi,
    imageTitle: 'Hampi Stone Chariot & Royal Heritage Trails',
    imageCaption:
      '16th-century Vijayanagara granite chariot glowing in late afternoon sun amidst Hampi’s boulder landscape.',
    gallery: [
      {
        title: 'Vittala Stone Chariot, Hampi',
        imageUrl: IMG.hampi,
        caption: 'Iconic carved granite temple chariot standing amidst UNESCO Vijayanagara ruins.',
      },
      {
        title: 'Coorg & Gokarna Coast',
        imageUrl: IMG.kerala,
        caption: 'Misty Western Ghats coffee estates and tranquil coastal backwaters.',
      },
      {
        title: 'Mysore & Udupi Delicacies',
        imageUrl: IMG.thali,
        caption: 'Crisp ghee benne dosa, comforting bisi bele bath, and melt-in-mouth Mysore Pak.',
      },
    ],
    overview:
      'Karnataka spans royal Mysore palaces, UNESCO boulder ruins of Hampi, misty Coorg coffee hills, Kabini wildlife, and the vibrant garden cafes of Bengaluru.',
    famousPlaces: [
      {
        name: 'Hampi Group of Monuments',
        city: 'Vijayanagara',
        category: 'UNESCO Heritage',
        bestTime: 'Sunrise / Sunset',
        description: 'Sprawling ancient temple capital featuring the Vittala Stone Chariot and Tungabhadra river coracles.',
      },
      {
        name: 'Mysore Palace (Amba Vilas)',
        city: 'Mysuru',
        category: 'Royal Palace',
        bestTime: 'Sunday Evening Lights',
        description: 'Indo-Saracenic royal palace illuminated by nearly 100,000 golden bulbs after dusk.',
      },
      {
        name: 'Coorg Coffee Estates & Abbey Falls',
        city: 'Madikeri',
        category: 'Hill Station',
        bestTime: 'Oct – Apr',
        description: 'Mist-draped Western Ghats hills fragrant with cardamom, pepper, and shade-grown Arabica coffee.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Benne Masala Dosa & Filter Kaapi',
        type: 'Classic',
        description: 'Golden butter-roasted crisp dosa served with coconut chutney and frothy brass-tumbler coffee.',
      },
      {
        name: 'Bisi Bele Bath',
        type: 'Vegetarian',
        description: 'Aromatic slow-simmered lentil-and-rice dish spiced with cinnamon, tamarind, and roasted cashews.',
      },
      {
        name: 'Mysore Pak',
        type: 'Dessert',
        description: 'Royal gram-flour and pure ghee fudge invented in the kitchens of Mysore Palace.',
      },
    ],
  },
  {
    id: 'kerala',
    name: 'Kerala',
    kind: 'State',
    capital: 'Thiruvananthapuram',
    region: 'South',
    lat: 8.52,
    lon: 76.94,
    bestSeason: 'September – March',
    languages: 'Malayalam',
    startingBudgetInr: 6500,
    imageUrl: IMG.kerala,
    imageTitle: 'Alleppey Backwaters & Coconut-Lined Canals',
    imageCaption:
      'Traditional wooden kettuvallam houseboat gliding peacefully through Kerala’s palm-fringed backwaters at golden hour.',
    gallery: [
      {
        title: 'Alleppey Houseboat Canals',
        imageUrl: IMG.kerala,
        caption: 'Mirror-still emerald waterways lined with swaying coconut palms and quiet village piers.',
      },
      {
        title: 'Munnar Tea Hills',
        imageUrl: IMG.meghalaya,
        caption: 'Rolling cloud-kissed tea terraces and misty shola waterfalls in the Western Ghats.',
      },
      {
        title: 'Kerala Sadya & Appam',
        imageUrl: IMG.thali,
        caption: 'Lacy fermented rice appams with coconut vegetable stew and sweet palada payasam.',
      },
    ],
    overview:
      'Celebrated as God’s Own Country, Kerala offers gentle houseboat cruises in Alleppey, cool tea plantations in Munnar, Fort Kochi spice streets, and soothing Ayurveda.',
    famousPlaces: [
      {
        name: 'Alleppey & Kumarakom Backwaters',
        city: 'Alappuzha',
        category: 'Backwaters',
        bestTime: 'Nov – Feb',
        description: 'Overnight wooden houseboats drifting past paddy fields, village shrines, and coconut lagoons.',
      },
      {
        name: 'Munnar Tea Plantations',
        city: 'Idukki',
        category: 'Hill Station',
        bestTime: 'Sep – Mar',
        description: 'Sculpted emerald tea gardens at 5,200 ft overlooking Eravikulam’s Nilgiri tahr cliffs.',
      },
      {
        name: 'Fort Kochi Chinese Fishing Nets',
        city: 'Kochi',
        category: 'Coastal Heritage',
        bestTime: 'Sunset',
        description: 'Historic spice-trade harbor blending Dutch, Portuguese, and Malabar architecture.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Appam & Coconut Vegetable / Malabar Stew',
        type: 'Classic',
        description: 'Soft-centered lacy rice hoppers paired with fragrant cardamom-coconut milk stew.',
      },
      {
        name: 'Kerala Sadya & Avial',
        type: 'Vegetarian',
        description: 'Traditional banana-leaf feast featuring sambar, avial, olan, crisp banana chips, and parippu.',
      },
      {
        name: 'Karimeen Pollichathu & Palada Payasam',
        type: 'Seafood',
        description: 'Pearl-spot fish marinated in shallots and black pepper, steamed in fragrant banana leaf.',
      },
    ],
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    kind: 'State',
    capital: 'Bhopal',
    region: 'Central',
    lat: 23.26,
    lon: 77.41,
    bestSeason: 'October – March',
    languages: 'Hindi',
    startingBudgetInr: 4600,
    imageUrl: IMG.konark,
    imageTitle: 'Khajuraho Temples, Sanchi Stupa & Tiger Reserves',
    imageCaption:
      'Finely sculpted 10th-century sandstone temples, ancient Buddhist domes, and dense central Indian jungles.',
    gallery: [
      {
        title: 'Khajuraho Sandstone Sculptures',
        imageUrl: IMG.konark,
        caption: 'UNESCO Nagara-style sandstone spires carved with extraordinary detail.',
      },
      {
        title: 'Orchha & Gwalior Forts',
        imageUrl: IMG.agraFort,
        caption: 'Monumental riverside palaces and red-sandstone citadel walls across Bundelkhand.',
      },
      {
        title: 'Indori Poha & Malwa Feast',
        imageUrl: IMG.thali,
        caption: 'Steaming jeeravan-spiced poha with crisp jalebi, dal bafla, and bhutte ka kees.',
      },
    ],
    overview:
      'The Heart of Incredible India—Madhya Pradesh unites UNESCO Khajuraho and Sanchi Stupa with Bandhavgarh and Kanha tiger forests, Ujjain Mahakaleshwar, and Indore’s legendary street food.',
    famousPlaces: [
      {
        name: 'Khajuraho Group of Monuments',
        city: 'Chhatarpur',
        category: 'UNESCO Heritage',
        bestTime: 'Oct – Mar',
        description: 'Masterpiece Chandela-dynasty sandstone temples rising gracefully from manicured gardens.',
      },
      {
        name: 'Sanchi Stupa & Ujjain Mahakaleshwar',
        city: 'Raisen & Ujjain',
        category: 'Sacred Heritage',
        bestTime: 'Morning',
        description: '2,200-year-old Mauryan stone dome and revered Jyotirlinga temple corridor along the Shipra river.',
      },
      {
        name: 'Kanha & Bandhavgarh Tiger Reserves',
        city: 'Mandla & Umaria',
        category: 'Wildlife Safari',
        bestTime: 'Nov – May',
        description: 'Golden sal forests and open meadows offering India’s premier Bengal tiger sightings.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Indori Poha & Jalebi',
        type: 'Street Food',
        description: 'Light flattened rice topped with fennel, pomegranate, crunchy Ratlami sev, and hot crispy jalebi.',
      },
      {
        name: 'Dal Bafla & Bhutte Ka Kees',
        type: 'Vegetarian',
        description: 'Boiled-then-baked wheat balls drenched in ghee beside spiced grated corn cooked in milk.',
      },
      {
        name: 'Mawa Bati',
        type: 'Dessert',
        description: 'Rich slow-reduced milk dumplings stuffed with pistachios and dipped in saffron syrup.',
      },
    ],
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    kind: 'State',
    capital: 'Mumbai',
    region: 'West',
    lat: 19.08,
    lon: 72.88,
    bestSeason: 'October – March',
    languages: 'Marathi, Hindi',
    startingBudgetInr: 5200,
    imageUrl: IMG.mumbai,
    imageTitle: 'Gateway of India & Sahyadri Monsoon Forts',
    imageCaption:
      'Golden hour over Mumbai’s iconic basalt Gateway of India harbor, linking coastal promenades with Ajanta-Ellora caves.',
    gallery: [
      {
        title: 'Gateway of India Harbor',
        imageUrl: IMG.mumbai,
        caption: 'Evening ferries gliding past Mumbai’s monumental waterfront arch and heritage hotels.',
      },
      {
        title: 'Ellora & Sahyadri Peaks',
        imageUrl: IMG.hampi,
        caption: 'Monolithic basalt rock-cut temples at Ellora and mist-wrapped Western Ghats hill forts.',
      },
      {
        title: 'Mumbai & Puneri Classics',
        imageUrl: IMG.thali,
        caption: 'Fiery misal pav, crispy vada pav, and sweet cardamom-nutmeg puran poli.',
      },
    ],
    overview:
      'From Mumbai’s art-deco seafront and UNESCO Ajanta-Ellora rock-cut caves to misty Lonavala valleys, Shirdi shrines, and the unspoiled Konkan coastline.',
    famousPlaces: [
      {
        name: 'Gateway of India & Marine Drive',
        city: 'Mumbai',
        category: 'Iconic Landmark',
        bestTime: 'Golden Hour',
        description: 'Historic basalt waterfront monument and sweeping Queen’s Necklace sea promenade.',
      },
      {
        name: 'Ajanta & Ellora Caves',
        city: 'Chhatrapati Sambhajinagar',
        category: 'UNESCO Caves',
        bestTime: 'Nov – Feb',
        description: 'Extraordinary monolithic Kailasa temple carved top-down from a single basalt mountain.',
      },
      {
        name: 'Mahabaleshwar & Lonavala Sahyadris',
        city: 'Satara & Pune',
        category: 'Hill Retreat',
        bestTime: 'Jul – Feb',
        description: 'Strawberry plateaus, valley viewpoints, and ancient Maratha hill forts.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Vada Pav & Misal Pav',
        type: 'Street Food',
        description: 'Spiced potato fritter inside soft ladi pav with dry garlic chutney, plus crunchy sprouted-lentil misal.',
      },
      {
        name: 'Puran Poli',
        type: 'Dessert',
        description: 'Warm ghee-brushed flatbread stuffed with sweet chana dal, jaggery, and nutmeg.',
      },
      {
        name: 'Malvani Fish Curry & Solkadhi',
        type: 'Seafood',
        description: 'Coastal spiced coconut gravy balanced with cooling pink kokum-coconut solkadhi.',
      },
    ],
  },
  {
    id: 'manipur',
    name: 'Manipur',
    kind: 'State',
    capital: 'Imphal',
    region: 'Northeast',
    lat: 24.82,
    lon: 93.94,
    bestSeason: 'October – March',
    languages: 'Meiteilon (Manipuri)',
    startingBudgetInr: 6400,
    imageUrl: IMG.meghalaya,
    imageTitle: 'Loktak Floating Lake & Emerald Hills',
    imageCaption:
      'Misty valley waters, floating phumdi islands of Keibul Lamjao, and serene Himalayan foothills.',
    gallery: [
      {
        title: 'Loktak & Shirui Hills',
        imageUrl: IMG.meghalaya,
        caption: 'Lush green hills cradling Loktak, Northeast India’s largest freshwater lake.',
      },
      {
        title: 'Kangla & Valley Temples',
        imageUrl: IMG.kashiTemple,
        caption: 'Ancient royal citadels and graceful classical Ras Lila heritage centers in Imphal.',
      },
      {
        title: 'Manipuri Traditional Meal',
        imageUrl: IMG.thali,
        caption: 'Fragrant black chak-hao rice, eromba chili-vegetable mash, and singju salad.',
      },
    ],
    overview:
      'Known as the Jeweled Land, Manipur dazzles with Loktak Lake’s floating circular phumdis, the endangered Sangai deer, and Imphal’s all-women Ima Keithel market.',
    famousPlaces: [
      {
        name: 'Loktak Lake & Keibul Lamjao',
        city: 'Bishnupur',
        category: 'Floating National Park',
        bestTime: 'Nov – Mar',
        description: 'The world’s only floating national park, home to the graceful brow-antlered Sangai deer.',
      },
      {
        name: 'Kangla Fort & Ima Keithel',
        city: 'Imphal',
        category: 'Cultural Landmark',
        bestTime: 'Morning',
        description: 'Historic royal citadel and the world’s largest all-women-run traditional handloom & produce market.',
      },
      {
        name: 'Dzukou & Shirui Hills',
        city: 'Ukhrul',
        category: 'Highland Meadows',
        bestTime: 'May – Jun, Oct',
        description: 'Rolling mountain valleys famed for rare seasonal pink Shirui lilies.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Eromba & Singju',
        type: 'Classic',
        description: 'Boiled seasonal vegetables mashed with roasted fermented flavors and fiery King chili, paired with lotus-stem salad.',
      },
      {
        name: 'Kangsoi Vegetable Stew',
        type: 'Vegetarian',
        description: 'Clear, comforting mountain herb-and-root stew flavored with ginger and roasted greens.',
      },
      {
        name: 'Chak-Hao Kheer',
        type: 'Dessert',
        description: 'Rich nutty purple-black sticky rice pudding simmered slowly with milk and cardamom.',
      },
    ],
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    kind: 'State',
    capital: 'Shillong',
    region: 'Northeast',
    lat: 25.58,
    lon: 91.89,
    bestSeason: 'October – May',
    languages: 'Khasi, Garo, English',
    startingBudgetInr: 6800,
    imageUrl: IMG.meghalaya,
    imageTitle: 'Nohkalikai Falls & Cloud-Wrapped Khasi Hills',
    imageCaption:
      'Emerald canyons, living root bridges, and cascading turquoise plunge pools in Sohra (Cherrapunji), Meghalaya.',
    gallery: [
      {
        title: 'Nohkalikai Waterfall, Sohra',
        imageUrl: IMG.meghalaya,
        caption: 'India’s tallest plunge waterfall dropping into a surreal emerald pool beneath drifting mist.',
      },
      {
        title: 'Shillong Pine Valleys',
        imageUrl: IMG.manali,
        caption: 'Rolling pine hills, Laitlum canyons, and crystal-clear Dawki river waters.',
      },
      {
        title: 'Khasi Jadoh & Smoked Platter',
        imageUrl: IMG.thali,
        caption: 'Fragrant turmeric-tinted red rice cooked with mountain herbs and roasted black sesame.',
      },
    ],
    overview:
      'The Abode of Clouds enchants every traveler with centuries-old living rubber-fig root bridges, transparent boats floating on the Umngot river in Dawki, and Shillong’s music cafes.',
    famousPlaces: [
      {
        name: 'Double Decker Living Root Bridge',
        city: 'Nongriat, Sohra',
        category: 'Bio-Engineering Wonder',
        bestTime: 'Oct – Apr',
        description: 'Ancient Khasi bridges hand-guided over generations from living aerial roots of rubber fig trees.',
      },
      {
        name: 'Dawki Umngot River & Mawlynnong',
        city: 'West Jaintia & East Khasi',
        category: 'River & Eco Village',
        bestTime: 'Nov – Mar',
        description: 'Glass-clear river water where wooden boats appear suspended in air, beside Asia’s cleanest village.',
      },
      {
        name: 'Nohkalikai Falls & Laitlum Canyons',
        city: 'Cherrapunji & Shillong',
        category: 'Waterfall & Gorge',
        bestTime: 'Morning',
        description: 'Breathtaking misty canyon overlooks and dramatic cliffside waterfalls.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Jadoh & Dohneiiong',
        type: 'Classic',
        description: 'Aromatic spiced Khasi rice dish served alongside rich black-sesame mountain curry.',
      },
      {
        name: 'Pukhlein & Tungrymbai',
        type: 'Vegetarian',
        description: 'Sweet crispy rice-jaggery cakes and nutty fermented soybean stir-fry with ginger.',
      },
      {
        name: 'Sohiong Berry Tea & Pumaloi',
        type: 'Dessert',
        description: 'Steamed local hill-rice cakes paired with tangy wild Khasi blackberry preserves.',
      },
    ],
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    kind: 'State',
    capital: 'Aizawl',
    region: 'Northeast',
    lat: 23.73,
    lon: 92.72,
    bestSeason: 'November – March',
    languages: 'Mizo, English',
    startingBudgetInr: 6900,
    imageUrl: IMG.meghalaya,
    imageTitle: 'Vantawng Falls & Aizawl Ridges',
    imageCaption:
      'Terraced blue-green bamboo ridges, steep terraced Aizawl neighborhoods, and cascading waterfalls.',
    gallery: [
      {
        title: 'Vantawng Jungle Cascade',
        imageUrl: IMG.meghalaya,
        caption: 'Two-tiered 750-foot waterfall plunging through lush bamboo valleys near Thenzawl.',
      },
      {
        title: 'Reiek Cloud Mountain',
        imageUrl: IMG.manali,
        caption: 'Panoramic 360-degree mountain ridges overlooking mist-filled valleys and Bangladesh plains.',
      },
      {
        title: 'Mizo Bai & Bamboo Cuisine',
        imageUrl: IMG.thali,
        caption: 'Wholesome oil-free steamed greens, bamboo shoots, and aromatic sticky rice.',
      },
    ],
    overview:
      'Known as the Land of the Hill People, Mizoram welcomes visitors with spotless hillside streets in Aizawl, tranquil Phawngpui Blue Mountain trails, and warm community spirit.',
    famousPlaces: [
      {
        name: 'Vantawng Falls',
        city: 'Serchhip',
        category: 'Waterfall',
        bestTime: 'Oct – Feb',
        description: 'Mizoram’s highest and most scenic two-tier waterfall wrapped in emerald bamboo forest.',
      },
      {
        name: 'Reiek Tlang Heritage Village',
        city: 'Near Aizawl',
        category: 'Hilltop Viewpoint',
        bestTime: 'Morning',
        description: 'Scenic cliff ridge with traditional Mizo huts and sweeping views of rolling blue hills.',
      },
      {
        name: 'Phawngpui (Blue Mountain)',
        city: 'Lawngtlai',
        category: 'National Park',
        bestTime: 'Nov – Mar',
        description: 'Highest peak in Mizoram famous for orchids, rhododendrons, and misty cliff faces.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Bai (Steamed Herb & Bamboo Stew)',
        type: 'Vegetarian',
        description: 'Comforting oil-free Mizo vegetable broth simmered with fermented beans, bamboo shoots, and greens.',
      },
      {
        name: 'Misa Mach Poora & Sawhchiar',
        type: 'Classic',
        description: 'Grilled spiced river prawns alongside slow-cooked herb-and-rice porridge.',
      },
      {
        name: 'Chhum Han & Koat Pitha',
        type: 'Dessert',
        description: 'Crisp banana-and-rice flour fritters lightly sweetened with hill jaggery.',
      },
    ],
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
    kind: 'State',
    capital: 'Kohima',
    region: 'Northeast',
    lat: 25.67,
    lon: 94.11,
    bestSeason: 'November – April',
    languages: 'English, Nagamese',
    startingBudgetInr: 6900,
    imageUrl: IMG.meghalaya,
    imageTitle: 'Dzukou Valley & Kohima Hilltop Heritage',
    imageCaption:
      'Emerald bamboo-carpeted Dzukou hills, terraced Angami villages in Khonoma, and vibrant Hornbill traditions.',
    gallery: [
      {
        title: 'Dzukou Emerald Ridge',
        imageUrl: IMG.meghalaya,
        caption: 'Rolling velvet-green hills and crystal valley streams along the Kohima border.',
      },
      {
        title: 'Khonoma Green Village',
        imageUrl: IMG.solang,
        caption: 'Asia’s first green conservation village framed by terraced hillside rice fields.',
      },
      {
        title: 'Naga Axone & Bamboo Platter',
        imageUrl: IMG.thali,
        caption: 'Smoky mountain curries, raja mircha chili chutneys, and fragrant sticky rice.',
      },
    ],
    overview:
      'Home to 16 distinct warrior-artisan tribes, Nagaland captivates travelers with the legendary Hornbill Festival in Kisama, Asia’s first green village Khonoma, and Dzukou Valley.',
    famousPlaces: [
      {
        name: 'Dzukou Valley',
        city: 'Kohima',
        category: 'Trekking Valley',
        bestTime: 'Jun – Sep, Nov',
        description: 'Iconic emerald-carpeted highland valley bursting with wild Dzukou lilies and drifting mist.',
      },
      {
        name: 'Kisama Heritage Village & Kohima War Memorial',
        city: 'Kohima',
        category: 'Cultural Heritage',
        bestTime: 'Dec (Hornbill) / Winter',
        description: 'Living cultural amphitheater showcasing Naga morungs, folk music, and serene terraced memorials.',
      },
      {
        name: 'Khonoma Green Village',
        city: 'West Kohima',
        category: 'Eco Heritage',
        bestTime: 'Oct – Mar',
        description: '700-year-old Angami village celebrated for forest conservation and terraced farming.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Smoked Naga Curries with Bamboo Shoot',
        type: 'Classic',
        description: 'Slow-cooked savory curries infused with fermented bamboo shoots and fiery Raja Mircha chili.',
      },
      {
        name: 'Axone & Galho',
        type: 'Vegetarian',
        description: 'Hearty Naga rice-and-greens stew flavored with fermented soybean and mountain herbs.',
      },
      {
        name: 'Zutho & Nap Naang',
        type: 'Dessert',
        description: 'Sweet purple-black sticky rice pudding served warm with toasted sesame.',
      },
    ],
  },
  {
    id: 'odisha',
    name: 'Odisha',
    kind: 'State',
    capital: 'Bhubaneswar',
    region: 'East',
    lat: 20.29,
    lon: 85.82,
    bestSeason: 'October – March',
    languages: 'Odia',
    startingBudgetInr: 4500,
    imageUrl: IMG.konark,
    imageTitle: 'Konark Sun Temple Chariot Wheel',
    imageCaption:
      '13th-century carved sandstone wheel of the UNESCO Konark Sun Temple bathed in golden Odisha sunlight.',
    gallery: [
      {
        title: 'Konark Sun Temple, Puri District',
        imageUrl: IMG.konark,
        caption: 'Monumental 24-wheel stone chariot of Surya crafted in Kalinga sandstone.',
      },
      {
        title: 'Chilika & Puri Coastline',
        imageUrl: IMG.goa,
        caption: 'Asia’s largest brackish lagoon welcoming Irrawaddy dolphins and winter flamingos.',
      },
      {
        title: 'Odia Mahaprasad & Chhena Poda',
        imageUrl: IMG.thali,
        caption: 'Earthen-pot dalma, cooling pakhala bhata, and caramelized baked cheese dessert.',
      },
    ],
    overview:
      'India’s Soul of Incredible Heritage—Odisha combines the UNESCO Konark Sun Temple, Puri’s Jagannath Rath Yatra coast, Chilika dolphin lagoon, and delicate silver filigree.',
    famousPlaces: [
      {
        name: 'Konark Sun Temple',
        city: 'Konark',
        category: 'UNESCO Heritage',
        bestTime: 'Morning / Sunset',
        description: '13th-century stone temple designed as a colossal horse-drawn chariot of the Sun God.',
      },
      {
        name: 'Jagannath Temple & Golden Beach',
        city: 'Puri',
        category: 'Sacred & Coast',
        bestTime: 'Oct – Mar',
        description: 'Revered Char Dham coastal temple beside Blue Flag certified golden sand beaches.',
      },
      {
        name: 'Chilika Lake & Lingaraj Temple',
        city: 'Satapada & Bhubaneswar',
        category: 'Lagoon & Temple',
        bestTime: 'Nov – Feb',
        description: 'Vast migratory bird lagoon and 11th-century Kalinga sandstone temple spire.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Dalma & Pakhala Bhata',
        type: 'Vegetarian',
        description: 'Wholesome lentil-and-vegetable stew tempered with roasted cumin, plus cooling fermented rice.',
      },
      {
        name: 'Dahibara Aloodum',
        type: 'Street Food',
        description: 'Cuttack’s beloved yogurt-soaked lentil vadas topped with spiced potato curry and crisp sev.',
      },
      {
        name: 'Chhena Poda & Odia Rasagola',
        type: 'Dessert',
        description: 'Caramelized wood-fired cottage cheese cake speckled with cashews and green cardamom.',
      },
    ],
  },
  {
    id: 'punjab',
    name: 'Punjab',
    kind: 'State',
    capital: 'Chandigarh',
    region: 'North',
    lat: 31.63,
    lon: 74.87,
    bestSeason: 'October – March',
    languages: 'Punjabi, Hindi',
    startingBudgetInr: 4400,
    imageUrl: IMG.goldenTemple,
    imageTitle: 'Sri Harmandir Sahib (Golden Temple), Amritsar',
    imageCaption:
      'The shimmering gold-leaf sanctum reflected across the serene Amrit Sarovar pool in Amritsar.',
    gallery: [
      {
        title: 'Golden Temple Reflection',
        imageUrl: IMG.goldenTemple,
        caption: 'Peaceful marble walkways and live devotional hymns beside the Amrit Sarovar.',
      },
      {
        title: 'Virasat-e-Khalsa & Wagah',
        imageUrl: IMG.agraFort,
        caption: 'Iconic Punjabi heritage museums in Anandpur Sahib and vibrant border ceremonies.',
      },
      {
        title: 'Amritsari Kulcha & Punjabi Thali',
        imageUrl: IMG.thali,
        caption: 'Flaky tandoor-baked stuffed kulchas with butter, chole, sarson ka saag, and frothy lassi.',
      },
    ],
    overview:
      'Warm-hearted and deeply spiritual, Punjab welcomes every guest at the Golden Temple’s community langar, lively Amritsar heritage bazaars, and fertile green fields.',
    famousPlaces: [
      {
        name: 'Golden Temple (Sri Harmandir Sahib)',
        city: 'Amritsar',
        category: 'Sacred Shrine',
        bestTime: 'Dawn & Night',
        description: 'Holiest Sikh shrine welcoming all faiths with marble walkways and the world’s largest free community kitchen.',
      },
      {
        name: 'Jallianwala Bagh & Partition Museum',
        city: 'Amritsar',
        category: 'Historic Memorial',
        bestTime: 'Morning',
        description: 'Moving heritage gardens and meticulously curated independence history galleries.',
      },
      {
        name: 'Virasat-e-Khalsa',
        city: 'Anandpur Sahib',
        category: 'Architecture & Museum',
        bestTime: 'Morning',
        description: 'Striking curved sandstone-and-steel museum celebrating 500 years of Punjabi culture.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Amritsari Kulcha & Chole',
        type: 'Street Food',
        description: 'Crisp clay-oven flatbread stuffed with spiced potatoes, paneer, and pomegranate seeds, brushed with ghee.',
      },
      {
        name: 'Sarson Ka Saag & Makki Di Roti',
        type: 'Vegetarian',
        description: 'Winter mustard-green puree topped with white butter alongside golden cornmeal rotis.',
      },
      {
        name: 'Peda Lassi & Pinni',
        type: 'Dessert',
        description: 'Thick earthen-kulhad churned yogurt topped with malai, paired with toasted wheat-nut pinnis.',
      },
    ],
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    kind: 'State',
    capital: 'Jaipur',
    region: 'North',
    lat: 26.91,
    lon: 75.79,
    bestSeason: 'October – March',
    languages: 'Hindi, Rajasthani',
    startingBudgetInr: 4400,
    imageUrl: IMG.jaipur,
    imageTitle: 'Hawa Mahal & Pink City Sandstone Facades',
    imageCaption:
      'Jaipur’s iconic 953-window rose sandstone Palace of Winds glowing in warm morning Rajasthani sun.',
    gallery: [
      {
        title: 'Hawa Mahal, Jaipur',
        imageUrl: IMG.jaipur,
        caption: 'Five-story honeycomb pink-sandstone facade engineered to draw cool breezes into royal chambers.',
      },
      {
        title: 'Amber & Mehrangarh Forts',
        imageUrl: IMG.agraFort,
        caption: 'Hilltop Rajput citadels overlooking Lake Maota in Jaipur and the blue rooftops of Jodhpur.',
      },
      {
        title: 'Royal Rajasthani Thali',
        imageUrl: IMG.thali,
        caption: 'Flaky baati soaked in ghee, panchmel dal, sweet churma, and crisp pyaaz kachori.',
      },
    ],
    overview:
      'Land of Kings—Rajasthan weaves pink Jaipur palaces, Udaipur marble lakes, Jodhpur’s Blue City citadel, Jaisalmer golden dunes, and Ranthambore’s wild tigers.',
    famousPlaces: [
      {
        name: 'Hawa Mahal & Amer Fort',
        city: 'Jaipur',
        category: 'Royal Heritage',
        bestTime: 'Morning',
        description: 'Iconic Pink City honeycomb palace and hilltop mirror-inlaid Sheesh Mahal fortress.',
      },
      {
        name: 'City Palace & Lake Pichola',
        city: 'Udaipur',
        category: 'Lakes & Palaces',
        bestTime: 'Sunset Boat Ride',
        description: 'White marble palaces rising gracefully above tranquil Aravalli-ringed lakes.',
      },
      {
        name: 'Mehrangarh Fort & Jaisalmer Dunes',
        city: 'Jodhpur & Jaisalmer',
        category: 'Desert & Fort',
        bestTime: 'Nov – Feb',
        description: 'Towering sandstone battlements and starlit Thar desert camel camps.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Dal Baati Churma',
        type: 'Vegetarian',
        description: 'Charcoal-baked wheat baatis crushed in pure ghee with five-lentil dal and sweet almond churma.',
      },
      {
        name: 'Pyaaz Kachori & Mirchi Vada',
        type: 'Street Food',
        description: 'Flaky golden onion-stuffed pastry served with tangy tamarind and mint chutneys.',
      },
      {
        name: 'Ghevar & Mawa Kachori',
        type: 'Dessert',
        description: 'Crisp honeycomb disc sweet soaked in saffron syrup and topped with rabri and pistachios.',
      },
    ],
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    kind: 'State',
    capital: 'Gangtok',
    region: 'Northeast',
    lat: 27.33,
    lon: 88.61,
    bestSeason: 'March – June, Oct – Dec',
    languages: 'Nepali, Sikkimese, Lepcha',
    startingBudgetInr: 6900,
    imageUrl: IMG.ladakh,
    imageTitle: 'Tsomgo Glacial Lake & Kanchenjunga Peaks',
    imageCaption:
      'Turquoise high-altitude mountain lake, colorful prayer flags, and crisp views of Kanchenjunga in Sikkim.',
    gallery: [
      {
        title: 'Gurudongmar & Tsomgo Lakes',
        imageUrl: IMG.ladakh,
        caption: 'Crystal-clear glacial lakes at 12,400–17,800 ft ringed by prayer flags and snow peaks.',
      },
      {
        title: 'Yumthang Valley & Waterfalls',
        imageUrl: IMG.meghalaya,
        caption: 'Rhododendron-filled North Sikkim alpine meadows and crystal river valleys.',
      },
      {
        title: 'Sikkimese Phagshapa & Momos',
        imageUrl: IMG.thali,
        caption: 'Steamed mountain momos, hot thukpa broth, and organic fermented gundruk.',
      },
    ],
    overview:
      'India’s first 100% organic state—Sikkim offers spotless mountain towns, Rumtek and Pemayangtse monasteries, spring rhododendrons, and jaw-dropping Kanchenjunga sunrises.',
    famousPlaces: [
      {
        name: 'Tsomgo Lake & Nathula Pass',
        city: 'East Sikkim',
        category: 'Glacial Lake',
        bestTime: 'Mar – Jun, Oct',
        description: 'Sacred alpine oval lake surrounded by snow ridges and peaceful mountain prayer flags.',
      },
      {
        name: 'Yumthang Valley of Flowers',
        city: 'Lachung, North Sikkim',
        category: 'Alpine Valley',
        bestTime: 'Apr – May',
        description: 'Highland pasture carpeted in crimson and pink wild rhododendrons beside hot springs.',
      },
      {
        name: 'Rumtek Monastery & MG Marg',
        city: 'Gangtok',
        category: 'Monastery & Promenade',
        bestTime: 'Morning',
        description: 'Vibrant Tibetan Buddhist seat paired with Gangtok’s spotless pedestrian ridge boulevard.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Sikkimese Momos & Gyathuk',
        type: 'Classic',
        description: 'Delicate hand-pleated dumplings served with spicy dalle khursani chili-tomato chutney.',
      },
      {
        name: 'Gundruk & Sinki Soup',
        type: 'Vegetarian',
        description: 'Traditional sun-dried leafy greens broth brimming with earthy Himalayan warmth.',
      },
      {
        name: 'Sel Roti',
        type: 'Dessert',
        description: 'Crisp, lightly sweet ring-shaped fermented rice bread enjoyed with mountain tea.',
      },
    ],
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    kind: 'State',
    capital: 'Chennai',
    region: 'South',
    lat: 13.08,
    lon: 80.27,
    bestSeason: 'November – March',
    languages: 'Tamil',
    startingBudgetInr: 5400,
    imageUrl: IMG.meenakshi,
    imageTitle: 'Meenakshi Amman Temple Gopuram, Madurai',
    imageCaption:
      'Towering hand-painted sculpted gateways of Madurai’s Meenakshi Temple rising over the historic temple city.',
    gallery: [
      {
        title: 'Meenakshi Temple, Madurai',
        imageUrl: IMG.meenakshi,
        caption: 'Fourteen vibrantly painted Dravidian gopurams adorned with thousands of mythological sculptures.',
      },
      {
        title: 'Mahabalipuram & Kanyakumari',
        imageUrl: IMG.goa,
        caption: '7th-century coastal shore temples and three-sea sunrises at India’s southern tip.',
      },
      {
        title: 'Chettinad & Filter Kaapi Feast',
        imageUrl: IMG.thali,
        caption: 'Soft idlis, crispy ghee roast dosa, aromatic Chettinad curries, and brass-davara coffee.',
      },
    ],
    overview:
      'A living museum of Dravidian architecture, classical Carnatic music, misty Nilgiri tea hills in Ooty, and iconic golden beaches from Mahabalipuram to Rameshwaram.',
    famousPlaces: [
      {
        name: 'Meenakshi Amman Temple',
        city: 'Madurai',
        category: 'Sacred Temple',
        bestTime: 'Morning / Evening',
        description: '2,500-year-old temple complex famed for colorful gopurams and the Hall of a Thousand Pillars.',
      },
      {
        name: 'Shore Temple & Brihadeeswarar',
        city: 'Mahabalipuram & Thanjavur',
        category: 'UNESCO Heritage',
        bestTime: 'Sunrise',
        description: 'Monolithic Pallava sea shrines and Chola granite temple spires.',
      },
      {
        name: 'Ooty, Coonoor & Kanyakumari',
        city: 'Nilgiris & Southern Tip',
        category: 'Hills & Coast',
        bestTime: 'Oct – May',
        description: 'UNESCO Nilgiri toy train rides through eucalyptus hills and sunrises over three meeting oceans.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Madurai Idli, Pongal & Ghee Roast Dosa',
        type: 'Vegetarian',
        description: 'Cloud-soft steamed rice cakes and pepper-cumin ven pongal with three fresh chutneys.',
      },
      {
        name: 'Chettinad Masala & Kothu Parotta',
        type: 'Street Food',
        description: 'Flaky layered flatbread griddled rhythmically with star-anise and kalpasi stone-flower spices.',
      },
      {
        name: 'Madurai Jigarthanda & Filter Coffee',
        type: 'Dessert',
        description: 'Cooling almond-gum, sarsaparilla, and slow-reduced milk dessert drink unique to Madurai.',
      },
    ],
  },
  {
    id: 'telangana',
    name: 'Telangana',
    kind: 'State',
    capital: 'Hyderabad',
    region: 'South',
    lat: 17.39,
    lon: 78.49,
    bestSeason: 'October – March',
    languages: 'Telugu, Urdu',
    startingBudgetInr: 4800,
    imageUrl: IMG.agraFort,
    imageTitle: 'Golconda Fort, Charminar & Ramappa Temple',
    imageCaption:
      'Granite Deccan fortresses, bustling pearl bazaars, and UNESCO Kakatiya star-shaped temple architecture.',
    gallery: [
      {
        title: 'Golconda & Deccan Arches',
        imageUrl: IMG.agraFort,
        caption: 'Acoustic royal pavilions and sweeping sunset views across historic Hyderabad.',
      },
      {
        title: 'Ramappa UNESCO Temple',
        imageUrl: IMG.hampi,
        caption: '800-year-old Kakatiya sandstone sanctuary built with floating bricks and sculpted dancers.',
      },
      {
        title: 'Hyderabadi Dum & Irani Chai',
        imageUrl: IMG.thali,
        caption: 'Saffron-layered Hyderabadi biryani, mirchi ka salan, and sweet double ka meetha.',
      },
    ],
    overview:
      'Where royal Nizami pearls and Charminar bazaars meet sleek lakeside promenades, acoustic Golconda forts, and the UNESCO Kakatiya Ramappa Temple.',
    famousPlaces: [
      {
        name: 'Charminar & Laad Bazaar',
        city: 'Hyderabad',
        category: 'Iconic Monument',
        bestTime: 'Evening',
        description: 'Four-minaret 1591 landmark surrounded by sparkling bangle alleys and heritage Irani cafes.',
      },
      {
        name: 'Golconda Fort',
        city: 'Hyderabad',
        category: 'Historic Fort',
        bestTime: 'Late Afternoon',
        description: '13th-century granite citadel famous for diamond history and acoustic hand-clap gates.',
      },
      {
        name: 'Ramappa (Rudreshwara) Temple',
        city: 'Mulugu (Warangal)',
        category: 'UNESCO Heritage',
        bestTime: 'Morning',
        description: 'Exquisitely carved Kakatiya sandbox-foundation temple beside scenic Ramappa lake.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Hyderabadi Kacchi Dum Biryani',
        type: 'Classic',
        description: 'Long-grain saffron basmati sealed in dough with caramelized onions, mint, and cooling mirchi ka salan.',
      },
      {
        name: 'Irani Chai & Osmania Biscuits',
        type: 'Street Food',
        description: 'Velvety slow-boiled cardamom tea served with melt-in-mouth sweet-and-salty bakery biscuits.',
      },
      {
        name: 'Qubani Ka Meetha & Double Ka Meetha',
        type: 'Dessert',
        description: 'Stewed apricot compote crowned with thick fresh malai cream and slivered almonds.',
      },
    ],
  },
  {
    id: 'tripura',
    name: 'Tripura',
    kind: 'State',
    capital: 'Agartala',
    region: 'Northeast',
    lat: 23.83,
    lon: 91.29,
    bestSeason: 'October – March',
    languages: 'Bengali, Kokborok',
    startingBudgetInr: 5500,
    imageUrl: IMG.kerala,
    imageTitle: 'Neermahal Water Palace & Unakoti Rock Carvings',
    imageCaption:
      'White lakeside palace floating on Rudrasagar lake alongside verdant bamboo-covered Jampui hills.',
    gallery: [
      {
        title: 'Neermahal Lake Palace',
        imageUrl: IMG.kerala,
        caption: 'Graceful marble-and-sandstone royal palace surrounded by calm Rudrasagar waters.',
      },
      {
        title: 'Unakoti Rock Reliefs',
        imageUrl: IMG.konark,
        caption: 'Colossal ancient hillside stone carvings hidden inside lush forest ravines.',
      },
      {
        title: 'Tripuri Mui Borok Platter',
        imageUrl: IMG.thali,
        caption: 'Bamboo-steamed herbs, roasted mustard chutneys, and fragrant warm rice.',
      },
    ],
    overview:
      'A serene northeastern treasure boasting India’s largest water palace Neermahal, colossal rock-cut Unakoti sculptures, and orange-orchard sunsets in Jampui Hills.',
    famousPlaces: [
      {
        name: 'Neermahal Water Palace',
        city: 'Melaghar',
        category: 'Lake Palace',
        bestTime: 'Sunset Boat',
        description: '1930s Mughal-Rajput hybrid palace sitting serenely in the middle of Rudrasagar Lake.',
      },
      {
        name: 'Unakoti Rock-Cut Heritage',
        city: 'Kailashahar',
        category: 'Ancient Bas-Relief',
        bestTime: 'Morning',
        description: 'Massive 30-foot stone reliefs carved into lush green waterfall cliffs.',
      },
      {
        name: 'Ujjayanta Palace & Sepahijala',
        city: 'Agartala',
        category: 'Royal Museum',
        bestTime: 'Afternoon',
        description: 'Gleaming neoclassical royal palace framed by Mughal-style lotus gardens.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Mui Borok & Gudok',
        type: 'Classic',
        description: 'Steamed bamboo-shoot and hill-vegetable delicacies paired with fragrant local herbs.',
      },
      {
        name: 'Chakhwi & Wahan Mosdeng',
        type: 'Vegetarian',
        description: 'Savory jackfruit-and-bamboo shoot medley tempered with roasted chilies and ginger.',
      },
      {
        name: 'Awan Bangwi',
        type: 'Dessert',
        description: 'Fragrant sticky rice steamed inside wild lairu leaves with cashews and raisins.',
      },
    ],
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    kind: 'State',
    capital: 'Lucknow',
    region: 'North',
    lat: 26.85,
    lon: 80.95,
    bestSeason: 'October – March',
    languages: 'Hindi, Urdu, Awadhi',
    startingBudgetInr: 3800,
    imageUrl: IMG.taj,
    imageTitle: 'Taj Mahal at Sunrise, Agra',
    imageCaption:
      'Ivory-white marble symmetry of the Taj Mahal reflecting across dawn water gardens beside the Yamuna river.',
    gallery: [
      {
        title: 'Taj Mahal, Agra',
        imageUrl: IMG.taj,
        caption: 'One of the Seven Wonders of the World glowing soft rose-gold in early morning light.',
      },
      {
        title: 'Kashi Vishwanath & Ganga Ghats',
        imageUrl: IMG.kashiGhats,
        caption: 'Sacred evening Ganga Aarti lamps illuminating Varanasi’s ancient river steps.',
      },
      {
        title: 'Awadhi & Banarasi Feast',
        imageUrl: IMG.thali,
        caption: 'Melt-in-mouth Lucknowi galouti, crisp Banarasi kachori sabzi, and winter malaiyo.',
      },
    ],
    overview:
      'India’s cultural heartland—home to the Taj Mahal in Agra, sacred Kashi Vishwanath and Ganga Aarti in Varanasi, Ayodhya, Prayagraj Sangam, and royal Lucknow.',
    famousPlaces: [
      {
        name: 'Taj Mahal & Agra Fort',
        city: 'Agra',
        category: 'Seven Wonders',
        bestTime: 'Sunrise (6:00 AM)',
        description: 'World-famous white marble mausoleum paired with grand red-sandstone Mughal ramparts.',
      },
      {
        name: 'Kashi Vishwanath & Dashashwamedh Ghat',
        city: 'Varanasi',
        category: 'Sacred River City',
        bestTime: 'Dawn & Dusk',
        description: 'Golden-spired temple corridor and mesmerizing wooden boat views of the evening Ganga Aarti.',
      },
      {
        name: 'Bara Imambara & Ayodhya Ram Mandir',
        city: 'Lucknow & Ayodhya',
        category: 'Heritage & Temple',
        bestTime: 'Morning',
        description: 'Architectural Bhool Bhulaiya labyrinth and newly built carved sandstone temple complex.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Lucknowi Galouti & Awadhi Biryani',
        type: 'Classic',
        description: 'Delicately spiced saffron-and-rosewater Awadhi delicacies cooked with traditional dum warmth.',
      },
      {
        name: 'Banarasi Tamatar Chaat & Kachori Sabzi',
        type: 'Street Food',
        description: 'Tangy, buttery mashed-tomato street chaat served in earthen kulhads topped with crisp namakpara.',
      },
      {
        name: 'Petha & Malaiyo',
        type: 'Dessert',
        description: 'Translucent Agra ash-gourd sweet and cloud-light winter saffron milk foam from Varanasi.',
      },
    ],
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    kind: 'State',
    capital: 'Dehradun',
    region: 'North',
    lat: 30.32,
    lon: 78.03,
    bestSeason: 'March – June, Sep – Nov',
    languages: 'Hindi, Garhwali, Kumaoni',
    startingBudgetInr: 4700,
    imageUrl: IMG.kedarnath,
    imageTitle: 'Kedarnath Temple & Garhwal Snow Peaks',
    imageCaption:
      'Ancient stone Kedarnath Temple framed by towering snow-dusted Himalayan peaks and alpine mists.',
    gallery: [
      {
        title: 'Kedarnath Dham',
        imageUrl: IMG.kedarnath,
        caption: '1,000-year-old stone Himalayan shrine standing at 3,583 meters in Rudraprayag.',
      },
      {
        title: 'Rishikesh Ganga Suspension Bridge',
        imageUrl: IMG.rishikesh,
        caption: 'Emerald Himalayan Ganga waters flowing quietly beneath Lakshman Jhula and forested hills.',
      },
      {
        title: 'Garhwali & Kumaoni Thali',
        imageUrl: IMG.thali,
        caption: 'Nutritious bhatt ki churkani, kafuli spinach curry, and chocolatey Almora bal mithai.',
      },
    ],
    overview:
      'Devbhoomi Uttarakhand cradles the sacred Char Dham shrines (Kedarnath, Badrinath, Gangotri, Yamunotri), yoga capital Rishikesh, Nainital lakes, and Valley of Flowers.',
    famousPlaces: [
      {
        name: 'Kedarnath & Badrinath Temples',
        city: 'Rudraprayag & Chamoli',
        category: 'Sacred Himalayas',
        bestTime: 'May – Jun, Sep – Oct',
        description: 'Ancient Himalayan stone temples surrounded by dramatic glaciers and rushing Mandakini waters.',
      },
      {
        name: 'Rishikesh & Har Ki Pauri',
        city: 'Rishikesh & Haridwar',
        category: 'Yoga & Ganga',
        bestTime: 'Evening Aarti',
        description: 'Clear emerald river ghats, suspension bridges, and tranquil evening Ganga Aarti chants.',
      },
      {
        name: 'Nainital, Mussoorie & Valley of Flowers',
        city: 'Nainital & Chamoli',
        category: 'Lakes & Meadows',
        bestTime: 'Jul – Sep (Valley)',
        description: 'Emerald hill lakes and UNESCO alpine meadows bursting with rare wild Himalayan blooms.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Kafuli & Bhatt Ki Churkani',
        type: 'Vegetarian',
        description: 'Iron-rich slow-cooked Himalayan spinach curry and roasted black-soybean stew over red hill rice.',
      },
      {
        name: 'Aloo Ke Gutke & Bhang Ki Chutney',
        type: 'Classic',
        description: 'Crisp turmeric-and-red-chili mountain potatoes tossed with wild hempseed chutney.',
      },
      {
        name: 'Bal Mithai',
        type: 'Dessert',
        description: 'Almora’s beloved roasted khoya fudge coated in crisp white sugar-coated poppy pearls.',
      },
    ],
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    kind: 'State',
    capital: 'Kolkata',
    region: 'East',
    lat: 22.57,
    lon: 88.36,
    bestSeason: 'October – March',
    languages: 'Bengali',
    startingBudgetInr: 4900,
    imageUrl: IMG.manali,
    imageTitle: 'Darjeeling Tea Hills, Kolkata Heritage & Sundarbans',
    imageCaption:
      'Misty Kanchenjunga sunrises above Darjeeling’s toy train tracks, paired with Kolkata’s literary lanes.',
    gallery: [
      {
        title: 'Darjeeling Misty Hills',
        imageUrl: IMG.manali,
        caption: 'Terraced Darjeeling tea slopes and historic Himalayan Railway viewpoints.',
      },
      {
        title: 'Kolkata Grand Architecture',
        imageUrl: IMG.mumbai,
        caption: 'Howrah Bridge river ferries, Victoria Memorial marble domes, and Princep Ghat sunsets.',
      },
      {
        title: 'Bengali Kosha, Fish & Mishti',
        imageUrl: IMG.thali,
        caption: 'Golden mustard shorshe curry, crisp luchi-alur dom, and warm spongy rosogolla.',
      },
    ],
    overview:
      'A poetic contrast from Tiger Hill’s snowy Kanchenjunga dawn in Darjeeling to Kolkata’s grand Victoria Memorial, tramways, Durga Puja art, and Sundarbans mangrove creeks.',
    famousPlaces: [
      {
        name: 'Victoria Memorial & Howrah Riverfront',
        city: 'Kolkata',
        category: 'Heritage City',
        bestTime: 'Sunset',
        description: 'Gleaming white Makrana marble museum and timeless Hooghly ghats.',
      },
      {
        name: 'Darjeeling Himalayan Railway & Tiger Hill',
        city: 'Darjeeling',
        category: 'UNESCO Hill Station',
        bestTime: 'Sunrise',
        description: 'Heritage steam toy train winding past emerald tea estates facing Mount Kanchenjunga.',
      },
      {
        name: 'Sundarbans National Park',
        city: 'South 24 Parganas',
        category: 'UNESCO Mangroves',
        bestTime: 'Nov – Feb',
        description: 'World’s largest tidal mangrove delta home to the swimming Royal Bengal tiger.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Shorshe Ilish & Chingri Malai Curry',
        type: 'Seafood',
        description: 'Velvety mustard-paste hilsa or coconut-milk tiger prawns served over steamed gobindobhog rice.',
      },
      {
        name: 'Kathi Roll & Luchi Alur Dom',
        type: 'Street Food',
        description: 'Flaky Kolkata paratha rolls and puffy golden luchis with aromatic baby-potato curry.',
      },
      {
        name: 'Rosogolla & Mishti Doi',
        type: 'Dessert',
        description: 'Feather-light syrup-soaked chhena spheres and caramelized clay-pot sweet yogurt.',
      },
    ],
  },

  /* ===================== 8 VERIFIED UNION TERRITORIES ===================== */
  {
    id: 'andaman-nicobar',
    name: 'Andaman & Nicobar Islands',
    kind: 'Union Territory',
    capital: 'Sri Vijaya Puram (Port Blair)',
    region: 'Union Territories',
    lat: 11.62,
    lon: 92.73,
    bestSeason: 'November – May',
    languages: 'Hindi, English, Bengali, Tamil',
    startingBudgetInr: 9500,
    imageUrl: IMG.andaman,
    imageTitle: 'Radhanagar Beach, Swaraj Dweep (Havelock)',
    imageCaption:
      'Powder-white coral sand meeting translucent turquoise Bay of Bengal waters beside emerald island rainforests.',
    gallery: [
      {
        title: 'Radhanagar Beach, Havelock',
        imageUrl: IMG.andaman,
        caption: 'Consistently ranked among Asia’s finest beaches with calm clear swimming lagoons.',
      },
      {
        title: 'Neil Island Coral Coves',
        imageUrl: IMG.goa,
        caption: 'Natural limestone rock bridges, glass-bottom reefs, and tranquil sunset piers.',
      },
      {
        title: 'Fresh Island Catch & Coconut Platter',
        imageUrl: IMG.thali,
        caption: 'Grilled reef catch, spiced coconut curries, and chilled tropical island fruit.',
      },
    ],
    overview:
      'An emerald archipelago of 572 tropical islands in the Bay of Bengal—famous for Radhanagar’s crystal lagoons, vibrant coral scuba reefs, and Cellular Jail heritage.',
    famousPlaces: [
      {
        name: 'Radhanagar & Elephant Beach',
        city: 'Swaraj Dweep (Havelock)',
        category: 'Tropical Beach',
        bestTime: 'Sunset / Morning Snorkel',
        description: 'Pristine white coral bay backed by towering tropical padauk rainforests.',
      },
      {
        name: 'Cellular Jail National Memorial',
        city: 'Sri Vijaya Puram (Port Blair)',
        category: 'Historic Landmark',
        bestTime: 'Evening Light Show',
        description: 'Solemn freedom-struggle monument overlooking Ross Island’s heritage ruins.',
      },
      {
        name: 'Natural Bridge & Bharatpur Beach',
        city: 'Shaheed Dweep (Neil Island)',
        category: 'Coral Reefs',
        bestTime: 'Low Tide',
        description: 'Crystal-clear shallow coral reefs ideal for beginner snorkeling and peaceful cycling.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Andaman Grilled Lobster & Coconut Prawn Curry',
        type: 'Seafood',
        description: 'Freshly caught island seafood simmered in creamy coconut milk, curry leaves, and mild island spices.',
      },
      {
        name: 'Fish Amritsari Island-Style & Spiced Rice',
        type: 'Classic',
        description: 'Crispy herb-crusted coastal fillets paired with tamarind-mango chutney.',
      },
      {
        name: 'Tender Coconut Pudding & Tropical Fruit',
        type: 'Dessert',
        description: 'Chilled natural island coconut custard served inside fresh green coconut shells.',
      },
    ],
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    kind: 'Union Territory',
    capital: 'Chandigarh',
    region: 'Union Territories',
    lat: 30.73,
    lon: 76.78,
    bestSeason: 'October – March',
    languages: 'English, Hindi, Punjabi',
    startingBudgetInr: 3300,
    imageUrl: IMG.goldenTemple,
    imageTitle: 'Rock Garden, Sukhna Lake & Capitol Complex',
    imageCaption:
      'Wide tree-lined boulevards, Le Corbusier’s UNESCO modernist Capitol Complex, and serene Sukhna Lake mornings.',
    gallery: [
      {
        title: 'Northern Heritage & Serenity',
        imageUrl: IMG.goldenTemple,
        caption: 'Peaceful lakeside promenades and modernist architectural landmarks of India’s planned city.',
      },
      {
        title: 'Shivalik Foothill Gateway',
        imageUrl: IMG.manali,
        caption: 'Breezy green avenues opening directly toward Shimla and Kasauli hills.',
      },
      {
        title: 'Sector 17 & Punjabi Classics',
        imageUrl: IMG.thali,
        caption: 'Crisp chole bhature, creamy butter curries, and warm roadside jalebi.',
      },
    ],
    overview:
      'Joint capital of Punjab and Haryana, Chandigarh is India’s cleanest planned city—celebrated for Nek Chand’s whimsical Rock Garden, Sukhna Lake boating, and UNESCO architecture.',
    famousPlaces: [
      {
        name: 'Rock Garden of Chandigarh',
        city: 'Sector 1',
        category: 'Art Sculpture Park',
        bestTime: 'Morning',
        description: '40-acre open-air mosaic wonderland sculpted entirely from recycled ceramics, bangles, and industrial tiles.',
      },
      {
        name: 'Sukhna Lake & Zakir Hussain Rose Garden',
        city: 'Sector 1 & 16',
        category: 'Lake & Botanical Garden',
        bestTime: 'Sunrise / Sunset',
        description: 'Tranquil reservoir framed by Shivalik hills and Asia’s largest rose garden with 1,600 varieties.',
      },
      {
        name: 'Capitol Complex',
        city: 'Sector 1',
        category: 'UNESCO Modernism',
        bestTime: 'Afternoon',
        description: 'Le Corbusier’s iconic Open Hand monument and sweeping concrete geometric plazas.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Sector 17 Chole Bhature & Rajma Chawal',
        type: 'Street Food',
        description: 'Fluffy golden bhaturas served with slow-spiced dark chickpeas and pickled green chilies.',
      },
      {
        name: 'Tandoori Paneer & Dal Makhani',
        type: 'Vegetarian',
        description: '24-hour slow-simmered black lentils finished with cream, ginger juliennes, and smoky charcoal warmth.',
      },
      {
        name: 'Kulfi Falooda',
        type: 'Dessert',
        description: 'Dense pistachio-cardamom milk kulfi topped with rose syrup and chilled vermicelli.',
      },
    ],
  },
  {
    id: 'dadra-nagar-haveli-daman-diu',
    name: 'Dadra & Nagar Haveli and Daman & Diu',
    kind: 'Union Territory',
    capital: 'Daman',
    region: 'Union Territories',
    lat: 20.4,
    lon: 72.83,
    bestSeason: 'October – March',
    languages: 'Gujarati, Hindi, Marathi',
    startingBudgetInr: 4400,
    imageUrl: IMG.goa,
    imageTitle: 'Diu Fort, Nagoa Beach & Silvassa Green Groves',
    imageCaption:
      'Sea-facing 16th-century Portuguese stone forts in Diu and Daman paired with tranquil forest gardens in Silvassa.',
    gallery: [
      {
        title: 'Diu & Daman Sea Forts',
        imageUrl: IMG.goa,
        caption: 'Hoka palm-lined Nagoa beach and historic coastal stone bastions overlooking the Arabian Sea.',
      },
      {
        title: 'Silvassa Forest & Tribal Gardens',
        imageUrl: IMG.meghalaya,
        caption: 'Lush Daman Ganga riverfront parks and quiet forest retreats near Dudhni Lake.',
      },
      {
        title: 'Coastal Gujarati & Portuguese Meal',
        imageUrl: IMG.thali,
        caption: 'Fresh coastal curries, crisp farsan snacks, and warm rotis.',
      },
    ],
    overview:
      'A peaceful coastal-and-forest Union Territory pairing Diu’s iconic sea fortress and rare Hoka palm beaches with Daman’s lighthouse promenade and Silvassa’s Dudhni Lake.',
    famousPlaces: [
      {
        name: 'Diu Fort & Naida Caves',
        city: 'Diu Island',
        category: 'Sea Fort & Caves',
        bestTime: 'Morning',
        description: 'Majestic sea-surrounded stone fortress beside dramatic sunlit sandstone cave chambers.',
      },
      {
        name: 'Moti Daman Fort & Devka Beach',
        city: 'Daman',
        category: 'Coastal Heritage',
        bestTime: 'Sunset',
        description: '16th-century walled coastal enclave with peaceful chapels and sunset sea walks.',
      },
      {
        name: 'Dudhni Lake & Vanganga Garden',
        city: 'Silvassa',
        category: 'Lake & Nature',
        bestTime: 'Oct – Feb',
        description: 'Mirror-still reservoir ringed by Sahyadri hills ideal for quiet afternoon kayaking.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Jetty Roll & Coastal Crab Curry',
        type: 'Seafood',
        description: 'Spiced Arabian Sea catch cooked with coastal tamarind, roasted coconut, and garlic.',
      },
      {
        name: 'Ubadiyu & Gujarati Farsan',
        type: 'Vegetarian',
        description: 'Seasonal winter tubers and beans slow-roasted underground in earthen pots with wild herbs.',
      },
      {
        name: 'Damanese Coconut Tart & Lapsee',
        type: 'Dessert',
        description: 'Warm cracked-wheat jaggery pudding garnished with toasted cashews and ghee.',
      },
    ],
  },
  {
    id: 'delhi',
    name: 'Delhi (NCT)',
    kind: 'Union Territory',
    capital: 'New Delhi',
    region: 'Union Territories',
    lat: 28.61,
    lon: 77.21,
    bestSeason: 'October – March',
    languages: 'Hindi, English, Punjabi, Urdu',
    startingBudgetInr: 3200,
    imageUrl: IMG.agraFort,
    imageTitle: 'Red Fort, Humayun’s Tomb & India Gate',
    imageCaption:
      'Monumental Mughal red sandstone arches, tree-lined Lutyens boulevards, and bustling Old Delhi heritage lanes.',
    gallery: [
      {
        title: 'Red Fort & Mughal Grandeur',
        imageUrl: IMG.agraFort,
        caption: '17th-century red sandstone Lal Qila ramparts and serene Humayun’s Tomb charbagh gardens.',
      },
      {
        title: 'Qutub Minar & Lotus Temple',
        imageUrl: IMG.taj,
        caption: 'UNESCO marble and sandstone architectural milestones spanning eight centuries of Delhi.',
      },
      {
        title: 'Chandni Chowk & Connaught Platter',
        imageUrl: IMG.thali,
        caption: 'Crisp aloo tikki chaat, paranthe wali gali flatbreads, butter chicken, and jalebi rabri.',
      },
    ],
    overview:
      'India’s vibrant capital blends three UNESCO World Heritage monuments—Red Fort, Qutub Minar, and Humayun’s Tomb—with leafy Lodhi Gardens, craft bazaars, and unmatched street food.',
    famousPlaces: [
      {
        name: 'Red Fort & Chandni Chowk',
        city: 'Old Delhi',
        category: 'UNESCO Monument',
        bestTime: 'Morning',
        description: 'Iconic Mughal fortress opening into centuries-old spice, silver, and street-food lanes.',
      },
      {
        name: 'Humayun’s Tomb & Lodhi Gardens',
        city: 'Central Delhi',
        category: 'UNESCO & Park',
        bestTime: 'Late Afternoon',
        description: 'The serene red-and-white marble garden tomb that inspired the Taj Mahal.',
      },
      {
        name: 'India Gate, Akshardham & Qutub Minar',
        city: 'New & South Delhi',
        category: 'Landmarks',
        bestTime: 'Evening',
        description: 'Soaring sandstone victory tower, Kartavya Path promenade, and carved pink-sandstone Akshardham.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Old Delhi Chaat & Paranthe Wali Gali',
        type: 'Street Food',
        description: 'Crisp aloo tikki, dahi bhalla, and flaky shallow-fried stuffed parathas with mint-tamarind chutney.',
      },
      {
        name: 'Chole Bhature & Rajma Chawal',
        type: 'Vegetarian',
        description: 'Delhi’s quintessential comfort breakfast of spiced chickpeas and pillowy bhature.',
      },
      {
        name: 'Daulat Ki Chaat & Kuremal Stuffed Kulfi',
        type: 'Dessert',
        description: 'Whipped winter saffron milk froth and real-fruit stuffed artisanal kulfi.',
      },
    ],
  },
  {
    id: 'jammu-kashmir',
    name: 'Jammu & Kashmir',
    kind: 'Union Territory',
    capital: 'Srinagar (Summer) / Jammu (Winter)',
    region: 'Union Territories',
    lat: 34.08,
    lon: 74.8,
    bestSeason: 'April – October',
    languages: 'Kashmiri, Dogri, Urdu, Hindi',
    startingBudgetInr: 7400,
    imageUrl: IMG.kashmirDal,
    imageTitle: 'Dal Lake Dawn Shikara Ride, Srinagar',
    imageCaption:
      'Wooden shikaras gliding across mirror-still Dal Lake water beneath rose-tinted Himalayan peaks.',
    gallery: [
      {
        title: 'Dal Lake Dawn Shikara',
        imageUrl: IMG.kashmirDal,
        caption: 'Floating flower markets and carved cedar houseboats resting peacefully on Srinagar’s Dal Lake.',
      },
      {
        title: 'Gulmarg Alpine Meadows',
        imageUrl: IMG.gulmarg,
        caption: 'Endless summer wildflower pastures and winter snow slopes beneath Apharwat peak.',
      },
      {
        title: 'Kashmiri Wazwan & Saffron Kahwa',
        imageUrl: IMG.thali,
        caption: 'Aromatic saffron pulao, dum aloo, nadru yakhni, and steaming almond-cardamom kahwa.',
      },
    ],
    overview:
      'From Vaishno Devi’s sacred Trikuta hills in Jammu to Srinagar’s Dal Lake houseboats, Pahalgam pine rivers, and Gulmarg Gondola meadows—Kashmir feels like pure poetry.',
    famousPlaces: [
      {
        name: 'Dal Lake & Mughal Gardens',
        city: 'Srinagar',
        category: 'Lake & Houseboats',
        bestTime: 'Sunrise',
        description: 'Iconic cedar houseboats, floating vegetable markets, and terraced Nishat & Shalimar chinar gardens.',
      },
      {
        name: 'Gulmarg Gondola & Pahalgam',
        city: 'Baramulla & Anantnag',
        category: 'Alpine Meadows',
        bestTime: 'Apr – Oct / Jan Snow',
        description: 'One of the world’s highest cable cars soaring over wildflower slopes and glacial Lidder rivers.',
      },
      {
        name: 'Mata Vaishno Devi Shrine',
        city: 'Katra, Jammu',
        category: 'Sacred Pilgrimage',
        bestTime: 'Year-Round',
        description: 'Revered cave shrine nestled high in the scenic Trikuta mountain range.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Kashmiri Rogan Josh & Gushtaba',
        type: 'Classic',
        description: 'Velvety Kashmiri red-chili and fennel-infused royal Wazwan delicacy served with fragrant rice.',
      },
      {
        name: 'Kashmiri Dum Aloo & Nadru Yakhni',
        type: 'Vegetarian',
        description: 'Crisp baby potatoes simmered in bright kashmiri chili-fennel gravy and yogurt-cooked lotus stem.',
      },
      {
        name: 'Saffron Kahwa & Noon Chai',
        type: 'Dessert',
        description: 'Golden green tea brewed with Pampore saffron strands, cinnamon, cardamom, and slivered almonds.',
      },
    ],
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    kind: 'Union Territory',
    capital: 'Leh',
    region: 'Union Territories',
    lat: 34.15,
    lon: 77.58,
    bestSeason: 'May – September',
    languages: 'Ladakhi, Tibetan, Hindi',
    startingBudgetInr: 8900,
    imageUrl: IMG.ladakh,
    imageTitle: 'Pangong Tso Lake, Ladakh',
    imageCaption:
      'Brilliantly turquoise 14,270-foot saltwater Pangong Lake framed by bare ochre Himalayan peaks and prayer flags.',
    gallery: [
      {
        title: 'Pangong Tso Lake',
        imageUrl: IMG.ladakh,
        caption: 'Shifting shades of sapphire and turquoise stretching across the trans-Himalayan plateau.',
      },
      {
        title: 'Nubra Valley & Khardung La',
        imageUrl: IMG.solang,
        caption: 'Silver sand dunes at Hunder met by double-humped Bactrian camels and snow passes.',
      },
      {
        title: 'Ladakhi Skyu & Butter Tea',
        imageUrl: IMG.thali,
        caption: 'Warm hand-rolled pasta stew, steamed tingmo bread, and apricot jam from Sham valley.',
      },
    ],
    overview:
      'The Land of High Passes—Ladakh astounds travelers with Pangong Tso’s neon-blue water, ancient hilltop Thiksey & Hemis monasteries, Nubra sand dunes, and crystal Milky Way skies.',
    famousPlaces: [
      {
        name: 'Pangong Tso & Tso Moriri',
        city: 'Changthang Plateau',
        category: 'High-Altitude Lakes',
        bestTime: 'May – Sep',
        description: 'Iconic mineral-blue alpine lakes changing color with every passing cloud at 14,000+ ft.',
      },
      {
        name: 'Thiksey Monastery & Leh Palace',
        city: 'Leh',
        category: 'Monastery',
        bestTime: 'Sunrise Morning Prayers',
        description: '12-story hillside white-and-ochre monastery overlooking the green Indus river valley.',
      },
      {
        name: 'Nubra Valley & Hunder Dunes',
        city: 'Diskit',
        category: 'Cold Desert Valley',
        bestTime: 'Jun – Sep',
        description: 'Dramatic mountain desert reached via Khardung La with towering Maitreya Buddha statues.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Thukpa, Skyu & Tingmo',
        type: 'Vegetarian',
        description: 'Hearty hand-pinched wheat-dough vegetable stew and fluffy steamed twisted Tibetan buns.',
      },
      {
        name: 'Chutagi & Khambir Bread',
        type: 'Classic',
        description: 'Bow-tie pasta simmered in rich mountain greens paired with crusty fermented whole-wheat loaves.',
      },
      {
        name: 'Apricot Halwa & Gur-Gur Chai',
        type: 'Dessert',
        description: 'Sun-ripened Ladakhi chuli apricots stewed into golden jam alongside warming butter tea.',
      },
    ],
  },
  {
    id: 'lakshadweep',
    name: 'Lakshadweep',
    kind: 'Union Territory',
    capital: 'Kavaratti',
    region: 'Union Territories',
    lat: 10.57,
    lon: 72.64,
    bestSeason: 'October – May',
    languages: 'Malayalam, Mahl',
    startingBudgetInr: 9900,
    imageUrl: IMG.andaman,
    imageTitle: 'Agatti & Bangaram Coral Atoll Lagoons',
    imageCaption:
      'Shallow sapphire coral lagoons encircling palm-covered sandbanks in the Arabian Sea.',
    gallery: [
      {
        title: 'Bangaram & Agatti Lagoon',
        imageUrl: IMG.andaman,
        caption: 'Unspoiled shallow coral reefs teeming with sea turtles, eagle rays, and turquoise water.',
      },
      {
        title: 'Minicoy Lighthouse Coast',
        imageUrl: IMG.kerala,
        caption: 'Calm palm-shaded island channels and traditional multi-colored tuna boats.',
      },
      {
        title: 'Island Coconut & Tuna Meal',
        imageUrl: IMG.thali,
        caption: 'Fragrant island coconut-rice curries, spicy masmin tuna fry, and palm jaggery sweets.',
      },
    ],
    overview:
      'India’s smallest Union Territory—36 pristine coral atolls floating in the Arabian Sea, offering glass-clear lagoons at Agatti, Bangaram, and Minicoy.',
    famousPlaces: [
      {
        name: 'Bangaram & Agatti Atolls',
        city: 'Agatti Island',
        category: 'Coral Lagoon',
        bestTime: 'Nov – Apr',
        description: 'Teardrop coral islands offering world-class reef snorkeling and bioluminescent night shores.',
      },
      {
        name: 'Kavaratti Marine Aquarium & Lagoon',
        city: 'Kavaratti',
        category: 'Island Capital',
        bestTime: 'Morning',
        description: 'Calm glass-bottom lagoon rides over living coral gardens and giant clams.',
      },
      {
        name: 'Minicoy Lighthouse & Tuna Beaches',
        city: 'Minicoy',
        category: 'Lighthouse & Reef',
        bestTime: 'Afternoon',
        description: '1885 whitewashed lighthouse offering panoramic views across crescent turquoise reefs.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Lakshadweep Mus Kavaab & Tuna Curry',
        type: 'Seafood',
        description: 'Aromatic coconut-and-curry-leaf island tuna spiced gently with black pepper and coriander.',
      },
      {
        name: 'Kilanchi & Coconut Appam',
        type: 'Vegetarian',
        description: 'Crisp rice-and-coconut crepes filled with sweet palm jaggery and grated coconut.',
      },
      {
        name: 'Addu & Halwa',
        type: 'Dessert',
        description: 'Traditional island sweet made with roasted coconut milk, cardamom, and palm sugar.',
      },
    ],
  },
  {
    id: 'puducherry',
    name: 'Puducherry',
    kind: 'Union Territory',
    capital: 'Puducherry',
    region: 'Union Territories',
    lat: 11.94,
    lon: 79.81,
    bestSeason: 'October – March',
    languages: 'Tamil, French, English',
    startingBudgetInr: 4600,
    imageUrl: IMG.goa,
    imageTitle: 'Promenade Beach & White Town Boulevards',
    imageCaption:
      'Mustard-yellow colonial villas draped in bougainvillea overlooking the calm Bay of Bengal promenade.',
    gallery: [
      {
        title: 'Rock Beach & Serenity Cove',
        imageUrl: IMG.goa,
        caption: 'Sunrise strolls along car-free Promenade Beach and palm-lined coastal bays.',
      },
      {
        title: 'Auroville & Heritage Temples',
        imageUrl: IMG.meenakshi,
        caption: 'Golden Matrimandir meditation dome alongside ancient Tamil temple architecture.',
      },
      {
        title: 'Franco-Tamil Cafe & Thali',
        imageUrl: IMG.thali,
        caption: 'Warm flaky croissants and crisp dosas beside creamy Pondicherry coconut fish curry.',
      },
    ],
    overview:
      'A charming coastal enclave where French-quarter mustard villas, quiet Auroville gardens, and Tamil temple traditions meet peaceful Bay of Bengal sunrises.',
    famousPlaces: [
      {
        name: 'White Town & Promenade Beach',
        city: 'Puducherry',
        category: 'Heritage Quarter',
        bestTime: 'Sunrise / Evening',
        description: 'Bougainvillea-draped colonial lanes leading directly to the breezy rock seawall.',
      },
      {
        name: 'Auroville Matrimandir',
        city: 'Auroville',
        category: 'Peace Sanctuary',
        bestTime: 'Morning',
        description: 'Iconic golden-disc geodesic dome surrounded by quiet banyan gardens.',
      },
      {
        name: 'Paradise Beach & Chunnambar Backwaters',
        city: 'Cuddalore Road',
        category: 'Beach & Boat',
        bestTime: 'Morning',
        description: 'Golden sandbar accessible via peaceful mangrove boat rides.',
      },
    ],
    favoriteFoods: [
      {
        name: 'Pondicherry Bouillabaisse & Coconut Curry',
        type: 'Seafood',
        description: 'Unique Franco-Tamil seafood stew scented with saffron, curry leaves, and fresh coconut.',
      },
      {
        name: 'Artisanal Croissants & Masala Dosa',
        type: 'Classic',
        description: 'White Town bakery mornings pairing butter-layered pastries with crisp South Indian filter coffee.',
      },
      {
        name: 'Creme Brulee & Payasam',
        type: 'Dessert',
        description: 'Velvety vanilla-bean caramelized custard served in sunlit courtyard cafes.',
      },
    ],
  },
];

// Sanity counts: 28 States + 8 Union Territories = 36 verified entries.
export const TOTAL_STATES_COUNT = INDIA_STATES_AND_UTS.filter((s) => s.kind === 'State').length;
export const TOTAL_UTS_COUNT = INDIA_STATES_AND_UTS.filter(
  (s) => s.kind === 'Union Territory'
).length;
