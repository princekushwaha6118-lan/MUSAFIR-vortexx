import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Images, SlidersHorizontal, Star } from 'lucide-react';
import { formatINR } from '../data/travelData.ts';
import type {
  DestinationRegion,
  MusafirDestination,
  ValuePriority,
} from '../types.ts';
import { calculateValueForMoney } from '../utils/valueScore.ts';

interface DestinationsSectionProps {
  destinations: MusafirDestination[];
  activeRegion: DestinationRegion;
  selectedSearchDest: string;
  maxBudgetInr: number | null;
  valuePriority: ValuePriority;
  onValuePriorityChange: (priority: ValuePriority) => void;
  onRegionChange: (region: DestinationRegion) => void;
  onClearSearchFilter: () => void;
  onResetBudget: () => void;
  onExploreDestination: (dest: MusafirDestination) => void;
}

type DestinationSortOption =
  | 'featured'
  | 'best-value'
  | 'top-rated'
  | 'lowest-price';

const REGIONS: DestinationRegion[] = [
  'All',
  'Indian Wonders & Temples',
  'Mountains',
  'Tropical & Coastal',
  'Iconic Cities',
];

const PRIORITY_OPTIONS: Array<{ id: ValuePriority; label: string }> = [
  { id: 'balanced', label: 'Balanced (50/50)' },
  { id: 'budget-first', label: 'Price Priority (70/30)' },
  { id: 'rating-first', label: 'Rating Priority (30/70)' },
];

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  destinations,
  activeRegion,
  selectedSearchDest,
  maxBudgetInr,
  valuePriority,
  onValuePriorityChange,
  onRegionChange,
  onClearSearchFilter,
  onResetBudget,
  onExploreDestination,
}) => {
  const [activePhotoByDest, setActivePhotoByDest] = useState<
    Record<string, number>
  >({});
  const [sortBy, setSortBy] = useState<DestinationSortOption>('best-value');

  const visibleDestinations = useMemo(() => {
    const filtered = destinations
      .filter((dest) => {
        const regionOk =
          activeRegion === 'All' || dest.regionCategory === activeRegion;
        const searchOk =
          selectedSearchDest === 'all' || dest.id === selectedSearchDest;
        const budgetOk =
          maxBudgetInr === null || dest.startingPriceInr <= maxBudgetInr;
        return regionOk && searchOk && budgetOk;
      })
      .map((dest) => ({
        dest,
        valueBreakdown: calculateValueForMoney(
          dest.startingPriceInr,
          dest.popularityRating,
          valuePriority
        ),
      }));

    if (sortBy === 'best-value') {
      return [...filtered].sort(
        (a, b) =>
          b.valueBreakdown.score - a.valueBreakdown.score ||
          a.dest.startingPriceInr - b.dest.startingPriceInr
      );
    }
    if (sortBy === 'top-rated') {
      return [...filtered].sort(
        (a, b) =>
          b.dest.popularityRating - a.dest.popularityRating ||
          b.dest.reviewCount - a.dest.reviewCount
      );
    }
    if (sortBy === 'lowest-price') {
      return [...filtered].sort(
        (a, b) => a.dest.startingPriceInr - b.dest.startingPriceInr
      );
    }
    return filtered;
  }, [destinations, activeRegion, selectedSearchDest, maxBudgetInr, valuePriority, sortBy]);

  return (
    <section
      id="destinations"
      className="mx-auto max-w-[1280px] px-4 sm:px-6 py-16 lg:py-20"
    >
      <div id="explore" className="scroll-mt-24" />
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1d4738] mb-2">
            Indian Wonders, Temples &amp; Global Escapes
          </p>
          <h2 className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight text-[#141714] [text-wrap:balance]">
            Popular{' '}
            <em className="font-editorial italic font-medium">Destinations</em>
          </h2>
          <p className="text-sm sm:text-base text-[#5a6159] mt-2 max-w-2xl">
            Every destination shows a live Value-for-Money score calculated from
            its Rupee price and traveler popularity rating.
            {maxBudgetInr !== null && (
              <span className="font-medium text-[#1d4738]">
                {' '}
                · Filtered under {formatINR(maxBudgetInr)}
              </span>
            )}
          </p>
        </div>

        {/* Interactive Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {maxBudgetInr !== null && (
            <button
              type="button"
              onClick={onResetBudget}
              className="text-xs font-semibold text-[#1d4738] underline underline-offset-4 mr-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              Clear budget ({formatINR(maxBudgetInr)})
            </button>
          )}
          {selectedSearchDest !== 'all' && (
            <button
              type="button"
              onClick={onClearSearchFilter}
              className="text-xs font-semibold text-[#1d4738] underline underline-offset-4 mr-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              Show all {destinations.length} places
            </button>
          )}
          <div
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-2xl sm:rounded-full bg-[#ebe5da]"
            role="tablist"
            aria-label="Filter destinations by category"
          >
            {REGIONS.map((region) => {
              const active = activeRegion === region;
              return (
                <button
                  key={region}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onRegionChange(region)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-all ${
                    active
                      ? 'bg-[#141714] text-white shadow-sm'
                      : 'text-[#4a5149] hover:text-[#141714]'
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Value-for-Money Calculator Weighting & Sort Bar */}
      <div className="bg-white rounded-2xl border border-black/8 px-4 sm:px-5 py-3.5 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#141714] whitespace-nowrap">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#1d4738]" />
            <span>Value-for-Money Weighting:</span>
          </span>
          <div
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full bg-[#f7f5f0] border border-black/6"
            role="group"
            aria-label="Choose price vs popularity weighting for Value-for-Money score"
          >
            {PRIORITY_OPTIONS.map((option) => {
              const active = valuePriority === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onValuePriorityChange(option.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    active
                      ? 'bg-[#1d4738] text-white'
                      : 'text-[#4a5149] hover:text-[#141714]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <label
            htmlFor="dest-sort-select"
            className="text-xs font-semibold text-[#5a6159] whitespace-nowrap"
          >
            Sort Destinations:
          </label>
          <select
            id="dest-sort-select"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as DestinationSortOption)
            }
            className="bg-[#f7f5f0] border border-black/10 rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#141714] focus:outline-none focus:border-[#1d4738] cursor-pointer"
          >
            <option value="best-value">Highest Value-for-Money</option>
            <option value="top-rated">Highest Popularity Rating</option>
            <option value="lowest-price">Lowest Price First</option>
            <option value="featured">Featured Order</option>
          </select>
        </div>
      </div>

      {visibleDestinations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-black/8 p-12 text-center">
          <p className="font-editorial text-2xl font-medium text-[#141714] mb-2">
            No destinations match your current filters
          </p>
          <p className="text-sm text-[#5a6159] mb-5">
            Reset the budget, category, or search selection to browse all places.
          </p>
          <button
            type="button"
            onClick={() => {
              onRegionChange('All');
              onClearSearchFilter();
              onResetBudget();
            }}
            className="bg-[#1d4738] text-white text-sm font-semibold px-5 py-2.5 rounded-full cursor-pointer"
          >
            View All Destinations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {visibleDestinations.map(({ dest, valueBreakdown }) => {
            const activeIndex = activePhotoByDest[dest.id] ?? 0;
            const activePhoto = dest.gallery[activeIndex] ?? dest.gallery[0];
            const barWidthPct = Math.round(valueBreakdown.score * 10);
            const isHighTier = valueBreakdown.score >= 7.2;

            return (
              <article
                key={dest.id}
                className="group bg-white rounded-[26px] border border-black/6 overflow-hidden shadow-[0_8px_28px_rgba(20,23,20,0.04)] hover:shadow-[0_18px_44px_rgba(20,23,20,0.09)] transition-all duration-300 flex flex-col"
              >
                {/* Main Photo */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#ebe5da]">
                  <img
                    src={activePhoto?.imageUrl ?? dest.imageUrl}
                    alt={`${dest.name} — ${activePhoto?.title ?? dest.name}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"
                  />
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-3 text-white">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-white/80">
                        Spot {activeIndex + 1} of {dest.gallery.length}
                      </p>
                      <p className="text-sm font-semibold truncate">
                        {activePhoto?.title}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono tabular-nums text-white/90 shrink-0">
                      <Images className="w-3.5 h-3.5" />
                      {dest.gallery.length} photos
                    </span>
                  </div>
                </div>

                {/* Interactive 4–5 Photo Thumbnail Strip */}
                <div className="px-4 pt-3 flex items-center gap-2">
                  {dest.gallery.map((photo, idx) => {
                    const isCurrent = idx === activeIndex;
                    return (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() =>
                          setActivePhotoByDest((prev) => ({
                            ...prev,
                            [dest.id]: idx,
                          }))
                        }
                        aria-label={`View ${photo.title}`}
                        className={`relative flex-1 h-12 rounded-xl overflow-hidden cursor-pointer transition-all ${
                          isCurrent
                            ? 'ring-2 ring-[#1d4738] ring-offset-1 opacity-100'
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

                {/* Card Copy, Popularity Rating & Value-for-Money Meter */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-[#5a6159] mb-1 flex flex-wrap items-center gap-x-1.5">
                      <span>{dest.country}</span>
                      <span aria-hidden="true">·</span>
                      <span>{dest.idealDuration}</span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 text-[#141714] font-mono tabular-nums font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        {dest.popularityRating.toFixed(1)}
                      </span>
                      <span className="font-mono tabular-nums">
                        ({dest.reviewCount.toLocaleString('en-IN')})
                      </span>
                    </p>
                    <h3 className="font-editorial text-2xl font-semibold text-[#141714] mb-2">
                      {dest.name}
                    </h3>
                    <p className="text-sm text-[#5a6159] leading-relaxed">
                      {dest.easyDescription}
                    </p>
                  </div>

                  {/* Calculated Value-for-Money Score Block */}
                  <div className="space-y-3">
                    <div className="pt-3.5 border-t border-black/8 space-y-1.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-semibold text-[#141714]">
                          Value-for-Money
                          <span className="font-medium text-[#5a6159]">
                            {' '}
                            · {valueBreakdown.tierLabel}
                          </span>
                        </span>
                        <span
                          className={`font-mono tabular-nums text-sm font-bold ${
                            isHighTier ? 'text-[#1d4738]' : 'text-[#b45309]'
                          }`}
                        >
                          {valueBreakdown.score.toFixed(1)} / 10
                        </span>
                      </div>

                      <div
                        className="w-full h-1.5 rounded-full bg-[#ebe5da] overflow-hidden"
                        role="progressbar"
                        aria-valuenow={valueBreakdown.score}
                        aria-valuemin={0}
                        aria-valuemax={10}
                        aria-label={`Value-for-Money score for ${dest.name}: ${valueBreakdown.score} out of 10`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isHighTier ? 'bg-[#1d4738]' : 'bg-[#b45309]'
                          }`}
                          style={{ width: `${barWidthPct}%` }}
                        />
                      </div>

                      <p className="text-[11px] font-mono tabular-nums text-[#5a6159]">
                        Price efficiency {valueBreakdown.priceScore.toFixed(1)} (
                        {valueBreakdown.priceWeightPct}%) · Popularity{' '}
                        {valueBreakdown.popularityScore.toFixed(1)} (
                        {valueBreakdown.ratingWeightPct}%)
                      </p>
                    </div>

                    <div className="pt-3 border-t border-black/8 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-[#5a6159] block">
                          Starting from
                        </span>
                        <span className="font-mono tabular-nums text-lg font-semibold text-[#141714]">
                          {formatINR(dest.startingPriceInr)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onExploreDestination(dest)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold bg-[#f7f5f0] hover:bg-[#1d4738] text-[#141714] hover:text-white border border-black/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <span>Explore ({dest.gallery.length} Pics)</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
