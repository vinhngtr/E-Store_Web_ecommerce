<?php

namespace Controller;

use Utils\{Auth, Request, Response, Model};

class Controller
{
    // Properties
    public string $table;
    protected array | null $get;
    protected array | null $post;
    protected array | null $put;
    protected array | null $delete;

    // Methods
    public function __construct(
        string $table,
        array | null $get = null,
        array | null $post = null,
        array | null $put = null,
        array | null $delete = null,
    ) {
        $this->table = $table;
        $this->get = $get;
        $this->post = $post;
        $this->put = $put;
        $this->delete = $delete;
    }

    protected function validateAuth(array | null $method, Response $response): array | null
    {
        if ($method === null)
            $response->status(405)->json(array('message' => 'Invalid request method'));

        if (!isset($_SERVER['HTTP_AUTHORIZATION']) || $_SERVER['HTTP_AUTHORIZATION'] === '') {
            if (!in_array('', $method))
                $response->status(401)->json(['message' => 'You are not authenticated']);
        } else {
            Auth::validate($_SERVER['HTTP_AUTHORIZATION'], $response);
            $user = Auth::decodeToken($_SERVER['HTTP_AUTHORIZATION']);
            if (!in_array($user['role'], $method))
                $response->status(403)->json(['message' => 'You are not allowed to access this']);
            return $user;
        }
        return null;
    }

    public function get(Request $request, Response $response): void
    {
        $this->validateAuth($this->get, $response);

        $result = Model::get($this->table, $request->get_conditions(), $request->get_order());

        if ($result)
            $response->status(200)->json(array('payload' => $result));
        else
            $response->status(404)->json(array('message' => 'Items not found'));
    }


    public function post(Request $request, Response $response): void
    {
        $this->validateAuth($this->post, $response);
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

    public function put(Request $request, Response $response): void
    {
        $this->validateAuth($this->put, $response);

        $body = $request->get_body();
        $result = Model::put($this->table, $body, $request->get_conditions());

        if ($result)
            $response->status(200)->json(array('payload' => $body));
        else
            $response->status(404)->json(array('message' => 'Items not found'));
    }

    public function delete(Request $request, Response $response): void
    {
        $this->validateAuth($this->delete, $response);

        $result = Model::delete($this->table,  $request->get_conditions());

        if ($result)
            $response->status(200)->json(array('message' => 'Items deleted successfully'));
        else
            $response->status(404)->json(array('message' => 'Items not found'));
    }
}
