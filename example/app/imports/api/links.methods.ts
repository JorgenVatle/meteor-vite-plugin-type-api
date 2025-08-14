import { defineMethod } from '@meteor-vite/type-api';
import { LinkCollection, LinkDocumentSchema } from './links.collection';

export const createLink = defineMethod({
    name: 'links.create',
    schema: LinkDocumentSchema,
    method: (link) => {
        return LinkCollection.insertAsync(link);
    }
});