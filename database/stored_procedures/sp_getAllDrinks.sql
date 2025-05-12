CREATE PROCEDURE sp_getAllDrinks
AS
BEGIN
  SELECT *
  FROM dbo.Drink
  ORDER BY name
END
GO



