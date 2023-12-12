<?php

namespace Utils;

include_once './env.php';

class Auth
{
    private static $algo = 'HS256';
    private static $type = 'JWT';
    private static $hash = 'sha256';

    protected static function base64UrlEncode($text)
    {
        return str_replace(
            ['+', '/', '='],
            ['-', '_', ''],
            base64_encode($text)
        );
    }

    public static function generateToken(array $payload): string
    {
        $header = self::base64UrlEncode(json_encode(['alg' => self::$algo, 'typ' => self::$type]));

        $payload = self::base64UrlEncode(json_encode([
            'id' => $payload['id'],
            'email' => $payload['email'],
            'password' => $payload['password'],
            'role' => $payload['role']
        ]));

        $signature = hash_hmac(self::$hash, "$header.$payload", $_ENV['SECRET_KEY'], true);
        $signature = self::base64UrlEncode($signature);

        return "$header.$payload.$signature";
    }

    public static function validateToken(string $token): bool
    {

        $token_parts = explode('.', $token);
        if (count($token_parts) !== 3) {
            echo "Token not contain 3 parts\n";
            return false;
        }


        $header = base64_decode($token_parts[0]);
        $payload = base64_decode($token_parts[1]);
        $signature = $token_parts[2];

        $header_data = json_decode($header, true);

        if (
            !isset($header_data['alg']) ||
            !isset($header_data['typ']) ||
            $header_data['alg'] !== self::$algo ||
            $header_data['typ'] !== self::$type
        ) {
            echo "Wrong token header data\n";
            return false;
        }

        $header = self::base64UrlEncode($header);
        $payload = self::base64UrlEncode($payload);

        $valid_signature = hash_hmac(self::$hash, "$header.$payload", $_ENV['SECRET_KEY'], true);
        $valid_signature = self::base64UrlEncode($valid_signature);

        return ($signature === $valid_signature);
    }

    public static function decodeToken(string $token): array | null
    {
        $payload = base64_decode(explode('.', $token)[1]);
        return json_decode($payload, true);
    }

    public static function validateHash($data, $hash): bool
    {
        return hash(self::$hash, $data) == $hash;
    }

    public static function genHash($data): string
    {
        return hash(self::$hash, $data);
    }

    protected static function validateUser(array | null $user, Response $response): void
    {
        $result = Model::get(
            'user',
            [
                "email='" . $user['email'] . "'",
                "password='" . self::genHash($user['password']) . "'"
            ]
        );
        if ($result)
            $response->status(401)->json(array('message' => 'Invalid credentials'));
    }

    public static function validate(string $token, Response $response): void
    {
        if (!self::validateToken($token))
            $response->status(401)->json(array('message' => 'Invalid token'));

        self::validateUser(self::decodeToken($token), $response);
    }
}
