<?php

namespace Controller;

use Utils\{Request, Response, Model};

class ReviewController extends Controller
{
    // Properties

    // Methods
    public function __construct()
    {
        parent::__construct(
            'review',
            get: ['admin', 'user', ''],
            post: ['user'],
        );
    }

    public function get(Request $request, Response $response): void
    {
        $this->validateAuth($this->get, $response);

        $result = Model::get($this->table, $request->get_conditions(), $request->get_order());

        echo var_dump($result);

        if ($result !== null) {
            $result = array_map(function ($review) {
                $user = Model::get(
                    'user',
                    [
                        "id='" . $review['userId'] . "'"
                    ]
                );
                return [...$review, 'user' => $user];
            }, $result);
            $response->status(200)->json(['payload' => $result]);
        } else
            $response->status(404)->json(['message' => 'Items not found']);
    }

    public function post(Request $request, Response $response): void
    {
        $user = parent::validateAuth($this->post, $response);
        $request->add_body('userId', $user['id']);
        $request->add_body('productId', $request->get_param('productId'));
        $body = $request->get_body();

        $result = Model::call(
            'pcd_createReview',
            [
                $body['userId'],
                $body['productId'],
                $body['content'],
                $body['rating']
            ]
        )[0]['result'];
        if ($result === '1')
            $response->status(201)->json(['payload' => $body, 'message' => 'Review created successfully']);
        else
            $response->status(400)->json(['message' => 'Item not created']);
    }
}
