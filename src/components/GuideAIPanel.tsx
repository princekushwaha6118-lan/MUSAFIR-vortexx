import React, { useState } from 'react';
import {
  Compass,
  ExternalLink,
  Loader2,
  LocateFixed,
  MapPin,
  Send,
  Sparkles,
} from 'lucide-react';
import type {
  GroundingPlaceSource,
  GuideMessage,
  IndiaStateUT,
} from '../types.ts';

interface GuideAIPanelProps {
  selectedPlace: IndiaStateUT | null;
  compact?: boolean;
}

export const GuideAIPanel: React.FC<GuideAIPanelProps> = ({
  selectedPlace,
  compact = false,
}) => {
  const [messages, setMessages] = useState<GuideMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [useMapsGrounding, setUseMapsGrounding] = useState(true);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locating, setLocating] = useState(false);

  const suggestedPrompts = selectedPlace
    ? [
        `Must-try favorite food in ${selectedPlace.name}?`,
        `Best 3-day itinerary for ${selectedPlace.name}`,
        `Top famous places in ${selectedPlace.name} & Rupee budget`,
      ]
    : [
        'Best winter temples & heritage places in India',
        'Top street food states to visit in India',
        '7-day North to South India trip under ₹35,000',
      ];

  const buildContextString = (place: IndiaStateUT | null): string => {
    if (!place) return '';
    const placesText = place.famousPlaces
      .map((p) => `${p.name} (${p.city}, ${p.category}, best: ${p.bestTime})`)
      .join('; ');
    const foodsText = place.favoriteFoods
      .map((f) => `${f.name} [${f.type}]: ${f.description}`)
      .join('; ');
    return [
      `${place.name} (${place.kind}), Capital: ${place.capital}, Region: ${place.region}`,
      `Best Season: ${place.bestSeason}, Languages: ${place.languages}, Starting Budget: ₹${place.startingBudgetInr.toLocaleString('en-IN')}`,
      `Famous Places: ${placesText}`,
      `Favorite Local Foods: ${foodsText}`,
    ].join('\n');
  };

  const handleToggleNearMe = () => {
    if (userCoords) {
      setUserCoords(null);
      return;
    }
    if (!navigator.geolocation) {
      setErrorMsg('Browser geolocation is unavailable on this device.');
      return;
    }
    setLocating(true);
    setErrorMsg(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setUseMapsGrounding(true);
        setLocating(false);
      },
      () => {
        setErrorMsg(
          'Location permission declined. Guide AI will use the selected state coordinates instead.'
        );
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 6000 }
    );
  };

  const askGuide = async (questionText: string) => {
    const clean = questionText.trim();
    if (!clean || loading) return;

    setErrorMsg(null);
    const userMsg: GuideMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: clean,
      stateName: selectedPlace?.name,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);

    const activeLat = userCoords?.lat ?? selectedPlace?.lat;
    const activeLng = userCoords?.lng ?? selectedPlace?.lon;

    try {
      const res = await fetch('/api/guide-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: clean,
          stateName: selectedPlace?.name,
          stateContext: buildContextString(selectedPlace),
          history: nextHistory.map((m) => ({ role: m.role, text: m.text })),
          useMapsGrounding,
          ...(typeof activeLat === 'number' && typeof activeLng === 'number'
            ? { lat: activeLat, lng: activeLng }
            : {}),
        }),
      });
      const data = (await res.json()) as {
        answer?: string;
        groundingPlaces?: GroundingPlaceSource[];
        error?: string;
      };
      if (!res.ok || !data.answer) {
        setErrorMsg(data.error ?? 'Unable to get an answer from Guide AI right now.');
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            text: data.answer!,
            stateName: selectedPlace?.name,
            groundingPlaces: data.groundingPlaces,
          },
        ]);
      }
    } catch {
      setErrorMsg('Network error reaching MUSAFIR Guide AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    askGuide(input);
  };

  return (
    <div className="bg-white rounded-[24px] border border-black/8 p-5 flex flex-col gap-3.5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1d4738] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MUSAFIR Guide AI</span>
          </p>
          <h4 className="font-editorial text-xl font-semibold text-[#141714] mt-0.5">
            {selectedPlace ? `${selectedPlace.name} Local Guide` : 'All-India Travel Companion'}
          </h4>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setErrorMsg(null);
            }}
            className="text-xs font-medium text-[#5a6159] hover:text-[#141714] cursor-pointer whitespace-nowrap"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Maps Grounding & Geolocation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <button
          type="button"
          onClick={() => setUseMapsGrounding((prev) => !prev)}
          aria-pressed={useMapsGrounding}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold border cursor-pointer transition-colors ${
            useMapsGrounding
              ? 'bg-[#e7ede9] text-[#1d4738] border-[#1d4738]/25'
              : 'bg-[#f7f5f0] text-[#5a6159] border-black/10'
          }`}
        >
          <MapPin className="w-3 h-3" />
          <span>Google Maps Data: {useMapsGrounding ? 'On' : 'Off'}</span>
        </button>

        <button
          type="button"
          onClick={handleToggleNearMe}
          disabled={locating}
          aria-pressed={Boolean(userCoords)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold border cursor-pointer transition-colors disabled:opacity-60 ${
            userCoords
              ? 'bg-[#141714] text-white border-[#141714]'
              : 'bg-[#f7f5f0] text-[#4a5149] border-black/10 hover:text-[#141714]'
          }`}
        >
          <LocateFixed className="w-3 h-3" />
          <span>
            {locating
              ? 'Locating...'
              : userCoords
              ? 'Near Me Active'
              : 'Use My Location'}
          </span>
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => askGuide(prompt)}
            disabled={loading}
            className="text-left text-xs font-medium text-[#1d4738] bg-[#f7f5f0] hover:bg-[#e7ede9] border border-black/8 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Conversation Feed */}
      <div
        className={`bg-[#f7f5f0] rounded-2xl p-3.5 overflow-y-auto space-y-3 ${
          compact ? 'max-h-56 min-h-[150px]' : 'max-h-72 min-h-[160px]'
        }`}
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center gap-3 text-xs sm:text-sm text-[#5a6159] py-4 px-1">
            <Compass className="w-5 h-5 text-[#1d4738] shrink-0" />
            <p className="leading-relaxed">
              Ask about any verified state or union territory—famous temples, hidden waterfalls,
              favorite local dishes, or Rupee trip budgets grounded with Google Maps data.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-[#141714] text-white ml-6'
                  : 'bg-white text-[#141714] border border-black/8 mr-3'
              }`}
            >
              <span className="block text-[10px] font-semibold uppercase tracking-wider opacity-65 mb-1">
                {msg.role === 'user' ? 'You' : 'MUSAFIR Guide AI'}
                {msg.stateName ? ` · ${msg.stateName}` : ''}
              </span>
              <p>{msg.text}</p>

              {msg.role === 'assistant' &&
                msg.groundingPlaces &&
                msg.groundingPlaces.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-black/8 space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1d4738]">
                      Verified Places on Google Maps
                    </p>
                    <div className="space-y-1.5">
                      {msg.groundingPlaces.map((place) => (
                        <div
                          key={place.uri}
                          className="bg-[#f7f5f0] rounded-lg px-2.5 py-2 text-xs space-y-1"
                        >
                          <a
                            href={place.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-[#1d4738] hover:underline inline-flex items-center gap-1"
                          >
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span>{place.title}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                          {place.reviewSnippets &&
                            place.reviewSnippets.length > 0 && (
                              <p className="text-[11px] text-[#5a6159] italic leading-snug">
                                “{place.reviewSnippets[0]}”
                              </p>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#1d4738] font-medium px-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Preparing Maps-grounded travel tips...</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <p role="alert" className="text-xs font-medium text-rose-700 bg-rose-50 px-3 py-2 rounded-xl">
          {errorMsg}
        </p>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            selectedPlace
              ? `Ask Guide AI about ${selectedPlace.name}...`
              : 'Ask about any Indian state, place, or food...'
          }
          aria-label="Ask MUSAFIR Guide AI"
          className="flex-1 bg-[#f7f5f0] border border-black/10 rounded-full px-4 py-2.5 text-xs sm:text-sm text-[#141714] placeholder:text-[#7c837a] focus:outline-none focus:border-[#1d4738]"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send question to Guide AI"
          className="bg-[#1d4738] hover:bg-[#15362a] text-white px-4 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-55 whitespace-nowrap shrink-0 transition-colors"
        >
          <span>Ask AI</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
