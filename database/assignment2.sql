-- Query 1: Insert Tony Stark into the account table
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Query 2: Update Tony Stark's account_type to 'Admin'
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;
-- Query 3: Delete Tony Stark's record from the account table
DELETE FROM account
WHERE account_id = 1;
-- Query 4: Update the GM Hummer record to change the interior description
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- Query 5: Select make, model, and classification name for inventory items in the "Sport" category
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM inventory AS i
    INNER JOIN classification AS c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- Query 6: Update file paths in the inventory table to include "/vehicles"
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');