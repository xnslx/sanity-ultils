import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { Records } from '~/components/Records';
import Carousels from '~/components/carousels/Carousels';
import type { Loader as RootLoader } from '~/root';
import { isStegaEnabled } from '~/sanity/isStegaEnabled.server';
import { useQuery } from '~/sanity/loader';
import { loadQuery } from '~/sanity/loader.server';
import { RECORDS_QUERY } from '~/sanity/queries';
import { CAROUSELS_QUERY } from '~/sanity/queries';
import type { RecordStub } from '~/types/record';
import { recordStubsZ } from '~/types/record';

export const meta: MetaFunction<
  typeof loader,
  {
    root: RootLoader;
  }
> = ({ matches }) => {
  const rootData = matches.find((match) => match.id === `root`)?.data;
  const home = rootData ? rootData.initial.data : null;
  const title = [home?.title, home?.siteTitle].filter(Boolean).join(' | ');

  return [{ title }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const stegaEnabled = isStegaEnabled(request.url);
  const initial = await loadQuery<RecordStub[]>(
    RECORDS_QUERY,
    {},
    {
      perspective: stegaEnabled ? 'previewDrafts' : 'published',
    }
  ).then((res) => ({
    ...res,
    data: res.data ? recordStubsZ.parse(res.data) : null,
  }));

  if (!initial.data) {
    throw new Response('Not found', { status: 404 });
  }

  const carousels = await loadQuery(CAROUSELS_QUERY);
  const { data: carouselData } = carousels;
  if (!carouselData) {
    throw new Response('Not found', { status: 404 });
  }

  return json({
    initial,
    query: RECORDS_QUERY,
    params: {},
    carouselData,
  });
};

export default function Index() {
  const { initial, query, params, carouselData } =
    useLoaderData<typeof loader>();
  console.log('c', carouselData);
  const { data, loading } = useQuery<typeof initial.data>(query, params, {
    //@ts-ignore
    initial,
  });

  if (loading || !data) {
    return <div>Loading...</div>;
  }

  //@ts-ignore
  const { isShowCarousels, carouselsList } = carouselData;

  const { carousels, _key, _type } = carouselsList;
  return (
    <div className="relative">
      {isShowCarousels && (
        <>
          <div className="flex flex-row justify-around absolute">
            {carousels.map((c: any) => (
              <h1>{c.menu}</h1>
            ))}
          </div>
          <Carousels data={carouselsList} />
        </>
      )}
    </div>
  );
}
