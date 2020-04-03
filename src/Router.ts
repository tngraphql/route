/**
 * Created by Phan Trung Nguyên.
 * User: nguyenpl117
 * Date: 3/6/2020
 * Time: 6:49 AM
 */
import { Route } from './Route';
import { RouteGroup } from './Group';
import { toRoutesJSON } from './Helpers';
import { RouteResource } from './Resource';

export class Router {
    public routes: any[] = [];

    private openedGroups: any[] = [];

    private getRecentGroup () {
        return this.openedGroups[this.openedGroups.length - 1]
    }

    constructor () {
    }

    /**
     * Add query for a given pattern and methods
     */
    public route (handleName: string, method: string, handler: any): Route {
        const route = new Route(handleName, method, handler)
        const openedGroup = this.getRecentGroup()

        if (openedGroup) {
            openedGroup.routes.push(route)
        } else {
            this.routes.push(route)
        }

        return route
    }

    /**
     * Define `Query` route
     */
    public query (queryName: string, handler: string): Route {
        return this.route(queryName, 'query', handler)
    }

    /**
     * Define `Mutation` route
     */
    public mutation (queryName: string, handler: string): Route {
        return this.route(queryName, 'mutation', handler)
    }

    /**
     * Define `Subscription` route
     */
    public subscription (queryName: string, handler: string): Route {
        return this.route(queryName, 'subscription', handler)
    }

    /**
     * Registers a route resource with conventional set of routes
     */
    public resource (resource: string, handler: string): RouteResource {
        const resourceInstance = new RouteResource(resource, handler, false)
        const openedGroup = this.getRecentGroup()

        if (openedGroup) {
            openedGroup.routes.push(resourceInstance)
        } else {
            this.routes.push(resourceInstance)
        }

        return resourceInstance
    }

    /**
     * Creates a group of routes. A route group can apply transforms
     * to routes in bulk
     */
    public group (callback: () => void) {
        /**
         * Create a new group with empty set of routes
         */
        const group = new RouteGroup([])

        /**
         * See if there is any opened existing route groups. If yes, then we
         * push this new group to the old group, otherwise we push it to
         * the list of routes.
         */
        const openedGroup = this.getRecentGroup()
        if (openedGroup) {
            openedGroup.routes.push(group)
        } else {
            this.routes.push(group)
        }

        /**
         * Track the group, so that the upcoming calls inside the callback
         * can use this group
         */
        this.openedGroups.push(group)

        /**
         * Execute the callback. Now all registered routes will be
         * collected seperately from the `routes` array
         */
        callback()

        /**
         * Now the callback is over, get rid of the opened group
         */
        this.openedGroups.pop()

        return group
    }

    /**
     * Returns a flat list of routes JSON
     */
    public toJSON () {
        return toRoutesJSON(this.routes);
    }
}