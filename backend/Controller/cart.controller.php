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
}
