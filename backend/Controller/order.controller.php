<?php

namespace Controller;

include_once 'controller.php';
include_once 'utils/database.php';

use Utils\{Request, Response, Model, Auth};

class OrderController extends Controller
{
    // Properties

    // Methods
    public function __construct()
    {
        parent::__construct(
            'userOrder',
            get: ['user', 'admin'],
            post: ['user'],
            put: ['admin']
        );
    }

    public function get(Request $request, Response $response): void
    {
        $user = parent::validateAuth($this->get, $response);
        if ($user['role'] === 'user') {
            $request->add_condition('userId', '=', $user['id']);
            $result = Model::get($this->table, $request->get_conditions(), $request->get_order());
        } else {
            if (count($request->get_conditions())) {
                $temp = str_replace("'", "", explode('=', $request->get_conditions()[0])[1]);
                // echo var_dump($temp);
                $result = Model::call("pcd_selectOrderDetailAdmin", [$temp]);
                $response->status(200)->json(array('payload' => $result));
            }
            // echo var_dump(str_replace("'", "", explode('=', $request->get_conditions()[0])[1]));

            else
                $result = Model::call("pcd_selectUserOrderAdmin", []);
        }

        if ($result) {
            $result = array_map(function ($row) {
                $row['products'] = Model::get('orderDetail', array('orderId=' . $row['id']));
                return $row;
            }, $result);
            $response->status(200)->json(array('payload' => $result));
        } else
            $response->status(404)->json(array('message' => 'Items not found'));
    }


    public function post(Request $request, Response $response): void
    {
        $user = parent::validateAuth($this->post, $response);

        $body = $request->get_body();
        $orderId = Model::post($this->table, ['userId' => $user['id']]);

        if ($orderId) {
            foreach ($body['products'] as $product) {
                $id = Model::post('orderDetail', ['orderId' => $orderId, ...$product]);
            }
            Model::delete('cart', ["userId=" . $user['id']]);
            $response->status(201)->json(array('message' => 'Order created'));
        } else
            $response->status(500)->json(array('message' => 'Failed to create order'));
    }
}
