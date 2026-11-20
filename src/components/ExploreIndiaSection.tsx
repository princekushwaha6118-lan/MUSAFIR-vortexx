import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Landmark,
  MapPin,
  Search,
  Utensils,
} from 'lucide-react';
import {
  ANDAMAN_ISLAND_POINTS,
  INDIA_MAINLAND_PATH,
  INDIA_STATES_AND_UTS,
  LAKSHADWEEP_ISLAND_POINTS,
  MAP_HEIGHT,
  MAP_WIDTH,
  TOTAL_STATES_COUNT,
  TOTAL_UTS_COUNT,
  projectIndiaPoint,
} from '../data/indiaStatesData.ts';
import { formatINR } from '../data/travelData.ts';
import type { IndiaRegion, IndiaStateUT } from '../types.ts';
import { GuideAIPanel } from './GuideAIPanel.tsx';

interface ExploreIndiaSectionProps {
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
  onOpenPlace,
}) => {
  const [regionFilter, setRegionFilter] = useState<IndiaRegion>('All');
  const [kindFilter, setKindFilter] = useState<'All' | 'State' | 'Union Territory'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCards, setShowAllCards] = useState(false);

  const defaultFocused = useMemo(
    () =>
      INDIA_STATES_AND_UTS.find((s) => s.id === 'uttar-pradesh') ??
      INDIA_STATES_AND_UTS[0],
    []
  );
  const [focusedPlace, setFocusedPlace] = useState<IndiaStateUT>(defaultFocused);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredPlaces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return INDIA_STATES_AND_UTS.filter((place) => {
      const regionMatch = regionFilter === 'All' || place.region === regionFilter;
      const kindMatch = kindFilter === 'All' || place.kind === kindFilter;
      if (!regionMatch || !kindMatch) return false;
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
  }, [regionFilter, kindFilter, searchQuery]);

  const filteredIds = useMemo(
    () => new Set(filteredPlaces.map((p) => p.id)),
    [filteredPlaces]
  );

  const isFiltered =
    regionFilter !== 'All' || kindFilter !== 'All' || searchQuery.trim().length > 0;
  const visibleGridPlaces =
    isFiltered || showAllCards ? filteredPlaces : filteredPlaces.slice(0, 9);

  const hoveredPlace = useMemo(
    () => INDIA_STATES_AND_UTS.find((p) => p.id === hoveredId) ?? null,
    [hoveredId]
  );
  const previewPlace = hoveredPlace ?? focusedPlace;

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
            Click any dot on the India map to open that state or union territory’s
            real photo details, verified famous places, favorite local foods, and
            live MUSAFIR Guide AI.
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
                Hover a dot to preview · Click any dot to open places &amp; favorite food
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-[#4a5149]">
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
                Union Territories ({TOTAL_UTS_COUNT})
              </span>
            </div>
          </div>

          {/* SVG Geographic Map */}
          <div className="relative bg-[#f7f5f0] rounded-[22px] border border-black/6 overflow-hidden flex-1 flex items-center justify-center p-2 sm:p-4">
            <svg
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              role="img"
              aria-label="Interactive map of India with clickable dots for all 28 states and 8 union territories"
              className="w-full h-auto max-h-[600px] select-none"
            >
              {/* Subtle Geographic Graticule */}
              <g stroke="rgba(20,23,20,0.05)" strokeWidth="1" strokeDasharray="4 4">
                {[140, 260, 380, 500].map((x) => (
                  <line key={`vx-${x}`} x1={x} y1={20} x2={x} y2={MAP_HEIGHT - 20} />
                ))}
                {[140, 260, 380, 500, 620].map((y) => (
                  <line key={`hy-${y}`} x1={20} y1={y} x2={MAP_WIDTH - 20} y2={y} />
                ))}
              </g>

              {/* Water Context Labels */}
              <text
                x="110"
                y="505"
                fill="rgba(29,71,56,0.36)"
                fontSize="11"
                fontWeight="600"
                letterSpacing="2"
              >
                ARABIAN SEA
              </text>
              <text
                x="415"
                y="495"
                fill="rgba(29,71,56,0.36)"
                fontSize="11"
                fontWeight="600"
                letterSpacing="2"
              >
                BAY OF BENGAL
              </text>
              <text
                x="235"
                y="678"
                fill="rgba(29,71,56,0.36)"
                fontSize="11"
                fontWeight="600"
                letterSpacing="2"
              >
                INDIAN OCEAN
              </text>

              {/* India Mainland Shape */}
              <path
                d={INDIA_MAINLAND_PATH}
                fill="#ebe5da"
                stroke="#1d4738"
                strokeOpacity="0.4"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Andaman & Nicobar Islands */}
              <g fill="#ebe5da" stroke="#1d4738" strokeOpacity="0.45" strokeWidth="1.2">
                {ANDAMAN_ISLAND_POINTS.map((isl, idx) => {
                  const pt = projectIndiaPoint(isl.lat, isl.lon);
                  return (
                    <circle key={`and-${idx}`} cx={pt.x} cy={pt.y} r={isl.r} />
                  );
                })}
              </g>

              {/* Lakshadweep Islands */}
              <g fill="#ebe5da" stroke="#1d4738" strokeOpacity="0.45" strokeWidth="1.2">
                {LAKSHADWEEP_ISLAND_POINTS.map((isl, idx) => {
                  const pt = projectIndiaPoint(isl.lat, isl.lon);
                  return (
                    <circle key={`lak-${idx}`} cx={pt.x} cy={pt.y} r={isl.r} />
                  );
                })}
              </g>

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
                    aria-label={`Open ${place.name} (${place.kind}) — Capital: ${place.capital}`}
                    className="cursor-pointer focus:outline-none"
                    style={{ opacity: matches ? 1 : 0.22 }}
                    onMouseEnter={() => {
                      setHoveredId(place.id);
                      setFocusedPlace(place);
                    }}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => {
                      setHoveredId(place.id);
                      setFocusedPlace(place);
                    }}
                    onBlur={() => setHoveredId(null)}
                    onClick={() => {
                      setFocusedPlace(place);
                      onOpenPlace(place);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setFocusedPlace(place);
                        onOpenPlace(place);
                      }
                    }}
                  >
                    {/* Generous invisible hit circle for easy clicking */}
                    <circle r="13" fill="transparent" />

                    {/* Active selection halo */}
                    {isSelected && (
                      <circle
                        r="11"
                        fill="none"
                        stroke={dotFill}
                        strokeWidth="2"
                        strokeOpacity="0.45"
                      />
                    )}

                    {/* Visible place dot */}
                    <circle
                      r={isSelected ? 6.5 : 5}
                      fill={dotFill}
                      stroke="#ffffff"
                      strokeWidth="1.8"
                    />
                  </g>
                );
              })}

              {/* Floating Map Tooltip for Hovered / Focused Dot */}
              {previewPlace && (() => {
                const pt = projectIndiaPoint(previewPlace.lat, previewPlace.lon);
                const flipLeft = pt.x > MAP_WIDTH * 0.62;
                const boxX = flipLeft ? pt.x - 186 : pt.x + 12;
                const boxY = Math.max(18, Math.min(MAP_HEIGHT - 64, pt.y - 24));
                return (
                  <g transform={`translate(${boxX}, ${boxY})`} pointerEvents="none">
                    <rect
                      width="174"
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
                      fill="rgba(255,255,255,0.75)"
                      fontSize="9.5"
                    >
                      {previewPlace.kind} · Click dot to open
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Quick Jump Buttons for Union Territories & Popular Hubs */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5a6159] mr-1">
              Quick Dots:
            </span>
            {[
              'delhi',
              'uttar-pradesh',
              'rajasthan',
              'kerala',
              'goa',
              'ladakh',
              'meghalaya',
              'andaman-nicobar',
            ].map((id) => {
              const p = INDIA_STATES_AND_UTS.find((item) => item.id === id);
              if (!p) return null;
              return (
                <button
                  key={p.id}
                  type="button"
                  onMouseEnter={() => setFocusedPlace(p)}
                  onClick={() => {
                    setFocusedPlace(p);
                    onOpenPlace(p);
                  }}
                  className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                    previewPlace.id === p.id
                      ? 'bg-[#141714] text-white border-[#141714]'
                      : 'bg-[#f7f5f0] text-[#141714] border-black/10 hover:bg-[#ebe5da]'
                  }`}
                >
                  {p.name.replace(' & ', ' / ').replace(' (NCT)', '')}
                </button>
              );
            })}
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
          <GuideAIPanel selectedPlace={previewPlace} />
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

            <span className="text-xs font-mono tabular-nums text-[#5a6159] whitespace-nowrap">
              {filteredPlaces.length} verified
            </span>
          </div>
        </div>

        {visibleGridPlaces.length === 0 ? (
          <div className="bg-white rounded-3xl border border-black/8 p-12 text-center">
            <p className="font-editorial text-2xl font-medium text-[#141714] mb-2">
              No Indian state or territory matched “{searchQuery}”
            </p>
            <p className="text-sm text-[#5a6159] mb-5">
              Try searching by state name, capital city, landmark, or favorite dish.
            </p>
            <button
              type="button"
              onClick={() => {
                setRegionFilter('All');
                setKindFilter('All');
                setSearchQuery('');
              }}
              className="bg-[#1d4738] text-white text-sm font-semibold px-5 py-2.5 rounded-full cursor-pointer"
            >
              Reset India Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleGridPlaces.map((place) => (
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
                        <p className="text-xs font-medium text-[#5a6159]">
                          Capital: {place.capital} · {place.bestSeason}
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

                    <div className="pt-3.5 border-t border-black/8 flex items-center justify-between gap-3">
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
                </article>
              ))}
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
