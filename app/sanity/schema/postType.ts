import { BookIcon } from '@sanity/icons';
import { format, parseISO } from 'date-fns';
import { defineField, defineType, defineArrayMember } from 'sanity';

import { authorType } from './authorType';
import { tagsType } from './tagsType';
import TagThemePreview from '../components/TagTheme';


export const postType = defineType({
  name: 'post',
  title: 'Post',
  icon: BookIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      //@ts-ignore
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Image caption',
              description: 'Caption displayed below the image.',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessiblity.',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
    }),
    defineField({
      title: 'Tags',
      name: 'tags',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tags' } }],
      // type: 'reference',
      // to: [{ type: 'tags' }],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: authorType.name }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      date: 'date',
      media: 'coverImage',
      tags: 'tags.tags',
    },
    prepare(selection) {
      const { title, media, author, date, tags } = selection;

      // const group = [tags.map((t: any) => t)].filter(Boolean);
      const subtitles = [
        author && `by ${author}`,
        date && `on ${format(parseISO(date), 'LLL d, yyyy')}`,
        tags && `${tags}`,
      ].filter(Boolean);

      return {
        title,
        subtitle: subtitles.join(' '),
      };
    },
  },
});
