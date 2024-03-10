import { UserIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const singlePostType = defineType({
  name: 'singlePost',
  title: 'Single Post',
  icon: UserIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{ type: 'post' }],
    }),
  ],
  preview: {
    select: {
      title: 'post.title',
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title,
      };
    },
  },
});
