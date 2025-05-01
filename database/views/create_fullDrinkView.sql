USE FinalProject_S1G6
GO

CREATE OR ALTER VIEW dbo.fullDrinkView AS
SELECT
    d.id,
    d.name,
    d.[mg/oz] AS mg_per_oz,
    d.image_url,
    d.manufacturer_id,
    m.name AS manufacturer_name,
    dt.name AS type_name
FROM
    dbo.Drink d
LEFT JOIN
    dbo.Manufacturer m ON d.manufacturer_id = m.id
LEFT JOIN
    dbo.HasDrinksType hdt ON d.id = hdt.drink_id
LEFT JOIN
    dbo.DrinksType dt ON hdt.drinks_type_id = dt.id;
GO
