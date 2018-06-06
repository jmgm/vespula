import * as React from 'react';
import * as PropTypes from 'prop-types';

import { Dependencies } from './lib/symbols';
import Application from './lib/application';
import Controller, { ControllerClass } from './lib/controller';

const ApplicationContextKey = '__vespulaApp';

export type ComponentClass<P = {}> = React.ComponentClass<P> | React.SFC<P>;
export type PropsWithController<C extends Controller, P = {}> = P & {
    controller: C;
};

interface ApplicationContext {
    [ApplicationContextKey]: Application;
}

export interface ComponentDecorator<PIn, POut> {
    (component: ComponentClass<PIn>): ComponentClass<POut>;
}

export class Provider extends React.Component<{ application: Application }> {
    private static childContextTypes = {
        [ApplicationContextKey]: PropTypes.instanceOf(Application)
    };

    private getChildContext() {
        return {
            [ApplicationContextKey]: this.props.application
        };
    }

    render() {
        return this.props.children;
    }
}

export function connect<C extends Controller, P = {}>(
    controllerClass: ControllerClass<C>
): ComponentDecorator<PropsWithController<C, P>, P> {
    return (component: ComponentClass<PropsWithController<C, P>>) =>
        class Connector extends React.Component<P> {
            static displayName = `Connect(${component.displayName ||
                component.name ||
                ''})`;

            static contextTypes = {
                [ApplicationContextKey]: PropTypes.instanceOf(Application)
            };

            private controller: C;
            private app: Application;

            constructor(props: P, ctx: ApplicationContext) {
                super(props);
                this.app = ctx[ApplicationContextKey];
                this.controller = this.app.constructController(controllerClass);
            }

            componentWillUnmount() {
                this.app.disposeController(this.controller);
            }

            render() {
                return React.createElement(component, {
                    ...(this.props as any),
                    controller: this.controller
                });
            }
        };
}
