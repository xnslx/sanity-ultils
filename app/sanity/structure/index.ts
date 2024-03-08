import { Disc, Home, Hourglass, Tags, Users } from 'lucide-react';
import type {
  DefaultDocumentNodeResolver,
  StructureResolver,
} from 'sanity/structure';

import OGPreview from '~/sanity/components/OGPreview';
import { resolveOGUrl } from '~/sanity/structure/resolveOGUrl';

import { client } from '~/sanity/client';
import tags from '~/sanity/structure/tagStructure';
import author from '~/sanity/structure/authorStructure';

const hiddenDocTypes = (listItem: { getId: () => string }) =>
  !['home'].includes(listItem.getId());

export const structure: StructureResolver = (S, context) =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      // Singleton, home page curation
      S.documentListItem()
        .schemaType('home')
        .icon(Home)
        .id('home')
        .title('Home'),
      S.divider(),
      // Document lists
      tags(S, context),
      author(S, context),
      S.divider(),
      //@ts-ignore
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ]);

export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType, documentId }
) => {
  const OGPreviewView = S.view
    .component(OGPreview)
    .options({
      url: resolveOGUrl(documentId),
    })
    .title('OG Preview');

  switch (schemaType) {
    case `home`:
      return S.document().views([S.view.form()]);
    case `record`:
      return S.document().views([S.view.form(), OGPreviewView]);
    default:
      return S.document().views([S.view.form()]);
  }
};
