import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Disc3,
  ExternalLink,
  Headphones,
  Loader2,
  LogOut,
  Music,
  Pause,
  Play,
  Search,
} from 'lucide-react';
import type {
  SpotifyPlaylist,
  SpotifyTrack,
  SpotifyUser,
} from '../types.ts';

interface PlaceSpotifyPlayerProps {
  placeName: string;
  searchContext?: string;
}

function formatTrackDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const PlaceSpotifyPlayer: React.FC<PlaceSpotifyPlayerProps> = ({
  placeName,
  searchContext,
}) => {
  const baseContext = searchContext?.trim() || placeName;
  const vibePresets = [
    { label: 'Local Vibe', query: `${baseContext} music` },
    { label: 'Folk & Roots', query: `${placeName} folk traditional` },
    { label: 'Roadtrip', query: `${placeName} roadtrip indie` },
    { label: 'Acoustic Chill', query: `${placeName} acoustic chill` },
  ];

  const [configured, setConfigured] = useState(true);
  const [spotifyUser, setSpotifyUser] = useState<SpotifyUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [searching, setSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeVibe, setActiveVibe] = useState(vibePresets[0].label);
  const [queryInput, setQueryInput] = useState(vibePresets[0].query);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);

  const [selectedEmbed, setSelectedEmbed] = useState<{
    kind: 'track' | 'playlist';
    id: string;
    title: string;
  } | null>(null);

  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopPreviewAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingTrackId(null);
  }, []);

  useEffect(() => {
    return () => {
      stopPreviewAudio();
    };
  }, [stopPreviewAudio]);

  const searchForPlace = useCallback(async (q: string) => {
    const clean = q.trim();
    if (!clean) return;
    setSearching(true);
    setErrorMsg(null);
    try {
      const res = await fetch(
        `/api/spotify/search?q=${encodeURIComponent(clean)}`
      );
      const data = (await res.json()) as {
        tracks?: SpotifyTrack[];
        playlists?: SpotifyPlaylist[];
        error?: string;
      };
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Could not load Spotify tracks for this place.');
      } else {
        const nextTracks = data.tracks ?? [];
        const nextPlaylists = data.playlists ?? [];
        setTracks(nextTracks);
        setPlaylists(nextPlaylists);
        if (nextTracks.length > 0) {
          setSelectedEmbed({
            kind: 'track',
            id: nextTracks[0].id,
            title: `${nextTracks[0].name} — ${nextTracks[0].artists}`,
          });
        } else if (nextPlaylists.length > 0) {
          setSelectedEmbed({
            kind: 'playlist',
            id: nextPlaylists[0].id,
            title: nextPlaylists[0].name,
          });
        }
      }
    } catch {
      setErrorMsg('Network error reaching Spotify catalog.');
    } finally {
      setSearching(false);
    }
  }, []);

  const syncSession = useCallback(async () => {
    setCheckingAuth(true);
    try {
      const res = await fetch('/api/spotify/me');
      const data = (await res.json()) as {
        configured?: boolean;
        connected?: boolean;
        user?: SpotifyUser | null;
      };
      setConfigured(Boolean(data.configured));
      const user = data.connected && data.user ? data.user : null;
      setSpotifyUser(user);
      if (user) {
        searchForPlace(`${baseContext} music`);
      } else {
        setTracks([]);
        setPlaylists([]);
        setSelectedEmbed(null);
      }
    } catch {
      setSpotifyUser(null);
    } finally {
      setCheckingAuth(false);
    }
  }, [baseContext, searchForPlace]);

  useEffect(() => {
    syncSession();
  }, [syncSession]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'SPOTIFY_AUTH_SUCCESS') {
        setErrorMsg(null);
        window.dispatchEvent(new Event('musafir:spotify-updated'));
      } else if (event.data?.type === 'SPOTIFY_AUTH_ERROR') {
        setErrorMsg(
          typeof event.data.error === 'string'
            ? event.data.error
            : 'Spotify connection could not be completed.'
        );
      }
    };

    const handleSync = () => {
      syncSession();
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('musafir:spotify-updated', handleSync);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('musafir:spotify-updated', handleSync);
    };
  }, [syncSession]);

  const handleConnect = async () => {
    setErrorMsg(null);
    try {
      const res = await fetch(
        `/api/spotify/auth/url?origin=${encodeURIComponent(window.location.origin)}`
      );
      const data = (await res.json()) as {
        url?: string;
        configured?: boolean;
        error?: string;
      };
      if (!res.ok || !data.url) {
        setConfigured(Boolean(data.configured));
        setErrorMsg(
          data.error ?? 'Spotify credentials are not configured yet.'
        );
        return;
      }
      const popup = window.open(
        data.url,
        'spotify_oauth_popup',
        'width=540,height=720'
      );
      if (!popup) {
        setErrorMsg(
          'Popup blocked by browser. Allow popups for this site to connect Spotify.'
        );
      }
    } catch {
      setErrorMsg('Unable to start Spotify sign-in right now.');
    }
  };

  const handleDisconnect = async () => {
    stopPreviewAudio();
    await fetch('/api/spotify/logout', { method: 'POST' });
    setSpotifyUser(null);
    setTracks([]);
    setPlaylists([]);
    setSelectedEmbed(null);
    window.dispatchEvent(new Event('musafir:spotify-updated'));
  };

  const handleTogglePreview = (track: SpotifyTrack) => {
    if (!track.previewUrl) return;
    if (playingTrackId === track.id && audioRef.current) {
      stopPreviewAudio();
      return;
    }
    stopPreviewAudio();
    const audio = new Audio(track.previewUrl);
    audio.onended = () => setPlayingTrackId(null);
    audio.play().catch(() => setPlayingTrackId(null));
    audioRef.current = audio;
    setPlayingTrackId(track.id);
  };

  return (
    <div className="pt-5 border-t border-black/8 space-y-4">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1d4738] flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5" />
            <span>Listen While Exploring {placeName}</span>
          </p>
          <h4 className="font-editorial text-xl font-semibold text-[#141714] mt-0.5">
            {placeName} Soundtrack on Spotify
          </h4>
        </div>

        {checkingAuth ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#5a6159]" />
        ) : spotifyUser ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-[#4a5149]">
              Connected as{' '}
              <strong className="text-[#141714]">
                {spotifyUser.displayName}
              </strong>
            </span>
            <button
              type="button"
              onClick={handleDisconnect}
              className="text-xs font-semibold text-[#5a6159] hover:text-[#141714] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleConnect}
              className="bg-[#141714] hover:bg-[#1d4738] text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
            >
              <Music className="w-3.5 h-3.5" />
              <span>Connect Spotify</span>
            </button>
            <a
              href={`https://open.spotify.com/search/${encodeURIComponent(
                `${placeName} music`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#f7f5f0] hover:bg-[#ebe5da] text-[#141714] text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Open in Spotify</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {errorMsg && (
        <p
          role="alert"
          className="text-xs font-medium text-rose-700 bg-rose-50 px-3.5 py-2.5 rounded-xl"
        >
          {errorMsg}
        </p>
      )}

      {spotifyUser ? (
        <div className="space-y-4">
          {/* Vibe Presets & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              {vibePresets.map((preset) => {
                const active = activeVibe === preset.label;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setActiveVibe(preset.label);
                      setQueryInput(preset.query);
                      searchForPlace(preset.query);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'bg-[#141714] text-white'
                        : 'bg-[#f7f5f0] text-[#4a5149] hover:text-[#141714]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setActiveVibe('');
                searchForPlace(queryInput);
              }}
              className="flex items-center gap-1.5"
            >
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#5a6159] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder={`Search ${placeName} music...`}
                  aria-label={`Search Spotify music for ${placeName}`}
                  className="bg-[#f7f5f0] border border-black/10 rounded-full pl-8 pr-3 py-1.5 text-xs text-[#141714] focus:outline-none focus:border-[#1d4738] w-44 sm:w-52"
                />
              </div>
              <button
                type="submit"
                disabled={searching}
                className="bg-[#1d4738] hover:bg-[#15362a] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
              >
                {searching ? 'Loading...' : 'Find'}
              </button>
            </form>
          </div>

          {searching && tracks.length === 0 ? (
            <div className="bg-[#f7f5f0] rounded-2xl p-5 flex items-center gap-2.5 text-xs text-[#5a6159]">
              <Loader2 className="w-4 h-4 animate-spin text-[#1d4738]" />
              <span>Finding Spotify tracks and playlists for {placeName}...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Official Spotify Embed Player */}
              {selectedEmbed && (
                <div className="lg:col-span-5 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5a6159] truncate">
                    Spotify Player · {selectedEmbed.title}
                  </p>
                  <iframe
                    title={`Spotify player for ${selectedEmbed.title}`}
                    src={`https://open.spotify.com/embed/${selectedEmbed.kind}/${selectedEmbed.id}?utm_source=generator`}
                    width="100%"
                    height={selectedEmbed.kind === 'track' ? '152' : '232'}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-2xl border-0 bg-[#141714]"
                  />
                </div>
              )}

              {/* Playable Place Tracklist */}
              <div
                className={
                  selectedEmbed ? 'lg:col-span-7 space-y-2' : 'lg:col-span-12 space-y-2'
                }
              >
                {tracks.length > 0 ? (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {tracks.map((track) => {
                      const isPlayingPreview = playingTrackId === track.id;
                      const isLoadedInEmbed =
                        selectedEmbed?.kind === 'track' &&
                        selectedEmbed.id === track.id;

                      return (
                        <div
                          key={track.id}
                          className={`rounded-xl p-2.5 flex items-center justify-between gap-2.5 transition-colors ${
                            isLoadedInEmbed ? 'bg-[#e7ede9]' : 'bg-[#f7f5f0]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {track.albumArt ? (
                              <img
                                src={track.albumArt}
                                alt={track.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-lg object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-[#ebe5da] grid place-items-center shrink-0">
                                <Music className="w-4 h-4 text-[#1d4738]" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#141714] truncate">
                                {track.name}
                              </p>
                              <p className="text-[11px] text-[#5a6159] truncate">
                                {track.artists} ·{' '}
                                <span className="font-mono tabular-nums">
                                  {formatTrackDuration(track.durationMs)}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {track.previewUrl && (
                              <button
                                type="button"
                                onClick={() => handleTogglePreview(track)}
                                aria-label={
                                  isPlayingPreview
                                    ? `Pause preview of ${track.name}`
                                    : `Play 30s preview of ${track.name}`
                                }
                                className="w-8 h-8 rounded-full bg-[#1d4738] text-white grid place-items-center cursor-pointer"
                              >
                                {isPlayingPreview ? (
                                  <Pause className="w-3.5 h-3.5" />
                                ) : (
                                  <Play className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                stopPreviewAudio();
                                setSelectedEmbed({
                                  kind: 'track',
                                  id: track.id,
                                  title: `${track.name} — ${track.artists}`,
                                });
                              }}
                              className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                                isLoadedInEmbed
                                  ? 'bg-[#141714] text-white'
                                  : 'bg-white text-[#141714] hover:bg-[#141714] hover:text-white'
                              }`}
                            >
                              {isLoadedInEmbed ? 'Loaded' : 'Play'}
                            </button>

                            <a
                              href={track.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${track.name} on Spotify`}
                              className="p-1.5 text-[#1d4738] hover:text-[#141714]"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-[#5a6159] bg-[#f7f5f0] rounded-xl p-4">
                    No matching tracks found for this query. Try another vibe preset above.
                  </p>
                )}

                {playlists.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {playlists.slice(0, 3).map((pl) => {
                      const activePl =
                        selectedEmbed?.kind === 'playlist' &&
                        selectedEmbed.id === pl.id;
                      return (
                        <button
                          key={pl.id}
                          type="button"
                          onClick={() => {
                            stopPreviewAudio();
                            setSelectedEmbed({
                              kind: 'playlist',
                              id: pl.id,
                              title: pl.name,
                            });
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                            activePl
                              ? 'bg-[#1d4738] text-white'
                              : 'bg-[#f7f5f0] text-[#141714] hover:bg-[#ebe5da]'
                          }`}
                        >
                          <Disc3 className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[170px]">
                            {pl.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#f7f5f0] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-semibold text-[#141714]">
              Play {placeName} music directly from Spotify while browsing
            </p>
            <p className="text-xs text-[#5a6159] leading-relaxed">
              Connect your Spotify account to load curated {placeName} tracks, folk
              soundtracks, and playlists right inside this destination view.
              {!configured && (
                <>
                  {' '}
                  Set <span className="font-mono">SPOTIFY_CLIENT_ID</span> and{' '}
                  <span className="font-mono">SPOTIFY_CLIENT_SECRET</span> in{' '}
                  <strong>Settings &gt; Secrets</strong>.
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
