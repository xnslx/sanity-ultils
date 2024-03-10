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
