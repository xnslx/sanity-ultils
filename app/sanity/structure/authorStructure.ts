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
    .title('Group by Authors')
    .icon(Tags)
    .child(
      S.documentTypeList('author')
        .title('Author')
        .child((authorId) => {
          return S.documentList()
            .title('Posts')
            .filter('_type == "post" && $authorId == author._ref')
            .params({ authorId });
        })
    )
);
