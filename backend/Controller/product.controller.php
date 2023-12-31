<?php

namespace Controller;

include_once 'controller.php';
include_once 'utils/database.php';

use Utils\{Request, Response, Model};


class ProductController extends Controller
{
    // Properties

    // Methods
    public function __construct()
    {
        parent::__construct(
            'product',
            get: ['admin', 'user', ''],
            post: ['admin'],
            put: ['admin'],
            delete: ['admin']
        );
    }


    public function get(Request $request, Response $response): void
    {
        $user = parent::validateAuth($this->get, $response);

        if ($user && $user['role'] == 'admin' && !count($request->get_conditions())) {
            $result = Model::call("pcd_selectAllProductsAdmin", []);

            $response->status(200)->json(array('payload' => $result));
        } else

            $result = Model::get($this->table, $request->get_conditions(), $request->get_order(), $request->get_limit());

        if ($result) {
            $result = array_map(function ($row) {
                $row['colorSizes'] = Model::get(
                    'productColorSize',
                    ['productId=' . $row['id']]
                );
                $row['images'] = Model::get(
                    'productImage',
                    ['productId=' . $row['id']]
                );
                return $row;
            }, $result);

            $response->status(200)->json(array('payload' => $result));
        } else
            $response->status(404)->json(array('message' => 'Products not found'));
    }

    public function post(Request $request, Response $response): void
    {
        parent::validateAuth($this->post, $response);

        $body = $request->get_body();
        $existed = Model::get(
            $this->table,
            [
                "name='" . $body['name'] . "'",
                "brandId='" . $body['brandId'] . "'",
                "categoryId='" . $body['categoryId'] . "'"
            ]
        );

        if ($existed === null || count($existed) === 0)
            $result = Model::post($this->table, $body);
        else {
            $id = $existed[0]['id'];
            $result = Model::put(
                $this->table,
                [...$body, 'active' => 1],
                ['id=' . $id]
            );
        }

        if ($result)
            $response->status(201)->json(['payload' => $body, 'id' => $result]);
        else
            $response->status(400)->json(array('message' => 'Item not created'));
    }
}
