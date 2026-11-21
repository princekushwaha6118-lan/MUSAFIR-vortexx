import React, { useCallback, useEffect, useState } from 'react';
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  RefreshCw,
  Sun,
  Wind,
} from 'lucide-react';
import type { MusafirDestination } from '../types.ts';

interface DestinationWeatherWidgetProps {
  destination: MusafirDestination;
}

interface DailyForecastItem {
  dateIso: string;
  weatherCode: number;
  tempMaxC: number;
  tempMinC: number;
  precipChancePct: number;
}

interface WeatherDataState {
  locationLabel: string;
  currentTempC: number;
  feelsLikeC: number;
  humidityPct: number;
  windKmh: number;
  currentCode: number;
  daily: DailyForecastItem[];
}

const DESTINATION_COORDS: Record<
  string,
  { lat: number; lng: number; label: string }
> = {
  'agra-taj': { lat: 27.1751, lng: 78.0421, label: 'Agra, Uttar Pradesh' },
  'varanasi-kashi': { lat: 25.3176, lng: 82.9739, label: 'Varanasi, India' },
  'kedarnath-rishikesh': {
    lat: 30.7346,
    lng: 79.0669,
    label: 'Kedarnath, Uttarakhand',
  },
  'madurai-hampi': { lat: 15.335, lng: 76.46, label: 'Hampi, Karnataka' },
  manali: { lat: 32.2432, lng: 77.1892, label: 'Manali, Himachal Pradesh' },
  kashmir: { lat: 34.0837, lng: 74.7973, label: 'Srinagar, Kashmir' },
  switzerland: {
    lat: 46.5935,
    lng: 7.9091,
    label: 'Lauterbrunnen, Switzerland',
  },
  bali: { lat: -8.5069, lng: 115.2625, label: 'Ubud, Bali' },
  paris: { lat: 48.8566, lng: 2.3522, label: 'Paris, France' },
  dubai: { lat: 25.2048, lng: 55.2708, label: 'Dubai, UAE' },
};

function describeWmoCode(code: number): {
  label: string;
  kind:
    | 'clear'
    | 'partly-cloudy'
    | 'cloudy'
    | 'fog'
    | 'drizzle'
    | 'rain'
    | 'snow'
    | 'storm';
} {
  if (code === 0) return { label: 'Clear Sky', kind: 'clear' };
  if (code === 1 || code === 2)
    return { label: 'Mostly Sunny', kind: 'partly-cloudy' };
  if (code === 3) return { label: 'Overcast', kind: 'cloudy' };
  if (code === 45 || code === 48) return { label: 'Mist / Fog', kind: 'fog' };
  if (code >= 51 && code <= 57) return { label: 'Drizzle', kind: 'drizzle' };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82))
    return { label: 'Rain Showers', kind: 'rain' };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86)
    return { label: 'Snow', kind: 'snow' };
  if (code >= 95) return { label: 'Thunderstorm', kind: 'storm' };
  return { label: 'Fair', kind: 'partly-cloudy' };
}

const WeatherConditionIcon: React.FC<{ code: number; className?: string }> = ({
  code,
  className = 'w-5 h-5',
}) => {
  const { kind } = describeWmoCode(code);
  switch (kind) {
    case 'clear':
      return <Sun className={`${className} text-amber-500`} />;
    case 'partly-cloudy':
      return <CloudSun className={`${className} text-amber-500`} />;
    case 'cloudy':
      return <Cloud className={`${className} text-slate-500`} />;
    case 'fog':
      return <CloudFog className={`${className} text-slate-500`} />;
    case 'drizzle':
      return <CloudDrizzle className={`${className} text-sky-600`} />;
    case 'rain':
      return <CloudRain className={`${className} text-sky-600`} />;
    case 'snow':
      return <CloudSnow className={`${className} text-sky-500`} />;
    case 'storm':
      return <CloudLightning className={`${className} text-indigo-600`} />;
  }
};

function formatTemp(tempC: number, unit: 'C' | 'F'): string {
  const val = unit === 'F' ? (tempC * 9) / 5 + 32 : tempC;
  return `${Math.round(val)}°`;
}

function formatDayLabel(
  dateIso: string,
  index: number
): { dayName: string; shortDate: string } {
  const parsed = new Date(`${dateIso}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { dayName: `Day ${index + 1}`, shortDate: dateIso };
  }
  const dayName =
    index === 0
      ? 'Today'
      : parsed.toLocaleDateString('en-US', { weekday: 'short' });
  const shortDate = parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return { dayName, shortDate };
}

export const DestinationWeatherWidget: React.FC<
  DestinationWeatherWidgetProps
> = ({ destination }) => {
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherDataState | null>(null);

  const loadForecast = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      let coords = DESTINATION_COORDS[destination.id];
      if (!coords) {
        const searchTerm = destination.name.split('&')[0].trim();
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            searchTerm
          )}&count=1&language=en&format=json`
        );
        if (geoRes.ok) {
          const geoData = (await geoRes.json()) as {
            results?: Array<{
              latitude: number;
              longitude: number;
              name: string;
              country?: string;
            }>;
          };
          const first = geoData.results?.[0];
          if (first) {
            coords = {
              lat: first.latitude,
              lng: first.longitude,
              label: first.country
                ? `${first.name}, ${first.country}`
                : first.name,
            };
          }
        }
      }

      if (!coords) {
        throw new Error('Could not resolve coordinates for this location.');
      }

      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=5&timezone=auto`;

      const res = await fetch(forecastUrl);
      if (!res.ok) {
        throw new Error('Weather service temporarily unavailable.');
      }

      const json = (await res.json()) as {
        current?: {
          temperature_2m: number;
          apparent_temperature: number;
          relative_humidity_2m: number;
          weather_code: number;
          wind_speed_10m: number;
        };
        daily?: {
          time: string[];
          weather_code: number[];
          temperature_2m_max: number[];
          temperature_2m_min: number[];
          precipitation_probability_max?: Array<number | null>;
        };
      };

      if (!json.current || !json.daily?.time?.length) {
        throw new Error('Incomplete weather data received.');
      }

      const daily: DailyForecastItem[] = json.daily.time
        .slice(0, 5)
        .map((dateIso, idx) => ({
          dateIso,
          weatherCode: json.daily!.weather_code[idx] ?? 0,
          tempMaxC: json.daily!.temperature_2m_max[idx] ?? 0,
          tempMinC: json.daily!.temperature_2m_min[idx] ?? 0,
          precipChancePct:
            json.daily!.precipitation_probability_max?.[idx] ?? 0,
        }));

      setWeather({
        locationLabel: coords.label,
        currentTempC: json.current.temperature_2m,
        feelsLikeC: json.current.apparent_temperature,
        humidityPct: json.current.relative_humidity_2m,
        windKmh: json.current.wind_speed_10m,
        currentCode: json.current.weather_code,
        daily,
      });
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Unable to fetch the 5-day forecast right now.'
      );
    } finally {
      setLoading(false);
    }
  }, [destination.id, destination.name]);

  useEffect(() => {
    loadForecast();
  }, [loadForecast]);

  return (
    <div className="pt-5 border-t border-black/8 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1d4738]">
            Live 5-Day Weather Forecast
          </p>
          <h4 className="font-editorial text-xl font-semibold text-[#141714] mt-0.5">
            {weather?.locationLabel ?? destination.name}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="inline-flex items-center p-0.5 rounded-full bg-[#ebe5da]"
            role="group"
            aria-label="Temperature unit"
          >
            {(['C', 'F'] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  unit === u
                    ? 'bg-[#141714] text-white'
                    : 'text-[#4a5149] hover:text-[#141714]'
                }`}
              >
                °{u}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={loadForecast}
            disabled={loading}
            aria-label="Refresh weather forecast"
            className="w-8 h-8 rounded-full bg-[#f7f5f0] hover:bg-[#ebe5da] text-[#141714] grid place-items-center cursor-pointer disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && !weather ? (
        <div className="bg-[#f7f5f0] rounded-2xl p-4 space-y-3 animate-pulse">
          <div className="h-8 w-44 rounded-lg bg-[#ebe5da]" />
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map((slot) => (
              <div key={slot} className="h-24 rounded-xl bg-[#ebe5da]" />
            ))}
          </div>
        </div>
      ) : errorMsg ? (
        <div
          role="alert"
          className="bg-[#f7f5f0] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3"
        >
          <p className="text-xs sm:text-sm text-rose-700 font-medium">
            {errorMsg}
          </p>
          <button
            type="button"
            onClick={loadForecast}
            className="bg-[#1d4738] text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer whitespace-nowrap"
          >
            Retry Forecast
          </button>
        </div>
      ) : (
        weather && (
          <div className="bg-[#f7f5f0] rounded-2xl p-4 sm:p-5 space-y-4">
            {/* Current Conditions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white grid place-items-center shrink-0">
                  <WeatherConditionIcon
                    code={weather.currentCode}
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-[#141714]">
                      {formatTemp(weather.currentTempC, unit)}
                      {unit}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[#1d4738]">
                      {describeWmoCode(weather.currentCode).label}
                    </span>
                  </div>
                  <p className="text-xs text-[#5a6159]">
                    Feels like{' '}
                    <span className="font-mono tabular-nums font-medium text-[#141714]">
                      {formatTemp(weather.feelsLikeC, unit)}
                      {unit}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#4a5149]">
                <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                  <Droplets className="w-3.5 h-3.5 text-[#1d4738]" />
                  {weather.humidityPct}% humidity
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                  <Wind className="w-3.5 h-3.5 text-[#1d4738]" />
                  {Math.round(weather.windKmh)} km/h
                </span>
              </div>
            </div>

            {/* 5-Day Daily Forecast Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-3 border-t border-black/8">
              {weather.daily.map((day, idx) => {
                const { dayName, shortDate } = formatDayLabel(day.dateIso, idx);
                const cond = describeWmoCode(day.weatherCode);
                return (
                  <div
                    key={day.dateIso}
                    className="bg-white rounded-xl p-3 flex flex-col justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#141714]">
                        {dayName}
                      </p>
                      <p className="text-[11px] text-[#5a6159]">{shortDate}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <WeatherConditionIcon
                        code={day.weatherCode}
                        className="w-5 h-5 shrink-0"
                      />
                      <span className="text-[11px] font-medium text-[#4a5149] truncate">
                        {cond.label}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-1 text-xs pt-1 border-t border-black/6">
                      <span className="font-mono tabular-nums font-semibold text-[#141714]">
                        {formatTemp(day.tempMaxC, unit)} /{' '}
                        <span className="font-normal text-[#5a6159]">
                          {formatTemp(day.tempMinC, unit)}
                        </span>
                      </span>
                      {day.precipChancePct > 0 && (
                        <span className="font-mono tabular-nums text-[10px] font-semibold text-sky-700">
                          {day.precipChancePct}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
};
