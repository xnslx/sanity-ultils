import { Home } from 'lucide-react';
import { defineField, defineType } from 'sanity';

const TITLE = 'Home';

export const carouselsType = defineType({
  name: 'carousels',
  title: 'Carousel List',
  type: 'object',
  icon: Home,
  fields: [
    defineField({
      title: 'Carousels',
      name: 'carousels',
      type: 'array',
      of: [{ type: 'carousel' }],
    }),
  ],
  preview: {
    select: {
      items: 'carousels',
    },
    prepare({ items }) {
      return {
        title: 'Carousel List',
      };
    },
  },
});
