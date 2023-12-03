<?php

namespace Controller;

use Utils\{Request, Response, Model, JWT};

class ColorSizeController extends Controller
{
    // Properties

    // Methods
    public function __construct()
    {
        parent::__construct(
            'productColorSize',
            post: ['admin'],
            put: ['admin'],
            delete: ['admin']
        );
    }

    public function post(Request $request, Response $response): void
    {
        if ($this->post !== null) {
            $user = JWT::decodeToken($_SERVER['HTTP_AUTHORIZATION']);
            if ($user['role'] !== $this->post)
                $response->status(403)->json(['message' => 'You are not allowed to access this']);
        }

        $body = $request->get_body();
        $result = Model::post($this->table, $body);

        if ($result)
            $response->status(201)->json($body);
        else
            $response->status(400)->json(array('message' => 'Item not created'));
    }

    public function put(Request $request, Response $response): void
    {
        if ($this->put !== null) {
            $user = JWT::decodeToken($_SERVER['HTTP_AUTHORIZATION']);
            if ($user['role'] !== $this->put)
                $response->status(403)->json(['message' => 'You are not allowed to access this']);
        }

        $body = $request->get_body();
        $result = Model::put($this->table, $body, $request->get_conditions());

        if ($result)
            $response->status(200)->json(array('payload' => $body));
        else
            $response->status(404)->json(array('message' => 'Items not found'));
    }

    public function delete(Request $request, Response $response): void
    {
        if ($this->delete !== null) {
            $user = JWT::decodeToken($_SERVER['HTTP_AUTHORIZATION']);
            if ($user['role'] !== $this->delete)
                $response->status(403)->json(['message' => 'You are not allowed to access this']);
        }

        $result = Model::delete($this->table,  $request->get_conditions());

        if ($result)
            $response->status(200)->json(array('message' => 'Items deleted successfully'));
        else
            $response->status(404)->json(array('message' => 'Items not found'));
    }
}
