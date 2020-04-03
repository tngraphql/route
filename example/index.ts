import { Route, RouteGroup, Router } from '../src';
import { MethodType } from '../src/Route';

/**
 * (c) Phan Trung Nguyên <nguyenpl117@gmail.com>
 * User: nguyenpl117
 * Date: 3/16/2020
 * Time: 9:02 PM
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const route = new Router();
export { route };

// const group = new RouteGroup([new RouteGroup([route])]);

route.group(() => {
    require('./route.ts')
}).middleware(['auth'])
     .namespace('fajsfks');
console.log(route.toJSON());