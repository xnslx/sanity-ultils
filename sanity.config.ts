import { presentationTool } from '@sanity/presentation';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { locate } from '~/sanity/presentation/locate';
import { frontendUrl, projectDetails } from '~/sanity/projectDetails';
import schema from '~/sanity/schema';
import { defaultDocumentNode, structure } from '~/sanity/structure';

export const config = defineConfig({
  ...projectDetails(),
  name: 'sanity-remix',
  title: 'Coderdojo',
  plugins: [
    structureTool({ structure, defaultDocumentNode }),
    presentationTool({
      previewUrl: frontendUrl,
      locate,
    }),
    visionTool(),
  ],
  basePath: `/studio`,
  schema: {
    types: schema,
  },
});
