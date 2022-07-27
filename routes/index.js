const RootRoute = require('./root');
const UserRoute = require('./user');
const WatchlistRoute = require('./watchlist');


module.exports = [
    /**
     * Root
     */
    [
        {
            'path': '/',
            'method': 'get',
            'middlewares': [],
            'handlers': RootRoute
        }
    ],

    /**
     * User
     */
    [
        {
            // Get all users.
            'path': '/user/',
            'method': 'get',
            'middlewares': [],
            'handlers': UserRoute.GetAll
        },
        {
            // Get user by ID.
            'path': '/user/:uuid',
            'method': 'get',
            'middlewares': [],
            'handlers': UserRoute.GetByUUID
        },
        {
            // Create new user.
            'path': '/user/',
            'method': 'post',
            'middlewares': [],
            'handlers': UserRoute.Create
        },
        {
            // Delete user.
            'path': '/user/:uuid',
            'method': 'delete',
            'middlewares': [],
            'handlers': UserRoute.Delete
        }
    ],


    /**
     * Watchlist
     */
    [
        {
            'path': '/watchlist/',
            'method': 'get',
            'middlewares': [],
            'handlers': WatchlistRoute.GetAll
        }, 
        {
            'path': '/watchlist/:uuid/:item',
            'method': 'get',
            'middlewares': [],
            'handlers': WatchlistRoute.GetItem
        },
        {
            'path': '/watchlist/:uuid',
            'method': 'get',
            'middlewares': [],
            'handlers': WatchlistRoute.GetByUUID
        },
        {
            'path': '/watchlist/:uuid/add',
            'method': 'post',
            'middlewares': [],
            'handlers': WatchlistRoute.AddItem
        },
        {
            'path': '/watchlist/',
            'method': 'post',
            'middlewares': [],
            'handlers': WatchlistRoute.Create
        },
        {
            'path': '/watchlist/:uuid',
            'method': 'delete',
            'middlewares': [],
            'handlers': WatchlistRoute.Delete
        },
        {
            'path': '/watchlist/:uuid/:item',
            'method': 'delete',
            'middlewares': [],
            'handlers': WatchlistRoute.DeleteItem
        }
    ]
];