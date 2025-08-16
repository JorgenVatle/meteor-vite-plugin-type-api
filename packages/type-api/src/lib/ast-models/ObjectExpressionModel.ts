import type ESTree from 'estree';
import { builders, type NodePath } from 'estree-toolkit';

export class ObjectExpressionModel {
    constructor(
        protected readonly path: NodePath<ESTree.ObjectExpression>
    ) {}
    
    public get properties(): NodePath<ESTree.Property>[] {
        // @ts-expect-error Could be an array spread?
        return this.path.get('properties');
    }
    
    public addProperty(prop: {
        key: string,
        value: string | number,
    }) {
        this.path.node?.properties.push(
            builders.property(
                'init',
                builders.identifier(prop.key),
                builders.literal(prop.value),
            )
        )
    }
    
    public getProperty(searchKey: string) {
        for (const prop of this.properties) {
            if (!prop.node) {
                continue;
            }
            if (searchKey === ObjectExpressionModel.getKey(prop.node)) {
                return prop;
            }
        }
    }
    
    public static getKey({ key }: ESTree.Property) {
        if (key.type === 'Identifier') {
            return key.name;
        }
        if (key.type === 'Literal') {
            return key.value;
        }
    }
    
}