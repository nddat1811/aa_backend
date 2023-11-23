CREATE DATABASE IF NOT EXISTS test;

USE test;
SET NAMES utf8;
SET time_zone = '+00:00';
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
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` BOOLEAN
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
  `id` INT PRIMARY KEY,
  `role_id` INT NOT NULL,
  `name` VARCHAR(255),
  `password` VARCHAR(255),
  `phone` VARCHAR(20),
  `email` VARCHAR(255),
  `address` VARCHAR(255),
  `dob` DATE,
  `last_login` TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_payment`;
CREATE TABLE `user_payment` (
  `id` INT PRIMARY KEY,
  `user_id` INT,
  `payment_type` VARCHAR(255),
  `provider` VARCHAR(255),
  `account_no` INT,
  `expiry` TIMESTAMP,
  `is_default` BOOLEAN
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `transaction`;
CREATE TABLE `transaction` (
  `id` INT PRIMARY KEY,
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
  `id` INT PRIMARY KEY,
  `user_id` INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items` (
  `id` INT PRIMARY KEY,
  `product_id` INT,
  `cart_id` INT,
  `quantity` INT,
  `price` FLOAT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `order_details`;
CREATE TABLE `order_details` (
  `id` INT PRIMARY KEY,
  `session_id` INT,
  `order_id` INT,
  `user_id` INT,
  `total` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` INT PRIMARY KEY,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP,
  `product_id` INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `id` INT PRIMARY KEY,
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
