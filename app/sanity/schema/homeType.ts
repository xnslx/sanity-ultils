import { Home } from 'lucide-react';
import { defineField, defineType } from 'sanity';

const TITLE = 'Home';

export const homeType = defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: Home,
  fields: [
    defineField({
      name: 'posts',
      title: 'Posts',
      type: 'array',
      of: [{ type: 'singlePost' }],
    }),
    defineField({
      title: 'Show Carousels?',
      name: 'isShowCarousels',
      type: 'boolean',
      description:
        'If show carousels, the posts will not be seen on the frontend',
      initialValue: false,
    }),
    defineField({
      title: 'Carousel List',
      name: 'carouselsList',
      type: 'carousels',
      hidden: ({ parent }) => {
        console.log('parent', parent);
        return !parent?.isShowCarousels;
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        subtitle: 'Index',
        title: TITLE,
      };
    },
  },
});
