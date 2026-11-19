-- Synthetic SQLite training data; intentional missing constraints for defect-seeding.
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;
CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT);
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL, amount NUMERIC NOT NULL, status TEXT, deleted_at TEXT);
INSERT INTO customers(customer_id,name,email) VALUES
(1,'Amina','amina@test.example'),(2,'Rahim','rahim@test.example'),(3,'Rafi','rahim@test.example');
INSERT INTO orders(order_id,customer_id,amount,status) VALUES
(101,1,500,'paid'),(102,2,300,'pending'),(103,1,200,'pending'),(104,99,150,'paid'),(105,3,75,NULL);
