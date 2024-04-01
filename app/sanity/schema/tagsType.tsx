import { Tags } from 'lucide-react';
import { defineField, defineType } from 'sanity';

import TagThemePreview from '../components/TagTheme';

export const tagsType = defineType({
  name: 'tags',
  title: 'Tags',
  type: 'document',
  icon: Tags,
  fields: [
    defineField({
      title: 'Tags',
      name: 'tags',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      tags: 'tags',
    },
    prepare(selection) {
      const { tags } = selection;

      return {
        title: tags || 'tag',
        media: <TagThemePreview text={tags} />,
      };
    },
  },
});
