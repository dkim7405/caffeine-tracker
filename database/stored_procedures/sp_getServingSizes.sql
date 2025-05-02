USE FinalProject_S1G6
GO

CREATE PROCEDURE sp_getServingSizes
    @drink_type_name NVARCHAR(50)
AS
BEGIN
    SELECT 
        ss.id AS serving_id,
        ss.name AS serving_name,
        ss.amount_ml,
        ss.amount_oz,
        dt.name AS drink_type
    FROM ServingSize ss
    INNER JOIN DrinksType dt ON ss.drinks_type_id = dt.id
    WHERE dt.name = @drink_type_name;
END
GO
