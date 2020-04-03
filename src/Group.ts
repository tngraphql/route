/**
 * Created by Phan Trung Nguyên.
 * User: nguyenpl117
 * Date: 3/6/2020
 * Time: 6:48 AM
 */
import { Macroable } from 'macroable'
import { Route } from './Route';
import { MiddlewareNode } from './Contracts/Route';
import { RouteResource } from './Resource';

export class RouteGroup extends Macroable {
    protected static macros = {}
    protected static getters = {}

    constructor(public routes: (RouteGroup | Route | RouteResource)[]) {
        super();
    }

    /**
     * Invokes a given method with params on the route instance or route
     * resource instance
     */
    private invoke (
        route: Route | RouteGroup | RouteResource,
        method: string,
        params: any[],
    ) {

        if (route instanceof RouteGroup) {
            route[method](...params)
            return
        }

        if (route instanceof RouteResource) {
            route.routes.forEach((child) => this.invoke(child, method, params))
            return
        }

        route[method](...params)
    }

    /**
     * Prepend an array of middleware to all routes middleware.
     *
     * @example
     * ```ts
     * Route.group(() => { }).middleware(['auth'])
     * ```
     */
    public middleware (middleware: MiddlewareNode | MiddlewareNode[]): this {
        this.routes.forEach((route) => this.invoke(route, 'middleware', [middleware, true]))
        return this
    }

    /**
     * Define namespace for all the routes inside the group.
     *
     * @example
     * ```ts
     * Route.group(() => {
     * }).namespace('App/Admin/Controllers')
     * ```
     */
    public namespace (namespace: string): this {
        this.routes.forEach((route) => this.invoke(route, 'namespace', [namespace]))
        return this
    }
}