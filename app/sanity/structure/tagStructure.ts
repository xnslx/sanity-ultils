import { Disc, Home, Hourglass, Tags, Users } from 'lucide-react';
import type {
  DefaultDocumentNodeResolver,
  ListItemBuilder,
  StructureResolver,
} from 'sanity/structure';

import OGPreview from '~/sanity/components/OGPreview';
import { resolveOGUrl } from '~/sanity/structure/resolveOGUrl';

import { client } from '~/sanity/client';
import defineStructure from '../utils/defineStructure';

export default defineStructure<ListItemBuilder>((S) =>
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
              .child(async () => {
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
    })
);
