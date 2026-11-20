import type { MusafirDestination, Testimonial, TravelPackage } from '../types.ts';

export const HERO_MOUNTAIN_IMAGE =
  '/src/assets/images/wanderly_hero_mountains_1794981284218.jpg';

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const DESTINATIONS: MusafirDestination[] = [
  {
    id: 'agra-taj',
    name: 'Taj Mahal & Agra',
    country: 'India · Seven Wonders',
    regionCategory: 'Indian Wonders & Temples',
    startingPriceInr: 4900,
    bestSeason: 'October – March',
    idealDuration: '3–4 Days',
    imageUrl: '/src/assets/images/india_taj_mahal_1794982487231.jpg',
    tagline:
      'Walk through India’s marble wonder at sunrise, red sandstone royal forts, and nearby pink-city palaces.',
    easyDescription:
      'One of the easiest and most unforgettable heritage trips in India. Start your morning watching the white marble Taj Mahal turn soft pink at sunrise, explore the massive Agra Fort right beside the Yamuna river, and continue onward to Jaipur’s iconic Hawa Mahal.',
    highlights: [
      'Early-morning skip-the-line entry to the Taj Mahal at sunrise',
      'Guided walk inside Agra Fort’s royal marble & sandstone halls',
      'Optional day extension to Jaipur’s Hawa Mahal & royal bazaars',
    ],
    gallery: [
      {
        id: 'taj-1',
        title: 'Taj Mahal at Sunrise',
        imageUrl: '/src/assets/images/india_taj_mahal_1794982487231.jpg',
        description:
          'Arrive at 6:00 AM to see the ivory marble monument glow in soft pink sunlight and reflect in the long garden water pool.',
      },
      {
        id: 'taj-2',
        title: 'Agra Fort Royal Arches',
        imageUrl: '/src/assets/images/india_agra_fort_1794982487266.jpg',
        description:
          'A grand red sandstone fort with peaceful Mughal courtyards and direct arched views looking straight toward the Taj Mahal.',
      },
      {
        id: 'taj-3',
        title: 'Hawa Mahal, Jaipur Extension',
        imageUrl: '/src/assets/images/india_jaipur_hawa_1794982490936.jpg',
        description:
          'Just a few hours away along the Golden Triangle route—famous for 953 sculpted sandstone windows built to let cool breeze inside.',
      },
      {
        id: 'taj-4',
        title: 'Golden Temple Spiritual Stop',
        imageUrl: '/src/assets/images/india_golden_temple_1794982490078.jpg',
        description:
          'Easily paired by overnight train from North India to experience the tranquil shimmering pool and community kitchen in Amritsar.',
      },
      {
        id: 'taj-5',
        title: 'Ganga Ghats Heritage Trail',
        imageUrl: '/src/assets/images/india_kashi_ghats_1794982488101.jpg',
        description:
          'Connect Agra’s Mughal architecture with ancient riverfront stone ghats for a complete North India cultural story.',
      },
    ],
  },
  {
    id: 'varanasi-kashi',
    name: 'Varanasi & Kashi Temple',
    country: 'India · Sacred Temples',
    regionCategory: 'Indian Wonders & Temples',
    startingPriceInr: 5400,
    bestSeason: 'October – March',
    idealDuration: '3–4 Days',
    imageUrl: '/src/assets/images/india_kashi_temple_1794982488435.jpg',
    tagline:
      'Ancient Kashi Vishwanath temple spires, sunrise boat rides on the Ganga, and glowing evening aarti.',
    easyDescription:
      'Varanasi is one of the oldest living cities in the world and feels deeply peaceful once you step onto its river ghats. Visit the golden-spired Kashi Vishwanath Temple, glide along the Ganga in a quiet wooden boat at dawn, and witness hundreds of oil lamps lit together at sunset.',
    highlights: [
      'Guided darshan walk through the new Kashi Vishwanath Corridor',
      'Sunrise & sunset wooden rowboat rides along historic Ganga ghats',
      'Front-row boat view of the evening Dashashwamedh Ganga Aarti',
    ],
    gallery: [
      {
        id: 'kashi-1',
        title: 'Kashi Vishwanath Temple Corridor',
        imageUrl: '/src/assets/images/india_kashi_temple_1794982488435.jpg',
        description:
          'Walk through intricately carved sandstone pillars leading straight to the gleaming gold-plated spire of Kashi Vishwanath.',
      },
      {
        id: 'kashi-2',
        title: 'Dashashwamedh Ghat Evening Aarti',
        imageUrl: '/src/assets/images/india_kashi_ghats_1794982488101.jpg',
        description:
          'As dusk settles, thousands gather on stone steps and wooden boats to watch synchronized brass oil lamps and river chants.',
      },
      {
        id: 'kashi-3',
        title: 'Rishikesh Upstream Ganga',
        imageUrl: '/src/assets/images/india_rishikesh_ganga_1794982488813.jpg',
        description:
          'Follow the sacred river upstream to the Himalayan foothills where emerald waters flow gently beneath forested hills.',
      },
      {
        id: 'kashi-4',
        title: 'Golden Temple Reflection',
        imageUrl: '/src/assets/images/india_golden_temple_1794982490078.jpg',
        description:
          'Combine your spiritual circuit with Amritsar’s serene Sarovar pool and peaceful morning prayers.',
      },
    ],
  },
  {
    id: 'kedarnath-rishikesh',
    name: 'Kedarnath & Rishikesh',
    country: 'India · Himalayan Temples',
    regionCategory: 'Indian Wonders & Temples',
    startingPriceInr: 7400,
    bestSeason: 'May – June, Sep – Oct',
    idealDuration: '5–6 Days',
    imageUrl: '/src/assets/images/india_kedarnath_temple_1794982489180.jpg',
    tagline:
      'Ancient stone Kedarnath Temple framed by snowy Himalayan peaks, paired with Rishikesh river serenity.',
    easyDescription:
      'A deeply moving blend of high-mountain scenery and sacred tradition. Begin by resting beside the clear emerald Ganga in Rishikesh, then journey into Uttarakhand’s dramatic valleys to stand before the 1,000-year-old stone Kedarnath Temple surrounded by snow peaks.',
    highlights: [
      'Comfortable valley stays in Rishikesh, Guptkashi & Sonprayag',
      'Organized Kedarnath temple darshan & scenic mountain trail assistance',
      'Evening Ganga Aarti by the quiet white sands of Rishikesh',
    ],
    gallery: [
      {
        id: 'kedar-1',
        title: 'Kedarnath Temple & Snow Peaks',
        imageUrl: '/src/assets/images/india_kedarnath_temple_1794982489180.jpg',
        description:
          'Perched at 3,583 meters, this ancient stone shrine stands calmly against towering snowy Himalayan walls and misty streams.',
      },
      {
        id: 'kedar-2',
        title: 'Rishikesh Suspension Bridge & Ganga',
        imageUrl: '/src/assets/images/india_rishikesh_ganga_1794982488813.jpg',
        description:
          'Start your ascent gently in Rishikesh with sunrise walks across the iconic bridge and riverside meditation.',
      },
      {
        id: 'kedar-3',
        title: 'Himalayan Cedar River Trails',
        imageUrl: '/src/assets/images/dest_manali_1794981285289.jpg',
        description:
          'Crisp mountain air, rushing glacial rivers, and tall deodar pine forests line the northern hill routes.',
      },
      {
        id: 'kedar-4',
        title: 'High Alpine Meadow Views',
        imageUrl: '/src/assets/images/manali_solang_valley_1794982490917.jpg',
        description:
          'Expansive green summer valleys beneath snow-capped ridges offer unforgettable spots to pause and breathe.',
      },
    ],
  },
  {
    id: 'madurai-hampi',
    name: 'Hampi & Madurai Temples',
    country: 'India · South Heritage',
    regionCategory: 'Indian Wonders & Temples',
    startingPriceInr: 6200,
    bestSeason: 'November – February',
    idealDuration: '5–6 Days',
    imageUrl: '/src/assets/images/india_hampi_chariot_1794982490213.jpg',
    tagline:
      'Explore Hampi’s carved granite Stone Chariot and Madurai’s towering colorful Meenakshi Temple.',
    easyDescription:
      'Discover South India’s finest architectural marvels without rushed crowds. Marvel at the famous carved Stone Chariot set among golden boulders in Hampi, and walk beneath the vibrant, intricately sculpted gopuram towers of Madurai’s Meenakshi Amman Temple.',
    highlights: [
      'Sunset guided walk at Hampi’s Vittala Temple & Stone Chariot',
      'Private heritage tour of Madurai’s Meenakshi Amman Temple',
      'Comfortable boutique stays and local South Indian culinary walks',
    ],
    gallery: [
      {
        id: 'south-1',
        title: 'Vittala Stone Chariot, Hampi',
        imageUrl: '/src/assets/images/india_hampi_chariot_1794982490213.jpg',
        description:
          'An iconic 16th-century granite chariot carved with moving stone wheels, framed by sunset boulders and coconut palms.',
      },
      {
        id: 'south-2',
        title: 'Meenakshi Amman Temple Gopuram',
        imageUrl: '/src/assets/images/india_meenakshi_temple_1794982490447.jpg',
        description:
          'Rising high over Madurai, these colorful tiered gateways showcase thousands of hand-painted and carved stone sculptures.',
      },
      {
        id: 'south-3',
        title: 'Kashi Heritage Architecture Comparison',
        imageUrl: '/src/assets/images/india_kashi_temple_1794982488435.jpg',
        description:
          'See how Dravidian South Indian gopurams contrast beautifully with North India’s Nagara-style sandstone shikharas.',
      },
      {
        id: 'south-4',
        title: 'Jaipur Royal Stone Craftsmanship',
        imageUrl: '/src/assets/images/india_jaipur_hawa_1794982490936.jpg',
        description:
          'Pair your heritage journey with Rajasthan’s famed sandstone latticework on an all-India temple & wonder pass.',
      },
    ],
  },
  {
    id: 'manali',
    name: 'Manali & Solang',
    country: 'India · Himachal',
    regionCategory: 'Mountains',
    startingPriceInr: 5800,
    bestSeason: 'March – June, Oct',
    idealDuration: '4–5 Days',
    imageUrl: '/src/assets/images/dest_manali_1794981285289.jpg',
    tagline:
      'Deodar cedar forests, clear mountain streams, Solang meadows, and cozy riverside stays.',
    easyDescription:
      'A classic, easy-to-reach Himalayan escape. Spend quiet mornings walking beside the Beas river under tall pine trees, ride up to Solang Valley’s open green slopes, and enjoy warm Himachali hospitality in wooden mountain cottages.',
    highlights: [
      'Private riverside cottage in Old Manali away from traffic',
      'Full-day excursion to Solang Valley & Atal Tunnel snow viewpoints',
      'Guided cedar forest trail walk & local orchard cafe stops',
    ],
    gallery: [
      {
        id: 'manali-1',
        title: 'Beas River & Deodar Forest Trail',
        imageUrl: '/src/assets/images/dest_manali_1794981285289.jpg',
        description:
          'Gentle stone footpaths beside rushing glacial water lined with tall cedar trees and clear views of snowy peaks.',
      },
      {
        id: 'manali-2',
        title: 'Solang Valley Green Meadows',
        imageUrl: '/src/assets/images/manali_solang_valley_1794982490917.jpg',
        description:
          'Wide wildflower meadows ideal for picnics, cable-car rides, and soft mountain sunsets.',
      },
      {
        id: 'manali-3',
        title: 'Himalayan Temple Architecture',
        imageUrl: '/src/assets/images/india_kedarnath_temple_1794982489180.jpg',
        description:
          'Experience traditional carved stone and timber Himalayan shrines nestled below snow ridges.',
      },
      {
        id: 'manali-4',
        title: 'Rishikesh Foothill River',
        imageUrl: '/src/assets/images/india_rishikesh_ganga_1794982488813.jpg',
        description:
          'Extend your northern hill trip south to Rishikesh’s calm riverbanks and sunrise suspension bridge walks.',
      },
    ],
  },
  {
    id: 'kashmir',
    name: 'Kashmir Valley',
    country: 'India · Srinagar & Gulmarg',
    regionCategory: 'Mountains',
    startingPriceInr: 7900,
    bestSeason: 'April – October',
    idealDuration: '5–6 Days',
    imageUrl: '/src/assets/images/dest_kashmir_1794981286401.jpg',
    tagline:
      'Calm dawn shikara rides on Dal Lake, cedar houseboats, and Gulmarg’s wildflower meadows.',
    easyDescription:
      'Often called heaven on earth, Kashmir moves at a gentle, poetic pace. Wake up inside a carved walnut-wood houseboat on Dal Lake, sip hot Kahwa tea as mist lifts off the water, and head up to Gulmarg’s endless green flower meadows.',
    highlights: [
      'Heritage cedar houseboat stay on quiet Nigeen & Dal Lake',
      'Private sunrise shikara ride past floating gardens',
      'Gulmarg Gondola ride & wildflower valley picnic',
    ],
    gallery: [
      {
        id: 'kash-1',
        title: 'Dal Lake Dawn Shikara Ride',
        imageUrl: '/src/assets/images/dest_kashmir_1794981286401.jpg',
        description:
          'Watch the rose-pink morning sky reflect across mirror-calm water as wooden shikaras glide past snow-capped peaks.',
      },
      {
        id: 'kash-2',
        title: 'Gulmarg Wildflower Meadows',
        imageUrl: '/src/assets/images/kashmir_gulmarg_meadow_1794982493657.jpg',
        description:
          'Vast green pastures dotted with yellow and purple wildflowers beneath jagged Himalayan summits.',
      },
      {
        id: 'kash-3',
        title: 'Amritsar Golden Temple Stopover',
        imageUrl: '/src/assets/images/india_golden_temple_1794982490078.jpg',
        description:
          'Many travelers pair Kashmir with a peaceful evening visit to the Golden Temple in Amritsar.',
      },
      {
        id: 'kash-4',
        title: 'Northern Alpine River Valleys',
        imageUrl: '/src/assets/images/dest_manali_1794981285289.jpg',
        description:
          'Crystal snowmelt streams and quiet pine groves similar to Pahalgam’s famed Lidder valley.',
      },
    ],
  },
  {
    id: 'switzerland',
    name: 'Switzerland',
    country: 'Swiss Alps',
    regionCategory: 'Mountains',
    startingPriceInr: 69500,
    bestSeason: 'May – September',
    idealDuration: '6–7 Days',
    imageUrl: '/src/assets/images/dest_switzerland_1794981284182.jpg',
    tagline:
      'Lauterbrunnen waterfalls, red panoramic mountain trains, and timeless timber chalets.',
    easyDescription:
      'Switzerland makes mountain travel effortless with clockwork scenic trains and spotless alpine villages. Ride the iconic red express across stone viaducts, wake up to 72 waterfalls in Lauterbrunnen valley, and stroll green pasture trails.',
    highlights: [
      'Panoramic Swiss rail pass across valleys and stone viaducts',
      'Boutique wooden chalet stays in Lauterbrunnen & Interlaken',
      'Lake Brienz cruise & glacier viewpoint excursion',
    ],
    gallery: [
      {
        id: 'sw-1',
        title: 'Lauterbrunnen Valley & Waterfalls',
        imageUrl: '/src/assets/images/dest_switzerland_1794981284182.jpg',
        description:
          'Dramatic sheer cliffs dropping into lush green meadows dotted with flower-lined wooden chalets.',
      },
      {
        id: 'sw-2',
        title: 'Red Panoramic Alpine Express',
        imageUrl: '/src/assets/images/swiss_alpine_train_1794982492477.jpg',
        description:
          'Glide comfortably over historic arched stone viaducts with floor-to-ceiling windows facing snow peaks.',
      },
      {
        id: 'sw-3',
        title: 'High Valley River Walk',
        imageUrl: '/src/assets/images/wanderly_hero_mountains_1794981284218.jpg',
        description:
          'Morning mist lifting off crystal mountain streams and quiet alpine villages.',
      },
      {
        id: 'sw-4',
        title: 'Paris Rail Connection',
        imageUrl: '/src/assets/images/dest_paris_1794981286284.jpg',
        description:
          'Under 4 hours by high-speed TGV train directly from Zurich or Geneva into the heart of Paris.',
      },
    ],
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    regionCategory: 'Tropical & Coastal',
    startingPriceInr: 29900,
    bestSeason: 'April – October',
    idealDuration: '5–6 Days',
    imageUrl: '/src/assets/images/dest_bali_1794981285221.jpg',
    tagline:
      'Misty emerald rice terraces in Ubud, sacred lakeside temples, and warm tropical villas.',
    easyDescription:
      'Ideal for travelers seeking warmth, nature, and calm culture on a smart Rupee budget. Spend mornings among Ubud’s layered green rice fields, visit serene lake temples shrouded in mist, and unwind at cliffside ocean cafes.',
    highlights: [
      'Private pool villa nestled beside Ubud rice terraces',
      'Sunrise tour of Ulun Danu Beratan lakeside water temple',
      'Dedicated private car & local English-speaking guide',
    ],
    gallery: [
      {
        id: 'bali-1',
        title: 'Ubud Emerald Rice Terraces',
        imageUrl: '/src/assets/images/dest_bali_1794981285221.jpg',
        description:
          'Walk quiet palm-shaded pathways across sculpted green terraces bathed in warm sunrise mist.',
      },
      {
        id: 'bali-2',
        title: 'Ulun Danu Beratan Water Temple',
        imageUrl: '/src/assets/images/bali_water_temple_1794982492602.jpg',
        description:
          'Multi-tiered shrine floating calmly on the mirror-still waters of highland Lake Beratan.',
      },
      {
        id: 'bali-3',
        title: 'Coastal Cliffs & Turquoise Bays',
        imageUrl: '/src/assets/images/santorini_red_beach_1794980887928.jpg',
        description:
          'Warm sun-drenched beaches and turquoise coves perfect for afternoon swimming and snorkeling.',
      },
      {
        id: 'bali-4',
        title: 'Tropical Cliffside Sunsets',
        imageUrl: '/src/assets/images/amalfi_positano_1794980888483.jpg',
        description:
          'Golden hour ocean views from cliffside terraces and relaxed coastal dining.',
      },
    ],
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    regionCategory: 'Iconic Cities',
    startingPriceInr: 58900,
    bestSeason: 'April – June, Sep – Oct',
    idealDuration: '5 Days',
    imageUrl: '/src/assets/images/dest_paris_1794981286284.jpg',
    tagline:
      'Tree-lined Haussmann avenues, Eiffel Tower twilight views, and relaxed Left Bank cafes.',
    easyDescription:
      'Designed so you enjoy Paris without rushing from line to line. Stroll leafy avenues toward the Eiffel Tower, skip museum queues with timed curator passes, and linger over fresh croissants in quiet Saint-Germain courtyards.',
    highlights: [
      'Boutique Left Bank hotel steps from Luxembourg Gardens',
      'Priority-access art & architecture walking tour',
      'Evening glass-boat dinner cruise on the Seine',
    ],
    gallery: [
      {
        id: 'paris-1',
        title: 'Avenue View Toward Eiffel Tower',
        imageUrl: '/src/assets/images/dest_paris_1794981286284.jpg',
        description:
          'Classic cream limestone facades, street cafes, and tree-lined cobblestone boulevards framing the Eiffel Tower.',
      },
      {
        id: 'paris-2',
        title: 'Mediterranean Coast Weekend Link',
        imageUrl: '/src/assets/images/amalfi_positano_1794980888483.jpg',
        description:
          'Short European flight south to sunlit pastel coastal towns for travelers extending their itinerary.',
      },
      {
        id: 'paris-3',
        title: 'Swiss Alpine Rail Link',
        imageUrl: '/src/assets/images/swiss_alpine_train_1794982492477.jpg',
        description:
          'Direct scenic rail connections bridge Parisian boulevards with snowy Swiss valleys.',
      },
      {
        id: 'paris-4',
        title: 'Historic Garden Terraces',
        imageUrl: '/src/assets/images/amalfi_ravello_1794980890637.jpg',
        description:
          'Sculpted stone promenades and flowering classical gardens perfect for late afternoon strolls.',
      },
    ],
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    regionCategory: 'Iconic Cities',
    startingPriceInr: 32500,
    bestSeason: 'November – March',
    idealDuration: '4–5 Days',
    imageUrl: '/src/assets/images/dest_dubai_1794981285588.jpg',
    tagline:
      'Golden Arabian desert dunes at twilight paired with soaring skyline views and marina yachts.',
    easyDescription:
      'Just a short direct flight from India, Dubai blends peaceful golden desert evenings with world-class architecture. Watch the sun dip behind rolling sand dunes from a private lantern-lit camp, then explore downtown skyline promenades.',
    highlights: [
      'Private twilight desert conservation camp & stargazing dinner',
      'Burj Khalifa observation deck & Old Dubai creek boat ride',
      'Luxury Dubai Marina twilight yacht cruise',
    ],
    gallery: [
      {
        id: 'dubai-1',
        title: 'Amber Desert Dunes & Skyline',
        imageUrl: '/src/assets/images/dest_dubai_1794981285588.jpg',
        description:
          'Soft wind-sculpted desert sands illuminated by lanterns with the glowing Burj Khalifa skyline on the horizon.',
      },
      {
        id: 'dubai-2',
        title: 'Coastal Marina & Blue Waters',
        imageUrl: '/src/assets/images/santorini_oia_1794980888493.jpg',
        description:
          'Bright coastal promenades and calm turquoise sea vistas ideal for sunset yacht charters.',
      },
      {
        id: 'dubai-3',
        title: 'Heritage Fort & Archways',
        imageUrl: '/src/assets/images/india_agra_fort_1794982487266.jpg',
        description:
          'Explore warm sandstone heritage quarters and shaded courtyard architecture.',
      },
      {
        id: 'dubai-4',
        title: 'Evening Waterfront Lights',
        imageUrl: '/src/assets/images/india_kashi_ghats_1794982488101.jpg',
        description:
          'Waterfront boat rides under twilight skies bring every evening alive along historic creeks.',
      },
    ],
  },
];

export const FEATURED_PACKAGES: TravelPackage[] = [
  {
    id: 'pkg-taj-heritage',
    destinationId: 'agra-taj',
    title: 'Taj Mahal Sunrise & Royal Jaipur Trail',
    locationLabel: 'Agra & Jaipur, India · Golden Triangle',
    duration: '4 Days / 3 Nights',
    days: 4,
    pricePerGuestInr: 5900,
    rating: 4.9,
    reviewCount: 284,
    description:
      'Witness the Taj Mahal at first light, tour Agra Fort with a historian, and continue to Jaipur’s rose-sandstone Hawa Mahal in a private AC vehicle.',
    imageUrl: '/src/assets/images/india_taj_mahal_1794982487231.jpg',
    inclusions: ['Heritage boutique stays', 'Sunrise Taj Mahal VIP entry', 'Private chauffeur car'],
  },
  {
    id: 'pkg-kashi-kedarnath',
    destinationId: 'varanasi-kashi',
    title: 'Sacred Kashi Temple & Ganga Aarti Retreat',
    locationLabel: 'Varanasi, India · Spiritual Heritage',
    duration: '4 Days / 3 Nights',
    days: 4,
    pricePerGuestInr: 5500,
    rating: 4.9,
    reviewCount: 196,
    description:
      'Guided Kashi Vishwanath darshan, peaceful dawn boat rides along the ghats, Sarnath heritage walk, and front-row evening Ganga Aarti.',
    imageUrl: '/src/assets/images/india_kashi_ghats_1794982488101.jpg',
    inclusions: ['Ghat-facing heritage hotel', 'Dawn & dusk private boat', 'Local spiritual guide'],
  },
  {
    id: 'pkg-kedarnath-yatra',
    destinationId: 'kedarnath-rishikesh',
    title: 'Kedarnath Dham & Rishikesh Himalayan Circuit',
    locationLabel: 'Uttarakhand, India · Sacred Himalayas',
    duration: '6 Days / 5 Nights',
    days: 6,
    pricePerGuestInr: 8500,
    rating: 4.9,
    reviewCount: 162,
    description:
      'Travel seamlessly from Rishikesh’s tranquil Ganga riverbanks up into high snow peaks for a guided, comfortable Kedarnath Temple journey.',
    imageUrl: '/src/assets/images/india_kedarnath_temple_1794982489180.jpg',
    inclusions: ['Riverside & valley lodges', 'Darshan registration support', 'All hill transfers & meals'],
  },
  {
    id: 'pkg-swiss-alpine',
    destinationId: 'switzerland',
    title: 'Swiss Alps & Scenic Glacier Express',
    locationLabel: 'Switzerland · Lauterbrunnen & Zermatt',
    duration: '7 Days / 6 Nights',
    days: 7,
    pricePerGuestInr: 72000,
    rating: 4.9,
    reviewCount: 148,
    description:
      'Ride the red panoramic mountain train across stone viaducts, stay in timber chalets, and explore green waterfall valleys.',
    imageUrl: '/src/assets/images/swiss_alpine_train_1794982492477.jpg',
    inclusions: ['Swiss Travel Rail Pass', 'Boutique alpine chalets', 'Guided valley walk'],
  },
  {
    id: 'pkg-kashmir-horizon',
    destinationId: 'kashmir',
    title: 'Dal Lake Houseboat & Gulmarg Meadows',
    locationLabel: 'Kashmir, India · Srinagar & Gulmarg',
    duration: '5 Days / 4 Nights',
    days: 5,
    pricePerGuestInr: 8900,
    rating: 4.8,
    reviewCount: 174,
    description:
      'Drift across Dal Lake at dawn in a traditional shikara, dine aboard a heritage walnut houseboat, and explore Gulmarg’s flower meadows.',
    imageUrl: '/src/assets/images/dest_kashmir_1794981286401.jpg',
    inclusions: ['Heritage cedar houseboat', 'Dawn shikara boat ride', 'Gulmarg cab & gondola pass'],
  },
  {
    id: 'pkg-bali-sanctuary',
    destinationId: 'bali',
    title: 'Ubud Rice Terraces & Water Temple Calm',
    locationLabel: 'Bali, Indonesia · Ubud & Bedugul',
    duration: '6 Days / 5 Nights',
    days: 6,
    pricePerGuestInr: 31500,
    rating: 4.9,
    reviewCount: 214,
    description:
      'Wake above misty emerald rice paddies in a private sanctuary villa, visit Ulun Danu lakeside temple, and unwind by the ocean.',
    imageUrl: '/src/assets/images/bali_water_temple_1794982492602.jpg',
    inclusions: ['Private pool sanctuary villa', 'Daily breakfast included', 'Private island driver'],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-1',
    name: 'Claire Laurent',
    location: 'Geneva, Switzerland',
    tripTaken: 'Taj Mahal & Jaipur Heritage · ₹5,900',
    rating: 5,
    quote:
      'Seeing the Taj Mahal in soft sunrise light with zero queue stress was unforgettable. Musafir truly lived up to har safar ek nayi kahani.',
    avatarUrl: '/src/assets/images/avatar_claire_1794981287693.jpg',
  },
  {
    id: 'rev-2',
    name: 'Arjun Mehta',
    location: 'Mumbai, India',
    tripTaken: 'Kedarnath & Rishikesh Circuit · ₹8,500',
    rating: 5,
    quote:
      'Everything from Rishikesh riverfront rooms to the mountain trail logistics was crystal clear in Rupees with zero surprise charges.',
    avatarUrl: '/src/assets/images/avatar_arjun_1794981287692.jpg',
  },
  {
    id: 'rev-3',
    name: 'Sophia Lin',
    location: 'Bengaluru, India',
    tripTaken: 'Varanasi Kashi & Ganga Aarti · ₹5,500',
    rating: 5,
    quote:
      'Our evening boat ride during Ganga Aarti and the peaceful sunrise walk through Kashi Vishwanath corridor felt magical and effortless.',
    avatarUrl: '/src/assets/images/avatar_sophia_1794981288230.jpg',
  },
];
