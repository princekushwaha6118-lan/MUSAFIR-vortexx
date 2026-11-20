import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type {
  BookingRecord,
  GroundingPlaceSource,
  SpotifyPlaylist,
  SpotifyTrack,
  SpotifyUser,
} from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'wanderly-store.json');

interface WanderlyStore {
  bookings: BookingRecord[];
  subscribers: string[];
  users: Array<{ name: string; email: string }>;
}

interface SpotifySessionData {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  user: SpotifyUser;
}

const spotifyOAuthStates = new Map<
  string,
  { redirectUri: string; createdAt: number }
>();
const spotifySessions = new Map<string, SpotifySessionData>();

function createGeminiClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function parseCookies(cookieHeader?: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) {
      out[key] = decodeURIComponent(val);
    }
  }
  return out;
}

function resolveAppBaseUrl(req: express.Request): string {
  const envUrl = process.env.APP_URL?.trim().replace(/\/$/, '');
  if (envUrl) return envUrl;
  const queryOrigin =
    typeof req.query.origin === 'string' ? req.query.origin.trim() : '';
  if (
    queryOrigin &&
    (queryOrigin.endsWith('.run.app') ||
      queryOrigin.startsWith('http://localhost:'))
  ) {
    return queryOrigin.replace(/\/$/, '');
  }
  const proto =
    (req.headers['x-forwarded-proto'] as string | undefined)?.split(',')[0] ??
    req.protocol ??
    'http';
  const host = req.get('host') ?? 'localhost:3000';
  return `${proto}://${host}`.replace(/\/$/, '');
}

async function refreshSpotifyTokenIfNeeded(
  sid: string,
  session: SpotifySessionData
): Promise<SpotifySessionData | null> {
  if (Date.now() < session.expiresAt - 60_000) {
    return session;
  }
  if (!session.refreshToken) {
    return null;
  }
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: session.refreshToken,
  });

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });
  if (!tokenRes.ok) return null;
  const tokenJson = (await tokenRes.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };
  if (!tokenJson.access_token) return null;

  const updated: SpotifySessionData = {
    ...session,
    accessToken: tokenJson.access_token,
    refreshToken: tokenJson.refresh_token ?? session.refreshToken,
    expiresAt: Date.now() + (tokenJson.expires_in ?? 3600) * 1000,
  };
  spotifySessions.set(sid, updated);
  return updated;
}

function readStore(): WanderlyStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    const initial: WanderlyStore = {
      bookings: [],
      subscribers: [],
      users: [],
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8')) as WanderlyStore;
  } catch {
    return { bookings: [], subscribers: [], users: [] };
  }
}

function writeStore(store: WanderlyStore): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '5mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/bookings', (req, res) => {
    const {
      destinationName,
      packageTitle,
      checkIn,
      checkOut,
      travelers,
      totalPriceInr,
      guestName,
      guestEmail,
    } = req.body as Omit<BookingRecord, 'id' | 'createdAt'>;

    if (!guestName?.trim() || !guestEmail?.trim() || !destinationName) {
      res
        .status(400)
        .json({ error: 'Please complete your name, email, and destination.' });
      return;
    }

    const store = readStore();
    const record: BookingRecord = {
      id: `MSF-${Math.floor(100000 + Math.random() * 900000)}`,
      destinationName,
      packageTitle: packageTitle || `${destinationName} Curated Escape`,
      checkIn,
      checkOut,
      travelers: Number(travelers) || 2,
      totalPriceInr: Number(totalPriceInr) || 5900,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      createdAt: new Date().toISOString(),
    };

    store.bookings.unshift(record);
    writeStore(store);
    res.status(201).json({ booking: record });
  });

  app.post('/api/newsletter', (req, res) => {
    const { email } = req.body as { email?: string };
    const cleanEmail = email?.trim().toLowerCase() ?? '';
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const store = readStore();
    if (!store.subscribers.includes(cleanEmail)) {
      store.subscribers.push(cleanEmail);
      writeStore(store);
    }
    res.status(201).json({ subscribed: true, email: cleanEmail });
  });

  app.post('/api/auth', (req, res) => {
    const { name, email, mode } = req.body as {
      name?: string;
      email?: string;
      mode?: 'login' | 'signup';
    };
    const cleanEmail = email?.trim().toLowerCase() ?? '';
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const store = readStore();
    const existing = store.users.find((u) => u.email === cleanEmail);
    const resolvedName =
      name?.trim() || existing?.name || cleanEmail.split('@')[0] || 'Traveler';

    if (mode === 'signup' || !existing) {
      if (!existing) {
        store.users.push({ name: resolvedName, email: cleanEmail });
        writeStore(store);
      }
    }

    res.json({
      user: {
        name: resolvedName,
        email: cleanEmail,
      },
    });
  });

  /* ---------------- MUSAFIR Guide AI + Google Maps Grounding ---------------- */
  app.post('/api/guide-ai', async (req, res) => {
    const {
      question,
      stateName,
      stateContext,
      history,
      useMapsGrounding = true,
      lat,
      lng,
    } = req.body as {
      question?: string;
      stateName?: string;
      stateContext?: string;
      history?: Array<{ role: 'user' | 'assistant'; text: string }>;
      useMapsGrounding?: boolean;
      lat?: number;
      lng?: number;
    };

    const cleanQuestion = question?.trim() ?? '';
    if (!cleanQuestion) {
      res.status(400).json({
        error: 'Please enter a travel question for MUSAFIR Guide AI.',
      });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      res.status(503).json({
        error:
          'MUSAFIR Guide AI is waiting for a Gemini API key. Please add GEMINI_API_KEY in Settings > Secrets.',
      });
      return;
    }

    try {
      const ai = createGeminiClient(apiKey);

      const systemInstruction = [
        'You are MUSAFIR Guide AI, a warm, knowledgeable Indian and global travel concierge covering all 28 States and 8 Union Territories of India.',
        'Provide clear, practical, accurate travel guidance in plain scannable paragraphs or short bullet points (no markdown tables or code blocks).',
        'Always mention specific real famous places, must-try local favorite foods, best season to visit, and realistic Rupee (₹ INR) budget tips when helpful.',
        'Keep responses concise (around 120-220 words) unless the traveler asks for a multi-day itinerary.',
        stateName
          ? `The traveler is currently exploring ${stateName}. Focus primarily on ${stateName} unless they ask about another place.`
          : '',
        stateContext ? `Verified reference details:\n${stateContext}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      const recentHistory = Array.isArray(history)
        ? history
            .slice(-6)
            .map(
              (m) =>
                `${m.role === 'user' ? 'Traveler' : 'MUSAFIR Guide'}: ${m.text}`
            )
            .join('\n')
        : '';

      const prompt = recentHistory
        ? `Previous conversation:\n${recentHistory}\n\nTraveler question: ${cleanQuestion}`
        : cleanQuestion;

      const hasCoords =
        typeof lat === 'number' &&
        Number.isFinite(lat) &&
        typeof lng === 'number' &&
        Number.isFinite(lng);

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction,
          ...(useMapsGrounding ? { tools: [{ googleMaps: {} }] } : {}),
          ...(useMapsGrounding && hasCoords
            ? {
                toolConfig: {
                  retrievalConfig: {
                    latLng: {
                      latitude: lat,
                      longitude: lng,
                    },
                  },
                },
              }
            : {}),
        },
      });

      const answer = response.text?.trim();
      if (!answer) {
        res.status(502).json({
          error: 'Guide AI returned an empty response. Please try again.',
        });
        return;
      }

      // Extract Google Maps grounding chunks & review snippets
      const rawChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
      const seenUris = new Set<string>();
      const groundingPlaces: GroundingPlaceSource[] = [];

      for (const chunk of rawChunks as Array<{
        maps?: {
          uri?: string;
          title?: string;
          placeAnswerSources?: {
            reviewSnippets?: Array<{
              content?: string;
              googleMapsUri?: string;
            }>;
          };
        };
      }>) {
        const uri = chunk.maps?.uri?.trim();
        const title = chunk.maps?.title?.trim();
        if (!uri || !title || seenUris.has(uri)) continue;
        seenUris.add(uri);

        const snippets =
          chunk.maps?.placeAnswerSources?.reviewSnippets
            ?.map((r) => r.content?.trim())
            .filter((s): s is string => Boolean(s))
            .slice(0, 2) ?? [];

        groundingPlaces.push({
          title,
          uri,
          ...(snippets.length > 0 ? { reviewSnippets: snippets } : {}),
        });
      }

      res.json({ answer, groundingPlaces });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Unable to reach Gemini Guide AI.';
      const status =
        msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED')
          ? 403
          : 500;
      res.status(status).json({
        error:
          status === 403
            ? 'Gemini API key was rejected. Please verify your key in Settings > Secrets.'
            : `Guide AI error: ${msg}`,
      });
    }
  });

  /* ---------------- Lyria Travel Music Generation ---------------- */
  app.post('/api/music/generate', async (req, res) => {
    const {
      prompt,
      mode = 'clip',
      destinationName,
    } = req.body as {
      prompt?: string;
      mode?: 'clip' | 'pro';
      destinationName?: string;
    };

    const cleanPrompt = prompt?.trim() ?? '';
    if (!cleanPrompt) {
      res.status(400).json({
        error: 'Please enter a musical mood or prompt to generate your track.',
      });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      res.status(503).json({
        error:
          'Music generation requires a Gemini API key in Settings > Secrets.',
      });
      return;
    }

    const model =
      mode === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';
    const durationLabel = mode === 'pro' ? 'Full Track' : '30s Clip';

    try {
      const ai = createGeminiClient(apiKey);
      const fullPrompt = destinationName
        ? `Compose a ${
            mode === 'pro' ? 'full-length' : '30-second'
          } travel soundtrack inspired by ${destinationName}: ${cleanPrompt}`
        : cleanPrompt;

      const stream = await ai.models.generateContentStream({
        model,
        contents: fullPrompt,
      });

      const audioChunks: Buffer[] = [];
      let lyrics = '';
      let mimeType = 'audio/mpeg';

      for await (const chunk of stream) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (audioChunks.length === 0 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioChunks.push(Buffer.from(part.inlineData.data, 'base64'));
          }
          if (part.text) {
            lyrics += part.text;
          }
        }
      }

      if (audioChunks.length === 0) {
        res.status(502).json({
          error:
            'Lyria did not return an audio stream for that prompt. Please adjust the description and retry.',
        });
        return;
      }

      const audioBase64 = Buffer.concat(audioChunks).toString('base64');
      res.json({
        audioDataUrl: `data:${mimeType};base64,${audioBase64}`,
        lyrics: lyrics.trim(),
        model,
        durationLabel,
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Unable to generate music track.';
      const isPaidKeyIssue =
        msg.includes('PERMISSION_DENIED') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('billing') ||
        msg.includes('403') ||
        msg.includes('429');
      res.status(isPaidKeyIssue ? 403 : 500).json({
        error: isPaidKeyIssue
          ? 'Lyria music generation requires a billing-enabled (paid) Gemini API key. You can select one in Settings > Secrets.'
          : `Music generation error: ${msg}`,
      });
    }
  });

  /* ---------------- Spotify OAuth & Travel Playlist Discovery ---------------- */
  app.get('/api/spotify/auth/url', (req, res) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
    if (!clientId || !clientSecret) {
      res.status(503).json({
        configured: false,
        error:
          'Spotify connection requires SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in Settings > Secrets.',
      });
      return;
    }

    const baseUrl = resolveAppBaseUrl(req);
    const redirectUri = `${baseUrl}/auth/spotify/callback`;
    const state = crypto.randomBytes(16).toString('hex');
    spotifyOAuthStates.set(state, {
      redirectUri,
      createdAt: Date.now(),
    });

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: 'user-read-private user-read-email playlist-read-private user-top-read',
      state,
      show_dialog: 'true',
    });

    res.json({
      configured: true,
      url: `https://accounts.spotify.com/authorize?${params.toString()}`,
    });
  });

  const spotifyCallbackHandler: express.RequestHandler = async (req, res) => {
    const code = typeof req.query.code === 'string' ? req.query.code : '';
    const state = typeof req.query.state === 'string' ? req.query.state : '';
    const oauthError =
      typeof req.query.error === 'string' ? req.query.error : '';

    if (oauthError) {
      res.status(400).send(`
        <html><body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'SPOTIFY_AUTH_ERROR', error: ${JSON.stringify(oauthError)} }, '*');
              window.close();
            }
          </script>
          <p>Spotify authorization canceled.</p>
        </body></html>
      `);
      return;
    }

    const stateEntry = spotifyOAuthStates.get(state);
    spotifyOAuthStates.delete(state);

    const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();

    if (!code || !stateEntry || !clientId || !clientSecret) {
      res.status(400).send(`
        <html><body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'SPOTIFY_AUTH_ERROR', error: 'Invalid Spotify OAuth state or missing credentials.' }, '*');
              window.close();
            }
          </script>
          <p>Invalid Spotify OAuth callback state.</p>
        </body></html>
      `);
      return;
    }

    try {
      const basic = Buffer.from(`${clientId}:${clientSecret}`).toString(
        'base64'
      );
      const tokenBody = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: stateEntry.redirectUri,
      });

      const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenBody.toString(),
      });

      const tokenJson = (await tokenRes.json()) as {
        access_token?: string;
        refresh_token?: string;
        expires_in?: number;
        error_description?: string;
      };

      if (!tokenRes.ok || !tokenJson.access_token) {
        throw new Error(
          tokenJson.error_description || 'Spotify token exchange failed.'
        );
      }

      const meRes = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${tokenJson.access_token}`,
        },
      });
      const meJson = (await meRes.json()) as {
        id?: string;
        display_name?: string;
        email?: string;
        product?: string;
        images?: Array<{ url?: string }>;
      };

      const sid = crypto.randomBytes(24).toString('hex');
      spotifySessions.set(sid, {
        accessToken: tokenJson.access_token,
        refreshToken: tokenJson.refresh_token,
        expiresAt: Date.now() + (tokenJson.expires_in ?? 3600) * 1000,
        user: {
          id: meJson.id ?? 'spotify-user',
          displayName: meJson.display_name || meJson.id || 'Spotify Listener',
          email: meJson.email,
          avatarUrl: meJson.images?.[0]?.url,
          product: meJson.product,
        },
      });

      res.cookie('msf_sp_sid', sid, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'SPOTIFY_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Spotify connected. This window will close automatically.</p>
          </body>
        </html>
      `);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Spotify authentication failed.';
      res.status(500).send(`
        <html><body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'SPOTIFY_AUTH_ERROR', error: ${JSON.stringify(msg)} }, '*');
              window.close();
            }
          </script>
          <p>${msg}</p>
        </body></html>
      `);
    }
  };

  app.get(
    ['/auth/spotify/callback', '/auth/spotify/callback/'],
    spotifyCallbackHandler
  );

  app.get('/api/spotify/me', async (req, res) => {
    const configured = Boolean(
      process.env.SPOTIFY_CLIENT_ID?.trim() &&
        process.env.SPOTIFY_CLIENT_SECRET?.trim()
    );
    const cookies = parseCookies(req.headers.cookie);
    const sid = cookies.msf_sp_sid;
    if (!sid) {
      res.json({ configured, connected: false, user: null });
      return;
    }

    const session = spotifySessions.get(sid);
    if (!session) {
      res.json({ configured, connected: false, user: null });
      return;
    }

    const valid = await refreshSpotifyTokenIfNeeded(sid, session);
    if (!valid) {
      spotifySessions.delete(sid);
      res.json({ configured, connected: false, user: null });
      return;
    }

    res.json({ configured, connected: true, user: valid.user });
  });

  app.get('/api/spotify/search', async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const sid = cookies.msf_sp_sid;
    const rawSession = sid ? spotifySessions.get(sid) : undefined;
    if (!sid || !rawSession) {
      res.status(401).json({
        error: 'Connect your Spotify account to search real tracks and playlists.',
      });
      return;
    }

    const session = await refreshSpotifyTokenIfNeeded(sid, rawSession);
    if (!session) {
      spotifySessions.delete(sid);
      res.status(401).json({ error: 'Spotify session expired. Please reconnect.' });
      return;
    }

    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!q) {
      res.status(400).json({ error: 'Please provide a search query.' });
      return;
    }

    try {
      const searchUrl = new URL('https://api.spotify.com/v1/search');
      searchUrl.searchParams.set('q', q);
      searchUrl.searchParams.set('type', 'track,playlist');
      searchUrl.searchParams.set('limit', '6');

      const spRes = await fetch(searchUrl.toString(), {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!spRes.ok) {
        const errBody = await spRes.text();
        res.status(spRes.status).json({
          error: `Spotify search failed (${spRes.status}): ${errBody.slice(0, 120)}`,
        });
        return;
      }

      const spJson = (await spRes.json()) as {
        tracks?: {
          items?: Array<{
            id: string;
            name: string;
            duration_ms: number;
            preview_url?: string | null;
            external_urls?: { spotify?: string };
            artists?: Array<{ name: string }>;
            album?: { name?: string; images?: Array<{ url?: string }> };
          }>;
        };
        playlists?: {
          items?: Array<{
            id: string;
            name: string;
            owner?: { display_name?: string };
            images?: Array<{ url?: string }>;
            external_urls?: { spotify?: string };
            tracks?: { total?: number };
          } | null>;
        };
      };

      const tracks: SpotifyTrack[] = (spJson.tracks?.items ?? []).map((t) => ({
        id: t.id,
        name: t.name,
        artists: (t.artists ?? []).map((a) => a.name).join(', '),
        album: t.album?.name ?? 'Single',
        albumArt: t.album?.images?.[0]?.url,
        previewUrl: t.preview_url ?? null,
        externalUrl: t.external_urls?.spotify ?? 'https://open.spotify.com',
        durationMs: t.duration_ms ?? 0,
      }));

      const playlists: SpotifyPlaylist[] = (spJson.playlists?.items ?? [])
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
        .map((p) => ({
          id: p.id,
          name: p.name,
          owner: p.owner?.display_name ?? 'Spotify',
          imageUrl: p.images?.[0]?.url,
          externalUrl: p.external_urls?.spotify ?? 'https://open.spotify.com',
          tracksTotal: p.tracks?.total ?? 0,
        }));

      res.json({ tracks, playlists });
    } catch (err) {
      res.status(500).json({
        error:
          err instanceof Error
            ? err.message
            : 'Failed to search Spotify catalog.',
      });
    }
  });

  app.post('/api/spotify/logout', (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    if (cookies.msf_sp_sid) {
      spotifySessions.delete(cookies.msf_sp_sid);
    }
    res.clearCookie('msf_sp_sid', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.json({ ok: true });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Wanderly server running on http://localhost:${port}`);
  });
}

startServer();
