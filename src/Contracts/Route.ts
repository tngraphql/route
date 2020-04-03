/**
 * (c) Phan Trung Nguyên <nguyenpl117@gmail.com>
 * User: nguyenpl117
 * Date: 3/16/2020
 * Time: 9:35 PM
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
/**
 * Input middleware node must be function or a string pointing
 * to the IoC container
 */
export type MiddlewareNode = string | (
    (ctx: any, next: () => Promise<void>, args?: string[]) => Promise<void>
    )

/**
 * Route definition returned as a result of `route.toJSON` method
 */
export type RouteDefinition = RouteNode & {
    method: string,
}

/**
 * Route node persisted within the store
 */
export type RouteNode = {
    handleName: string;

    /**
     * The router itself doesn't use the handler for anything, it
     * leaves the type to `any` for the consumer to decide the
     * shape of the handler
     */
    handler: string,

    /**
     * The router itself doesn't use the middleware for anything, it
     * leaves the type to `any` for the consumer to decide the
     * shape of the middleware
     */
    middleware: MiddlewareNode[],

    /**
     * Any custom runtime properties to be added to the route
     */
    meta: {
        namespace?: string,
    } & { [key: string]: any },

    /**
     * A unique name to lookup routes by name
     */
    name?: string,
};
