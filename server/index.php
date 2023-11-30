<?php

include_once 'utils/env.php';
include_once 'utils/request.php';
include_once 'utils/response.php';

include_once 'Controller/controller.php';
include_once 'Controller/product.controller.php';
include_once 'Controller/order.controller.php';
include_once 'Controller/cart.controller.php';

// Load environment variables
(new Utils\DotEnv(__DIR__ . '/.env'))->load();

// Create Request and Response objects
$request = new Utils\Request($_SERVER['REQUEST_URI'], $_SERVER['REQUEST_METHOD']);
$response = new Utils\Response();

$endpoint = $request->get_route(2);

$tables = [
    'brands' => 'brand',
    // 'carts' => 'cart',
    'categories' => 'category',
    'orderDetails' => 'orderDetail',
    'productColors' => 'productColor',
    'productSizes' => 'productSize',
    'reviews' => 'review',
];

$controller = null;

// Send request to corresponding controller
if (array_key_exists($endpoint, $tables))
    $controller = new Controller\Controller($tables[$endpoint]);
// elseif ($endpoint === 'users')
//     $controller = new Controller\UserController();
elseif (in_array(($endpoint), ['', 'products']))
    $controller = new Controller\ProductController();
elseif ($endpoint === 'userOrders')
    $controller = new Controller\OrderController();
elseif ($endpoint === 'carts')
    $controller = new Controller\CartController();
else {
    $response->status(401)->json(array('message' => 'Invalid request URI'));
    exit();
}

switch ($request->get_method()) {
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
        $response->status(405)->json(array('message' => 'Method not allowed'));
}
