/**
 * (c) Phan Trung Nguyên <nguyenpl117@gmail.com>
 * User: nguyenpl117
 * Date: 3/11/2020
 * Time: 12:57 PM
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Route } from '../src';
import { MethodType } from '../src/Route';

describe('Route', () => {
    it('create a basic route', async () => {
        const route = new Route('name', MethodType.query, 'resolve');
        expect((route as any).handleName).toBe('name');
        expect((route as any).method).toBe(MethodType.query);
        expect((route as any).handler).toBe('resolve');
        expect((route as any).deleted).toBe(false);
        expect((route as any).routeMiddleware).toEqual([]);

        expect(route.toJSON()).toEqual({
            "meta": {},
            method: MethodType.query,
            handleName: 'name',
            handler: 'resolve',
            middleware: []
        });
    });

    it('define an array of route middleware', async () => {
        const route = new Route('name', MethodType.query, 'resolve');
        route.middleware(['auth', 'acl:admin']);
        expect(route.toJSON()).toEqual({
            "meta": {},
            method: MethodType.query,
            handleName: 'name',
            handler: 'resolve',
            middleware: ['auth', 'acl:admin']
        });
    });

    it('define route middleware as a string', async () => {
        const route = new Route('name', MethodType.query, 'resolve');
        route.middleware('auth');
        expect(route.toJSON()).toEqual({
            "meta": {},
            method: MethodType.query,
            handleName: 'name',
            handler: 'resolve',
            middleware: ['auth']
        });
    });

    it('define route namespace', async () => {
        const route = new Route('name', MethodType.query, 'resolve');
        route.namespace('auth');
        expect(route.toJSON()).toEqual({
            "meta": {
                namespace: 'auth'
            },
            method: MethodType.query,
            handleName: 'name',
            handler: 'resolve',
            middleware: []
        });
    });

    it('define route middleware prepend', async () => {
        const route = new Route('name', MethodType.query, 'resolve');
        route.middleware(['auth'])
        route.middleware('acl:admin', true);
        expect(route.toJSON()).toEqual({
            "meta": {},
            method: MethodType.query,
            handleName: 'name',
            handler: 'resolve',
            middleware: ['acl:admin', 'auth']
        });
    });
});