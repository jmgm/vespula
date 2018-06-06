import { ApplicationServiceId } from './symbols';
import Service from './service';
import Application from './application';

export default class ApplicationService extends Service {
    static ServiceId = ApplicationServiceId;

    constructor(private application: Application) {
        super();
    }

    getApplication(): Application {
        return this.application;
    }
}
