/**
 * Created by Phan Trung Nguyên.
 * User: nguyenpl117
 * Date: 3/6/2020
 * Time: 6:37 AM
 */
import { Macroable } from 'macroable/build';
import { MiddlewareNode, RouteDefinition } from './Contracts/Route';

export enum MethodType {
    query = 'query',
    mutation = 'mutation',
    subscription = 'subscription'
}

export class Route extends Macroable {
    protected static macros = {}
    protected static getters = {}

    /**
     * An array of middleware. Added using `middleware` function
     */
    protected routeMiddleware: any[] = [];

    /**
     * Storing the namespace explicitly set using `route.namespace` method
     */
    private routeNamespace: string;

    /**
     * A boolean to prevent route from getting registered within
     * the [[Store]].
     *
     * This flag must be set before [[Router.commit]] method
     */
    public deleted: boolean = false

    /**
     * A unique name to lookup the route
     */
    public name: string

    constructor(public handleName: string, protected method: string, protected handler: string) {
        super();
    }

    /**
     * Define an array of middleware to be executed on the route. If `prepend`
     * is true, then middleware will be added to start of the existing
     * middleware. The option is exposed for [[RouteGroup]]
     */
    public middleware (middleware: MiddlewareNode | MiddlewareNode[], prepend = false): this {
        middleware = Array.isArray(middleware) ? middleware : [middleware]
        this.routeMiddleware = prepend ? middleware.concat(this.routeMiddleware) : this.routeMiddleware.concat(middleware)
        return this
    }

    /**
     * Define controller namespace for a given route
     */
    public namespace (namespace: string, overwrite: boolean = false): this {
        if (!this.routeNamespace || overwrite) {
            this.routeNamespace = namespace
        }
        return this
    }

    /**
     * Returns [[RouteDefinition]] that can be passed to the [[Store]] for
     * registering the route
     */
    public toJSON (): RouteDefinition {
        return {
            method: this.method,
            handleName: this.handleName,
            handler: this.handler,
            middleware: this.routeMiddleware,
            meta: {
                namespace: this.routeNamespace,
            }
        }
    }
}