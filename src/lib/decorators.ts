import { Dependencies, ServiceLazyFlag } from './symbols';
import { ServiceId, InjectableClass } from './types';
import { ServiceClass } from './service';

export function inject(id: ServiceId) {
    return function(target: InjectableClass, key: string, index: number): void {
        const dependencyList =
            target[Dependencies] || (target[Dependencies] = []);
        dependencyList[index] = id;
    };
}

export function lazy(target: ServiceClass) {
    target[ServiceLazyFlag] = true;
}
