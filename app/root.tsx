import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { lazy, Suspense } from 'react';
import { cssBundleHref } from '@remix-run/css-bundle';

import { Layout } from '~/components/Layout';
import { themePreferenceCookie } from '~/cookies';
import { getBodyClassNames } from '~/lib/getBodyClassNames';
import { isStegaEnabled } from '~/sanity/isStegaEnabled.server';
import { useQuery } from '~/sanity/loader';
import { loadQuery } from '~/sanity/loader.server';
import { frontendUrl, studioUrl } from '~/sanity/projectDetails';
import { HOME_QUERY } from '~/sanity/queries';
import styles from '~/tailwind.css';
import type { HomeDocument } from '~/types/home';
import { homeZ } from '~/types/home';
import { themePreference } from '~/types/themePreference';
import emblaStyle from '~/styles/embla.css';

const LiveVisualEditing = lazy(() => import('~/components/LiveVisualEditing'));

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'preconnect', href: 'https://cdn.sanity.io' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
      crossOrigin: 'anonymous',
    },
    {
      href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;700&family=Inter:wght@500;700;800&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap',
      rel: 'stylesheet',
    },
    { rel: 'stylesheet', href: emblaStyle },
  ];
};

export type Loader = typeof loader;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const stegaEnabled = isStegaEnabled(request.url);

  // Dark/light mode
  const cookieHeader = request.headers.get('Cookie');
  const cookieValue = (await themePreferenceCookie.parse(cookieHeader)) || {};
  const theme = themePreference.parse(cookieValue.themePreference) || 'light';
  const bodyClassNames = getBodyClassNames(theme);

  // Sanity content reused throughout the site
  const initial = await loadQuery<HomeDocument>(
    HOME_QUERY,
    {},
    {
      perspective: stegaEnabled ? 'previewDrafts' : 'published',
    }
  ).then((res) => ({
    ...res,
    data: res.data ? homeZ.parse(res.data) : undefined,
  }));

  return json({
    initial,
    query: HOME_QUERY,
    params: {},
    theme,
    bodyClassNames,
    sanity: {
      isStudioRoute: new URL(request.url).pathname.startsWith('/studio'),
      stegaEnabled,
    },
    ENV: {
      SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID!,
      SANITY_DATASET: process.env.SANITY_DATASET!,
      SANITY_API_VERSION: process.env.SANITY_API_VERSION!,
      // URL of the Frontend that will be loaded into Presentation
      SANITY_FRONTEND_URL: frontendUrl,
      // URL of the Studio to allow requests from Presentation
      SANITY_URL: studioUrl,
    },
  });
};

export default function App() {
  const { initial, query, params, theme, bodyClassNames, sanity, ENV } =
    useLoaderData<typeof loader>();
  const { data, loading } = useQuery<typeof initial.data>(query, params, {
    // @ts-expect-error
    initial,
  });

  return (
    <html lang="en">
      <head>
        <Meta />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="https://fav.farm/🤘" />
        <Links />
      </head>
      <body className={bodyClassNames}>
        {sanity.isStudioRoute ? (
          <Outlet />
        ) : (
          <>
            <Layout home={loading || !data ? initial.data : data} theme={theme}>
              <Outlet />
            </Layout>
          </>
        )}
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
        {!sanity.isStudioRoute && sanity.stegaEnabled ? (
          <Suspense>
            <LiveVisualEditing studioUrl={ENV.SANITY_URL} />
          </Suspense>
        ) : null}
      </body>
    </html>
  );
}
