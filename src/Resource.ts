/**
 * Created by Phan Trung Nguyên.
 * User: nguyenpl117
 * Date: 3/6/2020
 * Time: 7:27 AM
 */
import { Macroable } from 'macroable/build';
import { Route } from './Route';
import { snakeCase } from 'snake-case';
import camelCase from 'camelcase';
import { singular, plural } from 'pluralize'
import { MiddlewareNode } from './Contracts/Route';

export class RouteResource extends Macroable {
    protected static macros = {}
    protected static getters = {}

    /**
     * A copy of routes that belongs to this resource
     */
    public routes: Route[] = []

    /**
     * Resource name
     */
    private resourceName: string = this.resource
                                       .split('.')
                                       .map((token) => snakeCase(token)).join('.')

    constructor(
        private resource: string,
        private controller: string,
        private shallow = false,
    ) {
        super()
        this.buildRoutes();
    }

    /**
     * Add a new route for the given pattern, methods and controller action
     */
    private makeRoute(pattern: string, methods: string, action: string) {
        const route = new Route(
            pattern,
            methods,
            `${ this.controller }.${ action }`
        )
        route.name = action;

        this.routes.push(route)
    }

    /**
     * Build routes for the given resource
     */
    private buildRoutes() {
        this.resource = this.resource.replace(/^\//, '').replace(/\/$/, '')

        const resourceTokens = this.resource.split('.')
        const mainResource = resourceTokens.pop()!

        /* const fullUrl = `${resourceTokens
             .map((token) => `${token}/:${snakeCase(token)}_id`)
             .join('/')}${mainResource}`*/
        const name = camelCase(this.resource);

        const n1 = singular(name);
        const n2 = plural(name);

        this.makeRoute(n1, 'query', 'index')
        this.makeRoute(n2, 'query', 'list')
        this.makeRoute(`${ name }Create`, 'mutation', 'create')
        this.makeRoute(`${ name }Update`, 'mutation', 'update')
        this.makeRoute(`${ name }Delete`, 'mutation', 'delete')
    }

    /**
     * Filter the routes based on their partial names
     */
    private filter(names: string[], inverse: boolean) {
        return this.routes.filter((route) => {
            const match = names.find((name) => route.name.endsWith(name))
            return inverse ? ! match : match
        })
    }

    /**
     * Register only given routes and remove others
     */
    public only(names: string[]): this {
        this.filter(names, true).forEach((route) => (route.deleted = true))
        return this
    }

    /**
     * Register all routes, except the one's defined
     */
    public except(names: string[]): this {
        this.filter(names, false).forEach((route) => (route.deleted = true))
        return this
    }

    /**
     * Add middleware to routes inside the resource
     */
    public middleware(middleware: MiddlewareNode | MiddlewareNode[] | {[key: string]: MiddlewareNode | MiddlewareNode[]}): this {
        if ( typeof middleware === 'string' ) {
            this.routes.forEach((one) => one.middleware([middleware]));
            return this;
        }
        if ( Array.isArray(middleware) ) {
            this.routes.forEach((one) => one.middleware(middleware));
            return this;
        }
        for( let name in middleware ) {
            if ( name === '*' ) {
                this.routes.forEach((one) => one.middleware(middleware[name]))
            } else {
                const route = this.routes.find((one) => {
                    return one.name.endsWith(name);
                })
                /* istanbul ignore else */
                if ( route ) {
                    route.middleware(middleware[name])
                }
            }
        }

        return this
    }

    /**
     * Define namespace for all the routes inside a given resource
     */
    public namespace (namespace: string): this {
        this.routes.forEach((route) => {
            route.namespace(namespace)
        })

        return this
    }
}