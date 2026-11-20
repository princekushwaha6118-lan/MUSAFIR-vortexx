import React, { useCallback, useEffect, useState } from 'react';
import {
  APILoadingStatus,
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
} from '@vis.gl/react-google-maps';
import type { MapMouseEvent } from '@vis.gl/react-google-maps';
import {
  ArrowUpRight,
  Crosshair,
  ExternalLink,
  Landmark,
  Loader2,
  MapPin,
  Utensils,
  X,
} from 'lucide-react';
import { formatINR } from '../data/travelData.ts';
import type {
  GroundingPlaceSource,
  IndiaStateUT,
  ValuePriority,
} from '../types.ts';
import {
  calculateValueForMoney,
  getIndiaPlacePopularity,
} from '../utils/valueScore.ts';

interface GoogleIndiaMapProps {
  places: IndiaStateUT[];
  filteredIds: Set<string>;
  selectedPlace: IndiaStateUT;
  valuePriority: ValuePriority;
  onFocusPlace: (place: IndiaStateUT) => void;
  onOpenPlace: (place: IndiaStateUT) => void;
  onSwitchToAtlas?: () => void;
}

const INDIA_CENTER = { lat: 22.35, lng: 79.0 };

type GoogleMapStyle = 'm' | 'k' | 'p';

const MAP_STYLE_OPTIONS: Array<{ id: GoogleMapStyle; label: string }> = [
  { id: 'm', label: 'Map' },
  { id: 'k', label: 'Satellite' },
  { id: 'p', label: 'Terrain' },
];

interface TouchedSpotState {
  lat: number;
  lng: number;
  place: IndiaStateUT;
  distanceKm: number;
  loadingNearby: boolean;
  nearbyPlaces: GroundingPlaceSource[];
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestIndiaPlace(
  places: IndiaStateUT[],
  lat: number,
  lng: number
): { place: IndiaStateUT; distanceKm: number } {
  let best = places[0];
  let bestDist = Number.POSITIVE_INFINITY;
  for (const item of places) {
    const dist = haversineKm(lat, lng, item.lat, item.lon);
    if (dist < bestDist) {
      bestDist = dist;
      best = item;
    }
  }
  return { place: best, distanceKm: Math.round(bestDist) };
}

async function queryNearbyFavorites(
  lat: number,
  lng: number,
  stateName: string
): Promise<GroundingPlaceSource[]> {
  try {
    const res = await fetch('/api/guide-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: `Find 3 favorite famous tourist places and local food spots near ${lat.toFixed(
          3
        )}, ${lng.toFixed(3)} in ${stateName}, India.`,
        stateName,
        useMapsGrounding: true,
        lat,
        lng,
      }),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      groundingPlaces?: GroundingPlaceSource[];
    };
    return data.groundingPlaces ?? [];
  } catch {
    return [];
  }
}

/* -------- Touched Spot Favorite Places Overlay Card -------- */
const FavoritePlacesOverlayCard: React.FC<{
  spot: TouchedSpotState;
  valuePriority: ValuePriority;
  onFocusLandmark?: (landmarkName: string) => void;
  onOpenFullPlace: (place: IndiaStateUT) => void;
  onClose: () => void;
}> = ({
  spot,
  valuePriority,
  onFocusLandmark,
  onOpenFullPlace,
  onClose,
}) => {
  const pop = getIndiaPlacePopularity(spot.place.id);
  const val = calculateValueForMoney(
    spot.place.startingBudgetInr,
    pop.rating,
    valuePriority
  );

  return (
    <div className="bg-white/97 backdrop-blur-md rounded-2xl border border-black/10 shadow-xl p-4 space-y-3 text-[#141714]">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1d4738] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>
              Favorite Places · {spot.place.name}
            </span>
          </p>
          <p className="text-[11px] font-mono tabular-nums text-[#5a6159] mt-0.5">
            {spot.lat.toFixed(2)}°N, {spot.lng.toFixed(2)}°E · Value{' '}
            {val.score.toFixed(1)}/10 · ★ {pop.rating.toFixed(1)}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close favorite places card"
          className="w-7 h-7 rounded-full bg-[#f7f5f0] hover:bg-[#ebe5da] grid place-items-center cursor-pointer shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Favorite / Famous Landmarks */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5a6159] flex items-center gap-1">
          <Landmark className="w-3 h-3 text-[#1d4738]" />
          <span>Favorite Places to Visit (Tap to Zoom)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {spot.place.famousPlaces.map((fp) => (
            <button
              key={fp.name}
              type="button"
              onClick={() =>
                onFocusLandmark?.(`${fp.name}, ${fp.city}, ${spot.place.name}`)
              }
              className="text-left bg-[#f7f5f0] hover:bg-[#e7ede9] rounded-xl p-2.5 transition-colors cursor-pointer"
            >
              <p className="text-xs font-semibold text-[#141714] truncate">
                {fp.name}
              </p>
              <p className="text-[11px] text-[#5a6159] truncate">
                {fp.city} · {fp.bestTime}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Favorite Local Food */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#4a5149] pt-1 border-t border-black/8">
        <Utensils className="w-3.5 h-3.5 text-[#1d4738] shrink-0" />
        <span className="font-semibold text-[#141714]">Favorite Food:</span>
        <span>{spot.place.favoriteFoods.map((f) => f.name).join(' · ')}</span>
      </div>

      {/* Live Google Maps Nearby Results */}
      {spot.loadingNearby ? (
        <div className="flex items-center gap-2 text-[11px] text-[#1d4738] font-medium">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Finding verified nearby spots on Google Maps...</span>
        </div>
      ) : (
        spot.nearbyPlaces.length > 0 && (
          <div className="pt-1 border-t border-black/8 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1d4738]">
              Verified on Google Maps
            </p>
            <div className="flex flex-wrap gap-2">
              {spot.nearbyPlaces.slice(0, 3).map((gp) => (
                <a
                  key={gp.uri}
                  href={gp.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-[#1d4738] bg-[#e7ede9] hover:bg-[#d7e5dc] px-2.5 py-1 rounded-lg inline-flex items-center gap-1"
                >
                  <span>{gp.title}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        )
      )}

      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="text-xs font-mono tabular-nums font-semibold text-[#141714]">
          From {formatINR(spot.place.startingBudgetInr)}
        </span>
        <button
          type="button"
          onClick={() => onOpenFullPlace(spot.place)}
          className="bg-[#1d4738] hover:bg-[#15362a] text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <span>Full Guide &amp; Spotify</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

/* -------- Live Google Maps Embedded View (no JS API key required) -------- */
const LiveGoogleMapsEmbed: React.FC<{
  places: IndiaStateUT[];
  selectedPlace: IndiaStateUT;
  valuePriority: ValuePriority;
  onFocusPlace: (place: IndiaStateUT) => void;
  onOpenPlace: (place: IndiaStateUT) => void;
}> = ({
  places,
  selectedPlace,
  valuePriority,
  onFocusPlace,
  onOpenPlace,
}) => {
  const [mapStyle, setMapStyle] = useState<GoogleMapStyle>('m');
  const [viewScope, setViewScope] = useState<'india' | 'place' | 'landmark'>(
    'india'
  );
  const [landmarkQuery, setLandmarkQuery] = useState<string>('');
  const [tapPickActive, setTapPickActive] = useState(false);
  const [touchedSpot, setTouchedSpot] = useState<TouchedSpotState | null>(null);

  const pop = getIndiaPlacePopularity(selectedPlace.id);
  const val = calculateValueForMoney(
    selectedPlace.startingBudgetInr,
    pop.rating,
    valuePriority
  );

  const queryTarget =
    viewScope === 'landmark' && landmarkQuery
      ? landmarkQuery
      : viewScope === 'place'
      ? `${selectedPlace.name.replace(' (NCT)', '')}, India`
      : 'India';
  const zoomLevel =
    viewScope === 'landmark' ? 12 : viewScope === 'place' ? 7 : 5;
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    queryTarget
  )}&t=${mapStyle}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;

  const externalMapsUrl =
    viewScope === 'india'
      ? 'https://www.google.com/maps/@22.35,79.0,5z'
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          queryTarget
        )}`;

  const triggerSpotFavorites = useCallback(
    async (lat: number, lng: number, explicitPlace?: IndiaStateUT) => {
      const resolved = explicitPlace
        ? { place: explicitPlace, distanceKm: 0 }
        : findNearestIndiaPlace(places, lat, lng);

      onFocusPlace(resolved.place);
      setViewScope('place');
      setTouchedSpot({
        lat,
        lng,
        place: resolved.place,
        distanceKm: resolved.distanceKm,
        loadingNearby: true,
        nearbyPlaces: [],
      });

      const nearby = await queryNearbyFavorites(lat, lng, resolved.place.name);
      setTouchedSpot((curr) =>
        curr && curr.place.id === resolved.place.id
          ? { ...curr, loadingNearby: false, nearbyPlaces: nearby }
          : curr
      );
    },
    [onFocusPlace, places]
  );

  const handleOverlayTouch = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const yPct = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    // Map click coordinates relative to the visible India or focused state viewport
    const spanLat = viewScope === 'india' ? 30.0 : 5.5;
    const spanLng = viewScope === 'india' ? 30.0 : 6.5;
    const centerLat =
      viewScope === 'india' ? 22.35 : selectedPlace.lat;
    const centerLng =
      viewScope === 'india' ? 79.0 : selectedPlace.lon;

    const tappedLat = centerLat + (0.5 - yPct) * spanLat;
    const tappedLng = centerLng + (xPct - 0.5) * spanLng;

    setTapPickActive(false);
    triggerSpotFavorites(tappedLat, tappedLng);
  };

  const sortedPlaces = places
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-[540px] sm:min-h-[600px] w-full rounded-[22px] overflow-hidden border border-black/8 bg-[#ebe5da] flex flex-col">
      {/* Google Maps Top Controls */}
      <div className="bg-[#f7f5f0] border-b border-black/8 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex items-center p-0.5 rounded-full bg-[#ebe5da]"
            role="group"
            aria-label="Google Map view style"
          >
            {MAP_STYLE_OPTIONS.map((opt) => {
              const active = mapStyle === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMapStyle(opt.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-[#141714] text-white'
                      : 'text-[#4a5149] hover:text-[#141714]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setTapPickActive((prev) => !prev)}
            aria-pressed={tapPickActive}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 transition-colors border ${
              tapPickActive
                ? 'bg-[#b45309] text-white border-[#b45309]'
                : 'bg-[#1d4738] text-white border-[#1d4738] hover:bg-[#15362a]'
            }`}
          >
            <Crosshair className="w-3 h-3" />
            <span>
              {tapPickActive ? 'Now Touch Anywhere on Map' : 'Touch Map for Favorite Places'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewScope('india');
              setTouchedSpot(null);
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer whitespace-nowrap border transition-colors ${
              viewScope === 'india'
                ? 'bg-[#141714] text-white border-[#141714]'
                : 'bg-white text-[#141714] border-black/10 hover:bg-[#ebe5da]'
            }`}
          >
            All India
          </button>

          <select
            aria-label="Focus Google Map on a State or Union Territory"
            value={viewScope !== 'india' ? selectedPlace.id : ''}
            onChange={(e) => {
              const valId = e.target.value;
              if (!valId) {
                setViewScope('india');
                setTouchedSpot(null);
                return;
              }
              const match = places.find((p) => p.id === valId);
              if (match) {
                triggerSpotFavorites(match.lat, match.lon, match);
              }
            }}
            className="bg-white border border-black/10 rounded-full px-3 py-1 text-[11px] font-semibold text-[#141714] cursor-pointer max-w-[175px]"
          >
            <option value="">Jump to State / UT...</option>
            {sortedPlaces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name.replace(' (NCT)', '')}
              </option>
            ))}
          </select>
        </div>

        <a
          href={externalMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-semibold text-[#1d4738] hover:underline inline-flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Live Google Maps Frame + Optional Touch Discovery Overlay */}
      <div className="relative h-[370px] sm:h-[420px] w-full bg-[#e5e3df]">
        <iframe
          key={`${queryTarget}-${mapStyle}-${zoomLevel}`}
          title={`Google Maps view of ${queryTarget}`}
          src={embedSrc}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />

        {tapPickActive && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Touch anywhere on the Google Map to discover favorite places at that location"
            onClick={handleOverlayTouch}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setTapPickActive(false);
                triggerSpotFavorites(selectedPlace.lat, selectedPlace.lon, selectedPlace);
              }
            }}
            className="absolute inset-0 z-10 cursor-crosshair bg-black/10 flex items-start justify-center pt-4"
          >
            <span className="bg-[#141714]/92 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
              Touch any location on the map to reveal favorite places &amp; food there
            </span>
          </div>
        )}

        {touchedSpot && (
          <div className="absolute inset-x-3 bottom-3 z-20 max-h-[310px] overflow-y-auto">
            <FavoritePlacesOverlayCard
              spot={touchedSpot}
              valuePriority={valuePriority}
              onFocusLandmark={(landmark) => {
                setLandmarkQuery(landmark);
                setViewScope('landmark');
              }}
              onOpenFullPlace={onOpenPlace}
              onClose={() => setTouchedSpot(null)}
            />
          </div>
        )}
      </div>

      {/* Bottom Favorite Places Quick Tray for Active State */}
      <div className="bg-white border-t border-black/8 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-[#1d4738] shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-[#141714] truncate">
              {selectedPlace.name} ·{' '}
              <span className="font-mono tabular-nums font-normal text-[#5a6159]">
                From {formatINR(selectedPlace.startingBudgetInr)} · Value{' '}
                {val.score.toFixed(1)}/10
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                triggerSpotFavorites(
                  selectedPlace.lat,
                  selectedPlace.lon,
                  selectedPlace
                )
              }
              className="bg-[#f7f5f0] hover:bg-[#ebe5da] text-[#141714] text-xs font-semibold px-3.5 py-1.5 rounded-full cursor-pointer whitespace-nowrap transition-colors"
            >
              Show Favorite Places
            </button>
            <button
              type="button"
              onClick={() => onOpenPlace(selectedPlace)}
              className="bg-[#1d4738] hover:bg-[#15362a] text-white text-xs font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors"
            >
              <span>Open Full Guide</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-[#5a6159] mr-1">
            Favorite Spots Here:
          </span>
          {selectedPlace.famousPlaces.map((fp) => (
            <button
              key={fp.name}
              type="button"
              onClick={() => {
                setLandmarkQuery(`${fp.name}, ${fp.city}, ${selectedPlace.name}`);
                setViewScope('landmark');
                triggerSpotFavorites(
                  selectedPlace.lat,
                  selectedPlace.lon,
                  selectedPlace
                );
              }}
              className="text-xs font-medium text-[#1d4738] bg-[#f7f5f0] hover:bg-[#e7ede9] border border-black/8 px-3 py-1 rounded-lg cursor-pointer transition-colors"
            >
              {fp.name} ({fp.city})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface InnerMapProps {
  places: IndiaStateUT[];
  filteredIds: Set<string>;
  selectedPlace: IndiaStateUT;
  valuePriority: ValuePriority;
  onFocusPlace: (place: IndiaStateUT) => void;
  onOpenPlace: (place: IndiaStateUT) => void;
}

const MapCameraSync: React.FC<{ target: { lat: number; lng: number } }> = ({
  target,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.panTo({ lat: target.lat, lng: target.lng });
  }, [map, target.lat, target.lng]);

  return null;
};

const MapStatusContent: React.FC<InnerMapProps> = ({
  places,
  filteredIds,
  selectedPlace,
  valuePriority,
  onFocusPlace,
  onOpenPlace,
}) => {
  const status = useApiLoadingStatus();
  const [infoOpen, setInfoOpen] = useState(true);
  const [selectedMarkerRef, activeMarkerEl] = useAdvancedMarkerRef();
  const [touchedPin, setTouchedPin] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [touchedSpot, setTouchedSpot] = useState<TouchedSpotState | null>(null);

  const inspectLocation = useCallback(
    async (lat: number, lng: number, explicitPlace?: IndiaStateUT) => {
      const resolved = explicitPlace
        ? { place: explicitPlace, distanceKm: 0 }
        : findNearestIndiaPlace(places, lat, lng);

      setTouchedPin({ lat, lng });
      onFocusPlace(resolved.place);
      setTouchedSpot({
        lat,
        lng,
        place: resolved.place,
        distanceKm: resolved.distanceKm,
        loadingNearby: true,
        nearbyPlaces: [],
      });

      const nearby = await queryNearbyFavorites(lat, lng, resolved.place.name);
      setTouchedSpot((curr) =>
        curr && curr.place.id === resolved.place.id
          ? { ...curr, loadingNearby: false, nearbyPlaces: nearby }
          : curr
      );
    },
    [onFocusPlace, places]
  );

  if (
    status === APILoadingStatus.FAILED ||
    status === APILoadingStatus.AUTH_FAILURE
  ) {
    return (
      <LiveGoogleMapsEmbed
        places={places}
        selectedPlace={selectedPlace}
        valuePriority={valuePriority}
        onFocusPlace={onFocusPlace}
        onOpenPlace={onOpenPlace}
      />
    );
  }

  const pop = getIndiaPlacePopularity(selectedPlace.id);
  const val = calculateValueForMoney(
    selectedPlace.startingBudgetInr,
    pop.rating,
    valuePriority
  );

  const cameraTarget = touchedPin ?? {
    lat: selectedPlace.lat,
    lng: selectedPlace.lon,
  };

  return (
    <div className="relative h-[500px] sm:h-[580px] w-full rounded-[22px] overflow-hidden border border-black/8 bg-[#ebe5da]">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={INDIA_CENTER}
        defaultZoom={4.8}
        gestureHandling="greedy"
        mapTypeControl={true}
        streetViewControl={true}
        fullscreenControl={true}
        zoomControl={true}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
        onClick={(ev: MapMouseEvent) => {
          const latLng = ev.detail?.latLng;
          if (!latLng) return;
          setInfoOpen(false);
          inspectLocation(latLng.lat, latLng.lng);
        }}
      >
        <MapCameraSync target={cameraTarget} />

        {places.map((place) => {
          const isSelected = place.id === selectedPlace.id;
          const isUT = place.kind === 'Union Territory';
          const matchesFilter = filteredIds.has(place.id);

          return (
            <AdvancedMarker
              key={place.id}
              ref={isSelected ? selectedMarkerRef : undefined}
              position={{ lat: place.lat, lng: place.lon }}
              title={`${place.name} (${place.kind})`}
              onClick={() => {
                setTouchedPin(null);
                onFocusPlace(place);
                setInfoOpen(true);
                inspectLocation(place.lat, place.lon, place);
              }}
            >
              <Pin
                background={isUT ? '#b45309' : '#1d4738'}
                borderColor="#ffffff"
                glyphColor="#ffffff"
                scale={isSelected ? 1.25 : matchesFilter ? 0.95 : 0.72}
              />
            </AdvancedMarker>
          );
        })}

        {touchedPin && (
          <AdvancedMarker
            position={touchedPin}
            title="Selected Google Map location"
          >
            <Pin
              background="#141714"
              borderColor="#ffffff"
              glyphColor="#ffffff"
              scale={1.15}
            />
          </AdvancedMarker>
        )}

        {infoOpen && activeMarkerEl && !touchedSpot && (
          <InfoWindow
            anchor={activeMarkerEl}
            maxWidth={270}
            onCloseClick={() => setInfoOpen(false)}
          >
            <div className="p-1 space-y-2 text-[#141714]">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedPlace.imageUrl}
                  alt={selectedPlace.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[#5a6159]">
                    {selectedPlace.kind} · ★ {pop.rating.toFixed(1)}
                  </p>
                  <p className="font-semibold text-sm truncate">
                    {selectedPlace.name}
                  </p>
                  <p className="text-[11px] font-mono tabular-nums text-[#1d4738] font-semibold">
                    From {formatINR(selectedPlace.startingBudgetInr)} · Value{' '}
                    {val.score.toFixed(1)}/10
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenPlace(selectedPlace)}
                className="w-full bg-[#1d4738] hover:bg-[#15362a] text-white text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Open Places &amp; Food</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Hint Chip at Top Center */}
      {!touchedSpot && (
        <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-[#141714]/88 text-white text-[11px] font-medium px-3.5 py-1.5 rounded-full shadow">
            Touch anywhere on the Google Map to reveal favorite places there
          </span>
        </div>
      )}

      {/* Favorite Places Popup Card on Map Touch */}
      {touchedSpot && (
        <div className="absolute inset-x-3 bottom-3 z-20 max-h-[300px] overflow-y-auto">
          <FavoritePlacesOverlayCard
            spot={touchedSpot}
            valuePriority={valuePriority}
            onOpenFullPlace={onOpenPlace}
            onClose={() => setTouchedSpot(null)}
          />
        </div>
      )}
    </div>
  );
};

export const GoogleIndiaMap: React.FC<GoogleIndiaMapProps> = ({
  places,
  filteredIds,
  selectedPlace,
  valuePriority,
  onFocusPlace,
  onOpenPlace,
}) => {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '').trim();

  if (!apiKey) {
    return (
      <LiveGoogleMapsEmbed
        places={places}
        selectedPlace={selectedPlace}
        valuePriority={valuePriority}
        onFocusPlace={onFocusPlace}
        onOpenPlace={onOpenPlace}
      />
    );
  }

  return (
    <APIProvider apiKey={apiKey} language="en" region="IN" libraries={['marker']}>
      <MapStatusContent
        places={places}
        filteredIds={filteredIds}
        selectedPlace={selectedPlace}
        valuePriority={valuePriority}
        onFocusPlace={onFocusPlace}
        onOpenPlace={onOpenPlace}
      />
    </APIProvider>
  );
};
