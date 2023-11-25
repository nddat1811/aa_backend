CREATE DATABASE IF NOT EXISTS test;

USE test;
SET NAMES utf8;
SET time_zone = '+08:00';
SET foreign_key_checks = 0;
SET sql_mode='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `code` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `images` VARCHAR(255),
  `origin` VARCHAR(255),
  `material` VARCHAR(255),
  `size` VARCHAR(255),
  `warranty` VARCHAR(255),
  `description` VARCHAR(255),
  `price` FLOAT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` BOOLEAN,
  `category_id` INT,
  `inventory_id` INT,
  `discount_id` INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `product_category`;
CREATE TABLE `product_category` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `code` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_at` timestamp NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` BOOLEAN NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `product_inventory`;
CREATE TABLE `product_inventory` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `quantity` INT,
  `created_at` timestamp NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` BOOLEAN
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `product_discount`;
CREATE TABLE `product_discount` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255),
  `description` VARCHAR(255),
  `active` BOOLEAN,
  `discount_percent` FLOAT,
  `created_at` timestamp NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `product_review`;
CREATE TABLE `product_review` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `product_id` INT,
  `user_id` INT,
  `parent_review` INT,
  `content` VARCHAR(255),
  `like` INT,
  `created_at` timestamp NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` BOOLEAN
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `role` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255),
  `password` VARCHAR(255),
  `phone` VARCHAR(255),
  `email` VARCHAR(255),
  `address` VARCHAR(255),
  `dob` TIMESTAMP,
  `last_login` TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_payment`;
CREATE TABLE `user_payment` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT,
  `payment_type` VARCHAR(255),
  `provider` VARCHAR(255),
  `account_no` VARCHAR(255),
  `expiry` TIMESTAMP,
  `is_default` BOOLEAN
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `transaction`;
CREATE TABLE `transaction` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT,
  `order_detail_id` INT,
  `type` SMALLINT NOT NULL,
  `mode` SMALLINT NOT NULL,
  `status` SMALLINT NOT NULL,
  `content` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `product_id` INT,
  `cart_id` INT,
  `quantity` INT,
  `price` FLOAT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `order_details`;
CREATE TABLE `order_details` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `order_id` INT,
  `user_id` INT,
  `total` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP,
  `product_id` INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT,
  `street` VARCHAR(255),
  `city` VARCHAR(255),
  `postal_code` VARCHAR(20),
  `is_default` BOOLEAN
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `product`
ADD FOREIGN KEY (`category_id`) REFERENCES `product_category`(`id`),
ADD FOREIGN KEY (`inventory_id`) REFERENCES `product_inventory`(`id`),
ADD FOREIGN KEY (`discount_id`) REFERENCES `product_discount`(`id`);

ALTER TABLE `product_review`
ADD FOREIGN KEY (`product_id`) REFERENCES `product`(`id`),
ADD FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
ADD FOREIGN KEY (`parent_review`) REFERENCES `product_review`(`id`);

ALTER TABLE `user_payment`
ADD FOREIGN KEY (`user_id`) REFERENCES `user`(`id`);

ALTER TABLE `transaction`
ADD FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
ADD FOREIGN KEY (`order_detail_id`) REFERENCES `order_details`(`id`);

ALTER TABLE `cart_items`
ADD FOREIGN KEY (`product_id`) REFERENCES `product`(`id`),
ADD FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`);

ALTER TABLE `order_details`
ADD FOREIGN KEY (`order_id`) REFERENCES `order_items`(`id`),
ADD FOREIGN KEY (`user_id`) REFERENCES `user`(`id`);

ALTER TABLE `address`
ADD FOREIGN KEY (`user_id`) REFERENCES `user`(`id`);

INSERT INTO `product` (`code`, `name`, `images`, `origin`, `material`, `size`, `warranty`, `description`, `price`, `category_id`, `inventory_id`, `discount_id`, `deleted_at`)
VALUES
('VONGTAY001', 'Vòng tay đá xanh', 'image1.jpg', 'Vietnam', 'Đá', 'Free size', '6 months', 'Vòng tay đá xanh dành cho mọi lứa tuổi.', 25.99, 1, 1, NULL, 0),
('VONGTAY002', 'Vòng tay ngọc trai', 'image2.jpg', 'Vietnam', 'Ngọc trai', 'Free size', '1 year', 'Vòng tay ngọc trai cao cấp, sang trọng.', 35.99, 1, 2, 1, 0),
('VONGTAY003', 'Vòng tay hạt gỗ', 'image3.jpg', 'Vietnam', 'Gỗ tự nhiên', 'Free size', '3 months', 'Vòng tay hạt gỗ tự nhiên, phong cách boho.', 19.99, 1, 3, NULL, 0),
('NHAN001', 'Nhẫn bạc nữ', 'image4.jpg', 'Italy', 'Bạc', 'Size 6', '2 years', 'Nhẫn bạc nữ kiểu dáng đơn giản, tinh tế.', 29.99, 2, 4, NULL, 0),
('NHAN002', 'Nhẫn bạc nam', 'image5.jpg', 'Italy', 'Bạc', 'Size 9', '1 year', 'Nhẫn bạc nam phong cách lịch lãm, mạnh mẽ.', 39.99, 2, 5, 2, 0),
('NHAN003', 'Nhẫn vàng trắng', 'image6.jpg', 'USA', 'Vàng trắng 18K', 'Size 7', '5 years', 'Nhẫn vàng trắng 18K với thiết kế độc đáo.', 79.99, 2, 6, NULL, 0),
('DAYCHUYEN001', 'Dây chuyền vàng hồng', 'image7.jpg', 'France', 'Vàng hồng 14K', '45cm', '1 year', 'Dây chuyền vàng hồng 14K đẳng cấp.', 149.99, 3, 7, NULL, 0),
('DAYCHUYEN002', 'Dây chuyền ngọc trai', 'image8.jpg', 'Japan', 'Ngọc trai', '50cm', '3 months', 'Dây chuyền ngọc trai đẹp và quý phái.', 89.99, 3, 8, NULL, 0),
('DAYCHUYEN003', 'Dây chuyền kim cương', 'image9.jpg', 'USA', 'Kim cương', '40cm', 'Lifetime', 'Dây chuyền kim cương cao cấp, bền vững.', 499.99, 3, 9, NULL, 0),
('LACCHAN001', 'Lắc chân ngọc trai', 'image10.jpg', 'Vietnam', 'Ngọc trai', 'Adjustable', '2 years', 'Lắc chân ngọc trai phong cách và sang trọng.', 45.99, 4, 10, NULL, 0),
('LACCHAN002', 'Lắc chân vàng 18K', 'image11.jpg', 'Italy', 'Vàng 18K', 'Adjustable', '5 years', 'Lắc chân vàng 18K đẳng cấp và tinh tế.', 89.99, 4, 11, NULL, 0),
('LACCHAN003', 'Lắc chân bạc nữ', 'image12.jpg', 'Italy', 'Bạc', 'Adjustable', '1 year', 'Lắc chân bạc nữ đơn giản nhưng cuốn hút.', 30, 4, 12, 2, 0);

INSERT INTO `product_category` (`code`, `name`)
VALUES
('VONGTAY', 'Vòng tay'),
('NHAN', 'Nhẫn'),
('DAYCHUYEN', 'Dây chuyền'),
('LACCHAN', 'Lắc chân');

INSERT INTO `product_inventory` (`quantity`)
VALUES
(1),
(15),
(20),
(8),
(12),
(90),
(75),
(11),
(5),
(7),
(18),
(95);

INSERT INTO `product_discount` (`name`, `description`, `active`, `discount_percent`)
VALUES
('Summer Sale', 'Giảm giá mùa hè', 1, 10),
('Flash Sale', 'Khuyến mãi flash', 1, 15);

INSERT INTO `product_review` (`product_id`, `user_id`, `parent_review`, `content`, `like`, `deleted_at`)
VALUES
(1, 1, NULL, 'Sản phẩm rất đẹp và chất lượng tốt.', 15, NULL),
(2, 2, NULL, 'Tôi rất hài lòng với sản phẩm này.', 10, NULL);

INSERT INTO `user` (`id`, `role`, `name`, `password`, `phone`, `email`, `address`, `dob`, `last_login`)
VALUES
(1, "ADMIN", 'Adam', '123', '0779455498', 'nddat1811@example.com', '123 Main St, Anytown, USA', '1990-05-15  00:00:00', '2023-11-20 08:30:00'),
(2, "USER", 'Đạt', '123', '0822000369', 'test', '456 Oak Ave, Sometown, USA', '1988-09-22 00:00:00', '2023-11-21 09:45:00'),
(3, "USER", 'Tô An', 'test', '555123456', 'alice@example.com', '789 Elm St, Anycity, USA', '1995-12-10  00:00:00', '2023-11-21 14:20:00'),
(4, "USER", 'Bob Brown', 'secretword', '111222333', 'bob@example.com', '321 Cedar St, Somecity, USA', '1992-07-03  00:00:00', '2023-11-22 10:15:00'),
(5, "USER", 'Eva Garcia', 'eva123', '999888777', 'eva@example.com', '654 Pine St, Othercity, USA', '1985-03-28  00:00:00', '2023-11-22 12:30:00'),
(6, "USER", 'David Lee', 'davidpass', '333444555', 'david@example.com', '987 Birch St, Anothercity, USA', '1998-10-17  00:00:00', '2023-11-23 11:00:00');

INSERT INTO `address` (`id`, `user_id`, `street`, `city`, `postal_code`, `is_default`)
VALUES
(1, 1, '135 Trần Hưng Đạo Name', 'HCM City', '12345', 1),
(2, 2, '117 Trần Hưng Đạo', 'Quảng Trị', '67890', 1),
(3, 3, '111 HCM', 'HCM', '13579', 1),
(4, 4, '012 Street Name', 'City D', '24680', 1),
(5, 5, '345 Street Name', 'City E', '98765', 1),
(6, 6, '678 Street Name', 'City F', '54321', 1);

INSERT INTO `user_payment` (`id`, `user_id`, `payment_type`, `provider`, `account_no`, `expiry`, `is_default`)
VALUES
(1, 1, 'Credit Card', 'Visa', '12345', '2024-12-01', 1),
(2, 1, 'PayPal', 'PayPal', '9876543210', '2023-11-30', 0),
(3, 2, 'Credit Card', 'Visa', '222222222', '2024-11-01', 0),
(4, 2, 'PayPal', 'PayPal', '119876543210', '2023-11-30', 1);

INSERT INTO `order_items` (`id`, `product_id`)
VALUES
(1, 1),
(2, 12);

INSERT INTO `order_details` (`id`, `order_id`, `user_id`, `total`)
VALUES
(1, 1, 1, 103.94),
(2, 2, 2, 199.95),
(3, 3, 3, 679.94);

INSERT INTO `cart` (`id`, `user_id`)
VALUES
(1, 1),
(2, 2),
(3, 3);

INSERT INTO `cart_items` (`id`, `product_id`, `cart_id`, `quantity`, `price`)
VALUES
(1, 1, 1, 1, 25.99),
(12, 12, 3, 2, 30);


INSERT INTO `transaction` ( `user_id`, `order_detail_id`, `type`, `mode`, `status`, `content`)
VALUES
  (1, 1, 1, 1, 1, 'Transaction 1 content'),
  (2, 2, 2, 2, 2, 'Transaction 2 content'),
  (3, 3, 3, 3, 3, 'Transaction 3 content');
