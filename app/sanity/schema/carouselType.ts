import { Home } from 'lucide-react';
import { defineField, defineType } from 'sanity';

const TITLE = 'Home';

export const carouselType = defineType({
  name: 'carousel',
  title: 'Carousel',
  type: 'object',
  icon: Home,
  fields: [
    defineField({
      name: 'menu',
      title: 'Menu',
      type: 'string',
    }),
    defineField({
      name: 'carouselItems',
      title: 'Carousel Items',
      type: 'array',
      of: [{ type: 'image' }, { type: 'video' }],
    }),
  ],
  preview: {
    select: {
      carousels: 'carouselItems',
      menu: 'menu',
    },
    prepare({ carousels, menu }) {
      console.log(menu);
      return {
        title: `${carousels.length} assets in this carousel container`,
        subtitle: `${menu}`,
      };
    },
  },
});
