-- Joins 3 tables

SELECT  Customers.first_name, Shippings.status, Orders.amount AS "total amount of orders"
FROM ((Orders
INNER JOIN Customers ON Orders.customer_id = Customers.customer_id)
INNER JOIN Shippings ON Customers.customer_id = Shippings.customer);

--Counts shipping of users and groups it by status

SELECT Shippings.status, COUNT(Customers.customer_id) AS NumberOfOrders FROM Customers
LEFT JOIN Shippings ON Shippings.customer = Customers.customer_id
GROUP BY status;


-- Selects users who have more than 3 orders
SELECT Customers.first_name, COUNT(Orders.order_id) AS "Count of orders"
FROM (Orders
INNER JOIN Customers ON Orders.customer_id = Customers.customer_id)
GROUP BY first_name
HAVING COUNT(Orders.order_id) > 2;

-- Procedures to reuse existed sql
CREATE PROCEDURE SelectAllCustomers @City nvarchar(30), @PostalCode nvarchar(10)
AS
SELECT * FROM Customers WHERE City = @City AND PostalCode = @PostalCode
GO;

EXEC SelectAllCustomers @City = 'London', @PostalCode = 'WA1 1DP';
