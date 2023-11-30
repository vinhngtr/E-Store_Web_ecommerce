<?php

namespace Utils;

use mysqli;

class Model
{
    // Properties

    // Methods
    private static function connectDatabase()
    {
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        $host = $_ENV['DB_HOST'];
        $username = $_ENV['DB_USER'];
        $password = $_ENV['DB_PASS'];
        $dbname = $_ENV['DB_NAME'];
        $conn = new mysqli($host, $username, $password, $dbname);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        $conn->set_charset('utf8mb4');
        return $conn;
    }

    public static function get(string $table, array | null $conditions = null, array | null $order = null): array | null
    {
        $conn = self::connectDatabase();
        $query = "SELECT * FROM " . $table;

        if ($conditions)
            $query .= " WHERE " . implode(" AND ", $conditions);

        if ($order)
            $query .= " ORDER BY " . implode(",", $order);

        $product = $conn->execute_query($query);
        $conn->close();

        if ($product === false)
            return null;
        return $product->fetch_all(MYSQLI_ASSOC);
    }

    public static function post(string $table, array $payload): int | false
    {
        $conn = self::connectDatabase();
        $keys = implode(',', array_keys($payload));

        $values = array_map(function ($val) {
            return sprintf("'%s'", $val);
        }, array_values($payload));
        $values = implode(',', $values);

        $success = $conn->query(sprintf(
            "INSERT INTO %s (%s) VALUES (%s)",
            $table,
            $keys,
            $values
        ));
        $res = false;

        if ($success) $res = $conn->insert_id;
        $conn->close();
        return $res;
    }

    public static function put(string $table, array $payload, array $conditions): bool
    {
        $conn = self::connectDatabase();
        $query = "UPDATE " . $table;

        $values = [];
        foreach ($payload as $key => $value) {
            $values[] = sprintf("%s='%s'", $key, $value);
        }
        $values = implode(',', $values);

        $query .= " SET " . $values;
        $query .= " WHERE " . implode(" AND ", $conditions);

        $success = $conn->query($query);

        $conn->close();
        return $success;
    }

    public static function delete(string $table, array $conditions, bool $delete = false): bool
    {
        $conn = self::connectDatabase();
        if ($delete)
            $query = "DELETE FROM " . $table;
        else
            $query = "UPDATE " .
                $table .
                " SET active=0";

        $query .= " WHERE " . implode(" AND ", $conditions);

        $success = $conn->query($query);

        $conn->close();
        return $success;
    }
}
