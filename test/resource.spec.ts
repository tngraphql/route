/**
 * (c) Phan Trung Nguyên <nguyenpl117@gmail.com>
 * User: nguyenpl117
 * Date: 3/11/2020
 * Time: 1:44 PM
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RouteResource, toRoutesJSON } from '../src';

describe('Resource router', () => {
    it('let basic resource router', async () => {
        const resource = new RouteResource('user', 'resolve');
        expect(toRoutesJSON(resource.routes)).toEqual([
            {
                method: 'query',
                handleName: 'user',
                handler: 'resolve.index',
                middleware: [],
                "meta": {},
            },
            {
                method: 'query',
                handleName: 'users',
                handler: 'resolve.list',
                middleware: [],
                "meta": {},
            },
            {
                "meta": {},
                method: 'mutation',
                handleName: 'userCreate',
                handler: 'resolve.create',
                middleware: []
            },
            {
                "meta": {},
                method: 'mutation',
                handleName: 'userUpdate',
                handler: 'resolve.update',
                middleware: []
            },
            {
                "meta": {},
                method: 'mutation',
                handleName: 'userDelete',
                handler: 'resolve.delete',
                middleware: []
            }
        ])
    });

    it('resource route add array middleware', async () => {
        const resource = new RouteResource('user', 'resolve');
        resource.middleware(['auth']);
        expect(toRoutesJSON(resource.routes)).toEqual([
            {
                "meta": {},
                method: 'query',
                handleName: 'user',
                handler: 'resolve.index',
                middleware: ['auth']
            },
            {
                "meta": {},
                method: 'query',
                handleName: 'users',
                handler: 'resolve.list',
                middleware: ['auth']
            },
            {
                "meta": {},
                method: 'mutation',
                handleName: 'userCreate',
                handler: 'resolve.create',
                middleware: ['auth']
            },
            {
                "meta": {},
                method: 'mutation',
                handleName: 'userUpdate',
                handler: 'resolve.update',
                middleware: ['auth']
            },
            {
                "meta": {},
                method: 'mutation',
                handleName: 'userDelete',
                handler: 'resolve.delete',
                middleware: ['auth']
            }
        ])
    });

    it('resource route add single middleware', async () => {
        const resource = new RouteResource('user', 'resolve');
        resource.middleware('auth');
        expect(toRoutesJSON(resource.routes)).toEqual([
            {
                "meta": {},
                method: 'query',
                handleName: 'user',
                handler: 'resolve.index',
                middleware: ['auth']
            },
            {
                "meta": {},
                method: 'query',
                handleName: 'users',
                handler: 'resolve.list',
                middleware: ['auth']
            },
            {
                "meta": {},
                method: 'mutation',
                handleName: 'userCreate',
                handler: 'resolve.create',
                middleware: ['auth']
            },
            {
                "meta": {},
                method: 'mutation',
                handleName: 'userUpdate',
                handler: 'resolve.update',
                middleware: ['auth']
            },
            {
                "meta": {},
                method: 'mutation',
                handleName: 'userDelete',
                handler: 'resolve.delete',
                middleware: ['auth']
            }
        ])
    });

    it('resource route add in object', async () => {
        const resource = new RouteResource('user', 'resolve');
        resource.middleware({
            list: ['auth']
        });
        expect(toRoutesJSON(resource.routes)).toEqual([
            {
                "meta": {},
                method: 'query',
                handleName: 'user',
                handler: 'resolve.index',
                middleware: []
            },
            {
                "meta": {},
                method: 'query',
                handleName: 'users',
                handler: 'resolve.list',
                middleware: ['auth']
            },
            {
                "meta": {},
                method: 'mutation',
                handleName: 'userCreate',
                handler: 'resolve.create',
                middleware: []
            },
            {
                "meta": {},
                method: 'mutation',
                handleName: 'userUpdate',
                handler: 'resolve.update',
                middleware: []
            },
            {
                method: 'mutation',
                "meta": {},
                handleName: 'userDelete',
                handler: 'resolve.delete',
                middleware: []
            }
        ])
    });

    it('resource route add all middlware in object', async () => {
        const resource = new RouteResource('user', 'resolve');
        resource.middleware({
            '*': ['auth']
        });
        expect(toRoutesJSON(resource.routes)).toEqual([
            {
                method: 'query',
                handleName: 'user',
                handler: 'resolve.index',
                "meta": {},
                middleware: ['auth']
            },
            {
                method: 'query',
                handleName: 'users',
                handler: 'resolve.list',
                "meta": {},
                middleware: ['auth']
            },
            {
                method: 'mutation',
                handleName: 'userCreate',
                handler: 'resolve.create',
                "meta": {},
                middleware: ['auth']
            },
            {
                method: 'mutation',
                handleName: 'userUpdate',
                handler: 'resolve.update',
                "meta": {},
                middleware: ['auth']
            },
            {
                method: 'mutation',
                handleName: 'userDelete',
                handler: 'resolve.delete',
                middleware: ['auth'],
                "meta": {},
            }
        ])
    });

    it('mark all other routes as deleted except defined one\'s', async () => {
        const resource = new RouteResource('user', 'resolve');
        resource.only(['index', 'delete']);

        expect(resource.routes.find((route) => route.name === 'index').deleted).toBe(false);
        expect(resource.routes.find((route) => route.name === 'delete').deleted).toBe(false);
        expect(resource.routes.find((route) => route.name === 'list').deleted).toBe(true);
        expect(resource.routes.find((route) => route.name === 'create').deleted).toBe(true);
        expect(resource.routes.find((route) => route.name === 'update').deleted).toBe(true);
    });

    it('mark all defined as delete', async () => {
        const resource = new RouteResource('user', 'resolve');
        resource.except(['list', 'create', 'update',]);

        expect(resource.routes.find((route) => route.name === 'index').deleted).toBe(false);
        expect(resource.routes.find((route) => route.name === 'delete').deleted).toBe(false);
        expect(resource.routes.find((route) => route.name === 'list').deleted).toBe(true);
        expect(resource.routes.find((route) => route.name === 'create').deleted).toBe(true);
        expect(resource.routes.find((route) => route.name === 'update').deleted).toBe(true);
    });

    it('only and except | When both are applied together, the only method will win', async () => {
        const resource = new RouteResource('user', 'resolve');
        resource.only(['index']);
        resource.except(['create', 'update',]);
        expect(toRoutesJSON(resource.routes)).toEqual([{
            method: 'query',
            handleName: 'user',
            handler: 'resolve.index',
            middleware: [],
            "meta": {},
        }])
    });

    it('define namespace for all routes', async () => {
        const resource = new RouteResource('photos', 'PhotosController')
        resource.namespace('Admin/Controllers')

        expect(resource.routes.map((route) => route.toJSON().meta.namespace)).toEqual([
            'Admin/Controllers',
            'Admin/Controllers',
            'Admin/Controllers',
            'Admin/Controllers',
            'Admin/Controllers'
        ])
    });
});