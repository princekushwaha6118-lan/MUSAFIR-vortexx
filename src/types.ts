export type DestinationRegion =
  | 'All'
  | 'Indian Wonders & Temples'
  | 'Mountains'
  | 'Tropical & Coastal'
  | 'Iconic Cities';

export interface PlacePhoto {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

export interface MusafirDestination {
  id: string;
  name: string;
  country: string;
  regionCategory: Exclude<DestinationRegion, 'All'>;
  startingPriceInr: number;
  bestSeason: string;
  idealDuration: string;
  imageUrl: string;
  tagline: string;
  easyDescription: string;
  highlights: string[];
  gallery: PlacePhoto[];
}

export interface TravelPackage {
  id: string;
  destinationId: string;
  title: string;
  locationLabel: string;
  duration: string;
  days: number;
  pricePerGuestInr: number;
  rating: number;
  reviewCount: number;
  description: string;
  imageUrl: string;
  inclusions: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  tripTaken: string;
  rating: number;
  quote: string;
  avatarUrl: string;
}

export interface BookingRecord {
  id: string;
  destinationName: string;
  packageTitle: string;
  checkIn: string;
  checkOut: string;
  travelers: number;
  totalPriceInr: number;
  guestName: string;
  guestEmail: string;
  createdAt: string;
}

export interface UserSession {
  name: string;
  email: string;
}

export type IndiaRegion =
  | 'All'
  | 'North'
  | 'South'
  | 'East'
  | 'West'
  | 'Central'
  | 'Northeast'
  | 'Union Territories';

export interface IndiaFamousPlace {
  name: string;
  city: string;
  category: string;
  bestTime: string;
  description: string;
}

export interface IndiaFavoriteFood {
  name: string;
  type: 'Vegetarian' | 'Classic' | 'Street Food' | 'Dessert' | 'Seafood';
  description: string;
}

export interface IndiaGalleryPhoto {
  title: string;
  imageUrl: string;
  caption: string;
}

export interface IndiaStateUT {
  id: string;
  name: string;
  kind: 'State' | 'Union Territory';
  capital: string;
  region: Exclude<IndiaRegion, 'All'>;
  lat: number;
  lon: number;
  bestSeason: string;
  languages: string;
  startingBudgetInr: number;
  imageUrl: string;
  imageTitle: string;
  imageCaption: string;
  gallery: IndiaGalleryPhoto[];
  overview: string;
  famousPlaces: IndiaFamousPlace[];
  favoriteFoods: IndiaFavoriteFood[];
}

export interface GuideMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  stateName?: string;
}

