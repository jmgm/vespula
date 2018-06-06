import { Dependencies, ServiceLazyFlag, ApplicationServiceId } from './symbols';
import { ServiceId } from './types';
import Service, { ServiceClass } from './service';
import Controller, { ControllerClass } from './controller';
import ApplicationService from './application.service';

export interface ApplicationSettings {
    services: {
        [id: string]: ServiceClass;
    };
}

export default class Application {
    private services = new Map<ServiceId, Service>();
    private serviceConstructors: Map<ServiceId, ServiceClass>;

    constructor({ services }: ApplicationSettings) {
        this.services.set(ApplicationServiceId, new ApplicationService(this));

        const serviceEntries = Object.entries(services);
        this.serviceConstructors = new Map(serviceEntries);

        serviceEntries
            .filter(([_, constructor]) => !constructor[ServiceLazyFlag])
            .forEach(([id]) => this.resolve(id));
    }

    constructController<C extends Controller>(
        controllerClass: ControllerClass<C>
    ): C {
        const dependencies = controllerClass[Dependencies] || [];
        return new controllerClass(...this.resolveDependencies(dependencies));
    }

    disposeController(controller: Controller): void {
        controller.onDestroy();
    }

    private resolveDependencies(deps: ServiceId[]): Service[] {
        return deps.map(id => this.resolve(id));
    }

    private resolve(id: ServiceId, stack: ServiceId[] = []): Service {
        {
            const service = this.services.get(id);
            if (service) {
                return service;
            }
        }

        const constructor = this.serviceConstructors.get(id);
        if (!constructor) {
            throw new Error(
                `Requested service "${id.toString()}" definition not found.`
            );
        }

        const dependencies = constructor[Dependencies] || [];
        const resolved = dependencies.map(depId => {
            const depIndex = stack.indexOf(depId);
            if (depIndex !== -1) {
                const path = [...stack.slice(depIndex), id, depId];
                throw new Error(
                    'Circular dependency detected. ' + path.join(' <- ')
                );
            }

            return this.resolve(depId, stack.concat([id]));
        });

        const instance = new constructor(...resolved);
        this.services.set(id, instance);
        return instance;
    }
}
