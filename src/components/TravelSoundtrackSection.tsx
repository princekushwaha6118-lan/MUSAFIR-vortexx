import React, { useCallback, useEffect, useState } from 'react';
import {
  Disc3,
  ExternalLink,
  Loader2,
  LogOut,
  Music,
  Pause,
  Play,
  Search,
  Sparkles,
} from 'lucide-react';
import type {
  GeneratedMusicResult,
  SpotifyPlaylist,
  SpotifyTrack,
  SpotifyUser,
} from '../types.ts';

interface TravelSoundtrackSectionProps {
  activePlaceName?: string;
}

const DESTINATION_SOUND_PRESETS = [
  {
    label: 'Taj Mahal Dawn Sitar',
    prompt:
      'Gentle classical Indian sitar, soft bansuri flute, and warm acoustic strings evoking sunrise over marble gardens in Agra.',
  },
  {
    label: 'Himalayan Cedar Acoustic',
    prompt:
      'Warm indie acoustic guitar, mountain wind chime textures, and calm ambient pads for a slow Himalayan valley road trip.',
  },
  {
    label: 'Kerala Backwaters Monsoon',
    prompt:
      'Serene bamboo flute, soft rain ambiance, and mellow lo-fi percussion drifting along emerald palm-lined backwaters.',
  },
  {
    label: 'Jaipur Royal Folk Roadtrip',
    prompt:
      'Uplifting Rajasthani folk rhythm with sarangi melodies and crisp upbeat acoustic travel groove for desert highways.',
  },
];

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const TravelSoundtrackSection: React.FC<TravelSoundtrackSectionProps> = ({
  activePlaceName,
}) => {
  // Spotify OAuth & search state
  const [spotifyConfigured, setSpotifyConfigured] = useState<boolean>(true);
  const [spotifyUser, setSpotifyUser] = useState<SpotifyUser | null>(null);
  const [spotifyLoading, setSpotifyLoading] = useState<boolean>(true);
  const [spotifyError, setSpotifyError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(
    activePlaceName ? `${activePlaceName} India travel` : 'Incredible India travel acoustic'
  );
  const [searchingSpotify, setSearchingSpotify] = useState(false);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [selectedEmbed, setSelectedEmbed] = useState<{
    kind: 'track' | 'playlist';
    id: string;
    title: string;
  } | null>(null);

  // Lyria Music Generation state
  const [musicPrompt, setMusicPrompt] = useState(
    DESTINATION_SOUND_PRESETS[0].prompt
  );
  const [lyriaMode, setLyriaMode] = useState<'clip' | 'pro'>('clip');
  const [generatingMusic, setGeneratingMusic] = useState(false);
  const [musicError, setMusicError] = useState<string | null>(null);
  const [generatedMusic, setGeneratedMusic] =
    useState<GeneratedMusicResult | null>(null);

  useEffect(() => {
    if (activePlaceName) {
      setSearchQuery(`${activePlaceName} travel music`);
    }
  }, [activePlaceName]);

  const loadSpotifySession = useCallback(async () => {
    setSpotifyLoading(true);
    try {
      const res = await fetch('/api/spotify/me');
      const data = (await res.json()) as {
        configured?: boolean;
        connected?: boolean;
        user?: SpotifyUser | null;
      };
      setSpotifyConfigured(Boolean(data.configured));
      setSpotifyUser(data.connected && data.user ? data.user : null);
    } catch {
      setSpotifyUser(null);
    } finally {
      setSpotifyLoading(false);
    }
  }, []);

  const searchSpotifyCatalog = useCallback(async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;
    setSearchingSpotify(true);
    setSpotifyError(null);
    try {
      const res = await fetch(
        `/api/spotify/search?q=${encodeURIComponent(q)}`
      );
      const data = (await res.json()) as {
        tracks?: SpotifyTrack[];
        playlists?: SpotifyPlaylist[];
        error?: string;
      };
      if (res.ok) {
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
      } else {
        setSpotifyError(data.error ?? 'Could not search Spotify right now.');
      }
    } catch {
      setSpotifyError('Network error while searching Spotify.');
    } finally {
      setSearchingSpotify(false);
    }
  }, []);

  useEffect(() => {
    loadSpotifySession();
  }, [loadSpotifySession]);

  useEffect(() => {
    if (spotifyUser && tracks.length === 0) {
      searchSpotifyCatalog(searchQuery);
    }
  }, [spotifyUser, tracks.length, searchQuery, searchSpotifyCatalog]);

  useEffect(() => {
    if (spotifyUser && activePlaceName) {
      searchSpotifyCatalog(`${activePlaceName} travel music`);
    }
  }, [activePlaceName, spotifyUser, searchSpotifyCatalog]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'SPOTIFY_AUTH_SUCCESS') {
        setSpotifyError(null);
        loadSpotifySession();
        window.dispatchEvent(new Event('musafir:spotify-updated'));
      } else if (event.data?.type === 'SPOTIFY_AUTH_ERROR') {
        setSpotifyError(
          typeof event.data.error === 'string'
            ? event.data.error
            : 'Spotify sign-in could not be completed.'
        );
      }
    };
    const handleSync = () => {
      loadSpotifySession();
    };
    window.addEventListener('message', handleMessage);
    window.addEventListener('musafir:spotify-updated', handleSync);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('musafir:spotify-updated', handleSync);
    };
  }, [loadSpotifySession]);

  useEffect(() => {
    return () => {
      if (previewAudio) {
        previewAudio.pause();
      }
    };
  }, [previewAudio]);

  const handleConnectSpotify = async () => {
    setSpotifyError(null);
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
        setSpotifyConfigured(Boolean(data.configured));
        setSpotifyError(
          data.error ?? 'Spotify credentials are not configured yet.'
        );
        return;
      }

      const authWindow = window.open(
        data.url,
        'spotify_oauth_popup',
        'width=540,height=720'
      );
      if (!authWindow) {
        setSpotifyError(
          'Popup was blocked by your browser. Please allow popups for this site to connect Spotify.'
        );
      }
    } catch {
      setSpotifyError('Unable to initiate Spotify login.');
    }
  };

  const handleDisconnectSpotify = async () => {
    await fetch('/api/spotify/logout', { method: 'POST' });
    if (previewAudio) {
      previewAudio.pause();
    }
    setPlayingTrackId(null);
    setSpotifyUser(null);
    setTracks([]);
    setPlaylists([]);
    setSelectedEmbed(null);
    window.dispatchEvent(new Event('musafir:spotify-updated'));
  };

  const handleTogglePreview = (track: SpotifyTrack) => {
    if (!track.previewUrl) return;
    if (playingTrackId === track.id && previewAudio) {
      previewAudio.pause();
      setPlayingTrackId(null);
      return;
    }
    if (previewAudio) {
      previewAudio.pause();
    }
    const audio = new Audio(track.previewUrl);
    audio.onended = () => setPlayingTrackId(null);
    audio.play().catch(() => setPlayingTrackId(null));
    setPreviewAudio(audio);
    setPlayingTrackId(track.id);
  };

  const handleGenerateMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!musicPrompt.trim() || generatingMusic) return;
    setGeneratingMusic(true);
    setMusicError(null);

    try {
      const res = await fetch('/api/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: musicPrompt.trim(),
          mode: lyriaMode,
          destinationName: activePlaceName,
        }),
      });
      const data = (await res.json()) as Partial<GeneratedMusicResult> & {
        error?: string;
      };
      if (!res.ok || !data.audioDataUrl) {
        setMusicError(
          data.error ?? 'Unable to generate travel track right now.'
        );
      } else {
        setGeneratedMusic({
          audioDataUrl: data.audioDataUrl,
          lyrics: data.lyrics ?? '',
          model: data.model ?? 'lyria-3-clip-preview',
          durationLabel:
            data.durationLabel ?? (lyriaMode === 'pro' ? 'Full Track' : '30s Clip'),
        });
      }
    } catch {
      setMusicError('Network error while generating music.');
    } finally {
      setGeneratingMusic(false);
    }
  };

  return (
    <section
      id="soundtrack"
      className="mx-auto max-w-[1280px] px-4 sm:px-6 py-16 lg:py-20 scroll-mt-24"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1d4738] mb-2">
            Spotify Travel Radio &amp; Lyria Studio
          </p>
          <h2 className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight text-[#141714] [text-wrap:balance]">
            Soundtrack Your{' '}
            <em className="font-editorial italic font-medium">Journey</em>
          </h2>
          <p className="text-sm sm:text-base text-[#5a6159] mt-2 max-w-2xl">
            Connect Spotify to discover destination playlists and 30-second track
            previews, or compose custom ambient travel music with Lyria AI.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
        {/* Left: Spotify OAuth & Real Catalog Search */}
        <div className="lg:col-span-6 bg-white rounded-[28px] border border-black/8 p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-[0_10px_30px_rgba(20,23,20,0.04)]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1d4738] flex items-center gap-1.5">
                  <Disc3 className="w-3.5 h-3.5" />
                  <span>Spotify Companion</span>
                </p>
                <h3 className="font-editorial text-2xl font-semibold text-[#141714] mt-0.5">
                  Destination Playlists &amp; Previews
                </h3>
              </div>

              {spotifyLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#5a6159]" />
              ) : spotifyUser ? (
                <div className="flex items-center gap-2.5">
                  {spotifyUser.avatarUrl && (
                    <img
                      src={spotifyUser.avatarUrl}
                      alt={spotifyUser.displayName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-xs font-semibold text-[#141714]">
                    {spotifyUser.displayName}
                  </span>
                  <button
                    type="button"
                    onClick={handleDisconnectSpotify}
                    aria-label="Disconnect Spotify"
                    className="text-xs font-semibold text-[#5a6159] hover:text-[#141714] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleConnectSpotify}
                  className="bg-[#141714] hover:bg-[#1d4738] text-white text-xs font-semibold px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Connect Spotify</span>
                </button>
              )}
            </div>

            {spotifyError && (
              <p
                role="alert"
                className="text-xs font-medium text-rose-700 bg-rose-50 px-3.5 py-2.5 rounded-xl"
              >
                {spotifyError}
              </p>
            )}

            {spotifyUser ? (
              <div className="space-y-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    searchSpotifyCatalog(searchQuery);
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#5a6159] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Spotify songs, artists, or playlists..."
                      aria-label="Search Spotify tracks and playlists"
                      className="w-full bg-[#f7f5f0] border border-black/10 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-[#141714] focus:outline-none focus:border-[#1d4738]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={searchingSpotify}
                    className="bg-[#1d4738] hover:bg-[#15362a] text-white text-xs font-semibold px-4 py-2.5 rounded-full cursor-pointer whitespace-nowrap disabled:opacity-60"
                  >
                    {searchingSpotify ? 'Searching...' : 'Search'}
                  </button>
                </form>

                {tracks.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5a6159]">
                      Matching Tracks
                    </p>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {tracks.map((track) => {
                        const isPlaying = playingTrackId === track.id;
                        return (
                          <div
                            key={track.id}
                            className="bg-[#f7f5f0] rounded-xl p-2.5 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
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
                                <p className="text-xs sm:text-sm font-semibold text-[#141714] truncate">
                                  {track.name}
                                </p>
                                <p className="text-[11px] text-[#5a6159] truncate">
                                  {track.artists} ·{' '}
                                  <span className="font-mono tabular-nums">
                                    {formatDuration(track.durationMs)}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {track.previewUrl && (
                                <button
                                  type="button"
                                  onClick={() => handleTogglePreview(track)}
                                  aria-label={
                                    isPlaying
                                      ? `Pause preview of ${track.name}`
                                      : `Play 30s preview of ${track.name}`
                                  }
                                  className="w-8 h-8 rounded-full bg-[#1d4738] text-white grid place-items-center cursor-pointer"
                                >
                                  {isPlaying ? (
                                    <Pause className="w-3.5 h-3.5" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  if (previewAudio) {
                                    previewAudio.pause();
                                  }
                                  setPlayingTrackId(null);
                                  setSelectedEmbed({
                                    kind: 'track',
                                    id: track.id,
                                    title: `${track.name} — ${track.artists}`,
                                  });
                                }}
                                className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                                  selectedEmbed?.kind === 'track' &&
                                  selectedEmbed.id === track.id
                                    ? 'bg-[#141714] text-white'
                                    : 'bg-white text-[#141714] hover:bg-[#141714] hover:text-white'
                                }`}
                              >
                                {selectedEmbed?.kind === 'track' &&
                                selectedEmbed.id === track.id
                                  ? 'Loaded'
                                  : 'Play'}
                              </button>
                              <a
                                href={track.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open ${track.name} on Spotify`}
                                className="text-xs font-semibold text-[#1d4738] hover:underline inline-flex items-center gap-1"
                              >
                                <span>Open</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedEmbed && (
                  <div className="space-y-2 pt-2 border-t border-black/8">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5a6159] truncate">
                      Now Playing in Spotify Player · {selectedEmbed.title}
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

                {playlists.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-black/8">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5a6159]">
                      Curated Travel Playlists (Click to Load Player)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {playlists.slice(0, 4).map((pl) => (
                        <button
                          key={pl.id}
                          type="button"
                          onClick={() =>
                            setSelectedEmbed({
                              kind: 'playlist',
                              id: pl.id,
                              title: pl.name,
                            })
                          }
                          className="bg-[#f7f5f0] hover:bg-[#ebe5da] rounded-xl p-2.5 flex items-center gap-2.5 transition-colors text-left cursor-pointer"
                        >
                          {pl.imageUrl ? (
                            <img
                              src={pl.imageUrl}
                              alt={pl.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#ebe5da] grid place-items-center shrink-0">
                              <Disc3 className="w-4 h-4 text-[#1d4738]" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-[#141714] truncate">
                              {pl.name}
                            </p>
                            <p className="text-[11px] text-[#5a6159] truncate">
                              {pl.owner} · {pl.tracksTotal} tracks
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#f7f5f0] rounded-2xl p-5 space-y-3">
                <p className="text-sm font-semibold text-[#141714]">
                  Play real destination music from your Spotify account
                </p>
                <p className="text-xs sm:text-sm text-[#5a6159] leading-relaxed">
                  Click <strong>Connect Spotify</strong> to sign in with Spotify OAuth
                  and search curated regional tracks, Bollywood &amp; indie roadtrip
                  playlists, and 30-second previews matched to your destination.
                </p>
                {!spotifyConfigured && (
                  <p className="text-xs text-[#4a5149] pt-2 border-t border-black/8">
                    Configure <span className="font-mono">SPOTIFY_CLIENT_ID</span> and{' '}
                    <span className="font-mono">SPOTIFY_CLIENT_SECRET</span> in{' '}
                    <strong>Settings &gt; Secrets</strong> with callback URI{' '}
                    <span className="font-mono break-all">
                      {typeof window !== 'undefined'
                        ? `${window.location.origin}/auth/spotify/callback`
                        : '/auth/spotify/callback'}
                    </span>
                    .
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Lyria AI Music Generation Studio */}
        <div className="lg:col-span-6 bg-white rounded-[28px] border border-black/8 p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-[0_10px_30px_rgba(20,23,20,0.04)]">
          <form onSubmit={handleGenerateMusic} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1d4738] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lyria Travel Music Generator</span>
                </p>
                <h3 className="font-editorial text-2xl font-semibold text-[#141714] mt-0.5">
                  Compose Custom Destination Audio
                </h3>
              </div>

              <div
                className="inline-flex items-center p-1 rounded-full bg-[#ebe5da]"
                role="group"
                aria-label="Choose Lyria track length"
              >
                <button
                  type="button"
                  onClick={() => setLyriaMode('clip')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                    lyriaMode === 'clip'
                      ? 'bg-[#141714] text-white'
                      : 'text-[#4a5149] hover:text-[#141714]'
                  }`}
                >
                  30s Clip (Lyria Clip)
                </button>
                <button
                  type="button"
                  onClick={() => setLyriaMode('pro')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                    lyriaMode === 'pro'
                      ? 'bg-[#141714] text-white'
                      : 'text-[#4a5149] hover:text-[#141714]'
                  }`}
                >
                  Full Track (Lyria Pro)
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {DESTINATION_SOUND_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setMusicPrompt(preset.prompt)}
                  className="text-xs font-medium text-[#1d4738] bg-[#f7f5f0] hover:bg-[#e7ede9] border border-black/8 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="lyria-prompt"
                className="text-xs font-semibold text-[#5a6159] block"
              >
                Describe instruments, tempo, and destination mood
              </label>
              <textarea
                id="lyria-prompt"
                rows={3}
                value={musicPrompt}
                onChange={(e) => setMusicPrompt(e.target.value)}
                placeholder="Warm acoustic sitar and soft mountain winds at sunrise..."
                className="w-full bg-[#f7f5f0] border border-black/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#141714] focus:outline-none focus:border-[#1d4738]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-mono text-[#5a6159]">
                Model:{' '}
                {lyriaMode === 'pro'
                  ? 'lyria-3-pro-preview'
                  : 'lyria-3-clip-preview'}
              </span>

              <button
                type="submit"
                disabled={generatingMusic || !musicPrompt.trim()}
                className="bg-[#1d4738] hover:bg-[#15362a] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap disabled:opacity-60"
              >
                {generatingMusic ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Composing Track...</span>
                  </>
                ) : (
                  <>
                    <Music className="w-4 h-4" />
                    <span>
                      Generate {lyriaMode === 'pro' ? 'Full Track' : '30s Clip'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>

          {musicError && (
            <p
              role="alert"
              className="text-xs font-medium text-rose-700 bg-rose-50 px-3.5 py-2.5 rounded-xl"
            >
              {musicError}
            </p>
          )}

          {generatedMusic && (
            <div className="bg-[#f7f5f0] rounded-2xl p-4 space-y-3 border border-black/8">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-[#1d4738]">
                  Generated {generatedMusic.durationLabel}
                </span>
                <span className="font-mono text-[#5a6159]">
                  {generatedMusic.model}
                </span>
              </div>
              <audio
                controls
                src={generatedMusic.audioDataUrl}
                className="w-full"
              />
              {generatedMusic.lyrics && (
                <p className="text-xs text-[#4a5149] whitespace-pre-line leading-relaxed pt-2 border-t border-black/8">
                  {generatedMusic.lyrics}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
