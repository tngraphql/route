/**
 * (c) Phan Trung Nguyên <nguyenpl117@gmail.com>
 * User: nguyenpl117
 * Date: 3/11/2020
 * Time: 1:19 PM
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Route, RouteGroup, RouteResource, toRoutesJSON } from '../src';
import { MethodType } from '../src/Route';

describe('Route Group', () => {
    it('add basic for the given route', async () => {
        const group = new RouteGroup([new Route('name', MethodType.query, 'resolve')]);

        expect(toRoutesJSON(group.routes)).toEqual([
            {
                method: 'query',
                handleName: 'name',
                handler: 'resolve',
                middleware: [],
                "meta": {},
            }
        ])
    });

    it('prepend middleware to existing route middleware', async () => {
        const route = new Route('name', MethodType.query, 'resolve');
        route.middleware('auth');
        const group = new RouteGroup([route]);
        group.middleware(['acl']);

        expect(toRoutesJSON(group.routes)).toEqual([
            {
                method: 'query',
                handleName: 'name',
                handler: 'resolve',
                middleware: ['acl', 'auth'],
                "meta": {},
            }
        ]);
    });

    it('add group for given group', async () => {
        const route = new Route('name', MethodType.query, 'resolve');

        const group = new RouteGroup([new RouteGroup([route])]);

        group.middleware(['auth']);

        expect(toRoutesJSON(group.routes)).toEqual([
            {
                method: 'query',
                handleName: 'name',
                handler: 'resolve',
                middleware: ['auth'],
                "meta": {},
            }
        ])
    });

    it('define resource inside the group', async () => {
        const resource = new RouteResource('photos', 'PhotosController')
        const group = new RouteGroup([resource]);

        expect(toRoutesJSON(group.routes)).toEqual([
            { method: 'query',
                handleName: 'photo',
                handler: 'PhotosController.index',
                middleware: [],
                meta: { namespace: undefined } },
            { method: 'query',
                handleName: 'photos',
                handler: 'PhotosController.list',
                middleware: [],
                meta: { namespace: undefined } },
            { method: 'mutation',
                handleName: 'photosCreate',
                handler: 'PhotosController.create',
                middleware: [],
                meta: { namespace: undefined } },
            { method: 'mutation',
                handleName: 'photosUpdate',
                handler: 'PhotosController.update',
                middleware: [],
                meta: { namespace: undefined } },
            { method: 'mutation',
                handleName: 'photosDelete',
                handler: 'PhotosController.delete',
                middleware: [],
                meta: { namespace: undefined } } ])
    });

    it('prepend namespace to the route resource', async () => {
        const resource = new RouteResource('photos', 'PhotosController')
        const group = new RouteGroup([resource]);
        group.namespace('App')

        expect(toRoutesJSON(group.routes)).toEqual([
            { method: 'query',
            handleName: 'photo',
            handler: 'PhotosController.index',
            middleware: [],
            meta: { namespace: 'App' } },
            { method: 'query',
                handleName: 'photos',
                handler: 'PhotosController.list',
                middleware: [],
                meta: { namespace: 'App' } },
            { method: 'mutation',
                handleName: 'photosCreate',
                handler: 'PhotosController.create',
                middleware: [],
                meta: { namespace: 'App' } },
            { method: 'mutation',
                handleName: 'photosUpdate',
                handler: 'PhotosController.update',
                middleware: [],
                meta: { namespace: 'App' } },
            { method: 'mutation',
                handleName: 'photosDelete',
                handler: 'PhotosController.delete',
                middleware: [],
                meta: { namespace: 'App' } } ])
    });

    it('define routes namespace', async () => {
        const route = new Route('/:id', 'query', 'handler')
        const group = new RouteGroup([route])
        group.namespace('Admin/Controllers/Http');

        expect(toRoutesJSON(group.routes).map(route => route.meta.namespace)).toEqual(['Admin/Controllers/Http'])
    });
});