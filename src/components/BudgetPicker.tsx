import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  Loader2,
  MapPin,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { INDIA_STATES_AND_UTS } from '../data/indiaStatesData.ts';
import { DESTINATIONS, formatINR } from '../data/travelData.ts';
import type { IndiaStateUT, MusafirDestination } from '../types.ts';

interface BudgetPickerProps {
  maxBudgetInr: number | null;
  onBudgetChange: (budget: number | null) => void;
  matchingStatesCount: number;
  matchingDestinationsCount: number;
  matchingPackagesCount: number;
  onOpenIndiaPlace: (place: IndiaStateUT) => void;
  onOpenDestination?: (dest: MusafirDestination) => void;
}

const BUDGET_PRESETS: Array<{ label: string; value: number | null }> = [
  { label: 'All Budgets', value: null },
  { label: 'Under ₹3,500', value: 3500 },
  { label: 'Under ₹4,500', value: 4500 },
  { label: 'Under ₹5,500', value: 5500 },
  { label: 'Under ₹7,500', value: 7500 },
  { label: 'Under ₹10,000', value: 10000 },
  { label: 'Under ₹35,000', value: 35000 },
];

export const BudgetPicker: React.FC<BudgetPickerProps> = ({
  maxBudgetInr,
  onBudgetChange,
  matchingStatesCount,
  matchingDestinationsCount,
  matchingPackagesCount,
  onOpenIndiaPlace,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [showAllUnlocked, setShowAllUnlocked] = useState(false);
  const [sortOrder, setSortOrder] = useState<'low-to-high' | 'closest-to-budget'>('closest-to-budget');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const sliderVal = maxBudgetInr ?? 75000;

  // Individual famous spots unlocked within the chosen budget
  const { matchingStates, unlockedFamousSpots, stretchStates, matchingIntlDests } = useMemo(() => {
    if (maxBudgetInr === null) {
      return {
        matchingStates: [] as IndiaStateUT[],
        unlockedFamousSpots: [] as Array<{
          placeName: string;
          city: string;
          category: string;
          priceInr: number;
          parentState: IndiaStateUT;
        }>,
        stretchStates: [] as IndiaStateUT[],
        matchingIntlDests: [] as MusafirDestination[],
      };
    }

    const matched = INDIA_STATES_AND_UTS.filter(
      (s) => s.startingBudgetInr <= maxBudgetInr
    ).sort((a, b) =>
      sortOrder === 'low-to-high'
        ? a.startingBudgetInr - b.startingBudgetInr
        : b.startingBudgetInr - a.startingBudgetInr
    );

    const spots = matched.flatMap((state) =>
      state.famousPlaces.map((fp) => ({
        placeName: fp.name,
        city: fp.city,
        category: fp.category,
        priceInr: state.startingBudgetInr,
        parentState: state,
      }))
    );

    const stretch = INDIA_STATES_AND_UTS.filter(
      (s) =>
        s.startingBudgetInr > maxBudgetInr &&
        s.startingBudgetInr <= maxBudgetInr + 1800
    )
      .sort((a, b) => a.startingBudgetInr - b.startingBudgetInr)
      .slice(0, 4);

    const intl = DESTINATIONS.filter(
      (d) =>
        d.startingPriceInr <= maxBudgetInr &&
        ['bali', 'dubai', 'paris', 'switzerland'].includes(d.id)
    ).sort((a, b) => a.startingPriceInr - b.startingPriceInr);

    return {
      matchingStates: matched,
      unlockedFamousSpots: spots,
      stretchStates: stretch,
      matchingIntlDests: intl,
    };
  }, [maxBudgetInr, sortOrder]);

  const handleApplyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(customInput.replace(/[^\d]/g, ''));
    if (!Number.isFinite(num) || num <= 0) return;
    onBudgetChange(Math.max(2500, num));
    setAiSuggestion(null);
    setAiError(null);
  };

  const handleAskAiForMorePlaces = async () => {
    if (maxBudgetInr === null || aiLoading) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const sampleNames = matchingStates
        .slice(0, 6)
        .map((s) => `${s.name} (${formatINR(s.startingBudgetInr)})`)
        .join(', ');
      const res = await fetch('/api/guide-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `My total travel budget is ${formatINR(maxBudgetInr)} per person. Suggest 6 extra offbeat or popular Indian places, weekend getaways, hill spots, or temple towns I can visit within ${formatINR(maxBudgetInr)}, along with must-try cheap local food and how to travel on this budget. Already listed: ${sampleNames || 'none'}.`,
        }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      if (!res.ok || !data.answer) {
        setAiError(data.error ?? 'Could not fetch more budget places right now.');
      } else {
        setAiSuggestion(data.answer);
      }
    } catch {
      setAiError('Network error while asking Guide AI for more budget places.');
    } finally {
      setAiLoading(false);
    }
  };

  const visibleSpots = showAllUnlocked
    ? unlockedFamousSpots
    : unlockedFamousSpots.slice(0, 9);

  return (
    <div className="bg-white rounded-[26px] border border-black/8 p-5 sm:p-6 mb-8 shadow-[0_10px_28px_rgba(20,23,20,0.05)] space-y-5">
      {/* Header + Presets */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1d4738] flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Choose Trips by Your Price</span>
          </p>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-[#141714]">
              {maxBudgetInr === null ? (
                'Pick Your Budget to Unlock Matching Places'
              ) : (
                <>
                  {unlockedFamousSpots.length} Famous Places Across{' '}
                  {matchingStatesCount} States/UTs Under{' '}
                  <span className="font-mono tabular-nums text-[#1d4738]">
                    {formatINR(maxBudgetInr)}
                  </span>
                </>
              )}
            </h3>
            <span className="text-xs font-mono tabular-nums text-[#5a6159]">
              {matchingStatesCount} States &amp; UTs · {matchingDestinationsCount}{' '}
              Destinations · {matchingPackagesCount} Packages
            </span>
          </div>
        </div>

        {/* Quick Budget Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {BUDGET_PRESETS.map((preset) => {
            const active = maxBudgetInr === preset.value;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  onBudgetChange(preset.value);
                  setAiSuggestion(null);
                  setAiError(null);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-all border ${
                  active
                    ? 'bg-[#1d4738] text-white border-[#1d4738]'
                    : 'bg-[#f7f5f0] text-[#141714] border-black/8 hover:bg-[#ebe5da]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slider + Custom Exact Price Input */}
      <div className="pt-4 border-t border-black/8 flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
          <label
            htmlFor="budget-range-slider"
            className="text-xs font-semibold text-[#5a6159] whitespace-nowrap shrink-0"
          >
            Adjust Your Price:
          </label>
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs font-mono tabular-nums text-[#5a6159] whitespace-nowrap">
              ₹2,999
            </span>
            <input
              id="budget-range-slider"
              type="range"
              min={3000}
              max={75000}
              step={500}
              value={sliderVal}
              onChange={(e) => {
                const val = Number(e.target.value);
                onBudgetChange(val >= 75000 ? null : val);
                setAiSuggestion(null);
                setAiError(null);
              }}
              aria-label="Maximum trip budget in Indian Rupees"
              className="w-full accent-[#1d4738] cursor-pointer"
            />
            <span className="text-xs font-mono tabular-nums text-[#5a6159] whitespace-nowrap">
              ₹75,000+
            </span>
          </div>
        </div>

        {/* Exact Custom Rupee Input */}
        <form onSubmit={handleApplyCustomPrice} className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-[#1d4738]">
              ₹
            </span>
            <input
              type="number"
              min={2500}
              max={500000}
              step={100}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder={maxBudgetInr ? String(maxBudgetInr) : 'Enter price (e.g. 5000)'}
              aria-label="Enter your exact budget in Rupees"
              className="w-44 bg-[#f7f5f0] border border-black/10 rounded-full pl-7 pr-3 py-1.5 text-xs font-mono tabular-nums text-[#141714] placeholder:text-[#7c837a] focus:outline-none focus:border-[#1d4738]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#141714] hover:bg-[#1d4738] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full cursor-pointer whitespace-nowrap transition-colors"
          >
            Find Places
          </button>

          {maxBudgetInr !== null && (
            <button
              type="button"
              onClick={() => {
                onBudgetChange(null);
                setCustomInput('');
                setAiSuggestion(null);
                setAiError(null);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1d4738] hover:text-[#141714] cursor-pointer whitespace-nowrap ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </form>
      </div>

      {/* Expanded "More Places According to Your Price" Drawer */}
      {maxBudgetInr !== null && (
        <div className="pt-5 border-t border-black/8 space-y-5 animate-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1d4738]">
                Places Unlocked Under {formatINR(maxBudgetInr)}
              </p>
              <p className="text-xs text-[#5a6159] mt-0.5">
                Click any famous place card below to open its photos, favorite local food, and full guide.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center p-0.5 rounded-full bg-[#ebe5da] text-xs">
                <button
                  type="button"
                  onClick={() => setSortOrder('closest-to-budget')}
                  className={`px-3 py-1 rounded-full font-semibold cursor-pointer ${
                    sortOrder === 'closest-to-budget'
                      ? 'bg-[#141714] text-white'
                      : 'text-[#4a5149]'
                  }`}
                >
                  Best Fit First
                </button>
                <button
                  type="button"
                  onClick={() => setSortOrder('low-to-high')}
                  className={`px-3 py-1 rounded-full font-semibold cursor-pointer ${
                    sortOrder === 'low-to-high'
                      ? 'bg-[#141714] text-white'
                      : 'text-[#4a5149]'
                  }`}
                >
                  Lowest Price First
                </button>
              </div>

              <button
                type="button"
                onClick={handleAskAiForMorePlaces}
                disabled={aiLoading}
                className="bg-[#e7ede9] hover:bg-[#1d4738] text-[#1d4738] hover:text-white text-xs font-semibold px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap disabled:opacity-60"
              >
                {aiLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>More Places Under {formatINR(maxBudgetInr)} (AI)</span>
              </button>
            </div>
          </div>

          {unlockedFamousSpots.length === 0 ? (
            <div className="bg-[#f7f5f0] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-[#141714]">
                Starter Indian trips begin at <strong>₹2,999</strong> (Haryana, Delhi, Chandigarh, Bihar). Raise your budget slightly to unlock them!
              </p>
              <button
                type="button"
                onClick={() => onBudgetChange(3500)}
                className="bg-[#1d4738] text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer"
              >
                Try Under ₹3,500
              </button>
            </div>
          ) : (
            <>
              {/* Grid of Individual Famous Places Matching Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {visibleSpots.map((spot, idx) => (
                  <button
                    key={`${spot.parentState.id}-${spot.placeName}-${idx}`}
                    type="button"
                    onClick={() => onOpenIndiaPlace(spot.parentState)}
                    className="group text-left bg-[#f7f5f0] hover:bg-[#ebe5da]/80 rounded-2xl p-3 flex items-center gap-3.5 border border-black/6 transition-colors cursor-pointer"
                  >
                    <img
                      src={spot.parentState.imageUrl}
                      alt={spot.placeName}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#ebe5da]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-[#5a6159] truncate">
                        {spot.parentState.name} · {spot.city}
                      </p>
                      <p className="text-sm font-semibold text-[#141714] truncate group-hover:text-[#1d4738]">
                        {spot.placeName}
                      </p>
                      <p className="text-xs font-mono tabular-nums font-semibold text-[#1d4738] mt-0.5 flex items-center justify-between">
                        <span>From {formatINR(spot.priceInr)}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {unlockedFamousSpots.length > 9 && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllUnlocked((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1d4738] hover:text-[#141714] bg-[#f7f5f0] px-4 py-2 rounded-full border border-black/10 cursor-pointer"
                  >
                    {showAllUnlocked ? (
                      <>
                        <span>Show Fewer Places</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>
                          Show All {unlockedFamousSpots.length} Places Under{' '}
                          {formatINR(maxBudgetInr)}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {/* International Bonus Matches (when budget >= 29,900) */}
          {matchingIntlDests.length > 0 && (
            <div className="bg-[#f7f5f0] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-medium text-[#141714] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#1d4738]" />
                <span>
                  International destinations also in your budget:{' '}
                  <strong>
                    {matchingIntlDests
                      .map((d) => `${d.name} (${formatINR(d.startingPriceInr)})`)
                      .join(' · ')}
                  </strong>
                </span>
              </p>
            </div>
          )}

          {/* Stretch Budget Bonus Row ("Add ~₹1,500 More for These Extra Places") */}
          {stretchStates.length > 0 && (
            <div className="bg-[#ebe5da]/50 rounded-2xl p-4 space-y-2.5">
              <p className="text-xs font-semibold text-[#141714]">
                Stretch Slightly (+₹100 – ₹1,800) to Also Unlock:
              </p>
              <div className="flex flex-wrap gap-2">
                {stretchStates.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onBudgetChange(st.startingBudgetInr)}
                    className="bg-white hover:bg-[#1d4738] text-[#141714] hover:text-white border border-black/10 text-xs font-medium px-3.5 py-2 rounded-full inline-flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>{st.name}</span>
                    <span className="font-mono tabular-nums font-semibold">
                      {formatINR(st.startingBudgetInr)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Guide AI Extra Recommendations Output */}
          {aiError && (
            <p className="text-xs font-medium text-rose-700 bg-rose-50 px-3.5 py-2.5 rounded-xl">
              {aiError}
            </p>
          )}
          {aiSuggestion && (
            <div className="bg-[#e7ede9]/60 rounded-2xl p-4 sm:p-5 space-y-2 border border-[#1d4738]/15">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1d4738] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Guide AI Extra Place Suggestions Under {formatINR(maxBudgetInr)}</span>
              </p>
              <p className="text-xs sm:text-sm text-[#141714] leading-relaxed whitespace-pre-line">
                {aiSuggestion}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
