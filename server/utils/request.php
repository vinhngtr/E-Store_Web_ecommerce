<?php

namespace Utils;

class Request
{
    // Properties
    private $path;
    private $method;
    private $routes;
    private $params;
    private $body;
    private $conditions;
    private $order;

    // Methods
    public function __construct(string $uri, string $method)
    {
        $this->params = [];
        $this->order = null;
        $idx = strpos($uri, "?");
        if ($idx === false)
            $this->path = $uri;
        else {
            $this->path = substr($uri, 0, $idx);
            $params = substr($uri, $idx + 1);
            parse_str($params, $this->params);
            // $params = explode("&", $params);
            // foreach ($params as $param) {
            //     $param = explode("=", $param);
            //     // if ($param === 'order') {
            //     // $this->order = explode(',', $param[1]);
            //     // echo $this->order;
            //     // } else
            //     $this->params[$param[0]] = $param[1];
            // }
        }

        $this->method = $method;
        $this->routes = explode('/', $this->path);

        if ($method === 'POST' || $method === 'PUT') {
            $json = file_get_contents('php://input');
            $this->body = json_decode($json, true);
        } else
            $this->body = null;

        $this->conditions = [];
        $this->construct_conditions();
    }

    private function construct_conditions()
    {
        array_map(function ($key) {
            $this->conditions[] = $key . "='" . $this->params[$key] . "'";
        }, array_keys($this->params));
    }

    public function add_condition($key, $operator, $value)
    {
        $this->conditions[] = sprintf("%s%s'%s'", $key, $operator, $value);
    }

    public function add_order(string $order)
    {
        $this->order[] = $order;
    }

    public function get_conditions(): array
    {
        return $this->conditions;
    }

    public function get_method(): string
    {
        return $this->method;
    }

    public function get_route(int $idx): string | null
    {
        if ($idx < count($this->routes))
            return $this->routes[$idx];
        return null;
    }

    public function get_body(): array | null
    {
        return $this->body;
    }
    public function get_order(): array | null
    {
        return $this->order;
    }
}
