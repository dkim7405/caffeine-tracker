USE FinalProject_S1G6
GO

CREATE OR ALTER PROCEDURE sp_getDrinks
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        *
    FROM
        dbo.Drink
    ORDER BY
        name
END