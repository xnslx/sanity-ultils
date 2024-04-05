import { Video } from 'lucide-react';
import { defineField, defineType } from 'sanity';

const TITLE = 'Home';

export const videoType = defineType({
  name: 'video',
  title: 'Video',
  type: 'object',
  icon: Video,
  fields: [
    defineField({
      name: 'id',
      title: 'Background Video',
      type: 'string',
      description:
        'Alternatively, enter a vimeo ID to show a looping video instead',
    }),
    defineField({
      title: 'Background Video Title',
      name: 'title',
      type: 'string',
      description: 'Short title/description of the video',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'video',
      };
    },
  },
});
