USE FinalProject_S1G6
GO

CREATE VIEW view_drinkDetails AS
SELECT 
    d.id AS drink_id,
    d.name AS drink_name,
    d.mg_per_oz,
    d.image_url,
    m.name AS manufacturer_name,
    dt.name AS drink_type
FROM 
    Drink d
LEFT JOIN Manufacturer m ON d.manufacturer_id = m.id
INNER JOIN HasDrinksType hdt ON d.id = hdt.drink_id
INNER JOIN DrinksType dt ON hdt.drinks_type_id = dt.id;
GO
