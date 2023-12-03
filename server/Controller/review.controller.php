<?php

namespace Controller;

use Utils\{Auth, Request, Response, Model};


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

    public function post(Request $request, Response $response): void
    {
        $user = parent::validateAuth($this->post, $response);
        // $request->add_condition('userId');
        $body = $request->get_body();

        if (Model::is_soft_delete($this->table)) {
            $existed = Model::get(
                $this->table,
                ["name='" . $body['name'] . "'",]
            );

            if (!$existed)
                $result = Model::post($this->table, $body);
            else {
                $result = Model::put(
                    $this->table,
                    [...$body, 'active' => 1],
                    ["name='" . $body['name'] . "'"]
                );
            }
        } else
            $result = Model::post($this->table, $body);

        if (is_int($result))
            $response->status(201)->json($body);
        else
            $response->status(400)->json(array('message' => 'Item not created'));
    }
}
