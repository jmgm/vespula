import { ServiceLazyFlag } from './symbols';
import { InjectableClass } from './types';

export default abstract class Service {}

export interface ServiceClass<S extends Service = Service>
    extends InjectableClass {
    new (...args: any[]): S;
    [ServiceLazyFlag]?: boolean;
}
