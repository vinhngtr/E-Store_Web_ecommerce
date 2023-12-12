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
    private $limit;
    private $type = [
        "int" => ['id', 'userId', 'productId', 'brandId', 'categoryId', 'rating', 'unitPrice', 'quantity', 'orderId']
    ];

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
        }

        $this->method = $method;
        $this->routes = explode('/', $this->path);

        if ($method === 'POST' || $method === 'PUT') {
            $json = file_get_contents('php://input');
            $this->body = json_decode($json, true);
        } else
            $this->body = null;

        $this->limit = 0;

        $this->conditions = [];
        $this->construct_conditions();
    }

    private function construct_conditions()
    {
        array_map(function ($key) {
            switch ($key) {
                case 'limit':
                    $this->limit = intval($this->params[$key]);
                    break;

                default:
                    $this->conditions[] = $key . "='" . $this->params[$key] . "'";

                    break;
            }
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

    public function add_body(string $key, string $value): void
    {
        $this->body[$key] = $value;
    }

    public function get_order(): array | null
    {
        return $this->order;
    }

    public function get_param($key): string | null
    {
        return $this->params[$key] ?? null;
    }

    public function get_limit(): int
    {
        return $this->limit;
    }
}
