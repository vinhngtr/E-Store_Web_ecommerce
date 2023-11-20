<?php 
if(isset($_POST['btn-log'])){
    $email_log = $_POST['email'];
    $pass_log = $_POST['password'];

    // ! tạo kết nối database để xác thực password và email nhập vào so với CSDL:
    $db_host = "localhost";
    $db_user = "trongvinh";
    $db_pass = "vinhtrong782002";
    $db_name = "list_user";
    $conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
    if(!$conn){
        die("Kết nối DB không thành công: " . mysqli_connect_error());
        exit();
    }
    
}
?>