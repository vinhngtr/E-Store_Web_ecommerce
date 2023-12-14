<?php

// use Controller\Controller;
// use Utils\Auth;

include_once './utils/env.php';
include_once './utils/request.php';
include_once './utils/response.php';
include_once './utils/auth.php';

include_once './Controller/controller.php';
include_once './Controller/product.controller.php';
include_once './Controller/order.controller.php';
include_once './Controller/cart.controller.php';
include_once './Controller/user.controller.php';
include_once './Controller/review.controller.php';

// Load environment variables
(new Utils\DotEnv(__DIR__ . '/.env'))->load();

// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
// echo var_dump($_SERVER);



// Create Request and Response objects
$request = new Utils\Request($_SERVER['REQUEST_URI'], $_SERVER['REQUEST_METHOD']);
$response = new Utils\Response();


$response = $response->header('Access-Control-Allow-Origin: *');


if (isset($_SERVER['HTTP_AUTHORIZATION']) && $_SERVER['HTTP_AUTHORIZATION'] !== '') {
    if (!preg_match("/^Bearer \S+$/", $_SERVER['HTTP_AUTHORIZATION']))
        $response->status(401)->json(array('message' => 'Invalid token'));
    $_SERVER['HTTP_AUTHORIZATION'] = explode(' ', $_SERVER['HTTP_AUTHORIZATION'])[1];
}
// echo "Bearer token checked\n";
$endpoint = $request->get_route(2);

// if (!in_array(($endpoint), ['', 'products'])) {
//     Auth::validateToken($_SERVER['HTTP_AUTHORIZATION'] ?? '', $response);
// }

$controller = null;

switch ($endpoint) {
    case '':
    case 'products':
        // get
        // get
        // get post put delete
        // checked
        // DONE
        $controller = new Controller\ProductController();
        break;

    case 'userOrders':
        // 
        // get post
        // get put
        // checked
        // DONE
        $controller = new Controller\OrderController();
        break;

    case 'carts':
        // 
        // get post put delete
        // 
        // checked
        // DONE
        $controller = new Controller\CartController();
        break;

    case 'brands':
        // get
        // get
        // get post put delete
        // checked
        // DONE
        $controller = new Controller\Controller(
            'brand',
            get: ['admin', 'user', ''],
            post: ['admin'],
            put: ['admin'],
            delete: ['admin']
        );
        break;

    case 'categories':
        // get
        // get
        // get post put delete
        // checked
        // DONE
        $controller = new Controller\Controller(
            'category',
            get: ['admin', 'user', ''],
            post: ['admin'],
            put: ['admin'],
            delete: ['admin']
        );
        break;

    case 'productColorSizes':
        //
        //
        // post put delete
        // checked
        $controller = new Controller\Controller(
            'productColorSize',
            post: ['admin'],
            put: ['admin'],
            delete: ['admin']
        );
        break;

    case 'productImages':
        $controller = new Controller\Controller(
            'productImage',
            post: ['admin'],
            put: ['admin'],
            delete: ['admin']
        );
        break;

    case 'reviews':
        // get
        // get post put
        // get
        // checked
        // DONE
        $controller = new Controller\ReviewController();
        break;

    case 'users':
        // get
        // get
        // get post put delete
        $controller = new Controller\UserController();
        break;

    default:
        $response->status(400)->json(array('message' => 'Invalid request URI'));
        break;
}
$method = $request->get_method();



switch ($method) {
    case 'GET':
        $controller->get($request, $response);
        break;
    case 'POST':
        $controller->post($request, $response);
        break;
    case 'PUT':
        $controller->put($request, $response);
        break;
    case 'DELETE':
        $controller->delete($request, $response);
        break;
    default:
        $response->status(405)->json(array('message' => 'Invalid request method'));
}

$response->status(400);
