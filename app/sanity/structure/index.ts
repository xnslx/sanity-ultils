import { Disc, Home, Hourglass, Tags, Users } from 'lucide-react';
import type {
  DefaultDocumentNodeResolver,
  StructureResolver,
} from 'sanity/structure';

import OGPreview from '~/sanity/components/OGPreview';
import { resolveOGUrl } from '~/sanity/structure/resolveOGUrl';

import { client } from '~/sanity/client';

const tagsStructure: StructureResolver = (S) =>
  S.listItem()
    .title('Group by Tags')
    .icon(Hourglass)
    .child(async () => {
      const data = await client.fetch(`*[_type == 'tags']`);
      const tagsList = await data.map((d: any) => d.tags).flat();
      const newTagsList = [...new Set(tagsList)].map((d) => d);
      return S.list()
        .title('By Tags')
        .items(
          newTagsList.map((n) =>
            S.listItem()
              .title(`${n}`)
              .icon(Tags)
              .child(async (singleTag) => {
                return S.documentList()
                  .title('Posts')
                  .filter(
                    '_type == "post" && count((tags[]->tags)[@ in ["Javascript"]]) > 0'
                  );
              })
          )
        );
    });

export const structure: StructureResolver = (S) =>
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
      S.documentTypeListItem('post').title('Posts').icon(Disc),
      S.documentTypeListItem('tags').title('Tags').icon(Disc),
      S.divider(),
      S.listItem()
        .title('Group by Tags')
        .icon(Hourglass)
        .child(async () => {
          const data = await client.fetch(`*[_type == 'tags']`);
          const tagsList = await data.map((d: any) => d.tags).flat();
          const newTagsList = [...new Set(tagsList)].map((d) => d);
          return S.list()
            .title('By Tags')
            .items(
              newTagsList.map((n) =>
                S.listItem()
                  .title(`${n}`)
                  .icon(Tags)
                  .child(async (singleTag) => {
                    return S.documentList()
                      .title('Posts')
                      .filter(
                        '_type == "post" && count((tags[]->tags)[@ in [$tag]]) > 0'
                      )
                      .params({
                        tag: n,
                      });
                  })
              )
            );
        }),
      S.listItem()
        .title('Group by Authors')
        .icon(Tags)
        .child(
          S.documentTypeList('author')
            .title('Author')
            .child((authorId) => {
              console.log('authorId', authorId);
              return S.documentList()
                .title('Posts')
                .filter('_type == "post" && $authorId == author._ref')
                .params({ authorId });
            })
        ),
      S.divider(),
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
