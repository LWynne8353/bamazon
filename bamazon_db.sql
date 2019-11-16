DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
id INT AUTO_INCREMENT NOT NULL,
product_name VARCHAR(250) NOT NULL,
department_name VARCHAR(250) NOT NULL,
price DECIMAL (10 , 2),
stock_quantity INT (100),
PRIMARY KEY (id)
);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("freezer", "appliances", 2000.00, 5);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("forks", "smallwares", 2.00, 144);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("oven", "cookware", 1530.00, 8);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("bins", "storage", 10.00, 40);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("refrigerator", "appliances", 1000.00, 9);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("grill", "cookware", 2300.00, 4);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("knives", "smallwares", 3.00, 72);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("spoons", "smallwares", 2.00, 144);