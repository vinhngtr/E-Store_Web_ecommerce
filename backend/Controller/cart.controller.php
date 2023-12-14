<?php

namespace Controller;

include_once 'controller.php';
include_once 'utils/database.php';

use Utils\{Request, Response, Model};

class CartController extends Controller
{
    // Properties

    // Methods
    public function __construct()
    {
        parent::__construct(
            'cart',
            get: ['user'],
            post: ['user'],
            put: ['user'],
            delete: ['user']
        );
    }

    public function get(Request $request, Response $response): void
    {
        $user = parent::validateAuth($this->get, $response);
        $request->add_condition('userId', '=', $user['id']);
        $result = Model::get($this->table, $request->get_conditions(), $request->get_order());

        if ($result !== null)
            $response->status(200)->json(array('payload' => $result));
        else
            $response->status(404)->json(array('message' => 'Items not found'));
    }

    public function post(Request $request, Response $response): void
    {
        $user = parent::validateAuth($this->post, $response);
        $body = $request->get_body();

        // $result = Model::post($this->table, $body);

        $result = Model::call(
            'pcd_addCart',
            [
                $user['id'],
                $body['color'],
                $body['size'],
                $body['productId'],
                $body['quantity']
            ]
        )[0]['result'];

        if ($result === '1')
            $response->status(201)->json($body);
        else
            $response->status(400)->json(array('message' => 'Item not created'));
    }

    public function put(Request $request, Response $response): void
    {
        $user = parent::validateAuth($this->post, $response);
        $body = $request->get_body();

        // $result = Model::post($this->table, $body);

        $result = Model::call(
            'pcd_updateCart',
            [
                $user['id'],
                $body['color'],
                $body['size'],
                $body['productId'],
                $body['quantity']
            ]
        )[0]['result'];

        if ($result === '1')
            $response->status(200)->json($body);
        else
            $response->status(400)->json(array('message' => 'Item not updated'));
    }
}
