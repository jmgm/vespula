import { InjectableClass } from './types';

export default abstract class Controller {
    onDestroy(): void {}
}

export interface ControllerClass<C extends Controller = Controller>
    extends InjectableClass {
    new (...args: any[]): C;
}
