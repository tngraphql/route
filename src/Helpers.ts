/**
 * Created by Phan Trung Nguyên.
 * User: nguyenpl117
 * Date: 3/6/2020
 * Time: 7:11 AM
 */
import { Route } from './Route';
import { RouteGroup } from './Group';
import { RouteResource } from './Resource';

/**
 * Converts and array of routes or route groups or route resource to a flat
 * list of route defination.
 */
export function toRoutesJSON (
    routes: (RouteGroup | RouteResource | Route)[],
): any[] {
    return routes.reduce((list: any[], route) => {
        if (route instanceof RouteGroup) {
            list = list.concat(toRoutesJSON(route.routes))
            return list
        }

        if (route instanceof RouteResource) {
            list = list.concat(toRoutesJSON(route.routes))
            return list
        }

        if (!route.deleted) {
            list.push(route.toJSON())
        }

        return list
    }, [])
}