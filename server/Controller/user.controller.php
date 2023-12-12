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

            $result = Model::call(
                'pcd_createUser',
                [
                    $body['fullName'],
                    $body['email'],
                    Auth::genHash($body['password'])
                ]
            )[0]['result'];

            if ($result === '1') {
                $users = Model::call(
                    'pcd_selectUserWithCredentials',
                    [
                        $body['email'],
                        Auth::genHash($body['password'])
                    ]
                );

                if (count($users) === 1)
                    $response->status(201)->json([
                        'token' => Auth::generateToken([
                            ...$users[0],
                            'password' => Auth::genHash($body['password'])
                        ]),
                        'message' => 'Registered successfully',
                        'user' => $users[0]
                    ]);
            }
        } elseif ($request->get_route(3) === 'login') {
            $body = $request->get_body();
            $users = Model::call(
                'pcd_selectUserWithCredentials',
                [
                    $body['email'],
                    Auth::genHash($body['password'])
                ]
            );

            if (count($users) === 1)
                $response->status(200)->json([
                    'token' => Auth::generateToken([
                        ...$users[0],
                        'password' => Auth::genHash($body['password'])
                    ]),
                    'message' => 'Logged in successfully',
                    'user' => $users[0]
                ]);
            else
                $response->status(401)->json(['message' => 'Invalid credentials']);
        } else
            $response->status(400)->json(['message' => 'Invalid request']);

        $response->status(400)->json(['message' => 'Item not created']);
    }
}
