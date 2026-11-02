/// <reference lib="webworker" />
import {
  CacheFirst,
  ExpirationPlugin,
  NetworkFirst,
  RangeRequestsPlugin,
  Serwist,
  StaleWhileRevalidate,
  type PrecacheEntry,
  type RuntimeCaching,
  type SerwistGlobalConfig,
} from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const DAY = 24 * 60 * 60;

const isSameOrigin = (url: URL) => self.location.origin === url.origin;

// The runtime caching rules below are the defaults the previous `next-pwa` plugin generated
// (same cache names, strategies, limits and order), so offline behavior is unchanged.
const runtimeCaching: RuntimeCaching[] = [
  {
    matcher: ({ url }) =>
      isSameOrigin(url) && url.pathname === '/' && url.search === '',
    handler: new NetworkFirst({
      cacheName: 'start-url',
      plugins: [
        {
          cacheWillUpdate: async ({ response }) =>
            response && response.type === 'opaqueredirect'
              ? new Response(response.body, {
                  status: 200,
                  statusText: 'OK',
                  headers: response.headers,
                })
              : response,
        },
      ],
    }),
  },
  {
    matcher: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
    handler: new CacheFirst({
      cacheName: 'google-fonts-webfonts',
      plugins: [new ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 365 * DAY })],
    }),
  },
  {
    matcher: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
    handler: new StaleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
      plugins: [new ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 7 * DAY })],
    }),
  },
  {
    matcher: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
    handler: new StaleWhileRevalidate({
      cacheName: 'static-font-assets',
      plugins: [new ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 7 * DAY })],
    }),
  },
  {
    matcher: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    handler: new StaleWhileRevalidate({
      cacheName: 'static-image-assets',
      plugins: [new ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: DAY })],
    }),
  },
  {
    matcher: /\/_next\/image\?url=.+$/i,
    handler: new StaleWhileRevalidate({
      cacheName: 'next-image',
      plugins: [new ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: DAY })],
    }),
  },
  {
    matcher: /\.(?:mp3|wav|ogg)$/i,
    handler: new CacheFirst({
      cacheName: 'static-audio-assets',
      plugins: [
        new RangeRequestsPlugin(),
        new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: DAY }),
      ],
    }),
  },
  {
    matcher: /\.(?:mp4)$/i,
    handler: new CacheFirst({
      cacheName: 'static-video-assets',
      plugins: [
        new RangeRequestsPlugin(),
        new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: DAY }),
      ],
    }),
  },
  {
    matcher: /\.(?:js)$/i,
    handler: new StaleWhileRevalidate({
      cacheName: 'static-js-assets',
      plugins: [new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: DAY })],
    }),
  },
  {
    matcher: /\.(?:css|less)$/i,
    handler: new StaleWhileRevalidate({
      cacheName: 'static-style-assets',
      plugins: [new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: DAY })],
    }),
  },
  {
    matcher: /\/_next\/data\/.+\/.+\.json$/i,
    handler: new StaleWhileRevalidate({
      cacheName: 'next-data',
      plugins: [new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: DAY })],
    }),
  },
  {
    matcher: /\.(?:json|xml|csv)$/i,
    handler: new NetworkFirst({
      cacheName: 'static-data-assets',
      plugins: [new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: DAY })],
    }),
  },
  {
    matcher: ({ url }) =>
      isSameOrigin(url) &&
      !url.pathname.startsWith('/api/auth/') &&
      url.pathname.startsWith('/api/'),
    handler: new NetworkFirst({
      cacheName: 'apis',
      networkTimeoutSeconds: 10,
      plugins: [new ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: DAY })],
    }),
  },
  {
    matcher: ({ url }) => isSameOrigin(url) && !url.pathname.startsWith('/api/'),
    handler: new NetworkFirst({
      cacheName: 'others',
      networkTimeoutSeconds: 10,
      plugins: [new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: DAY })],
    }),
  },
  {
    matcher: ({ url }) => !isSameOrigin(url),
    handler: new NetworkFirst({
      cacheName: 'cross-origin',
      networkTimeoutSeconds: 10,
      plugins: [new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 60 * 60 })],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true,
    ignoreURLParametersMatching: [],
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching,
});

serwist.addEventListeners();
