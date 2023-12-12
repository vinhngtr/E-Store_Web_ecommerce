<?php

namespace Utils;

class Response
{
    // Properties

    // Methods
    public function __construct()
    {
    }

    public function status($statusCode)
    {
        http_response_code($statusCode);
        return $this;
    }

    public function header($header)
    {
        header($header);
        return $this;
    }

    public function json($payload)
    {
        $this->header("Content-Type: application/json");
        echo json_encode($payload);
        exit();
    }
}
