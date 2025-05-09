USE FinalProject_S1G6
GO

CREATE OR ALTER PROCEDURE sp_getDrinkDetails
    @drinkid int
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM view_drinkDetails
    WHERE drink_id = @drinkid;
END
GO
