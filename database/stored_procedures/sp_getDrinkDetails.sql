USE FinalProject_S1G6
GO

CREATE PROCEDURE sp_getDrinkDetails
    @drinkid int
AS
BEGIN
    SELECT *
    FROM view_drinkDetails
    WHERE drink_id = @drinkid;
END
GO
