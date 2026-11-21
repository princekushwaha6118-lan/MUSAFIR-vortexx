import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Building2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Landmark,
  MapPin,
  Search,
  Sparkles,
  Star,
  Utensils,
} from 'lucide-react';
import {
  INDIA_STATES_AND_UTS,
  MAP_HEIGHT,
  MAP_WIDTH,
  TOTAL_STATES_COUNT,
  TOTAL_UTS_COUNT,
  projectIndiaPoint,
} from '../data/indiaStatesData.ts';
import { INDIA_STATE_BORDER_PATHS } from '../data/indiaStateBorders.ts';
import { getDistrictsByStateId } from '../data/indiaDistrictsData.ts';
import { formatINR } from '../data/travelData.ts';
import type { IndiaRegion, IndiaStateUT, ValuePriority } from '../types.ts';
import {
  calculateValueForMoney,
  getIndiaPlacePopularity,
} from '../utils/valueScore.ts';
import { BudgetPicker } from './BudgetPicker.tsx';
import { GoogleIndiaMap } from './GoogleIndiaMap.tsx';
import { GuideAIPanel } from './GuideAIPanel.tsx';

interface ExploreIndiaSectionProps {
  maxBudgetInr: number | null;
  onBudgetChange: (budget: number | null) => void;
  matchingDestinationsCount: number;
  matchingPackagesCount: number;
  valuePriority?: ValuePriority;
  onOpenPlace: (place: IndiaStateUT) => void;
}

const INDIA_REGIONS: IndiaRegion[] = [
  'All',
  'North',
  'South',
  'East',
  'West',
  'Central',
  'Northeast',
  'Union Territories',
];

export const ExploreIndiaSection: React.FC<ExploreIndiaSectionProps> = ({
  maxBudgetInr,
  onBudgetChange,
  matchingDestinationsCount,
  matchingPackagesCount,
  valuePriority = 'balanced',
  onOpenPlace,
}) => {
  const [regionFilter, setRegionFilter] = useState<IndiaRegion>('All');
  const [kindFilter, setKindFilter] = useState<'All' | 'State' | 'Union Territory'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByValue, setSortByValue] = useState(false);
  const [showAllCards, setShowAllCards] = useState(false);

  const defaultFocused = useMemo(
    () =>
      INDIA_STATES_AND_UTS.find((s) => s.id === 'uttar-pradesh') ??
      INDIA_STATES_AND_UTS[0],
    []
  );
  const [focusedPlace, setFocusedPlace] = useState<IndiaStateUT>(defaultFocused);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'atlas' | 'google'>('atlas');
  const [districtQuery, setDistrictQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [districtGuideQuery, setDistrictGuideQuery] = useState<{
    id: number;
    text: string;
  } | null>(null);

  const selectStateOnMap = (place: IndiaStateUT) => {
    setFocusedPlace(place);
    setHoveredId(null);
    setDistrictQuery('');
    setSelectedDistrict(null);
  };

  const focusedDistricts = useMemo(
    () => getDistrictsByStateId(focusedPlace.id),
    [focusedPlace.id]
  );

  const visibleFocusedDistricts = useMemo(() => {
    const q = districtQuery.trim().toLowerCase();
    if (!q) return focusedDistricts;
    return focusedDistricts.filter((d) => d.toLowerCase().includes(q));
  }, [focusedDistricts, districtQuery]);

  const budgetMatchingStatesCount = useMemo(
    () =>
      INDIA_STATES_AND_UTS.filter(
        (p) => maxBudgetInr === null || p.startingBudgetInr <= maxBudgetInr
      ).length,
    [maxBudgetInr]
  );

  const filteredPlaces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const matched = INDIA_STATES_AND_UTS.filter((place) => {
      const regionMatch = regionFilter === 'All' || place.region === regionFilter;
      const kindMatch = kindFilter === 'All' || place.kind === kindFilter;
      const budgetMatch =
        maxBudgetInr === null || place.startingBudgetInr <= maxBudgetInr;
      if (!regionMatch || !kindMatch || !budgetMatch) return false;
      if (!q) return true;
      const inName = place.name.toLowerCase().includes(q);
      const inCapital = place.capital.toLowerCase().includes(q);
      const inPlaces = place.famousPlaces.some(
        (fp) =>
          fp.name.toLowerCase().includes(q) || fp.city.toLowerCase().includes(q)
      );
      const inFoods = place.favoriteFoods.some((ff) =>
        ff.name.toLowerCase().includes(q)
      );
      return inName || inCapital || inPlaces || inFoods;
    });
    if (!sortByValue) return matched;
    return [...matched].sort((a, b) => {
      const scoreA = calculateValueForMoney(
        a.startingBudgetInr,
        getIndiaPlacePopularity(a.id).rating,
        valuePriority
      ).score;
      const scoreB = calculateValueForMoney(
        b.startingBudgetInr,
        getIndiaPlacePopularity(b.id).rating,
        valuePriority
      ).score;
      return scoreB - scoreA || a.startingBudgetInr - b.startingBudgetInr;
    });
  }, [regionFilter, kindFilter, maxBudgetInr, searchQuery, sortByValue, valuePriority]);

  const filteredIds = useMemo(
    () => new Set(filteredPlaces.map((p) => p.id)),
    [filteredPlaces]
  );

  const isFiltered =
    regionFilter !== 'All' ||
    kindFilter !== 'All' ||
    maxBudgetInr !== null ||
    searchQuery.trim().length > 0 ||
    sortByValue;
  const visibleGridPlaces =
    isFiltered || showAllCards ? filteredPlaces : filteredPlaces.slice(0, 9);

  const hoveredPlace = useMemo(
    () => INDIA_STATES_AND_UTS.find((p) => p.id === hoveredId) ?? null,
    [hoveredId]
  );
  const previewPlace = hoveredPlace ?? focusedPlace;
  const previewPopularity = getIndiaPlacePopularity(previewPlace.id);
  const previewValue = calculateValueForMoney(
    previewPlace.startingBudgetInr,
    previewPopularity.rating,
    valuePriority
  );

  return (
    <section
      id="explore-india"
      className="mx-auto max-w-[1280px] px-4 sm:px-6 py-16 lg:py-20 scroll-mt-24"
    >
      {/* Editorial Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1d4738] mb-2">
            Verified India Atlas · {TOTAL_STATES_COUNT} States &amp; {TOTAL_UTS_COUNT}{' '}
            Union Territories
          </p>
          <h2 className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight text-[#141714] [text-wrap:balance]">
            Explore{' '}
            <em className="font-editorial italic font-medium">Incredible India</em>
          </h2>
          <p className="text-sm sm:text-base text-[#5a6159] mt-2 max-w-2xl leading-relaxed">
            Click any dot on the India map—or select any of the 28 states and 8
            union territories below—to explore real photos, famous landmarks,
            favorite regional food, and live MUSAFIR Guide AI.
          </p>
        </div>

        {/* Region Filter Tabs */}
        <div
          className="inline-flex flex-wrap items-center gap-1 p-1 rounded-2xl sm:rounded-full bg-[#ebe5da]"
          role="tablist"
          aria-label="Filter India map and directory by region"
        >
          {INDIA_REGIONS.map((region) => {
            const active = regionFilter === region;
            return (
              <button
                key={region}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setRegionFilter(region)}
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

      {/* Interactive Price / Budget Selector */}
      <BudgetPicker
        maxBudgetInr={maxBudgetInr}
        onBudgetChange={onBudgetChange}
        matchingStatesCount={budgetMatchingStatesCount}
        matchingDestinationsCount={matchingDestinationsCount}
        matchingPackagesCount={matchingPackagesCount}
        onOpenIndiaPlace={(place) => {
          setFocusedPlace(place);
          onOpenPlace(place);
        }}
      />

      {/* 2-Column Split: Interactive India Map (Left) + Live Preview & Guide AI (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch mb-14">
        {/* Interactive India Map Card */}
        <div className="lg:col-span-7 bg-white rounded-[28px] border border-black/8 p-5 sm:p-7 flex flex-col justify-between shadow-[0_12px_36px_rgba(20,23,20,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-[#141714]">
                Interactive Map of India
              </h3>
              <p className="text-xs text-[#5a6159] mt-0.5">
                Touch any state to highlight its border and see visiting places &amp; favorite food
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div
                className="inline-flex items-center p-1 rounded-full bg-[#ebe5da]"
                role="tablist"
                aria-label="Switch map view mode"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mapMode === 'atlas'}
                  onClick={() => setMapMode('atlas')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                    mapMode === 'atlas'
                      ? 'bg-[#141714] text-white'
                      : 'text-[#4a5149] hover:text-[#141714]'
                  }`}
                >
                  Border &amp; Dots
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mapMode === 'google'}
                  onClick={() => setMapMode('google')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                    mapMode === 'google'
                      ? 'bg-[#141714] text-white'
                      : 'text-[#4a5149] hover:text-[#141714]'
                  }`}
                >
                  Google Maps
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs font-medium text-[#4a5149]">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="w-2.5 h-2.5 rounded-full bg-[#1d4738] inline-block"
                  />
                  States ({TOTAL_STATES_COUNT})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="w-2.5 h-2.5 rounded-full bg-[#b45309] inline-block"
                  />
                  UTs ({TOTAL_UTS_COUNT})
                </span>
              </div>
            </div>
          </div>

          {mapMode === 'google' ? (
            <GoogleIndiaMap
              places={INDIA_STATES_AND_UTS}
              filteredIds={filteredIds}
              selectedPlace={focusedPlace}
              valuePriority={valuePriority}
              onFocusPlace={(place) => setFocusedPlace(place)}
              onOpenPlace={onOpenPlace}
              onSwitchToAtlas={() => setMapMode('atlas')}
            />
          ) : (
          <div className="space-y-4">
            <div className="relative bg-[#f7f5f0] rounded-[22px] border border-black/6 overflow-hidden flex items-center justify-center p-2 sm:p-4">
              <svg
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                role="img"
                aria-label="Interactive India map with clickable state borders and dots for all 28 states and 8 union territories"
                className="w-full h-auto max-h-[580px] select-none"
              >
                <defs>
                  <filter
                    id="active-state-glow"
                    x="-15%"
                    y="-15%"
                    width="130%"
                    height="130%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="2"
                      stdDeviation="3"
                      floodColor="#141714"
                      floodOpacity="0.22"
                    />
                  </filter>
                </defs>

                {/* All 36 Interactive State & Union Territory Borders (sorted so active state border paints cleanly on top) */}
                {INDIA_STATES_AND_UTS.slice()
                  .sort((a, b) => {
                    const rank = (id: string) =>
                      id === focusedPlace.id ? 2 : id === hoveredId ? 1 : 0;
                    return rank(a.id) - rank(b.id);
                  })
                  .map((place) => {
                    const borderPath = INDIA_STATE_BORDER_PATHS[place.id];
                    if (!borderPath) return null;

                    const matches = filteredIds.has(place.id);
                    const isFocused = focusedPlace.id === place.id;
                    const isHovered = hoveredId === place.id;
                    const isUT = place.kind === 'Union Territory';

                    const baseFill = isUT ? '#efe3d2' : '#ebe5da';
                    const hoverFill = isUT ? '#f6dec2' : '#dce8e1';
                    const activeFill = isUT ? '#efc796' : '#bfd8cb';

                    const fill = isFocused
                      ? activeFill
                      : isHovered
                      ? hoverFill
                      : baseFill;

                    const strokeColor = isUT ? '#b45309' : '#1d4738';
                    const strokeWidth = isFocused ? 2.6 : isHovered ? 1.8 : 1.0;
                    const strokeOpacity = isFocused ? 1 : isHovered ? 0.85 : 0.42;

                    return (
                      <path
                        key={`border-${place.id}`}
                        d={borderPath}
                        fill={fill}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeOpacity={strokeOpacity}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        filter={isFocused ? 'url(#active-state-glow)' : undefined}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select ${place.name} (${place.kind}) to highlight its border and view visiting places and favorite food`}
                        className="cursor-pointer transition-colors duration-150 focus:outline-none"
                        style={{ opacity: matches ? 1 : 0.28 }}
                        onMouseEnter={() => setHoveredId(place.id)}
                        onMouseLeave={() =>
                          setHoveredId((curr) => (curr === place.id ? null : curr))
                        }
                        onClick={() => selectStateOnMap(place)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            selectStateOnMap(place);
                          }
                        }}
                      />
                    );
                  })}

                {/* 36 Clickable State & Union Territory Dots */}
                {INDIA_STATES_AND_UTS.map((place) => {
                  const pt = projectIndiaPoint(place.lat, place.lon);
                  const matches = filteredIds.has(place.id);
                  const isSelected = previewPlace.id === place.id;
                  const isUT = place.kind === 'Union Territory';
                  const dotFill = isUT ? '#b45309' : '#1d4738';

                  return (
                    <g
                      key={place.id}
                      transform={`translate(${pt.x}, ${pt.y})`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${place.name} (${place.kind}) — Capital: ${place.capital}`}
                      className="cursor-pointer focus:outline-none"
                      style={{ opacity: matches ? 1 : 0.24 }}
                      onMouseEnter={() => setHoveredId(place.id)}
                      onMouseLeave={() =>
                        setHoveredId((curr) => (curr === place.id ? null : curr))
                      }
                      onFocus={() => setHoveredId(place.id)}
                      onBlur={() =>
                        setHoveredId((curr) => (curr === place.id ? null : curr))
                      }
                      onClick={() => selectStateOnMap(place)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          selectStateOnMap(place);
                        }
                      }}
                    >
                      {/* Generous touch/click target */}
                      <circle r="12" fill="transparent" />

                      {/* Active selection halo */}
                      {isSelected && (
                        <circle
                          r="10.5"
                          fill="none"
                          stroke={dotFill}
                          strokeWidth="2"
                          strokeOpacity="0.6"
                        />
                      )}

                      {/* Visible place dot */}
                      <circle
                        r={isSelected ? 6 : 4.3}
                        fill={dotFill}
                        stroke="#ffffff"
                        strokeWidth="1.6"
                      />
                    </g>
                  );
                })}

                {/* Floating Map Tooltip for Hovered / Focused State */}
                {previewPlace && (() => {
                  const pt = projectIndiaPoint(previewPlace.lat, previewPlace.lon);
                  const flipLeft = pt.x > MAP_WIDTH * 0.62;
                  const boxX = flipLeft ? pt.x - 190 : pt.x + 12;
                  const boxY = Math.max(18, Math.min(MAP_HEIGHT - 64, pt.y - 24));
                  return (
                    <g transform={`translate(${boxX}, ${boxY})`} pointerEvents="none">
                      <rect
                        width="178"
                        height="46"
                        rx="10"
                        fill="#141714"
                        fillOpacity="0.93"
                      />
                      <text
                        x="11"
                        y="19"
                        fill="#ffffff"
                        fontSize="11.5"
                        fontWeight="600"
                      >
                        {previewPlace.name.length > 22
                          ? `${previewPlace.name.slice(0, 21)}…`
                          : previewPlace.name}
                      </text>
                      <text
                        x="11"
                        y="35"
                        fill="rgba(255,255,255,0.78)"
                        fontSize="9.5"
                      >
                        {previewPlace.kind} · {previewPlace.capital}
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Immediate Visiting Places & Favorite Food Panel for Selected/Touched State */}
            <div className="bg-[#f7f5f0] rounded-[20px] border border-black/8 p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/8">
                <div>
                  <p className="text-[11px] font-medium text-[#5a6159]">
                    <span className="font-semibold text-[#1d4738]">
                      {focusedPlace.kind}
                    </span>{' '}
                    · Capital: {focusedPlace.capital} · Best: {focusedPlace.bestSeason}
                  </p>
                  <h4 className="font-editorial text-xl sm:text-2xl font-semibold text-[#141714]">
                    {focusedPlace.name} — Visiting Places &amp; Favorite Food
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenPlace(focusedPlace)}
                  className="bg-[#1d4738] hover:bg-[#15362a] text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Full Photos &amp; Spotify</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visiting Places */}
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#1d4738] flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 shrink-0" />
                    <span>Visiting Places ({focusedPlace.famousPlaces.length})</span>
                  </p>
                  <ul className="space-y-2">
                    {focusedPlace.famousPlaces.map((spot) => (
                      <li
                        key={spot.name}
                        className="bg-white rounded-xl p-3 border border-black/6 space-y-1"
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-xs sm:text-sm font-semibold text-[#141714]">
                            {spot.name}
                          </p>
                          <span className="text-[11px] text-[#5a6159] whitespace-nowrap shrink-0">
                            {spot.city}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5a6159] leading-relaxed">
                          {spot.description}
                        </p>
                        <p className="text-[11px] font-medium text-[#1d4738]">
                          {spot.category} · Best time: {spot.bestTime}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Favorite Food */}
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#b45309] flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 shrink-0" />
                    <span>Favorite Food ({focusedPlace.favoriteFoods.length})</span>
                  </p>
                  <ul className="space-y-2">
                    {focusedPlace.favoriteFoods.map((dish) => (
                      <li
                        key={dish.name}
                        className="bg-white rounded-xl p-3 border border-black/6 space-y-1"
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-xs sm:text-sm font-semibold text-[#141714]">
                            {dish.name}
                          </p>
                          <span className="text-[11px] font-medium text-[#b45309] whitespace-nowrap shrink-0">
                            {dish.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5a6159] leading-relaxed">
                          {dish.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Districts of Selected / Touched State */}
              <div className="pt-4 border-t border-black/8 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#1d4738] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="tabular-nums">
                      Districts of {focusedPlace.name} ({focusedDistricts.length})
                    </span>
                  </p>

                  {focusedDistricts.length > 8 && (
                    <div className="relative w-full sm:w-56">
                      <Search className="w-3.5 h-3.5 text-[#5a6159] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={districtQuery}
                        onChange={(e) => setDistrictQuery(e.target.value)}
                        placeholder={`Filter ${focusedPlace.name} districts...`}
                        aria-label={`Filter districts in ${focusedPlace.name}`}
                        className="w-full bg-white border border-black/10 rounded-full pl-8 pr-3 py-1.5 text-xs text-[#141714] placeholder:text-[#7c837a] focus:outline-none focus:border-[#1d4738]"
                      />
                    </div>
                  )}
                </div>

                {visibleFocusedDistricts.length === 0 ? (
                  <p className="text-xs text-[#5a6159]">
                    No district matched “{districtQuery}” in {focusedPlace.name}.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {visibleFocusedDistricts.map((district) => {
                      const active = selectedDistrict === district;
                      return (
                        <button
                          key={district}
                          type="button"
                          onClick={() =>
                            setSelectedDistrict((curr) =>
                              curr === district ? null : district
                            )
                          }
                          title={district}
                          className={`text-left text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer truncate ${
                            active
                              ? 'bg-[#1d4738] text-white border-[#1d4738]'
                              : 'bg-white text-[#141714] border-black/8 hover:bg-[#e7ede9]'
                          }`}
                        >
                          {district}
                        </button>
                      );
                    })}
                  </div>
                )}

                {selectedDistrict && (
                  <div className="bg-white rounded-xl border border-black/8 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-[#141714]">
                      <span className="font-semibold">{selectedDistrict}</span>{' '}
                      <span className="text-[#5a6159]">
                        · {focusedPlace.name} District
                      </span>
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setDistrictGuideQuery({
                            id: Date.now(),
                            text: `What are the top visiting places and favorite local foods in ${selectedDistrict} district, ${focusedPlace.name}, India?`,
                          })
                        }
                        className="bg-[#1d4738] hover:bg-[#15362a] text-white text-[11px] font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Places &amp; Food in {selectedDistrict}</span>
                      </button>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${selectedDistrict}, ${focusedPlace.name}, India`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#f7f5f0] hover:bg-[#ebe5da] text-[#141714] border border-black/10 text-[11px] font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
                      >
                        <span>Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

          {/* All 28 States & 8 Union Territories Quick Dots */}
          <div className="mt-5 pt-4 border-t border-black/8 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-medium text-[#4a5149]">
                <strong className="font-semibold text-[#141714]">
                  All Quick Dots ({TOTAL_STATES_COUNT} States &amp; {TOTAL_UTS_COUNT} Union Territories):
                </strong>{' '}
                Hover to spotlight on the map, or click any place to view photos, landmarks &amp; food.
              </p>
            </div>

            {/* 28 States */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1d4738]">
                {TOTAL_STATES_COUNT} States
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {INDIA_STATES_AND_UTS.filter((item) => item.kind === 'State')
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((p) => {
                    const isSelected = previewPlace.id === p.id;
                    const matchesFilter = filteredIds.has(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onMouseEnter={() => {
                          setHoveredId(p.id);
                          if (mapMode === 'atlas') setFocusedPlace(p);
                        }}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => {
                          setFocusedPlace(p);
                          onOpenPlace(p);
                        }}
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#141714] text-white border-[#141714]'
                            : 'bg-[#f7f5f0] text-[#141714] border-black/10 hover:bg-[#ebe5da]'
                        } ${matchesFilter ? 'opacity-100' : 'opacity-45'}`}
                      >
                        <span
                          aria-hidden="true"
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isSelected ? 'bg-white' : 'bg-[#1d4738]'
                          }`}
                        />
                        <span>{p.name}</span>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* 8 Union Territories */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#b45309]">
                {TOTAL_UTS_COUNT} Union Territories
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {INDIA_STATES_AND_UTS.filter((item) => item.kind === 'Union Territory')
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((p) => {
                    const isSelected = previewPlace.id === p.id;
                    const matchesFilter = filteredIds.has(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onMouseEnter={() => {
                          setHoveredId(p.id);
                          if (mapMode === 'atlas') setFocusedPlace(p);
                        }}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => {
                          setFocusedPlace(p);
                          onOpenPlace(p);
                        }}
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#141714] text-white border-[#141714]'
                            : 'bg-[#f7f5f0] text-[#141714] border-black/10 hover:bg-[#ebe5da]'
                        } ${matchesFilter ? 'opacity-100' : 'opacity-45'}`}
                      >
                        <span
                          aria-hidden="true"
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isSelected ? 'bg-white' : 'bg-[#b45309]'
                          }`}
                        />
                        <span>{p.name.replace(' (NCT)', '')}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Selected Dot Preview + Guide AI */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Active Map Dot Spotlight Card */}
          <div className="bg-white rounded-[26px] border border-black/8 overflow-hidden shadow-[0_12px_36px_rgba(20,23,20,0.05)]">
            <div className="relative h-52 bg-[#1b241e]">
              <img
                src={previewPlace.imageUrl}
                alt={`${previewPlace.name} — ${previewPlace.imageTitle}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
              />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <p className="text-[11px] font-medium text-white/85">
                  {previewPlace.kind} · Capital: {previewPlace.capital}
                </p>
                <h3 className="font-editorial text-2xl font-semibold">
                  {previewPlace.name}
                </h3>
                <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                  {previewPlace.imageTitle}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs sm:text-sm text-[#5a6159] leading-relaxed">
                {previewPlace.imageCaption}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#f7f5f0] rounded-xl p-3">
                  <p className="font-semibold text-[#1d4738] flex items-center gap-1.5 mb-1">
                    <Landmark className="w-3.5 h-3.5" />
                    <span>Famous Places</span>
                  </p>
                  <p className="text-[#141714] font-medium leading-snug">
                    {previewPlace.famousPlaces.map((fp) => fp.name).join(' · ')}
                  </p>
                </div>

                <div className="bg-[#f7f5f0] rounded-xl p-3">
                  <p className="font-semibold text-[#1d4738] flex items-center gap-1.5 mb-1">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Favorite Food</span>
                  </p>
                  <p className="text-[#141714] font-medium leading-snug">
                    {previewPlace.favoriteFoods.map((ff) => ff.name).join(' · ')}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-black/8 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-1 font-mono tabular-nums font-semibold text-[#141714]">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {previewPopularity.rating.toFixed(1)}
                  <span className="font-sans font-normal text-[#5a6159]">
                    ({previewPopularity.reviews.toLocaleString('en-IN')})
                  </span>
                </span>
                <span className="font-mono tabular-nums font-semibold text-[#1d4738]">
                  Value Score: {previewValue.score.toFixed(1)} / 10 · {previewValue.tierLabel}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#5a6159] block">
                    Est. Trip Budget
                  </span>
                  <span className="font-mono tabular-nums text-base font-semibold text-[#141714]">
                    {formatINR(previewPlace.startingBudgetInr)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenPlace(previewPlace)}
                  className="bg-[#1d4738] hover:bg-[#15362a] text-white text-xs font-semibold px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Open Places &amp; Food</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* MUSAFIR Guide AI Panel */}
          <GuideAIPanel
            selectedPlace={previewPlace}
            externalQuery={districtGuideQuery}
          />
        </div>
      </div>

      {/* Directory Search & Verified 28 States + 8 UTs Grid */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-black/8 p-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#5a6159] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any state, UT, famous place, or local food..."
              aria-label="Search Indian states, union territories, famous places, or favorite food"
              className="w-full bg-[#f7f5f0] border border-black/10 rounded-full pl-10 pr-4 py-2 text-sm text-[#141714] placeholder:text-[#7c837a] focus:outline-none focus:border-[#1d4738]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
            <div
              className="inline-flex items-center gap-1 p-1 rounded-full bg-[#ebe5da]"
              role="group"
              aria-label="Filter by States or Union Territories"
            >
              {(
                [
                  { id: 'All', label: `All (${INDIA_STATES_AND_UTS.length})` },
                  { id: 'State', label: `States (${TOTAL_STATES_COUNT})` },
                  { id: 'Union Territory', label: `UTs (${TOTAL_UTS_COUNT})` },
                ] as const
              ).map((tab) => {
                const active = kindFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setKindFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-all ${
                      active
                        ? 'bg-[#141714] text-white'
                        : 'text-[#4a5149] hover:text-[#141714]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setSortByValue((prev) => !prev)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap border transition-colors ${
                sortByValue
                  ? 'bg-[#1d4738] text-white border-[#1d4738]'
                  : 'bg-[#f7f5f0] text-[#141714] border-black/10 hover:bg-[#ebe5da]'
              }`}
            >
              {sortByValue ? 'Sorted: Best Value-for-Money' : 'Sort by Value Score'}
            </button>

            <span className="text-xs font-mono tabular-nums text-[#5a6159] whitespace-nowrap">
              {filteredPlaces.length} verified
            </span>
          </div>
        </div>

        {visibleGridPlaces.length === 0 ? (
          <div className="bg-white rounded-3xl border border-black/8 p-12 text-center">
            <p className="font-editorial text-2xl font-medium text-[#141714] mb-2">
              No Indian state or territory matched your current filters
            </p>
            <p className="text-sm text-[#5a6159] mb-5">
              Raise your budget limit or reset filters to browse all 28 states &amp; 8 union territories.
            </p>
            <button
              type="button"
              onClick={() => {
                setRegionFilter('All');
                setKindFilter('All');
                setSearchQuery('');
                onBudgetChange(null);
              }}
              className="bg-[#1d4738] text-white text-sm font-semibold px-5 py-2.5 rounded-full cursor-pointer"
            >
              Reset India &amp; Budget Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleGridPlaces.map((place) => {
                const pop = getIndiaPlacePopularity(place.id);
                const val = calculateValueForMoney(
                  place.startingBudgetInr,
                  pop.rating,
                  valuePriority
                );
                return (
                <article
                  key={place.id}
                  className="group bg-white rounded-[24px] border border-black/8 overflow-hidden shadow-[0_8px_24px_rgba(20,23,20,0.04)] hover:shadow-[0_16px_40px_rgba(20,23,20,0.09)] transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#ebe5da]">
                    <img
                      src={place.imageUrl}
                      alt={`${place.name} — ${place.imageTitle}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"
                    />
                    <div className="absolute bottom-3.5 left-4 right-4 text-white">
                      <p className="text-[11px] font-medium text-white/85">
                        {place.kind} · {place.region}
                      </p>
                      <p className="text-sm font-semibold truncate">{place.imageTitle}</p>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2.5">
                      <div>
                        <p className="text-xs font-medium text-[#5a6159] flex flex-wrap items-center gap-x-1.5">
                          <span>Capital: {place.capital}</span>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 font-mono tabular-nums font-semibold text-[#141714]">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            {pop.rating.toFixed(1)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{place.bestSeason}</span>
                        </p>
                        <h3 className="font-editorial text-2xl font-semibold text-[#141714] mt-0.5">
                          {place.name}
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-[#5a6159] leading-relaxed">
                        {place.overview}
                      </p>

                      <div className="pt-1 space-y-1.5 text-xs">
                        <p className="text-[#141714] flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#1d4738] shrink-0 mt-0.5" />
                          <span>
                            <strong className="font-semibold">Famous:</strong>{' '}
                            {place.famousPlaces
                              .slice(0, 2)
                              .map((fp) => fp.name)
                              .join(', ')}
                          </span>
                        </p>
                        <p className="text-[#141714] flex items-start gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-[#1d4738] shrink-0 mt-0.5" />
                          <span>
                            <strong className="font-semibold">Favorite Food:</strong>{' '}
                            {place.favoriteFoods
                              .slice(0, 2)
                              .map((ff) => ff.name)
                              .join(', ')}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="pt-2.5 border-t border-black/8 space-y-1">
                        <div className="flex items-baseline justify-between gap-2 text-xs">
                          <span className="font-semibold text-[#141714]">
                            Value-for-Money ·{' '}
                            <span className="font-medium text-[#5a6159]">
                              {val.tierLabel}
                            </span>
                          </span>
                          <span className="font-mono tabular-nums font-bold text-[#1d4738]">
                            {val.score.toFixed(1)} / 10
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#ebe5da] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#1d4738]"
                            style={{ width: `${Math.round(val.score * 10)}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-black/8 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#5a6159] block">
                            Starting from
                          </span>
                          <span className="font-mono tabular-nums text-base font-semibold text-[#141714]">
                            {formatINR(place.startingBudgetInr)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setFocusedPlace(place);
                            onOpenPlace(place);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#f7f5f0] hover:bg-[#1d4738] text-[#141714] hover:text-white border border-black/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <span>Places &amp; Food</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>

            {!isFiltered && filteredPlaces.length > 9 && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowAllCards((prev) => !prev)}
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#141714] text-[#141714] hover:text-white border border-black/12 text-sm font-semibold px-6 py-3 rounded-full cursor-pointer transition-colors shadow-sm"
                >
                  {showAllCards ? (
                    <>
                      <span>Show Fewer States &amp; UTs</span>
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>
                        Show All {filteredPlaces.length} Verified States &amp; Union
                        Territories
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
