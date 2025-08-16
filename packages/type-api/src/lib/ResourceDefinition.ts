import { ApiTypeError } from '@/lib/Errors';
import * as v from 'valibot';

export class ResourceDefinition {
    
    constructor(protected readonly config: ResourceDefinitionConfig) {}
    
    public get type() {
        return this.config.type;
    }
    
    public get name() {
        return this.config.name || this.config._defaultName;
    }
    
    public get schema() {
        return this.config.schema;
    }
    
    public get environment() {
        return this.config._environment;
    }
    
    public log(level: LogLevel, ...data: any[]) {
        console[level](`(${this.environment}) [${this.type}: ${this.name}]`, ...data);
    }
    
    public async run(params: any) {
        if (!this.config.run) {
            throw new ApiTypeError('This API resource does not have a run method defined. This method should only be called from the a server environment.')
        }
        const parsed = v.parse(this.schema, params);
        return await this.config.run(parsed);
    }
    
    public callHandle(run: (...params: any) => any) {
        const resource = this;
        
        const handle = function (this: any, ...params: any) {
            resource.log('debug', 'Sending request', { params });
            const result = run.apply(this, params);
            Promise.resolve(result).then(result => {
                resource.log('debug', 'Received response', result);
            })
            return result;
        };
        
        Object.defineProperty(handle, 'name', {
            value: this.name,
        });
        
        Object.assign(handle, this);
        
        return handle;
    }
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface ResourceDefinitionConfig {
    name?: string;
    type: ResourceType;
    schema: v.GenericSchema;
    run?: (...params: any) => any;
    _environment: ResourceEnvironment;
    _defaultName: string;
}

export type ResourceType = 'method' | 'publication';
export type ResourceEnvironment = 'client' | 'server';