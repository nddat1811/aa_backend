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
  `height` FLOAT,
  `width` FLOAT,
  `thickness` FLOAT,
  `color` VARCHAR(255),
  `surface` VARCHAR(255),
  `style` VARCHAR(255),
  `application` VARCHAR(255),
  `boxsize` FLOAT,
  `warranty` VARCHAR(255),
  `description` VARCHAR(255),
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP,
  `deleted_at` BOOLEAN,
  `tag` VARCHAR(255) NOT NULL,
  `origin` INT,
  `category_id` INT,
  `review_id` INT,
  `inventory_id` INT,
  `discount_id` INT,
  `price_id` INT,
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `product_category`;
CREATE TABLE `product_category` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `code` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP,
  `deleted_at` BOOLEAN
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- vì có nhiều giá cho từng m^2
DROP TABLE IF EXISTS `product_price`;
CREATE TABLE `product_price` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `price` FLOAT,
  `description` VARCHAR(255)
);

DROP TABLE IF EXISTS `product_inventory`;
CREATE TABLE `product_inventory` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `quantity` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP,
  `deleted_at` BOOLEAN
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `product_discount`;
CREATE TABLE `product_discount` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255),
  `description` VARCHAR(255),
  `active` BOOLEAN,
  `discount_percent` FLOAT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP,
  `deleted_at` BOOLEAN
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `product_review`;
CREATE TABLE `product_review` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT,
  `parent_review` INT,
  `content` VARCHAR(255),
  `like` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP,
  `deleted_at` BOOLEAN,
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `product`
ADD FOREIGN KEY (`category_id`) REFERENCES `product_category`(`id`),
ADD FOREIGN KEY (`review_id`) REFERENCES `product_review`(`id`),
ADD FOREIGN KEY (`inventory_id`) REFERENCES `product_inventory`(`id`),
ADD FOREIGN KEY (`discount_id`) REFERENCES `product_discount`(`id`),
ADD FOREIGN KEY (`price_id`) REFERENCES `product_price`(`id`);

ALTER TABLE `product_review`
ADD CONSTRAINT `fk_parent_review_id`
FOREIGN KEY (`parent_review`) REFERENCES `product_review`(`id`);
