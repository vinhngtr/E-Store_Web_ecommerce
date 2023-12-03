DROP DATABASE IF EXISTS store;
CREATE DATABASE store;
USE store;

-- ==================================================
-- CATEGORY
-- ==================================================

-- DROP TABLE IF EXISTS category;
CREATE TABLE category (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    active BOOL NOT NULL DEFAULT 1,

    CONSTRAINT pk_category PRIMARY KEY (id)
);

INSERT INTO category (name) VALUES ("RAM & ROM");
INSERT INTO category (name) VALUES ("SSD & HDD");
INSERT INTO category (name) VALUES ("Monitor");
INSERT INTO category (name) VALUES ("Headphone");
INSERT INTO category (name) VALUES ("GPU");
INSERT INTO category (name) VALUES ("Keyboard");
INSERT INTO category (name) VALUES ("Mouse");
INSERT INTO category (name) VALUES ("Other");

-- ==================================================
-- BRAND
-- ==================================================

-- DROP TABLE IF EXISTS brand;
CREATE TABLE brand (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    active BOOL NOT NULL DEFAULT 1,

    CONSTRAINT pk_brand PRIMARY KEY (id)
);

INSERT INTO brand (name) VALUES ("Corsair");
INSERT INTO brand (name) VALUES ("Kingston");

INSERT INTO brand (name) VALUES ("WD");
INSERT INTO brand (name) VALUES ("Seagate");

INSERT INTO brand (name) VALUES ("Asus");
INSERT INTO brand (name) VALUES ("LG");

INSERT INTO brand (name) VALUES ("Sony");
INSERT INTO brand (name) VALUES ("Lenovo");

INSERT INTO brand (name) VALUES ("Gigabyte");
INSERT INTO brand (name) VALUES ("NVIDIA");

INSERT INTO brand (name) VALUES ("DareU");
INSERT INTO brand (name) VALUES ("Akko");

INSERT INTO brand (name) VALUES ("Logitech");
INSERT INTO brand (name) VALUES ("Havit");

INSERT INTO brand (name) VALUES ("Xiaomi");
INSERT INTO brand (name) VALUES ("SanDisk");

-- ==================================================
-- PRODUCT
-- ==================================================

-- DROP TABLE IF EXISTS product;
CREATE TABLE product (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    unitPrice INT NOT NULL DEFAULT 0,
    quantity INT NOT NULL DEFAULT 0,
    categoryId INT NOT NULL,
    brandId INT NOT NULL,
    discount DECIMAL(3, 2) NOT NULL DEFAULT 0,
    discountStart DATETIME,
    discountEnd DATETIME,
    rating DECIMAL (3, 1) NOT NULL DEFAULT 0,
    numberOfRatings INT NOT NULL DEFAULT 0,
    active BOOL NOT NULL DEFAULT 1,

    CONSTRAINT pk_product PRIMARY KEY (id),
    CONSTRAINT fk_product_category FOREIGN KEY (categoryId) REFERENCES category(id),
    CONSTRAINT fk_product_brand FOREIGN KEY (brandId) REFERENCES brand(id),
    CONSTRAINT chk_product CHECK (quantity >= 0 AND discount >= 0)
);

-- ("RAM & ROM");
INSERT INTO product (name, description, categoryId, brandId) VALUES
("Ram Corsair Dominator Platinum RGB 3200", "", 1, 1),
("Ram Corsair Vengeance RGB 5600 DDR5", "", 1, 1),
("RAM Kingston Fury Beast RGB bus 5600 DDR5", "", 1, 2);

-- ("SSD & HDD");
-- INSERT INTO brand (name) VALUES ("Seagate");
-- INSERT INTO brand (name) VALUES ("WD");

INSERT INTO product (name, description, categoryId, brandId) VALUES
("Ổ Cứng SSD WD Blue SN570 M.2 NVMe PCIe Gen3", "", 2, 3),
("Ổ Cứng SSD WD Blue SN580 M.2 NVMe PCIe Gen4", "", 2, 3);

-- ("Monitor");
-- ("Headphone");
-- ("GPU");
-- ("Keyboard");
-- ("Mouse");
-- ("Other");


-- ==================================================
-- PRODUCT IMAGE
-- ==================================================

-- DROP TABLE IF EXISTS productImage;
CREATE TABLE productImage (
    id INT AUTO_INCREMENT,
    productId INT NOT NULL,
    image VARCHAR(255) NOT NULL,

    CONSTRAINT pk_productImage PRIMARY KEY (id),
    CONSTRAINT fk_productImage_product FOREIGN KEY (productId) REFERENCES product(id)
);

INSERT INTO productImage (productId, image) VALUES
(1, "https://product.hstatic.net/200000722513/product/orsair-dominator-platinum-rgb-white-2_de089f0593aa4b429c6da5e07e53b9f3_c5132186088045dcb50903c233d4b3c7_grande.png"),
(1, "https://product.hstatic.net/200000722513/product/orsair-dominator-platinum-rgb-white-7_fecfa72ce1e24dac95f2f375996f5d07_c9f60bbc003f4daf8182be508509189c_grande.png"),
(1, "https://product.hstatic.net/200000722513/product/3000c15_gallery_dominator_plat_rgb_03_7085fc2a5db848dbaf8979840303bcfd_e2d8a4320516498e821eb327699c84d4_grande.png"),
(1, "https://product.hstatic.net/200000722513/product/3000c15_gallery_dominator_plat_rgb_04_a6ba98dadac74f0297b96b716227648e_c81bf28ed39e4cb1a72457f5a5700ebb_grande.png");

INSERT INTO productImage (productId, image) VALUES
(2, "https://product.hstatic.net/200000722513/product/1b_d55b96e7b5314601a6c9c877e1c606ec_large_405b5da5871c4d2aad42aa59665cfe6e_grande.png"),
(2, "https://product.hstatic.net/200000722513/product/w1_f98b77de451b4c32b638c2328aaa355a_3d9669737097494c84e6255e28c81ed3_grande.png"),
(2, "https://product.hstatic.net/200000722513/product/w2_ecb655e2a6fb4c48a0f533d41773e1cc_1fd2816b2cc7492baa7d501b80e39492_grande.png");

INSERT INTO productImage (productId, image) VALUES
(3, "https://product.hstatic.net/200000722513/product/kt_49b1ddec1a7b444a9d2430e29064129a_f7d8664e0aa344188d76e40d712fa43b_grande.jpg"),
(3, "https://product.hstatic.net/200000722513/product/kt1_c2676a6e8ecb43eba4453ad7b2b5afc8_f5006f8bf0cc4dca9cd33ae4655aa23a_grande.jpg"),
(3, "https://product.hstatic.net/200000722513/product/t-memory-beast-ddr5-rgb-kit-of-2-3-lg_0042fcded1cb45cd9295ed103465c384_3ac96153736942ec92d18251ed897674_grande.png");


INSERT INTO productImage (productId, image) VALUES
(4, "https://product.hstatic.net/200000722513/product/wd_blue_sn570_250gb_ww_adobe_front_hr_f744c65a15044372942307877fbf464a_5c4abd5d032745daaeb5b84bd4d7f17f_grande.jpg"),
(4, "https://product.hstatic.net/200000722513/product/wd_blue_sn570_500g_ww_front_lr__1__20ec0c2bae4a4bf4a65bc08a59eb6f8d_1ce29e8a28f34f78974c6f358ee24bdd_grande.jpg"),
(4, "https://product.hstatic.net/200000722513/product/wd_blue_sn570_1tb_ww_front_hr__1__9d53d75557054e80b706ad367d557946_05bf857e910947fe8afb87ed1d214a9a_grande.jpg");

INSERT INTO productImage (productId, image) VALUES
(5, "https://product.hstatic.net/200000722513/product/77071_o_cung_ssd_wd_sn580_blue_m_142e515e8ca44a6eb9c032964c96bf53_grande.png"),
(5, "https://product.hstatic.net/200000722513/product/77071_o_cung_ssd_wd_sn580_blue_m_d5ea5db2013245f0bfea6ec5dc117dc5_grande.png"),
(5, "https://product.hstatic.net/200000722513/product/77071_o_cung_ssd_wd_sn580_blue_m_dc7afa833968484dae8491462dd7e535_grande.png");


-- ==================================================
-- PRODUCT COLOR SIZE
-- ==================================================

-- DROP TABLE IF EXISTS productColor;
CREATE TABLE productColorSize (
    color CHAR(6) NOT NULL,
    size VARCHAR(255) NOT NULL,
    productId INT NOT NULL,
    colorName VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unitPrice INT NOT NULL DEFAULT 0,

    CONSTRAINT pk_productColor PRIMARY KEY (color, size, productId),
    CONSTRAINT fk_productColor_product FOREIGN KEY (productId) REFERENCES product(id)
);

DELIMITER $$
-- DROP TRIGGER IF EXISTS trg_add_productColorSize $$
CREATE TRIGGER trg_add_productColorSize BEFORE INSERT ON productColorSize
FOR EACH ROW
BEGIN
    DECLARE var_unitPrice INT;

    SELECT MIN(unitPrice) INTO var_unitPrice FROM productColorSize WHERE productId = NEW.productId;

    UPDATE product
    SET quantity = quantity + NEW.quantity,
        unitPrice = var_unitPrice
    WHERE id = NEW.productId;
END;
$$
DELIMITER ;

DELIMITER $$
-- DROP TRIGGER IF EXISTS trg_update_productColorSize $$
CREATE TRIGGER trg_update_productColorSize BEFORE UPDATE ON productColorSize
FOR EACH ROW
BEGIN
    DECLARE var_unitPrice INT;

    SELECT MIN(unitPrice) INTO var_unitPrice FROM productColorSize WHERE productId = NEW.productId;

    UPDATE product
    SET quantity = quantity + NEW.quantity - OLD.quantity,
        unitPrice = var_unitPrice
    WHERE id = NEW.productId;
END;
$$
DELIMITER ;

INSERT INTO productColorSize (color, size, productId, colorName, quantity, unitPrice) VALUES
("000000", "16GB (2x8GB)", 1, "Black", 10, 3790000),
("FFFFFF", "16GB (2x8GB)", 1, "White", 10, 3790000);

INSERT INTO productColorSize (color, size, productId, colorName, quantity, unitPrice) VALUES
("000000", "32GB (2x16GB)", 2, "Black", 10, 5790000),
("FFFFFF", "32GB (2x16GB)", 2, "White", 10, 5790000);

INSERT INTO productColorSize (color, size, productId, colorName, quantity, unitPrice) VALUES
("000000", "16GB (2x8GB)", 3, "Black", 10, 3190000),
("000000", "32GB (2x16GB)", 3, "Black", 10, 6190000),
("000000", "64GB (2x32GB)", 3, "Black", 10, 14990000);


INSERT INTO productColorSize (color, size, productId, colorName, quantity, unitPrice) VALUES
("0000FF", "250 GB", 4, "Blue", 10, 1190000),
("0000FF", "500 GB", 4, "Blue", 10, 1450000),
("0000FF", "1 TB", 4, "Blue", 10, 1690000);

INSERT INTO productColorSize (color, size, productId, colorName, quantity, unitPrice) VALUES
("0000FF", "250 GB", 5, "Blue", 10, 1290000),
("0000FF", "500 GB", 5, "Blue", 10, 1790000),
("0000FF", "1 TB", 5, "Blue", 10, 2290000);


-- ==================================================
-- USER
-- ==================================================

-- DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id INT AUTO_INCREMENT,
    fullName VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password CHAR(64) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    avatar VARCHAR(255),
    role VARCHAR(5) NOT NULL DEFAULT 'user',

    CONSTRAINT pk_user PRIMARY KEY (id)
);

-- INSERT INTO user (fullName, email, password, address, phone) VALUES
-- ("Nguyễn Trọng Vinh", "ntv@hcmut.edu.vn", "password", "Địa chỉ nhà của Vinh Nguyễn", "0123456789"),
-- ("Nguyễn Xuân Thọ", "nxt@hcmut.edu.vn", "password", "Địa chỉ nhà của Thọ Nguyễn", "0123456789"),
-- ("Trần Nguyễn PHương Thành", "tnpt@hcmut.edu.vn", "password", "Địa chỉ nhà của Thành Trần", "0123456789"),
-- ("Mạch Thanh Thuận", "mtt@hcmut.edu.vn", "password", "Địa chỉ nhà của Thuận Mạch", "0123456789");

-- INSERT INTO user (fullName, email, password, address, phone, role) VALUES
-- ("Admin", "admin@gmail.com", "password", "Địa chỉ shop", "0123456789", "admin");

-- ==================================================
-- USER ORDER
-- ==================================================

-- DROP TABLE IF EXISTS userOrder;
CREATE TABLE userOrder (
    id INT AUTO_INCREMENT,
    userId INT NOT NULL,
    orderTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total INT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',

    CONSTRAINT pk_userOrder PRIMARY KEY (id),
    CONSTRAINT pk_userOrder_user FOREIGN KEY (userId) REFERENCES user(id),
    CONSTRAINT chk_userOrder CHECK (total >= 0)
);

-- INSERT INTO userOrder (userId, orderTime) VALUES (1, CURRENT_TIMESTAMP());

-- ==================================================
-- ORDER DETAIL
-- ==================================================

-- DROP TABLE IF EXISTS orderDetail;
CREATE TABLE orderDetail (
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    discount DECIMAL(4, 2) NOT NULL DEFAULT 0,
    price INT DEFAULT 0,

    CONSTRAINT pk_orderDetail PRIMARY KEY (orderId, productId),
    CONSTRAINT fk_orderDetail_userOrder FOREIGN KEY (orderId) REFERENCES userOrder(id),
    CONSTRAINT fk_orderDetail_product FOREIGN KEY (productId) REFERENCES product(id),
    CONSTRAINT chk_orderDetail CHECK (quantity > 0 AND price >= 0)
);

DELIMITER $$
-- DROP TRIGGER IF EXISTS trg_add_orderDetail $$
CREATE TRIGGER trg_add_orderDetail BEFORE INSERT ON orderDetail
FOR EACH ROW
BEGIN
    DECLARE var_unitPrice INT;
    DECLARE var_discount DECIMAL(4, 2);
    
    SELECT unitPrice, discount INTO var_unitPrice, var_discount FROM product WHERE id = NEW.productId;

    UPDATE product
    SET quantity = quantity - NEW.quantity
    WHERE id = NEW.productId;

    SET NEW.discount = var_discount;
    SET NEW.price = var_unitPrice * NEW.quantity * (1 - var_discount);

    UPDATE userOrder
    SET total = total + NEW.price
    WHERE id = NEW.orderId;
END;
$$
DELIMITER ;

-- ==================================================
-- CART
-- ==================================================

-- DROP TABLE IF EXISTS cart;
CREATE TABLE cart (
    userId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,

    CONSTRAINT pk_cart PRIMARY KEY (userId, productId),
    CONSTRAINT fk_cart_user FOREIGN KEY (userId) REFERENCES user(id),
    CONSTRAINT fk_cart_product FOREIGN KEY (productId) REFERENCES product(id),
    CONSTRAINT chk_cart CHECK (quantity > 0)
);

-- ==================================================
-- REVIEW
-- ==================================================

-- DROP TABLE IF EXISTS review;
CREATE TABLE review (
    userId INT NOT NULL,
    productId INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    rating INT NOT NULL,

    CONSTRAINT pk_review PRIMARY KEY (userId, productId),
    CONSTRAINT fk_review_user FOREIGN KEY (userId) REFERENCES user(id),
    CONSTRAINT fk_review_product FOREIGN KEY (productId) REFERENCES product(id),
    CONSTRAINT chk_review CHECK (rating >= 0 AND rating <= 5)
);

DELIMITER $$
-- DROP TRIGGER IF EXISTS trg_add_review $$
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

-- INSERT INTO review (userId, productId, content, rating) VALUES
-- (1, 1, "Review 1", 5),
-- (2, 1, "Review 2", 3);