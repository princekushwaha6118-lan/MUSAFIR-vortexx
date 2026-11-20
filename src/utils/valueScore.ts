import type { ValuePriority, ValueScoreBreakdown } from '../types.ts';

const MIN_REF_PRICE_INR = 2900;
const MAX_REF_PRICE_INR = 85000;
const MIN_REF_RATING = 3.5;
const MAX_REF_RATING = 5.0;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calculateValueForMoney(
  priceInr: number,
  popularityRating: number,
  priority: ValuePriority = 'balanced'
): ValueScoreBreakdown {
  const safePrice = clamp(priceInr, MIN_REF_PRICE_INR, MAX_REF_PRICE_INR);
  const priceNorm =
    (Math.log(MAX_REF_PRICE_INR) - Math.log(safePrice)) /
    (Math.log(MAX_REF_PRICE_INR) - Math.log(MIN_REF_PRICE_INR));
  const priceScore = Number((clamp(priceNorm, 0, 1) * 10).toFixed(1));

  const ratingNorm =
    (popularityRating - MIN_REF_RATING) / (MAX_REF_RATING - MIN_REF_RATING);
  const popularityScore = Number((clamp(ratingNorm, 0, 1) * 10).toFixed(1));

  const priceWeightPct =
    priority === 'budget-first' ? 70 : priority === 'rating-first' ? 30 : 50;
  const ratingWeightPct = 100 - priceWeightPct;

  const rawScore =
    (priceScore * priceWeightPct + popularityScore * ratingWeightPct) / 100;
  const score = Number(clamp(rawScore, 0, 10).toFixed(1));

  let tierLabel: ValueScoreBreakdown['tierLabel'] = 'Premium Experience';
  if (score >= 8.2) {
    tierLabel = 'Exceptional Value';
  } else if (score >= 7.2) {
    tierLabel = 'Great Value';
  } else if (score >= 6.0) {
    tierLabel = 'Good Value';
  }

  return {
    score,
    priceScore,
    popularityScore,
    priceWeightPct,
    ratingWeightPct,
    tierLabel,
  };
}

const INDIA_POPULARITY_BY_ID: Record<string, { rating: number; reviews: number }> = {
  'uttar-pradesh': { rating: 4.9, reviews: 1840 },
  rajasthan: { rating: 4.9, reviews: 1620 },
  kerala: { rating: 4.9, reviews: 1490 },
  uttarakhand: { rating: 4.9, reviews: 1380 },
  'himachal-pradesh': { rating: 4.8, reviews: 1410 },
  ladakh: { rating: 4.9, reviews: 980 },
  'jammu-kashmir': { rating: 4.8, reviews: 1210 },
  goa: { rating: 4.8, reviews: 1560 },
  delhi: { rating: 4.7, reviews: 1720 },
  'tamil-nadu': { rating: 4.8, reviews: 940 },
  karnataka: { rating: 4.8, reviews: 1030 },
  maharashtra: { rating: 4.7, reviews: 1180 },
  punjab: { rating: 4.8, reviews: 1120 },
  meghalaya: { rating: 4.9, reviews: 760 },
  sikkim: { rating: 4.9, reviews: 810 },
  'andaman-nicobar': { rating: 4.8, reviews: 690 },
  odisha: { rating: 4.7, reviews: 740 },
  gujarat: { rating: 4.7, reviews: 850 },
  'west-bengal': { rating: 4.7, reviews: 910 },
  'madhya-pradesh': { rating: 4.7, reviews: 680 },
  assam: { rating: 4.7, reviews: 620 },
  bihar: { rating: 4.6, reviews: 590 },
  telangana: { rating: 4.6, reviews: 650 },
  'andhra-pradesh': { rating: 4.6, reviews: 540 },
  chandigarh: { rating: 4.6, reviews: 480 },
  puducherry: { rating: 4.7, reviews: 710 },
  lakshadweep: { rating: 4.8, reviews: 390 },
  'arunachal-pradesh': { rating: 4.8, reviews: 410 },
  nagaland: { rating: 4.7, reviews: 340 },
  mizoram: { rating: 4.7, reviews: 290 },
  manipur: { rating: 4.6, reviews: 320 },
  tripura: { rating: 4.5, reviews: 280 },
  jharkhand: { rating: 4.5, reviews: 430 },
  chhattisgarh: { rating: 4.5, reviews: 310 },
  haryana: { rating: 4.4, reviews: 460 },
  'dadra-nagar-haveli-daman-diu': { rating: 4.5, reviews: 330 },
};

export function getIndiaPlacePopularity(id: string): {
  rating: number;
  reviews: number;
} {
  return INDIA_POPULARITY_BY_ID[id] ?? { rating: 4.6, reviews: 400 };
}
