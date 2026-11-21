import React, { useState } from 'react';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  Landmark,
  MapPin,
  Search,
  Sparkles,
  Star,
  Utensils,
  X,
} from 'lucide-react';
import { getDistrictsByStateId } from '../data/indiaDistrictsData.ts';
import { formatINR } from '../data/travelData.ts';
import type { IndiaStateUT, ValuePriority } from '../types.ts';
import {
  calculateValueForMoney,
  getIndiaPlacePopularity,
} from '../utils/valueScore.ts';
import { GuideAIPanel } from './GuideAIPanel.tsx';
import { PlaceSpotifyPlayer } from './PlaceSpotifyPlayer.tsx';

interface IndiaPlaceModalProps {
  place: IndiaStateUT | null;
  valuePriority?: ValuePriority;
  onClose: () => void;
  onPlanTrip: (place: IndiaStateUT) => void;
}

type ModalTab = 'places' | 'food' | 'districts' | 'guide';

export const IndiaPlaceModal: React.FC<IndiaPlaceModalProps> = ({
  place,
  valuePriority = 'balanced',
  onClose,
  onPlanTrip,
}) => {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<ModalTab>('places');
  const [districtFilter, setDistrictFilter] = useState('');
  const [districtGuideQuery, setDistrictGuideQuery] = useState<{
    id: number;
    text: string;
  } | null>(null);

  if (!place) return null;

  const districts = getDistrictsByStateId(place.id);
  const filteredDistricts = districtFilter.trim()
    ? districts.filter((d) =>
        d.toLowerCase().includes(districtFilter.trim().toLowerCase())
      )
    : districts;

  const pop = getIndiaPlacePopularity(place.id);
  const valueBreakdown = calculateValueForMoney(
    place.startingBudgetInr,
    pop.rating,
    valuePriority
  );

  const photos = place.gallery.length > 0 ? place.gallery : [
    {
      title: place.imageTitle,
      imageUrl: place.imageUrl,
      caption: place.imageCaption,
    },
  ];
  const currentPhoto = photos[photoIdx] ?? photos[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="india-place-modal-title"
    >
      <div className="glass-panel bg-white w-full max-w-4xl rounded-[28px] overflow-hidden animate-fade-up max-h-[92vh] overflow-y-auto">
        {/* Top Real Photo Stage */}
        <div className="relative h-64 sm:h-80 bg-[#1b241e]">
          <img
            src={currentPhoto.imageUrl}
            alt={`${place.name} — ${currentPhoto.title}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close state details"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-[#141714] grid place-items-center cursor-pointer hover:bg-white shadow"
          >
            <X className="w-4 h-4" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() =>
                  setPhotoIdx((prev) => (prev - 1 + photos.length) % photos.length)
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 text-[#141714] grid place-items-center cursor-pointer hover:bg-white shadow"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => setPhotoIdx((prev) => (prev + 1) % photos.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 text-[#141714] grid place-items-center cursor-pointer hover:bg-white shadow"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="absolute bottom-5 left-6 right-6 text-white">
            <p className="text-xs font-medium text-white/85 mb-1">
              {place.kind} · Capital: {place.capital} · Best in {place.bestSeason}
            </p>
            <h3
              id="india-place-modal-title"
              className="font-editorial text-2xl sm:text-4xl font-semibold"
            >
              {place.name}
            </h3>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 bg-white">
          {/* Thumbnail Selector + Image Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-5 grid grid-cols-3 gap-2.5">
              {photos.map((photo, idx) => {
                const isSelected = idx === photoIdx;
                return (
                  <button
                    key={photo.title}
                    type="button"
                    onClick={() => setPhotoIdx(idx)}
                    aria-label={`View image ${photo.title}`}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all bg-[#ebe5da] ${
                      isSelected
                        ? 'ring-2 ring-[#1d4738] ring-offset-2 opacity-100'
                        : 'opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>

            <div className="md:col-span-7 bg-[#f7f5f0] rounded-2xl p-4 space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1d4738]">
                Image Details · Photo {photoIdx + 1} of {photos.length}
              </p>
              <p className="text-sm font-semibold text-[#141714]">{currentPhoto.title}</p>
              <p className="text-xs sm:text-sm text-[#5a6159] leading-relaxed">
                {currentPhoto.caption}
              </p>
            </div>
          </div>

          {/* Unboxed Verified Metadata & Overview */}
          <div className="space-y-2.5 border-b border-black/8 pb-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#5a6159]">
              <span className="text-[#1d4738] font-semibold">Verified India Directory</span>
              <span aria-hidden="true">·</span>
              <span>{place.region}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-mono tabular-nums font-semibold text-[#141714]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                {pop.rating.toFixed(1)} ({pop.reviews.toLocaleString('en-IN')})
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums font-semibold text-[#1d4738]">
                Value-for-Money: {valueBreakdown.score.toFixed(1)} / 10 ({valueBreakdown.tierLabel})
              </span>
              <span aria-hidden="true">·</span>
              <span>Languages: {place.languages}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {place.lat.toFixed(2)}°N, {place.lon.toFixed(2)}°E
              </span>
            </div>
            <p className="text-sm sm:text-base text-[#141714] leading-relaxed">
              {place.overview}
            </p>
          </div>

          {/* Interactive Tabs: Famous Places / Favorite Food / Guide AI */}
          <div
            className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-2xl sm:rounded-full bg-[#ebe5da]"
            role="tablist"
            aria-label="Explore state details"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'places'}
              onClick={() => setActiveTab('places')}
              className={`px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-all ${
                activeTab === 'places'
                  ? 'bg-[#141714] text-white shadow-sm'
                  : 'text-[#4a5149] hover:text-[#141714]'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Famous Places ({place.famousPlaces.length})</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'food'}
              onClick={() => setActiveTab('food')}
              className={`px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-all ${
                activeTab === 'food'
                  ? 'bg-[#141714] text-white shadow-sm'
                  : 'text-[#4a5149] hover:text-[#141714]'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Favorite Food ({place.favoriteFoods.length})</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'districts'}
              onClick={() => setActiveTab('districts')}
              className={`px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-all ${
                activeTab === 'districts'
                  ? 'bg-[#141714] text-white shadow-sm'
                  : 'text-[#4a5149] hover:text-[#141714]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="tabular-nums">Districts ({districts.length})</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'guide'}
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-all ${
                activeTab === 'guide'
                  ? 'bg-[#1d4738] text-white shadow-sm'
                  : 'text-[#1d4738] hover:text-[#141714]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Guide AI</span>
            </button>
          </div>

          {/* Tab Panel Content */}
          {activeTab === 'places' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {place.famousPlaces.map((spot) => (
                <div
                  key={spot.name}
                  className="bg-[#f7f5f0] rounded-2xl p-5 flex flex-col justify-between gap-3"
                >
                  <div>
                    <p className="text-[11px] font-medium text-[#5a6159] mb-1">
                      {spot.city} · {spot.category}
                    </p>
                    <h4 className="font-editorial text-lg font-semibold text-[#141714] mb-2">
                      {spot.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#5a6159] leading-relaxed">
                      {spot.description}
                    </p>
                  </div>
                  <p className="text-[11px] font-medium text-[#1d4738] pt-2 border-t border-black/8 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 shrink-0" />
                    <span>Best time: {spot.bestTime}</span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'food' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {place.favoriteFoods.map((dish) => (
                <div
                  key={dish.name}
                  className="bg-[#f7f5f0] rounded-2xl p-5 flex flex-col justify-between gap-2.5"
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1d4738] mb-1">
                      {dish.type}
                    </p>
                    <h4 className="font-editorial text-lg font-semibold text-[#141714] mb-2">
                      {dish.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#5a6159] leading-relaxed">
                      {dish.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'districts' && (
            <div className="bg-[#f7f5f0] rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1d4738] tabular-nums">
                  All {districts.length} Districts of {place.name} (Click any district for Guide AI)
                </p>
                {districts.length > 8 && (
                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 text-[#5a6159] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={districtFilter}
                      onChange={(e) => setDistrictFilter(e.target.value)}
                      placeholder={`Search ${place.name} districts...`}
                      aria-label={`Search districts in ${place.name}`}
                      className="w-full bg-white border border-black/10 rounded-full pl-8 pr-3 py-1.5 text-xs text-[#141714] placeholder:text-[#7c837a] focus:outline-none focus:border-[#1d4738]"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
                {filteredDistricts.map((district) => (
                  <div
                    key={district}
                    className="bg-white rounded-xl border border-black/8 px-3 py-2 flex items-center justify-between gap-1.5"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setDistrictGuideQuery({
                          id: Date.now(),
                          text: `Top visiting places and favorite food in ${district} district, ${place.name}, India`,
                        });
                        setActiveTab('guide');
                      }}
                      className="text-left text-xs font-medium text-[#141714] hover:text-[#1d4738] truncate cursor-pointer flex-1"
                      title={`Ask Guide AI about ${district}`}
                    >
                      {district}
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${district}, ${place.name}, India`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${district} on Google Maps`}
                      className="text-[#5a6159] hover:text-[#1d4738] shrink-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <GuideAIPanel
              selectedPlace={place}
              compact
              externalQuery={districtGuideQuery}
            />
          )}

          {/* Spotify Music Player for Visited Place */}
          <PlaceSpotifyPlayer
            placeName={place.name}
            searchContext={`${place.name} ${place.capital} India`}
          />

          {/* Footer Booking Bar */}
          <div className="pt-4 border-t border-black/8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#5a6159] block">
                Estimated Starting Package
              </span>
              <span className="font-mono tabular-nums text-2xl font-semibold text-[#141714]">
                {formatINR(place.startingBudgetInr)}{' '}
                <span className="font-sans text-xs font-normal text-[#5a6159]">
                  / guest
                </span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {activeTab !== 'guide' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('guide')}
                  className="bg-[#f7f5f0] hover:bg-[#ebe5da] text-[#141714] border border-black/10 text-xs sm:text-sm font-semibold px-4 py-3 rounded-full inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#1d4738]" />
                  <span>Ask Guide AI</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onPlanTrip(place)}
                className="bg-[#1d4738] hover:bg-[#15362a] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>Plan {place.name} Trip</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
