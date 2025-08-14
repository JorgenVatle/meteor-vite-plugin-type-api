import { defineMethod } from '@meteor-vite/plugin-meteor-api-types';
import { LinkCollection, LinkDocumentSchema } from './links.collection';

export const createLink = defineMethod('links.create', {
    schema: LinkDocumentSchema,
    method: (link) => {
        return LinkCollection.insertAsync(link);
    }
});