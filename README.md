# @meteor-vite/api-types
A Vite plugin for generating type-safe Meteor methods and publications.

> Follows the same pattern as [`zodern:relay`](https://github.com/zodern/meteor-relay) with some minor differences: 
> - [Valibot](https://valibot.dev/) is used for schema validation as opposed to [`zod`](https://zod.dev/)
> - Relay modules are parsed with Rollup's built-in AST parser.
> - Method and publication directories are configurable through Vite allowing for methods to be defined by either a custom file extension, directory name or both.
> 
> `zodern:relay` is supported by Vite through [`@meteor-vite/plugin-zodern-relay`](https://github.com/JorgenVatle/meteor-vite/tree/release/npm-packages/%40meteor-vite/plugin-zodern-relay).


## Installation

Add the package to your project:
```bash
npm install @meteor-vite/api-types
```

## Configuration
In your `vite.config.ts` file:
```typescript
import meteorApiTypes from '@meteor-vite/api-types/plugin';

export default defineConfig({
    plugins: [
        meteorApiTypes({
            // ...
        }),
    ]
})
```

<details>
<summary>View all configuration options</summary>

```typescript
meteorApiTypes({
    /**
     * Treats the provided directory names as Meteor methods/publications.
     * Publications and methods can share the same directory or file extension 
     * if you want to manage both in the same file.
     * @optional
     */
    dirname: {
        /**
         * Parent directory for Meteor methods.
         *
         * All files within directories matching this name will be treated as
         * Meteor methods regardless of their file extension.
         *
         * @default methods
         */
        methods: string;
        
        /**
         * Parent directory for Meteor publications.
         *
         * All files within directories matching this name will be treated as
         * Meteor publications regardless of their file extension.
         *
         * @default publications
         */
        publications: string;
    },
    
    /**
     * Treats the provided file extensions as Meteor methods/publications.
     * @optional
     */
    fileExtension: {
        /**
         * File extension for Meteor methods.
         *
         * This can be used as an alternative to nesting methods under a
         * methods directory.
         *
         * @default .methods.ts
         */
        methods: string;
        
        /**
         * File extension for Meteor publications.
         *
         * This can be used as an alternative to nesting publications under a
         * publications directory.
         *
         * @default .publications.ts
         */
        publications: string;
    },
})
```

</details>

## Methods

### Defining methods
Define your Meteor methods in a file with a `.methods.ts` extension or nest them under a `methods/` parent directory.

Example filename: `/imports/api/links.methods.ts`
```typescript
import { defineMethod } from '@meteor-vite/api-types';

export const createLink = defineMethod({
    schema: v.object({
        href: v.string(),
        description: v.optional(v.string()),
    }),
    run({ description, href }) {
        return Links.insert({ description, href });
    }
});
```

### Calling methods
Methods can be imported directly from anywhere in your app. This works both on the server and client.

```typescript
import { createLink } from '/imports/api/links.methods';

createLink({
    href: 'https://example.com',
    description: 'Example link'
}).then((id) => {
    console.log(`Created link: ${id}`);
})
```

## Publications

### Defining publications
Define your Meteor publications in a file with a `.publications.ts` extension or nest them under a `publications/` parent directory.

Example filename: `/imports/api/links.publications.ts`
```typescript
import { definePublication } from '@meteor-vite/api-types';

export const getLinks = definePublication({
    schema: v.object({
        createdAt: v.object({
            $gt: v.optional(v.date()),
            $lt: v.optional(v.date()),
        })
    }),
    run(query) {
        return Links.find(query);
    }
});
```

### Subscribing to publications
Publications can be imported directly from anywhere in your app. This works both on the server and client.

```typescript
import { getLinks } from '/imports/api/links.publications';

const subscription = getLinks({
    createdAt: {
        $lt: new Date(2025, 0, 1),
    }
});

Tracker.autorun(() => {
    console.log({
        ready: subscription.ready(),
    });
})
```

## License
MIT