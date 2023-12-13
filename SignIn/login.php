<?php
if (isset($_POST['btn-log'])) {
    $email_log = $_POST['email'];
    $pass_log = $_POST['password'];

    // ! tạo kết nối database để xác thực password và email nhập vào so với CSDL:
    $db_host = "localhost";
    $db_user = "trongvinh";
    $db_pass = "vinhtrong782002";
    $db_name = "list_user";
    $conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
    if (!$conn) {
        die("Kết nối DB không thành công: " . mysqli_connect_error());
        exit();
    }
    // Chuẩn bị câu lệnh truy vấn
    $stmt = $conn->prepare("SELECT * FROM account_user WHERE email = ?");
    // assign return in array POST to parameter;
    $stmt->bind_param("s", $email_log);
    // excutive
    $stmt->execute();
    // assign value return to variable result
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($pass_log, $user['password'])) {
            // ! tạo 1 page thông báo đăng nhập thành công -> button back về Home:
            header("Location: ../index.html");
            exit();
        } else {
            echo "Mật khẩu nhập vào không chính xác";
            exit();
        }
    } else {
        echo "Không tìm thấy người dùng với tài khoản này!";
    }
    $stmt->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet">
    <title>Đăng nhập tài khoản</title>
</head>

<body>
    <div class="container">
        <div class="navigation">
            <div id="navBar">
                <div class="top-navi">
                    <div class="top-left">
                        Chào mừng bạn đến với E-Store - cửa hàng linh kiện đi kèm máy tính
                    </div>
                    <div class="top-right">
                        Follow us:
                        <span>
                            <a href="https://www.facebook.com/vinh.nguyentrong.1291" style="color: white;"><i class="fa-brands fa-facebook"></i></a>
                            <a href="#" style="color: white;"><i class="fa-brands fa-instagram"></i></a>
                            <a href="https://www.youtube.com/" style="color: white;"><i class="fa-brands fa-youtube"></i></a>
                        </span>
                    </div>
                </div>
                <div class="midd-navi">
                    <div class="logo">
                        <a href="../index.html" style="color: white; text-decoration: none;">
                            <span style="font-size: 50px; font-weight: bold; padding-right: 3px;">E</span>
                            <span style="font-size: 40px; font-weight: bold; padding-right: 3px;">-</span>
                            <span style="font-size: 32px; font-weight: bold;">STORE</span>
                        </a>
                    </div>
                    <div class="search">
                        <input type="text" id="searchInput" placeholder="Tìm kiếm sản phẩm...">
                        <button><i class="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                    <div class="info-user" style="display: grid; grid-template-columns: auto auto auto; column-gap: 24px;">
                        <a href="../Cart/index.html" style="width: 32px;height: 32px; display: inline-block;" title="Giỏ hàng">
                            <i class="fa-solid fa-cart-shopping"></i>
                        </a>
                        <a href="#" style=" width: 32px;height: 32px; display: inline-block;" title="Sản phẩm yêu thích">
                            <i class="fa-regular fa-heart"></i>
                        </a>
                        <a href="#" style=" width: 32px;height: 32px; display: inline-block;" title="Đăng nhập/Đăng kí">
                            <i class="fa-regular fa-user"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="bottom-navi">
                <div class="left-side" style="font-size: 18px;">
                    <div class="category" style="margin-right: 24px; ">
                        <button style="display: inline-block; padding: 14px 24px; font-family: 'Public Sans', sans-serif; font-size: 18px;">
                            Danh mục sản phẩm
                            <i class="fa-solid fa-caret-down" style="padding-left: 3px;"></i>
                        </button>
                        <ul class="list-btnCate">
                            <li><a href="#">RAM & ROM</a></li>
                            <li><a href="#">SSD & HDD</a></li>
                            <li><a href="#">Màn hình PC</a></li>
                            <li><a href="#">Headphone</a></li>
                            <li><a href="#">Bàn phím máy tính</a></li>
                            <li><a href="#">Chuột gaming</a></li>
                            <li><a href="#">Card màn hình</a></li>
                            <li><a href="#">Tản nhiệt laptop</a></li>
                        </ul>
                    </div>
                    <div class="home" style="margin-right: 24px;">
                        <a href="../index.html" style="text-decoration: none;">
                            <i class="fa-solid fa-house" style="padding-right: 5px;"></i>
                            <span>Trang chủ</span>
                        </a>
                    </div>
                    <div class="blogger" style="margin-right: 24px;">
                        <a href=".../Blogger/index.html" style="text-decoration: none;">
                            <i class="fa-brands fa-blogger" style="padding-right: 5px;"></i>
                            <span>Blog</span>
                        </a>
                    </div>
                    <div class="about" style="margin-right: 24px;">
                        <a href="../About/index.html" style="text-decoration: none;">
                            <i class="fa-solid fa-circle-info" style="padding-right: 5px;"></i>
                            <span>Giới thiệu</span>
                        </a>
                    </div>
                    <div class="contact">
                        <a href="../FAQ/index.html" style="text-decoration: none;">
                            <i class="fa-solid fa-address-card" style="padding-right: 5px;"></i>
                            <span>Liên hệ</span>
                        </a>
                    </div>
                </div>
                <div class="right-side" style="font-size: 18px;">
                    <a href="#" style="text-decoration: none;" title="Hotline"><i class="fa-solid fa-phone" style="padding-right: 3px;"></i>
                        +84 - 969379924
                    </a>
                </div>
            </div>
            <div class="hr1" style="width: 100vw; background-color: #E4E7E9; height: 1px;"></div>
        </div>
        <div class="body-page">
            <div class="registration-form">
                <h2 ">Đăng nhập tài khoản</h2>
                <form id=" signupForm" action="" method="POST">
                    <div class="inputItem">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="inputItem">
                        <div class="methodPass">
                            <label for="password">Mật khẩu:</label>
                            <a href="./forgotPass.php">Quên mật khẩu</a>
                        </div>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button style="display: inline-block;" type="submit" name="btn-log">Đăng nhập</button>
                    </form>
            </div>
        </div>

        <!-- !FOOTER PAGE -->
        <div class="footer">
            <div class="top-footer">
                <div class="info-shop">
                    <div class="name-shop">
                        <a href="../index.html" style="color: white; text-decoration: none;">
                            <span style="font-size: 50px; font-weight: bold; padding-right: 3px;">E</span>
                            <span style="font-size: 40px; font-weight: bold; padding-right: 3px;">-</span>
                            <span style="font-size: 32px; font-weight: bold;">STORE</span>
                        </a>
                    </div>
                    <div class="detailInfoShop">
                        <div class="hotline">
                            <span style="display: inline-block; color: #77878F; font-size: 16px; margin-bottom: 5px;">Hotline hỗ trợ trực tuyến:</span>
                            <p style="color: #fff;font-size: 18px;">(84) 0969379924</p>
                        </div>
                        <div class="address">
                            <span style="color: #ADB7BC;font-size: 16px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 24px; "> ĐH BK HCM, TP. Thủ Đức, Hồ Chí Minh</span>
                        </div>
                        <div class="gmail">
                            <a style="color: #fff;font-style: normal;
                            font-weight: 500;
                            line-height: 24px; " href="mailto:vinhtrong782002@gmail.com">vinhtrong782002@gmail.com</a>
                        </div>
                    </div>
                </div>

                <div class="cate-shop">
                    <div class="title-cate">
                        <h2 style="font-size: 23px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: 24px;
                        text-transform: uppercase; color: #fff;">
                            TOP SẢN PHẨM
                        </h2>
                    </div>
                    <div class="body-cate" style="display: grid; grid-template-rows: 1fr 1fr 1fr 1fr 1fr;">
                        <p style="padding: 8px 0;" class="itemOfFooter"><a href="#">Màn hình PC</a></p>
                        <p style="padding: 8px 0;" class="itemOfFooter"><a href="#">Tai nghe</a></p>
                        <p style="padding: 8px 0;" class="itemOfFooter"><a href="#">Chuột</a></p>
                        <p style="padding: 8px 0;" class="itemOfFooter"><a href="#">Bàn phím</a></p>
                        <p style="padding: 8px 0;" class="itemOfFooter"><a style="color:#EBC80C ;" href="#">Xem tất cả sản phẩm <i class="fa-solid fa-arrow-right" style="padding-left: 5px;"></i></a></p>
                    </div>
                </div>

                <div class="menu-shop">
                    <div class="title-menu">
                        <h2 style="font-size: 23px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: 24px;
                        text-transform: uppercase; color: #fff;">
                            Menu
                        </h2>
                    </div>
                    <div class="body-menu" style="display: grid; grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;">
                        <p style="padding: 8px 0;" class="itemOfFooter"><a href="#">Trang chủ</a></p>
                        <p style="padding: 8px 0;" class="itemOfFooter"><a href="#">Tất cả sản phẩm</a></p>
                        <p style="padding: 8px 0;" class="itemOfFooter"><a href="#">Tài khoản của bạn</a></p>
                        <p style="padding: 8px 0;" class="itemOfFooter"><a href="#">Đơn hàng của bạn</a></p>
                        <p style="padding: 8px 0;" class="itemOfFooter"><a href="#">Bảng tin</a></p>
                        <p style="padding: 8px 0;" class="itemOfFooter"><a href="#">Về chúng tôi</a></p>
                    </div>
                </div>

                <div class="research-shop">
                    <div class="title-research">
                        <h2 style="font-size: 23px;
                        display: inline-block;
                        font-style: normal;
                        font-weight: 500;
                        line-height: 24px;
                        text-transform: uppercase; color: #fff;">
                            Tìm kiếm phổ biến
                        </h2>
                    </div>
                    <div class="body-research" style="display: flex;width: 270px; flex-wrap: wrap; gap: 8px;">
                        <a href="#">
                            <span>Headphone</span>
                        </a>
                        <a href="#">
                            <span>Chuột</span>
                        </a>
                        <a href="#">
                            <span>Asus</span>
                        </a>
                        <a href="#">
                            <span>Bàn phím</span>
                        </a>
                        <a href="#">
                            <span>SSD</span>
                        </a>
                        <a href="#">
                            <span>Graphics card</span>
                        </a>
                        <a href="#">
                            <span>RAM</span>
                        </a>
                        <a href="#">
                            <span>ROM</span>
                        </a>
                        <a href="#">
                            <span>Màn hình PC</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="coppyright">
                <p style="color: white; text-align: center;">E-STORE &#169; 2023. Design by GROUP-WEB-HCMUT</p>
            </div>
        </div>

    </div>
</body>

</html>