const withPWA = require('next-pwa')({
  dest: 'public'
});

// Next.js 16 removed `publicRuntimeConfig` / `next/config`. The same values are now
// serialized into one `env` entry, which Next inlines at build time for server and client.
const publicRuntimeConfig = {
  CONTENTSTACK_API_KEY: process.env.CONTENTSTACK_API_KEY,
  CONTENTSTACK_DELIVERY_TOKEN: process.env.CONTENTSTACK_DELIVERY_TOKEN,
  CONTENTSTACK_ENVIRONMENT: process.env.CONTENTSTACK_ENVIRONMENT,
  CONTENTSTACK_MANAGEMENT_TOKEN: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
  CONTENTSTACK_API_HOST:
    process.env.CONTENTSTACK_API_HOST || 'api.contentstack.io',
  CONTENTSTACK_APP_HOST:
    process.env.CONTENTSTACK_APP_HOST || 'app.contentstack.com',
  NEXT_PUBLIC_CONTENTSTACK_API_KEY: process.env.CONTENTSTACK_API_KEY,
  CONTENTSTACK_LIVE_PREVIEW:
    process.env.NEXT_PUBLIC_CONTENTSTACK_LIVE_PREVIEW || 'true',
  CONTENTSTACK_LIVE_EDIT_TAGS:
    process.env.CONTENTSTACK_LIVE_EDIT_TAGS || 'false',
};

const config = {
  env: {
    CONTENTSTACK_PUBLIC_RUNTIME_CONFIG: JSON.stringify(publicRuntimeConfig),
  },
};
module.exports =
  process.env.NODE_ENV === 'development' ? config : withPWA(config);
