-- After seed.sql, execute five simulated application-style actions.
-- A01 Register a customer
INSERT INTO customers(customer_id,name,email) VALUES (10,'Test User','test.user@test.example');
SELECT customer_id,name,email FROM customers WHERE customer_id=10;
-- A02 Update profile
UPDATE customers SET name='Test User Updated' WHERE customer_id=10;
SELECT customer_id,name,email FROM customers WHERE customer_id=10;
-- A03 Create order
INSERT INTO orders(order_id,customer_id,amount,status) VALUES (201,10,400,'pending');
SELECT order_id,customer_id,amount,status FROM orders WHERE order_id=201;
-- A04 Mark order paid
UPDATE orders SET status='paid' WHERE order_id=201;
SELECT order_id,customer_id,amount,status FROM orders WHERE order_id=201;
-- A05 Soft-delete order
UPDATE orders SET deleted_at='2026-11-19 12:00:00' WHERE order_id=201;
SELECT order_id,deleted_at FROM orders WHERE order_id=201;
SELECT COUNT(*) AS active_order_count FROM orders WHERE order_id=201 AND deleted_at IS NULL;
