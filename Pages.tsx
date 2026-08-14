import { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
        name: 'layout',
        type:'blocks',
        required: true,
        blocks: [
            {
                slug: 'hero',
                fields: [
                    {
                    name: 'heading',
                    type:'text',
                    required: true,
                    },
                     {
                    name: 'subheading',
                    type:'richText',
                    required: true,
                    },

                ],
            },
        ],
    },
  ],
}