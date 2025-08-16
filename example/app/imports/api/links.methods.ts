import { defineMethod } from '@meteor-vite/type-api';
import { LinkCollection, LinkDocumentSchema } from './links.collection';

export const createLink = defineMethod({
    schema: LinkDocumentSchema,
    run: (link) => {
        return LinkCollection.insertAsync(link);
    }
});