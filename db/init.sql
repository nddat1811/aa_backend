CREATE DATABASE IF NOT EXISTS test;

USE test;
SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- DROP TABLE IF EXISTS `product`;

-- CREATE TABLE `product` (
--   `id` INT PRIMARY KEY AUTO_INCREMENT,
--   `code` VARCHAR(255) NOT NULL,
--   `name` VARCHAR(255) NOT NULL,
--   `images` VARCHAR(255),
--   `height` FLOAT,
--   `width` FLOAT,
--   `thickness` FLOAT,
--   `color` VARCHAR(255),
--   `surface` VARCHAR(255),
--   `style` VARCHAR(255),
--   `application` VARCHAR(255),
--   `boxsize` FLOAT,
--   `warranty` VARCHAR(255),
--   `description` VARCHAR(255),
--   `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `deleted_at` BOOLEAN,
--   `tag` VARCHAR(255) NOT NULL,
--   `origin` VARCHAR(255),
--   `category_id` INT,
--   `inventory_id` INT,
--   `discount_id` INT
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `product_category`;
CREATE TABLE `product_category` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `code` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_at` timestamp NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` BOOLEAN NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- -- vì có nhiều giá cho từng m^2
-- DROP TABLE IF EXISTS `product_price`;
-- CREATE TABLE `product_price` (
--   `id` INT PRIMARY KEY AUTO_INCREMENT,
--   `product_id` INT,
--   `price` FLOAT,
--   `description` VARCHAR(255)
-- );

-- DROP TABLE IF EXISTS `product_inventory`;
-- CREATE TABLE `product_inventory` (
--   `id` INT PRIMARY KEY AUTO_INCREMENT,
--   `quantity` INT,
--   `created_at` timestamp NOT NULL  DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `deleted_at` BOOLEAN
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- DROP TABLE IF EXISTS `product_discount`;
-- CREATE TABLE `product_discount` (
--   `id` INT PRIMARY KEY AUTO_INCREMENT,
--   `name` VARCHAR(255),
--   `description` VARCHAR(255),
--   `active` BOOLEAN,
--   `discount_percent` FLOAT,
--   `created_at` timestamp NOT NULL  DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `deleted_at` BOOLEAN
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- DROP TABLE IF EXISTS `product_review`;
-- CREATE TABLE `product_review` (
--   `id` INT PRIMARY KEY AUTO_INCREMENT,
--   `product_id` INT,
--   `user_id` INT,
--   `parent_review` INT,
--   `content` VARCHAR(255),
--   `like` INT,
--   `created_at` timestamp NOT NULL  DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `deleted_at` BOOLEAN
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ALTER TABLE `product`
-- ADD FOREIGN KEY (`category_id`) REFERENCES `product_category`(`id`),
-- ADD FOREIGN KEY (`inventory_id`) REFERENCES `product_inventory`(`id`),
-- ADD FOREIGN KEY (`discount_id`) REFERENCES `product_discount`(`id`);

-- ALTER TABLE `product_price`
-- ADD FOREIGN KEY (`product_id`) REFERENCES `product`(`id`);

-- ALTER TABLE `product_review`
-- ADD CONSTRAINT `fk_parent_review_id` FOREIGN KEY (`parent_review`) REFERENCES `product_review`(`id`),
-- ADD CONSTRAINT `fk_product_id_review`FOREIGN KEY (`product_id`) REFERENCES `product`(`id`);


-- INSERT INTO `product` (`code`, `name`, `images`, `height`, `width`, `thickness`, `color`, `surface`, `style`, `application`, `boxsize`, `warranty`, `description`, `tag`, `origin`, `category_id`, `inventory_id`, `discount_id`)
-- VALUES
-- ('P001', 'Wooden Table', 'table_image.jpg', 75.0, 150.0, 5.0, 'Brown', 'Smooth', 'Modern', 'Living Room', 120.0, '1 year', 'A modern wooden table', 'Furniture', 'Vietnam', 1, 1, 1),
-- ('P002', 'Wooden Chair', 'chair_image.jpg', 90.0, 45.0, 10.0, 'Oak', 'Polished', 'Classic', 'Dining Room', 50.0, '2 years', 'A classic wooden chair', 'Furniture', 'China', 2, 2, 2),
-- ('P003', 'Wooden Shelf', 'shelf_image.jpg', 180.0, 60.0, 12.0, 'Walnut', 'Patterned', 'Vintage', 'Study Room', 90.0, '3 years', 'A vintage wooden shelf', 'Furniture', 'India', 3, 3, 1),
-- ('P004', 'Wooden Lamp', 'lamp_image.jpg', 30.0, 20.0, 5.0, 'Maple', 'Glossy', 'Contemporary', 'Living Room', 40.0, '1 year', 'A contemporary wooden lamp', 'Lighting', 'Germany', 4, 4, NULL),
-- ('P005', 'Wooden Closet', 'closet_image.jpg', 210.0, 180.0, 25.0, 'Cherry', 'Carved', 'Antique', 'Bedroom', 200.0, '2 years', 'An antique wooden closet', 'Furniture', 'France', 1, 5, NULL),
-- ('P006', 'Wooden Desk', 'desk_image.jpg', 120.0, 80.0, 10.0, 'Pine', 'Textured', 'Rustic', 'Home Office', 100.0, '1.5 years', 'A rustic wooden desk', 'Furniture', 'United States', 2, 6, 3),
-- ('P007', 'Wooden Bench', 'bench_image.jpg', 150.0, 30.0, 8.0, 'Birch', 'Stained', 'Farmhouse', 'Garden', 80.0, '2 years', 'A stained wooden bench', 'Furniture', 'Canada', 3, 7, 1),
-- ('P008', 'Wooden Stool', 'stool_image.jpg', 50.0, 50.0, 5.0, 'Cedar', 'Weathered', 'Coastal', 'Patio', 70.0, '1 year', 'A weathered wooden stool', 'Furniture', 'Australia', 4, 8, 2),
-- ('P009', 'Wooden Mirror', 'mirror_image.jpg', 100.0, 70.0, 7.0, 'Teak', 'Engraved', 'Eclectic', 'Bathroom', 60.0, '2 years', 'An engraved wooden mirror', 'Decor', 'Sweden', 1, 9, NULL),
-- ('P010', 'Wooden Frame', 'frame_image.jpg', 40.0, 30.0, 3.0, 'Rosewood', 'Antiqued', 'Vintage', 'Living Room', 20.0, '1 year', 'A vintage wooden frame', 'Decor', 'Japan', 2, 10, NULL),
-- ('P011', 'Wooden Clock', 'clock_image.jpg', 35.0, 35.0, 5.0, 'Ash', 'Handcrafted', 'Minimalist', 'Living Room', 25.0, '1.5 years', 'A handcrafted wooden clock', 'Decor', 'Netherlands', 3, 11, 2),
-- ('P012', 'Wooden Bed', 'bed_image.jpg', 200.0, 160.0, 20.0, 'Mahogany', 'Carved', 'Traditional', 'Bedroom', 180.0, '4 years', 'A traditional wooden bed', 'Furniture', 'Brazil', 4, 12, 3);

INSERT INTO `product_category` (`code`, `name`)
VALUES
('C001', 'Furniture'),
('C002', 'Decor'),
('C003', 'Outdoor'),
('C004', 'Accessories');


-- INSERT INTO `product_price` (`product_id`, `price`, `description`)
-- VALUES
-- (1, 150.0, 'Price for Wooden Table'),
-- (2, 80.0, 'Price for Wooden Chair'),
-- (3, 200.0, 'Price for Wooden Shelf'),
-- (4, 300.0, 'Price for Wooden Lamp'),
-- (5, 400.0, 'Price for Wooden Closet');


-- INSERT INTO `product_inventory` (`quantity`)
-- VALUES
-- (100),
-- (150),
-- (200),
-- (120),
-- (180),
-- (250),
-- (300),
-- (210),
-- (280),
-- (190),
-- (220),
-- (175);

-- INSERT INTO `product_discount` (`name`, `description`, `active`, `discount_percent`)
-- VALUES
-- ('Summer Sale', 'Discount for summer season', 1, 15.0),
-- ('Festive Discount', 'Discount for festive season', 1, 10.0),
-- ('Clearance Sale', 'Discount for clearance', 0, 20.0);


-- INSERT INTO `product_review` (`product_id`, `user_id`, `parent_review`, `content`, `like`)
-- VALUES
-- (1, 1, NULL, 'Great table, sturdy and stylish!', 15),
-- (2, 2, NULL, 'Comfortable chair, excellent build.', 12);
