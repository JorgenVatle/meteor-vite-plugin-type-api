import { Mongo } from 'meteor/mongo';
import * as v from 'valibot';

export const LinkDocumentSchema = v.object({
    href: v.string(),
    text: v.string(),
});

export type LinkDocument = v.InferOutput<typeof LinkDocumentSchema>;

export const LinkCollection = new Mongo.Collection<LinkDocument>('links');