import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Compass,
  MapPin,
  Search,
  Star,
  Tag,
  X,
} from 'lucide-react';
import { INDIA_STATES_AND_UTS } from '../data/indiaStatesData.ts';
import {
  DESTINATIONS,
  FEATURED_PACKAGES,
  formatINR,
} from '../data/travelData.ts';
import type {
  IndiaStateUT,
  MusafirDestination,
  TravelPackage,
  ValuePriority,
} from '../types.ts';
import {
  calculateValueForMoney,
  getIndiaPlacePopularity,
} from '../utils/valueScore.ts';

interface PlaceSearchModalProps {
  open: boolean;
  valuePriority?: ValuePriority;
  onClose: () => void;
  onSelectDestination: (dest: MusafirDestination) => void;
  onSelectIndiaPlace: (place: IndiaStateUT) => void;
  onSelectPackage: (pkg: TravelPackage) => void;
}

type SearchResultItem =
  | {
      key: string;
      kind: 'Destination';
      title: string;
      subtitle: string;
      priceInr: number;
      rating: number;
      valueScore: number;
      imageUrl: string;
      dest: MusafirDestination;
    }
  | {
      key: string;
      kind: 'State' | 'Union Territory';
      title: string;
      subtitle: string;
      priceInr: number;
      rating: number;
      valueScore: number;
      imageUrl: string;
      place: IndiaStateUT;
    }
  | {
      key: string;
      kind: 'Package';
      title: string;
      subtitle: string;
      priceInr: number;
      rating: number;
      valueScore: number;
      imageUrl: string;
      pkg: TravelPackage;
    };

const QUICK_POPULAR_TERMS = [
  'Taj Mahal',
  'Kedarnath',
  'Varanasi',
  'Jaipur',
  'Goa',
  'Kashmir',
  'Kerala',
  'Bali',
];

export const PlaceSearchModal: React.FC<PlaceSearchModalProps> = ({
  open,
  valuePriority = 'balanced',
  onClose,
  onSelectDestination,
  onSelectIndiaPlace,
  onSelectPackage,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 30);
    return () => window.clearTimeout(timer);
  }, [open]);

  const results = useMemo<SearchResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    const items: SearchResultItem[] = [];

    for (const dest of DESTINATIONS) {
      const hay = [
        dest.name,
        dest.country,
        dest.regionCategory,
        dest.tagline,
        ...dest.highlights,
        ...dest.gallery.map((g) => g.title),
      ]
        .join(' ')
        .toLowerCase();

      if (!q || hay.includes(q)) {
        const val = calculateValueForMoney(
          dest.startingPriceInr,
          dest.popularityRating,
          valuePriority
        );
        items.push({
          key: `dest-${dest.id}`,
          kind: 'Destination',
          title: dest.name,
          subtitle: dest.country,
          priceInr: dest.startingPriceInr,
          rating: dest.popularityRating,
          valueScore: val.score,
          imageUrl: dest.imageUrl,
          dest,
        });
      }
    }

    for (const place of INDIA_STATES_AND_UTS) {
      const matchedLandmark = q
        ? place.famousPlaces.find(
            (fp) =>
              fp.name.toLowerCase().includes(q) ||
              fp.city.toLowerCase().includes(q)
          )
        : undefined;
      const matchedFood = q
        ? place.favoriteFoods.find((ff) => ff.name.toLowerCase().includes(q))
        : undefined;

      const hay = [
        place.name,
        place.capital,
        place.region,
        place.overview,
        ...place.famousPlaces.map((fp) => `${fp.name} ${fp.city}`),
        ...place.favoriteFoods.map((ff) => ff.name),
      ]
        .join(' ')
        .toLowerCase();

      if (!q || hay.includes(q)) {
        const pop = getIndiaPlacePopularity(place.id);
        const val = calculateValueForMoney(
          place.startingBudgetInr,
          pop.rating,
          valuePriority
        );
        const matchHint = matchedLandmark
          ? `${matchedLandmark.name}, ${matchedLandmark.city}`
          : matchedFood
          ? `Famous food: ${matchedFood.name}`
          : `Capital: ${place.capital} · ${place.famousPlaces
              .slice(0, 2)
              .map((f) => f.name)
              .join(', ')}`;

        items.push({
          key: `india-${place.id}`,
          kind: place.kind,
          title: place.name,
          subtitle: matchHint,
          priceInr: place.startingBudgetInr,
          rating: pop.rating,
          valueScore: val.score,
          imageUrl: place.imageUrl,
          place,
        });
      }
    }

    for (const pkg of FEATURED_PACKAGES) {
      const hay = [pkg.title, pkg.locationLabel, pkg.description]
        .join(' ')
        .toLowerCase();
      if (q && hay.includes(q)) {
        const val = calculateValueForMoney(
          pkg.pricePerGuestInr,
          pkg.rating,
          valuePriority
        );
        items.push({
          key: `pkg-${pkg.id}`,
          kind: 'Package',
          title: pkg.title,
          subtitle: `${pkg.locationLabel} · ${pkg.duration}`,
          priceInr: pkg.pricePerGuestInr,
          rating: pkg.rating,
          valueScore: val.score,
          imageUrl: pkg.imageUrl,
          pkg,
        });
      }
    }

    // Prioritize exact/starts-with title matches first when searching
    if (q) {
      items.sort((a, b) => {
        const aStarts = a.title.toLowerCase().startsWith(q) ? 0 : 1;
        const bStarts = b.title.toLowerCase().startsWith(q) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        const aInTitle = a.title.toLowerCase().includes(q) ? 0 : 1;
        const bInTitle = b.title.toLowerCase().includes(q) ? 0 : 1;
        return aInTitle - bInTitle;
      });
    }

    return q ? items.slice(0, 14) : items.slice(0, 10);
  }, [query, valuePriority]);

  const handleChoose = (item: SearchResultItem) => {
    onClose();
    if (item.kind === 'Destination') {
      onSelectDestination(item.dest);
    } else if (item.kind === 'Package') {
      onSelectPackage(item.pkg);
    } else {
      onSelectIndiaPlace(item.place);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-16 bg-black/55 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search destinations, Indian states, landmarks, and packages"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-panel bg-white w-full max-w-2xl rounded-[26px] overflow-hidden shadow-2xl animate-fade-up">
        {/* Search Input Header */}
        <div className="p-4 sm:p-5 border-b border-black/8 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#1d4738] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onClose();
              } else if (e.key === 'ArrowDown' && results.length > 0) {
                e.preventDefault();
                setActiveIndex((prev) => (prev + 1) % results.length);
              } else if (e.key === 'ArrowUp' && results.length > 0) {
                e.preventDefault();
                setActiveIndex(
                  (prev) => (prev - 1 + results.length) % results.length
                );
              } else if (e.key === 'Enter' && results[activeIndex]) {
                e.preventDefault();
                handleChoose(results[activeIndex]);
              }
            }}
            placeholder="Search any place, state, temple, landmark, or food..."
            aria-label="Search places across India and the world"
            className="flex-1 bg-transparent text-sm sm:text-base font-medium text-[#141714] placeholder:text-[#7c837a] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setActiveIndex(0);
                inputRef.current?.focus();
              }}
              aria-label="Clear search query"
              className="text-xs font-semibold text-[#5a6159] hover:text-[#141714] px-2 py-1 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close place search"
            className="w-9 h-9 rounded-full bg-[#f7f5f0] hover:bg-[#ebe5da] text-[#141714] grid place-items-center cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Popular Quick Terms */}
        <div className="px-4 sm:px-5 py-3 bg-[#f7f5f0]/80 border-b border-black/8 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5a6159] mr-1">
            Quick Find:
          </span>
          {QUICK_POPULAR_TERMS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setQuery(term);
                setActiveIndex(0);
                inputRef.current?.focus();
              }}
              className={`text-xs font-medium px-2.5 py-1 rounded-lg border cursor-pointer transition-colors ${
                query.toLowerCase() === term.toLowerCase()
                  ? 'bg-[#141714] text-white border-[#141714]'
                  : 'bg-white text-[#141714] border-black/10 hover:bg-[#ebe5da]'
              }`}
            >
              {term}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 sm:p-4 space-y-1.5">
          {results.length === 0 ? (
            <div className="py-10 px-4 text-center space-y-2">
              <Compass className="w-7 h-7 text-[#1d4738] mx-auto" />
              <p className="font-editorial text-xl font-semibold text-[#141714]">
                No matching place found for “{query}”
              </p>
              <p className="text-xs sm:text-sm text-[#5a6159]">
                Try searching by Indian state, union territory, temple, city, or
                destination name like Jaipur, Kedarnath, Goa, or Bali.
              </p>
            </div>
          ) : (
            results.map((item, idx) => {
              const isHighlighted = idx === activeIndex;
              return (
                <button
                  key={item.key}
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => handleChoose(item)}
                  className={`w-full text-left rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                    isHighlighted ? 'bg-[#e7ede9]' : 'hover:bg-[#f7f5f0]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover shrink-0 bg-[#ebe5da]"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5a6159]">
                        {item.kind === 'Package' ? (
                          <Tag className="w-3 h-3 text-[#1d4738] shrink-0" />
                        ) : (
                          <MapPin className="w-3 h-3 text-[#1d4738] shrink-0" />
                        )}
                        <span className="font-semibold text-[#1d4738]">
                          {item.kind}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-0.5 font-mono tabular-nums font-semibold text-[#141714]">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          {item.rating.toFixed(1)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums text-[#1d4738] font-semibold">
                          Value {item.valueScore.toFixed(1)}/10
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#141714] truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#5a6159] truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="font-mono tabular-nums text-xs sm:text-sm font-semibold text-[#141714]">
                      {formatINR(item.priceInr)}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[#1d4738]" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
