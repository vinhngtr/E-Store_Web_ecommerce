<?php
require 'conn.php';
$fullName = $email = $password = $confirmPass = "";

//! Làm sạch dữ liệu ở bước cơ bản:
function testData($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
// ! Kiểm tra tại nút submit
if (isset($_POST['btn-reg'])) {
    // echo "Submit success";
    $fullName = testData($_POST['fullName']);
    $email = testData($_POST['email']);
    $confirmPass = testData($_POST['confirmPassword']);
    $password = testData($_POST['password']);
    // ! Kiểm tra các trường có khác empty + đkiện đặt ra cho email / password (nếu có):
    if (strlen($password) < 6) {
        echo "Mật khẩu không được bé hơn 6 kí tự!";
        exit();
    } else if ($password != $confirmPass) {
        echo "Mật khẩu không khớp. Vui lòng nhập lại!";
        exit();
    }

    // ?------ MÃ HÓA MẬT KHẨU TRƯỚC KHI GỬI LÊN MYSQL (MASTER) - ở form đăng nhập cần kiểm tra lại password người dùng bằng hàm: `password_verify()`;
    $password = password_hash($password, PASSWORD_DEFAULT);

    // ! INSERT DỮ LIỆU VÀO DATABASE BẰNG LỆNH INSERT -> 'INSERT INTO name_table (nameColum,...) VALUES (nameValiable)
    $sql = "INSERT INTO `account_user` (`FullName`, `Email`, `Password`)  VALUES ('$fullName', '$email', '$password')";
    if ($conn->query($sql) === TRUE) {
        // header(): chuyển đến trang thông báo đăng kí tài khoản thành công OR PAGE ĐĂNG NHẬP
        header("Location: ../SignIn/index.html");
        echo "Đăng kí người dùng thành công!";
    } else {
        echo "Có lỗi xảy ra!";
    }
    $conn->close();
}
// echo $email;
