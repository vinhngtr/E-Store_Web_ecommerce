DROP DATABASE IF EXISTS store;
CREATE DATABASE store;
USE store;


-- ============================================================

--                            TABLE

-- ============================================================


-- ==================== CATEGORY
CREATE TABLE category (
    id          INT             AUTO_INCREMENT,
    name        VARCHAR(255)    NOT NULL,
    active      BOOL            NOT NULL    DEFAULT 1,

    CONSTRAINT pk_category PRIMARY KEY (id)
);

-- ==================== BRAND
CREATE TABLE brand (
    id          INT             AUTO_INCREMENT,
    name        VARCHAR(255)    NOT NULL,
    active      BOOL            NOT NULL    DEFAULT 1,

    CONSTRAINT pk_brand PRIMARY KEY (id)
);

-- ==================== PRODUCT
CREATE TABLE product (
    id                  INT             AUTO_INCREMENT,
    name                VARCHAR(255)    NOT NULL,
    description         VARCHAR(255)    NOT NULL,
    unitPrice           INT             NOT NULL    DEFAULT 0,
    quantity            INT             NOT NULL    DEFAULT 0,
    categoryId          INT             NOT NULL,
    brandId             INT             NOT NULL,
    discount            DECIMAL(3, 2)   NOT NULL    DEFAULT 0,
    discountStart       DATETIME,
    discountEnd         DATETIME,
    rating              DECIMAL(3, 1)   NOT NULL    DEFAULT 0,
    numberOfRatings     INT             NOT NULL    DEFAULT 0,
    active              BOOL            NOT NULL    DEFAULT 1,

    CONSTRAINT pk_product PRIMARY KEY (id),
    CONSTRAINT fk_product_category FOREIGN KEY (categoryId) REFERENCES category(id),
    CONSTRAINT fk_product_brand FOREIGN KEY (brandId) REFERENCES brand(id),
    CONSTRAINT chk_product CHECK (quantity >= 0 AND discount >= 0)
);

-- ==================== PRODUCT IMAGE
CREATE TABLE productImage (
    id              INT             AUTO_INCREMENT,
    productId       INT             NOT NULL,
    image           VARCHAR(255)    NOT NULL,

    CONSTRAINT pk_productImage PRIMARY KEY (id),
    CONSTRAINT fk_productImage_product FOREIGN KEY (productId) REFERENCES product(id)
);

-- ==================== PRODUCT COLOR SIZE
CREATE TABLE productColorSize (
    color           CHAR(6)         NOT NULL,
    size            VARCHAR(255)    NOT NULL,
    productId       INT             NOT NULL,
    colorName       VARCHAR(255)    NOT NULL,
    quantity        INT             NOT NULL    DEFAULT 0,
    unitPrice       INT             NOT NULL    DEFAULT 0,

    CONSTRAINT pk_productColor PRIMARY KEY (color, size, productId),
    CONSTRAINT fk_productColor_product FOREIGN KEY (productId) REFERENCES product(id)
);

-- ==================== USER
CREATE TABLE user (
    id              INT                 AUTO_INCREMENT,
    fullName        VARCHAR(255),
    email           VARCHAR(255)        UNIQUE      NOT NULL,
    password        CHAR(64)            NOT NULL,
    address         VARCHAR(255)        NOT NULL,
    phone           VARCHAR(20)         NOT NULL,
    avatar          VARCHAR(255),
    role            VARCHAR(5)          NOT NULL    DEFAULT 'user',

    CONSTRAINT pk_user PRIMARY KEY (id)
);

-- ==================== USER ORDER
CREATE TABLE userOrder (
    id              INT             AUTO_INCREMENT,
    userId          INT             NOT NULL,
    orderTime       DATETIME        NOT NULL        DEFAULT CURRENT_TIMESTAMP,
    total           INT             NOT NULL        DEFAULT 0,
    status          VARCHAR(32)     NOT NULL        DEFAULT 'pending',

    CONSTRAINT pk_userOrder PRIMARY KEY (id),
    CONSTRAINT pk_userOrder_user FOREIGN KEY (userId) REFERENCES user(id),
    CONSTRAINT chk_userOrder CHECK (total >= 0 AND status IN (
        "pending",
        "processing",
        "delivering",
        "canceled",
        "delivered"
    ))
);

-- ==================== ORDER DETAIL
CREATE TABLE orderDetail (
    orderId         INT             NOT NULL,
    color           CHAR(6)         NOT NULL,
    size            VARCHAR(255)    NOT NULL,
    productId       INT             NOT NULL,
    quantity        INT             NOT NULL,
    discount        DECIMAL(4, 2)   NOT NULL    DEFAULT 0,
    price           INT             DEFAULT 0,

    CONSTRAINT pk_orderDetail PRIMARY KEY (orderId, productId),
    CONSTRAINT fk_orderDetail_userOrder FOREIGN KEY (orderId) REFERENCES userOrder(id),
    CONSTRAINT fk_orderDetail_productColorSize FOREIGN KEY (color, size, productId) REFERENCES productColorSize(color, size, productId),
    CONSTRAINT chk_orderDetail CHECK (quantity > 0 AND price >= 0)
);

-- ==================== CART
CREATE TABLE cart (
    userId          INT             NOT NULL,
    color           CHAR(6)         NOT NULL,
    size            VARCHAR(255)    NOT NULL,
    productId       INT             NOT NULL,
    quantity        INT             NOT NULL    DEFAULT 1,

    CONSTRAINT pk_cart PRIMARY KEY (userId, color, size, productId),
    CONSTRAINT fk_cart_user FOREIGN KEY (userId) REFERENCES user(id),
    CONSTRAINT fk_cart_productColorSize FOREIGN KEY (color, size, productId) REFERENCES productColorSize(color, size, productId),
    CONSTRAINT chk_cart CHECK (quantity > 0)
);

-- ==================== REVIEW
CREATE TABLE review (
    userId          INT             NOT NULL,
    productId       INT             NOT NULL,
    content         VARCHAR(255)    NOT NULL,
    rating          INT             NOT NULL,

    CONSTRAINT pk_review PRIMARY KEY (userId, productId),
    CONSTRAINT fk_review_user FOREIGN KEY (userId) REFERENCES user(id),
    CONSTRAINT fk_review_product FOREIGN KEY (productId) REFERENCES product(id),
    CONSTRAINT chk_review CHECK (rating >= 0 AND rating <= 5)
);


-- ==================== SALE
CREATE TABLE sale (
    productId       INT             NOT NULL,
    unitSold        INT             NOT NULL    DEFAULT 0,
    gross           INT             NOT NULL    DEFAULT 0,

    CONSTRAINT pk_sale PRIMARY KEY (productId),
    CONSTRAINT fk_sale_product FOREIGN KEY (productId) REFERENCES product(id)
);


-- ============================================================

--                           TRIGGER

-- ============================================================



-- ==================== INSERT PRODUCT

DELIMITER $$
CREATE TRIGGER trg_insert_product AFTER INSERT ON product
FOR EACH ROW
BEGIN
    INSERT INTO sale (productId) VALUES (NEW.id);
END;
$$



-- ==================== INSERT PRODUCT COLOR SIZE
DELIMITER $$
CREATE TRIGGER trg_insert_productColorSize AFTER INSERT ON productColorSize
FOR EACH ROW
BEGIN
    DECLARE v_unitPrice INT;

    SELECT MIN(unitPrice) INTO v_unitPrice
    FROM productColorSize
    WHERE productId = NEW.productId;

    UPDATE product
    SET quantity = quantity + NEW.quantity,
        unitPrice = v_unitPrice
    WHERE id = NEW.productId;
END;
$$


-- ==================== UPDATE PRODUCT COLOR SIZE
CREATE TRIGGER trg_update_productColorSize AFTER UPDATE ON productColorSize
FOR EACH ROW
BEGIN
    DECLARE v_unitPrice INT;

    SELECT MIN(unitPrice) INTO v_unitPrice
    FROM productColorSize
    WHERE productId = NEW.productId;

    UPDATE product
    SET quantity = quantity + NEW.quantity - OLD.quantity,
        unitPrice = v_unitPrice
    WHERE id = NEW.productId;
END;
$$
DELIMITER ;


-- ==================== INSERT ORDER DETAIL
DELIMITER $$
CREATE TRIGGER trg_insert_orderDetail BEFORE INSERT ON orderDetail
FOR EACH ROW
BEGIN
    DECLARE v_unitPrice INT;
    DECLARE v_discountStart TIMESTAMP;
    DECLARE v_discountEnd TIMESTAMP;
    DECLARE v_discount DECIMAL(4, 2);
    
    -- update discount and price of order detail
    SELECT cs.unitPrice, p.discount, p.discountStart, p.discountEnd INTO v_unitPrice, v_discount, v_discountStart, v_discountEnd
    FROM productColorSize AS cs,
        product AS p
    WHERE p.id = cs.productId AND
        p.id = NEW.productId AND
        cs.color = NEW.color AND
        cs.size = NEW.size;

    IF CURRENT_TIMESTAMP() > v_discountEnd OR CURRENT_TIMESTAMP() < v_discountStart THEN
        SET v_discount = 0;
    END IF;

    SET NEW.discount = v_discount;
    SET NEW.price = v_unitPrice * NEW.quantity * (1 - v_discount);
    

    -- update inventory
    UPDATE productColorSize
    SET quantity = quantity - NEW.quantity
    WHERE productId = NEW.productId AND
        color = NEW.color AND
        size = NEW.size;


    -- update user order
    UPDATE userOrder
    SET total = total + NEW.price
    WHERE id = NEW.orderId;

    -- update sale
    UPDATE sale
    SET unitSold = unitSold + NEW.quantity,
        gross = gross + NEW.price
    WHERE productId = NEW.productId;
END;
$$
DELIMITER ;


-- ==================== INSERT REVIEW
DELIMITER $$
CREATE TRIGGER trg_add_review AFTER INSERT ON review
FOR EACH ROW
BEGIN
    DECLARE var_rating DECIMAL(3, 1);
    DECLARE var_numberOfRatings INT;
    DECLARE var_totalRating INT;
    
    SELECT rating, numberOfRatings, rating * numberOfRatings INTO var_rating, var_numberOfRatings, var_totalRating FROM product WHERE id = NEW.productId;

    SET var_numberOfRatings = var_numberOfRatings + 1;
    SET var_totalRating = var_totalRating + NEW.rating;
    SET var_rating = var_totalRating / var_numberOfRatings;

    UPDATE product
    SET rating = var_rating,
        numberOfRatings = var_numberOfRatings
    WHERE id = NEW.productId;
END;
$$
DELIMITER ;



-- ============================================================

--                          PROCEDURE

-- ============================================================




-- ==================== SELECT ALL PRODUCTS ADMIN
DELIMITER $$
CREATE PROCEDURE pcd_selectAllProductsAdmin ()
BEGIN
    SELECT p.id, p.name, p.unitPrice, p.description, p.quantity, s.unitSold, c.name AS categoryName,
    (SELECT image FROM productImage WHERE productimage.productId = p.id LIMIT 1) AS image
    FROM product AS p, sale AS s, category AS c
    WHERE p.categoryId = c.id AND p.id = s.productId;
END;
$$
DELIMITER ;

-- ==================== INSERT USER
DELIMITER $$
CREATE PROCEDURE pcd_createUser (
    IN i_fullName VARCHAR(255),
    IN i_email VARCHAR(255),
    IN i_password CHAR(64)
)
BEGIN
    DECLARE v_exist INT;
    SELECT COUNT(*) INTO v_exist FROM user WHERE email = i_email;
    IF v_exist > 0 THEN
        SELECT 0 AS id;
    ELSE
        BEGIN
            INSERT INTO user (fullName, email, password) VALUES (i_fullName, i_email, i_password);
            SELECT LAST_INSERT_ID() AS id;
        END;
    END IF;
END;
$$
DELIMITER ;


-- ==================== SELECT USER
DELIMITER $$
CREATE PROCEDURE pcd_selectUserWithCredentials (
    IN i_email VARCHAR(255),
    IN i_password CHAR(64)
)
BEGIN
    SELECT * FROM user WHERE email = i_email AND password = i_password;
END;
$$
DELIMITER ;



-- ==================== SELECT USER ORDER, ROLE = ADMIN
DELIMITER $$
CREATE PROCEDURE pcd_selectUserOrderAdmin ()
BEGIN
    SELECT userOrder.*, user.fullName
    FROM user, userOrder
    WHERE user.id = userOrder.userId;
END;
$$
DELIMITER ;


-- ==================== SELECT USER ORDER, ROLE = ADMIN
DELIMITER $$
CREATE PROCEDURE pcd_selectOrderDetailAdmin (
    IN i_orderID INT
)
BEGIN
    SELECT orderDetail.*, product.name, productColorSize.colorName
    FROM orderDetail, product, productColorSize
    WHERE orderDetail.orderId = i_orderID AND
        orderDetail.color = productColorSize.color AND
        orderDetail.size = productColorSize.size AND
        orderDetail.productId = productColorSize.productId AND
        orderDetail.productId = product.id
        ;
END;
$$
DELIMITER ;


-- ==================== INSERT REVIEW
DELIMITER $$
CREATE PROCEDURE pcd_createReview (
    IN i_userId INT,
    IN i_productId INT,
    IN i_content VARCHAR(255),
    IN i_rating INT
)
BEGIN
    INSERT INTO review (userId, productId, content, rating) VALUES (i_userId, i_productId, i_content, i_rating);
    SELECT 1 AS result;
END;
$$
DELIMITER ;


-- ==================== INSERT CART
DELIMITER $$
CREATE PROCEDURE pcd_addCart (
    IN i_userId INT,
    IN i_color CHAR(6),
    IN i_size VARCHAR(255),
    IN i_productId INT,
    IN i_quantity INT
)
BEGIN
    DECLARE v_exist INT;
    DECLARE v_quantity INT;
    SELECT COUNT(*) INTO v_exist
    FROM cart
    WHERE userId = i_userId AND
        color = i_color AND
        size = i_size AND
        productId = i_productId;
    
    IF v_exist > 0 THEN
        UPDATE cart
        SET quantity = quantity + i_quantity
        WHERE userId = i_userId AND productId = i_productId;
    
    ELSE
        INSERT INTO cart (userId, color, size, productId, quantity)
        VALUES (i_userId, i_color, i_size, i_productId, i_quantity);
    
    END IF;
    SELECT 1 AS result;
END;
$$
DELIMITER ;


-- ==================== UPDATE CART
DELIMITER $$
CREATE PROCEDURE pcd_updateCart (
    IN i_userId INT,
    IN i_color CHAR(6),
    IN i_size VARCHAR(255),
    IN i_productId INT,
    IN i_quantity INT
)
BEGIN
    DECLARE v_exist INT;
    SELECT COUNT(*) INTO v_exist FROM cart WHERE userId = i_userId AND productId = i_productId;
    IF v_exist > 0 THEN
        BEGIN
            UPDATE cart
            SET quantity = i_quantity
            WHERE userId = i_userId AND
                color = i_color AND
                size = i_size AND
                productId = i_productId;

            SELECT 1 AS result;
        END;
    ELSE
        SELECT 0 AS result;
    END IF;
END;
$$
DELIMITER ;


-- ==================== INSERT USER, ROLE = ADMIN
DELIMITER $$
CREATE PROCEDURE pcd_createAdmin (
    IN i_fullName VARCHAR(255),
    IN i_email VARCHAR(255),
    IN i_password CHAR(64)
)
BEGIN
    DECLARE v_exist INT;
    SELECT COUNT(*) INTO v_exist FROM user WHERE email = i_email AND role = "admin";
    IF v_exist > 0 THEN
        SELECT 0 AS id;
    ELSE
        BEGIN
            INSERT INTO user (fullName, email, password, role) VALUES (i_fullName, i_email, i_password, "admin");
            SELECT LAST_INSERT_ID() AS id;
        END;
    END IF;
END;
$$
DELIMITER ;





-- ============================================================

--                             INSERT

-- ============================================================



-- ==================== CATEGORY
INSERT INTO category (name) VALUES
("RAM & ROM"),              ("SSD & HDD"),              ("Màn hình PC"),
("Headphone"),              ("Card màn hình"),          ("Bàn phím máy tính"),
("Chuột"),                  ("Khác");



-- ==================== BRAND
INSERT INTO brand (name) VALUES
("Corsair"),                ("Kingston"),               ("WD Blue"),
("PHILIPS"),                ("KOORUI"),                 ("Sceptre"),
("Sony"),                   ("Bose"),                   ("JBL"),
("Skullcandy"),             ("MSI"),                    ("ZOTAC"),
("SteelSeries"),            ("8Bitdo"),                 ("Razer"),
("Redragon"),               ("Thermaltake"),            ("KLIM Cyclone");



-- ==================== PRODUCT
INSERT INTO product (name, description, categoryId, brandId) VALUES
("Ram Corsair Dominator Platinum RGB 3200", "", 1, 1),
("Ram Corsair Vengeance RGB 5600 DDR5", "", 1, 1),
("RAM Kingston Fury Beast RGB bus 5600 DDR5", "", 1, 2),

("Ổ Cứng SSD WD Blue SN570 M.2 NVMe PCIe Gen3", "", 2, 3),
("Ổ Cứng SSD WD Blue SN580 M.2 NVMe PCIe Gen4", "", 2, 3),

("Màn hình PHILIPS 22 inch",
"Màn hình PHILIPS 22 inch, độ phân giải Full HD mỏng (1920 x 1080) 75Hz \
- Hỗ trợ VESA, cổng HDMI & VGA - Bảo hành 4 năm đổi mới nhanh chóng \
- Mã sản phẩm 221V8LN.", 3, 4),
("Màn hình LED Sceptre 22 inch",
"Màn hình LED Sceptre 22 inch, độ phân giải 1080P, tần số làm mới 75Hz, \
màu sắc 99% sRGB - HDMI X2, VGA, Loa tích hợp, Màu Đen (Dòng sản phẩm \
E225W-19203R).", 3, 6),
("Màn hình máy tính KOORUI 22 inch",
"Màn hình máy tính KOORUI 22 inch, Hiển thị FHD 1080P, Tần số làm mới \
75Hz, Viền siêu mỏng/Chăm sóc mắt/Nghiêng Ergonomic, Cổng HDMI VGA, \
Màn hình LED cho PC, Hỗ trợ VESA Mounting.", 3, 5),

("Tai nghe không dây chống ồn Sony WH-CH720N",
"Tai nghe không dây chống ồn Sony WH-CH720N Bluetooth, tai nghe đeo qua \
tai với microphone và tích hợp trợ lý ảo Alexa, màu Đen Mới.", 4, 7),
("Tai nghe không dây chống ồn Bose QuietComfort",
"Tai nghe không dây chống ồn Bose QuietComfort mới, tai nghe Bluetooth qua\
tai với thời lượng pin lên đến 24 giờ, màu Trắng Hơi.", 4, 8),
("Tai nghe không dây chống ồn JBL Tune Buds",
"Tai nghe không dây chống ồn JBL Tune Buds - Màu Đen, kích thước nhỏ.", 4, 9),
("Tai nghe không dây in-ear Skullcandy Grind",
"Tai nghe không dây in-ear Skullcandy Grind, pin 40 giờ, tích hợp Skull-iQ, hỗ trợ Alexa, \
microphone, tương thích với iPhone, Android và các thiết bị Bluetooth - \
Màu Xanh Đậm/ Xanh Lá.", 4, 10),

("MSI GeForce RTX 4060 Ti Gaming",
"Thẻ đồ họa MSI GeForce RTX 4060 Ti Gaming X 8G - GPU RTX 4060 Ti, \
8GB GDDR6 (18Gbps/128-bit), PCIe 4.0 - Twin FROZR 9 (2 quạt TORX Fan 5.0), \
RGB - HDMI 2.1, DisplayPort 1.4a.", 5, 11),
("ZOTAC Gaming GeForce RTX 4060 Ti 16GB AMP DLSS 3",
"Thẻ đồ họa chơi game ZOTAC Gaming GeForce RTX 4060 Ti 16GB AMP DLSS 3 \
- 16GB GDDR6 128-bit 18 Gbps PCIe 4.0, thẻ đồ họa chơi game nhỏ gọn, \
Hệ thống làm mát IceStorm 2.0 tiên tiến, Đèn RGB Spectra, Mã sản phẩm \
ZT-D40620F-10M.", 5, 12),

("SteelSeries USB Apex 5",
"Bàn phím chơi game cơ học kỹ thuật số SteelSeries USB Apex 5 - \
Đèn nền RGB từng phím - Khung hợp kim nhôm cấp máy bay - Màn hình \
thông minh OLED (Switch màu Blue kết hợp).", 6, 13),
("Bàn phím cơ học Retro 8Bitdo",
"Bàn phím cơ học Retro 8Bitdo, Kết nối Bluetooth/2.4G/USB-C, \
có thể thay đổi nhanh chóng, với 87 phím, Hai nút siêu có thể lập \
trình cho Windows và Android - Phiên bản N.", 6, 14),

("Chuột chơi game Razer DeathAdder Essential",
"Chuột chơi game Razer DeathAdder Essential: Cảm biến quang học 6400 DPI\
- 5 nút có thể lập trình - Công tắc cơ học - Lớp lót bên hông bằng cao su\
- Màu Đen Cổ điển.).", 7, 15),
("Chuột chơi game quang học RGB Redragon M711 Cobra",
"Chuột chơi game quang học RGB Redragon M711 Cobra - Màu Đen.", 7, 16),

("Thermaltake Massive 14",
"Thermaltake Massive 14 - Gối tản nhiệt cho laptop/notebook có lưới \
thép và hai quạt LED màu xanh 140mm, có thể điều chỉnh tốc độ, dành \
cho laptop/notebook kích thước từ 10 đến 17 inch, mã sản phẩm \
CL-N001-PL14BU-A, màu Đen.", 8, 17),
("Gối tản nhiệt KLIM Cyclone",
"Gối tản nhiệt KLIM Cyclone cho laptop với 5 quạt êm dịu - Mới 2023 \
- Gối tản nhiệt dành cho laptop chơi game - Chân đế laptop ổn định với \
quạt - Tương thích với laptop đến 17 inch - Bảo hành 5 năm - Hỗ trợ PC, \
Mac, PS5, PS4, Xbox One - Màu Đen Xanh.", 8, 18);



-- ==================== PRODUCT IMAGE
INSERT INTO productImage (productId, image) VALUES
(1, "https://product.hstatic.net/200000722513/product/orsair-dominator-platinum-rgb-white-2_de089f0593aa4b429c6da5e07e53b9f3_c5132186088045dcb50903c233d4b3c7_grande.png"),
(1, "https://product.hstatic.net/200000722513/product/orsair-dominator-platinum-rgb-white-7_fecfa72ce1e24dac95f2f375996f5d07_c9f60bbc003f4daf8182be508509189c_grande.png"),
(1, "https://product.hstatic.net/200000722513/product/3000c15_gallery_dominator_plat_rgb_03_7085fc2a5db848dbaf8979840303bcfd_e2d8a4320516498e821eb327699c84d4_grande.png"),
(1, "https://product.hstatic.net/200000722513/product/3000c15_gallery_dominator_plat_rgb_04_a6ba98dadac74f0297b96b716227648e_c81bf28ed39e4cb1a72457f5a5700ebb_grande.png"),


(2, "https://product.hstatic.net/200000722513/product/1b_d55b96e7b5314601a6c9c877e1c606ec_large_405b5da5871c4d2aad42aa59665cfe6e_grande.png"),
(2, "https://product.hstatic.net/200000722513/product/w1_f98b77de451b4c32b638c2328aaa355a_3d9669737097494c84e6255e28c81ed3_grande.png"),
(2, "https://product.hstatic.net/200000722513/product/w2_ecb655e2a6fb4c48a0f533d41773e1cc_1fd2816b2cc7492baa7d501b80e39492_grande.png"),


(3, "https://product.hstatic.net/200000722513/product/kt_49b1ddec1a7b444a9d2430e29064129a_f7d8664e0aa344188d76e40d712fa43b_grande.jpg"),
(3, "https://product.hstatic.net/200000722513/product/kt1_c2676a6e8ecb43eba4453ad7b2b5afc8_f5006f8bf0cc4dca9cd33ae4655aa23a_grande.jpg"),
(3, "https://product.hstatic.net/200000722513/product/t-memory-beast-ddr5-rgb-kit-of-2-3-lg_0042fcded1cb45cd9295ed103465c384_3ac96153736942ec92d18251ed897674_grande.png"),



(4, "https://product.hstatic.net/200000722513/product/wd_blue_sn570_250gb_ww_adobe_front_hr_f744c65a15044372942307877fbf464a_5c4abd5d032745daaeb5b84bd4d7f17f_grande.jpg"),
(4, "https://product.hstatic.net/200000722513/product/wd_blue_sn570_500g_ww_front_lr__1__20ec0c2bae4a4bf4a65bc08a59eb6f8d_1ce29e8a28f34f78974c6f358ee24bdd_grande.jpg"),
(4, "https://product.hstatic.net/200000722513/product/wd_blue_sn570_1tb_ww_front_hr__1__9d53d75557054e80b706ad367d557946_05bf857e910947fe8afb87ed1d214a9a_grande.jpg"),


(5, "https://product.hstatic.net/200000722513/product/77071_o_cung_ssd_wd_sn580_blue_m_142e515e8ca44a6eb9c032964c96bf53_grande.png"),
(5, "https://product.hstatic.net/200000722513/product/77071_o_cung_ssd_wd_sn580_blue_m_d5ea5db2013245f0bfea6ec5dc117dc5_grande.png"),
(5, "https://product.hstatic.net/200000722513/product/77071_o_cung_ssd_wd_sn580_blue_m_dc7afa833968484dae8491462dd7e535_grande.png"),



(6, "https://m.media-amazon.com/images/I/71iMPr0C8KL._AC_SL1500_.jpg"),
(6, "https://m.media-amazon.com/images/I/71WQh5q3egL._AC_SL1500_.jpg"),
(6, "https://m.media-amazon.com/images/I/61reta-rn-L._AC_SL1500_.jpg"),



(7, "https://m.media-amazon.com/images/I/61k5baRnzTL._AC_SL1333_.jpg"),
(7, "https://m.media-amazon.com/images/I/61k5baRnzTL._AC_SL1333_.jpg"),
(7, "https://m.media-amazon.com/images/I/71NFfDMiLDL._AC_SL1500_.jpg"),


(8, "https://m.media-amazon.com/images/I/71RWUesV7ML._AC_SL1500_.jpg"),
(8, "https://m.media-amazon.com/images/I/714z8ISqjrL._AC_SL1500_.jpg"),
(8, "https://m.media-amazon.com/images/I/71pdLz+gPYL._AC_SL1500_.jpg"),


(9, "https://m.media-amazon.com/images/I/51rpbVmi9XL._AC_SL1200_.jpg"),
(9, "https://m.media-amazon.com/images/I/81L8FJQd5nL._AC_SL1500_.jpg"),
(9, "https://m.media-amazon.com/images/I/91hx2gnY0qL._AC_SL1500_.jpg"),


(10, "https://m.media-amazon.com/images/I/51K77J9rCjL._AC_SL1500_.jpg"),
(10, "https://m.media-amazon.com/images/I/51PDgdXX27L._AC_SL1500_.jpg"),
(10, "https://m.media-amazon.com/images/I/71ygziUmnWL._AC_SL1500_.jpg"),


(11, "https://m.media-amazon.com/images/I/51EZig0rEAL._AC_SL1500_.jpg"),
(11, "https://m.media-amazon.com/images/I/41Qo8Cps+JL._AC_SL1500_.jpg"),
(11, "https://m.media-amazon.com/images/I/41dJUFOoWbL._AC_SL1500_.jpg"),



(12, "https://m.media-amazon.com/images/I/51rtZPimkBL._AC_SL1000_.jpg"),
(12, "https://m.media-amazon.com/images/I/719PhpYz2qL._AC_SL1500_.jpg"),
(12, "https://m.media-amazon.com/images/I/81iItGAGS1L._AC_SL1500_.jpg"),



(13, "https://m.media-amazon.com/images/I/81Wyk9kS01L._AC_SL1500_.jpg"),
(13, "https://m.media-amazon.com/images/I/81ehPKjp0bL._AC_SL1500_.jpg"),
(13, "https://m.media-amazon.com/images/I/71HlIc1QxpL._AC_SL1500_.jpg"),



(14, "https://m.media-amazon.com/images/I/8153eBeVpQL._AC_SL1500_.jpg"),
(14, "https://m.media-amazon.com/images/I/61sMPkaGRwL._AC_SL1500_.jpg"),
(14, "https://m.media-amazon.com/images/I/6127JUdSB0L._AC_SL1500_.jpg"),



(15, "https://m.media-amazon.com/images/I/81yd9W+0doL._AC_SX425_.jpg"),
(15, "https://m.media-amazon.com/images/I/81QEX6i2K-L._AC_SL1500_.jpg"),
(15, "https://m.media-amazon.com/images/I/71NmdYbd0mL._AC_SL1500_.jpg"),



(16, "https://m.media-amazon.com/images/I/71yE77UAvxL._AC_SL1500_.jpg"),
(16, "https://m.media-amazon.com/images/I/61m5pXHc+6L._AC_SL1500_.jpg"),
(16, "https://m.media-amazon.com/images/I/41GeN4Kf0LL._AC_SL1500_.jpg"),



(17, "https://m.media-amazon.com/images/I/8189uwDnMkL._AC_SL1500_.jpg"),
(17, "https://m.media-amazon.com/images/I/61Vbk62PIjS._AC_SL1500_.jpg"),
(17, "https://m.media-amazon.com/images/I/61V3921F10S._AC_SL1500_.jpg"),



(18, "https://m.media-amazon.com/images/I/61mPlkAdz5L._AC_SL1500_.jpg"),
(18, "https://m.media-amazon.com/images/I/71vG4lOufkL._AC_SL1500_.jpg"),
(18, "https://m.media-amazon.com/images/I/71sjT9o51iL._AC_SL1500_.jpg"),



(18, "https://m.media-amazon.com/images/I/51qo9uGyWiL._AC_US40_.jpg"),
(18, "https://m.media-amazon.com/images/I/51Rkv4PP70L._AC_US40_.jpg"),
(18, "https://m.media-amazon.com/images/I/41VIzELZxSL._AC_US40_.jpg"),



(19, "https://m.media-amazon.com/images/I/919B55ca9bL._AC_SL1500_.jpg"),
(19, "https://m.media-amazon.com/images/I/91uSrd3PBKL._AC_SL1500_.jpg"),
(19, "https://m.media-amazon.com/images/I/61g+xe5SMsL._AC_SL1500_.jpg"),



(20, "https://m.media-amazon.com/images/I/71GYwojJXzL._AC_SL1500_.jpg"),
(20, "https://m.media-amazon.com/images/I/71n6KdB8SnL._AC_SL1500_.jpg"),
(20, "https://m.media-amazon.com/images/I/71lrXNvcf3L._AC_SL1500_.jpg");





-- ==================== PRODUCT COLOR SIZE
INSERT INTO productColorSize (color, size, productId, colorName, quantity, unitPrice) VALUES
("000000", "16GB (2x8GB)", 1, "Black", 10, 3790000),
("FFFFFF", "16GB (2x8GB)", 1, "White", 10, 3790000),
("FFFFFF", "32GB (2x16GB)", 1, "White", 10, 6000000),


("000000", "32GB (2x16GB)", 2, "Black", 10, 5790000),
("FFFFFF", "32GB (2x16GB)", 2, "White", 10, 5790000),


("000000", "16GB (2x8GB)", 3, "Black", 10, 3190000),
("000000", "32GB (2x16GB)", 3, "Black", 10, 6190000),
("000000", "64GB (2x32GB)", 3, "Black", 10, 14990000),


("0000FF", "250 GB", 4, "Blue", 10, 1190000),
("0000FF", "500 GB", 4, "Blue", 10, 1450000),
("0000FF", "1 TB", 4, "Blue", 10, 1690000),


("0000FF", "250 GB", 5, "Blue", 10, 1290000),
("0000FF", "500 GB", 5, "Blue", 10, 1790000),
("0000FF", "1 TB", 5, "Blue", 10, 2290000),


("0000FF", "Apax 3", 6, "Blue", 10, 1490000),
("0000FF", "Apex 3 TKL", 6, "Blue", 10, 1690000),
("0000FF", "Apex 5", 6, "Blue", 10, 2100000),


("000000", "Hex 3", 7, "Red", 10, 1310000),
("000000", "Hex 3 XK", 7, "Red", 10, 1520000),
("000000", "Hex 5", 7, "Red", 10, 3190000),


("0000FF", "XK1", 8, "Black", 10, 650000),
("0000FF", "XK11", 8, "Black", 10, 820000),
("0000FF", "XK21", 8, "Black", 10, 1500000),


("0000FF", "ML 21X", 9, "Blue", 10, 1200000),
("0000FF", "ML 23X", 9, "Blue", 10, 1340000),
("0000FF", "ML 32A", 9, "Blue", 10, 1710000),


("0000FF", "PX 20", 10, "White", 10, 12090000),
("0000FF", "PX 20S", 10, "White", 10, 17090000),
("0000FF", "PS 20AS", 10, "White", 10, 22100000),


("0000FF", "AL 1A", 11, "Blue", 10, 13450000),
("0000FF", "AL 2S", 11, "Blue", 10, 15450000),
("0000FF", "AL 4S", 11, "Blue", 10, 24940000),


("0000FF", "H10 A2", 12, "Black", 10, 19280000),
("0000FF", "H10 A3", 12, "Black", 10, 23920000),
("0000FF", "H10 A4", 12, "Black", 10, 25020000),


("0000FF", "G20X", 13, "Blue", 10, 16350000),
("0000FF", "G3 49A", 13, "Blue", 10, 18290000),
("0000FF", "G3 55A", 13, "Blue", 10, 25690000),


("0000FF", "RTX 3090 TI", 14, "Blue", 10, 22500000),
("0000FF", "RTX 4090 TI", 14, "Blue", 10, 32909000),
("0000FF", "RTX 4090", 14, "Blue", 10, 40905000),


("0000FF", "JB 50L", 15, "Blue", 10, 6290000),
("0000FF", "JB 70L", 15, "Blue", 10, 7590000),
("0000FF", "JB 80B", 15, "Blue", 10, 9690000),


("0000FF", "BO B8K", 16, "Blue", 10, 2697000),
("0000FF", "BO B8XS", 16, "Blue", 10, 3190000),
("0000FF", "BO B12A", 16, "Blue", 10, 5295000),


("0000FF", "LO39", 17, "Blue", 10, 2890000),
("0000FF", "LO45", 17, "Blue", 10, 2990000),
("0000FF", "LO20X", 17, "Blue", 10, 3130000),


("0000FF", "WE20", 18, "Blue", 10, 4790000),
("0000FF", "WE40", 18, "Blue", 10, 6120000),
("0000FF", "WE203", 18, "Blue", 10, 9256000),


("0000FF", "GA 29T", 19, "Blue", 10, 890000),
("0000FF", "GA 90T", 19, "Blue", 10, 1290000),
("0000FF", "GAXM", 19, "Blue", 10, 2590000),


("0000FF", "Q20M", 20, "Blue", 10, 1320000),
("0000FF", "Q20X", 20, "Blue", 10, 1890000),
("0000FF", "Q302A", 20, "Blue", 10, 2720000);





-- ==================== USER
INSERT INTO user (fullName, email, password, role) VALUES
("Admin", "admin@gmail.com", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", "admin");

INSERT INTO user (fullName, email, password) VALUES
("User 1", "user1@gmail.com", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"),
("User 2", "user2@gmail.com", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"),
("User 3", "user3@gmail.com", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");



-- ==================== USER ORDER
INSERT INTO userOrder (userId, orderTime) VALUES
(2, NOW()),
(2, 20231214150603),
(3, 20231214151803);


-- ==================== ORDER DETAIL
INSERT INTO orderDetail (orderId, color, size, productId, quantity) VALUES
(1, "000000", "16GB (2x8GB)", 1, 2), (1, "FFFFFF", "32GB (2x16GB)", 2, 2), (1, "000000", "32GB (2x16GB)", 3, 1),
(2, "000000", "16GB (2x8GB)", 1, 3), (2, "FFFFFF", "32GB (2x16GB)", 2, 1),
(3, "0000FF", "1 TB", 4, 1);
