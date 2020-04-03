/**
 * (c) Phan Trung Nguyên <nguyenpl117@gmail.com>
 * User: nguyenpl117
 * Date: 3/11/2020
 * Time: 2:16 PM
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Router } from '../src';
import { MethodType } from '../src/Route';

describe('Router | route', () => {
    it('add route', async () => {
        const router = new Router();

        const query = router.query('user', 'resolve.index');
        const mutation = router.mutation('userCreate', 'resolve.create');
        const subscription = router.subscription('userLive', 'resolve.live');

        expect(query.toJSON()).toEqual({
            "meta": {},
            method: MethodType.query,
            handleName: 'user',
            handler: 'resolve.index',
            middleware: []
        });
        expect(mutation.toJSON()).toEqual({
            "meta": {},
            method: MethodType.mutation,
            handleName: 'userCreate',
            handler: 'resolve.create',
            middleware: []
        });
        expect(subscription.toJSON()).toEqual({
            "meta": {},
            method: MethodType.subscription,
            handleName: 'userLive',
            handler: 'resolve.live',
            middleware: []
        });

    });

    it('allow nested groups', async () => {
        const router = new Router();

        router.group(() => {
            router.group(() => {
                router.query('user', 'resolve.index');
            });
        });

        expect(router.toJSON()).toEqual([{
            "meta": {},
            method: 'query',
            handleName: 'user',
            handler: 'resolve.index',
            middleware: []
        }])
    });

    it('apply middleware in nested groups', async () => {
        const router = new Router();

        router.group(() => {
            router.group(() => {
                router.query('user', 'resolve.index');
            }).middleware(['admin']);
        }).middleware(['auth']);

        expect(router.toJSON()).toEqual([{
            "meta": {},
            method: 'query',
            handleName: 'user',
            handler: 'resolve.index',
            middleware: ['auth', 'admin']
        }])
    });

    it('apply namespace in nested groupds', async () => {
        const router = new Router();

        router.group(() => {
            router.group(() => {
                router.query('user', 'resolve.index');
                router.query('user2', 'resolve.index')
                      .namespace('App/Query')
            }).middleware(['admin']);
        }).namespace('App/Controllers');

        expect(router.toJSON()).toEqual([
            {
                method: 'query',
                handleName: 'user',
                handler: 'resolve.index',
                middleware: ['admin'],
                meta: {
                    namespace: 'App/Controllers'
                }
            },
            {
                method: 'query',
                handleName: 'user2',
                handler: 'resolve.index',
                middleware: ['admin'],
                meta: {
                    namespace: 'App/Query'
                }
            }
        ])
    });

    it('define basic resource', async () => {
        const router = new Router();
        router.resource('user', 'resolve');

        expect(router.toJSON()).toEqual(
            [
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
                    middleware: []
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
                }]
        );
    });

    it('define resource inside nested groups', async () => {
        const router = new Router();

        router.group(() => {
            router.resource('user', 'resolve');
        });

        expect(router.toJSON()).toEqual(
            [
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
                    middleware: []
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
                }]
        );
    });
});