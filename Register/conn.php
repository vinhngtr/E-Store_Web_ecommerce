<?php
$db_host = "localhost";
$db_username = "trongvinh";
$db_pass = "vinhtrong782002";
$db_name = "list_user";
$conn = mysqli_connect($db_host, $db_username, $db_pass, $db_name);
if(!$conn){
    echo mysqli_connect_error();
    exit();
}
?>