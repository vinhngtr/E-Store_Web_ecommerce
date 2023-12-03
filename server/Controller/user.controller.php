<?php

namespace Controller;

use Utils\{Auth, Request, Response, Model};

class UserController extends Controller
{
    // Properties

    // Methods
    public function __construct()
    {
        parent::__construct(
            'user',
            post: ['']
        );
    }

    public function post(Request $request, Response $response): void
    {
        if ($request->get_route(3) === 'register') {
            $body = $request->get_body();
            $request->add_body('password', Auth::genHash($body['password']));
            $result = Model::post($this->table, $request->get_body());
            $users = Model::get(
                $this->table,
                [
                    "email='" . $body['email'] . "'",
                    "password='" . Auth::genHash($body['password']) . "'"
                ]
            );

            if ($result && $users)
                $response->status(201)->json(['token' => Auth::generateToken($users[0])]);
        } elseif ($request->get_route(3) === 'login') {

            $body = $request->get_body();
            $users = Model::get(
                $this->table,
                [
                    "email='" . $body['email'] . "'",
                    "password='" . Auth::genHash($body['password']) . "'"
                ]
            );
            if ($users)
                $response->status(200)->json(['token' => Auth::generateToken($users[0])]);
            else
                $response->status(401)->json(['message' => 'Invalid credentials']);
        } else
            $response->status(400)->json(['message' => 'Invalid request']);

        $response->status(400)->json(array('message' => 'Item not created'));
    }
}
