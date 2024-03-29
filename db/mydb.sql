CREATE TABLE `baranggays` (
	`id` int auto_increment primary key,
    `baranggay` varchar(50) not null
);

INSERT INTO `baranggays`(`baranggay`) VALUES ('Mapulang Lupa');
INSERT INTO `baranggays`(`baranggay`) VALUES ('Poblacion');
INSERT INTO `baranggays`(`baranggay`) VALUES ('San Roque');

CREATE TABLE `municipalities` (
	`id` int auto_increment primary key,
    `municipality` varchar(50) not null
);

INSERT INTO `municipalities`(`municipality`) VALUES ('Pandi');

CREATE TABLE `provinces` (
	`id` int auto_increment primary key,
    `province` varchar(50) not null,
    `zip` int not null
);

INSERT INTO `provinces`(`province`, `zip`) VALUES ('Bulacan', 3014);

CREATE TABLE `customers` (
	`id` int auto_increment primary key,
    `username` varchar(50) not null,
    `password` varchar(50) not null,
    `surname` varchar(50) not null,
    `first_name` varchar(50) not null,
    `email` varchar(50) not null unique,
    `residence` varchar(50),
    `baranggay_id` int,
    `municipality_id` int,
    `province_id` int,
    `shop_name` varchar(50)
);

ALTER TABLE `customers`
ADD FOREIGN KEY (`baranggay_id`) REFERENCES `baranggays` (`id`),
ADD FOREIGN KEY (`municipality_id`) REFERENCES `municipalities` (`id`),
ADD FOREIGN KEY (`province_id`) REFERENCES `provinces` (`id`);

CREATE TABLE `products` (
	`id` int auto_increment primary key,
    `seller_id` int not null,
    `company_name` varchar(50) not null,
    `brand_name` varchar(50) not null,
    `description` varchar(50) not null,
    `variation` varchar(50) not null,
    `price` int not null,
    `stock` tinyint not null
);

ALTER TABLE `products`
ADD FOREIGN KEY (`seller_id`) REFERENCES `customers` (`id`);

CREATE TABLE `carts` (
	`id` int auto_increment primary key,
    `customer_id` int not null,
    `product_id` int not null,
    `price` int not null,
    `quantity` tinyint not null
);

ALTER TABLE `carts`
ADD FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

CREATE TABLE `batches` (
	`id` int auto_increment primary key,
    `batch_order` int not null,
    `cart_id` int not null
);

ALTER TABLE `batches`
ADD FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`);

CREATE TABLE `orders` (
	`id` int auto_increment primary key,
    `buyer_id` int not null,
    `product_id` int not null,
    `price` int not null,
    `quantity` tinyint not null,
    `time` time not null,
    `date` date not null
);

ALTER TABLE `orders`
ADD FOREIGN KEY (`buyer_id`) REFERENCES `customers` (`id`),
ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

CREATE TABLE `transactions` (
	`id` int auto_increment primary key,
    `customer_id` int not null,
    `order_id` int not null,
    `instance` varchar(6) not null
);

ALTER TABLE `transactions`
ADD FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
