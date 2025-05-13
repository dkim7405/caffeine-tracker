USE FinalProject_S1G6
GO

CREATE OR ALTER PROCEDURE sp_insertAdd
    @userid int,
    @drinkid int,
    @totalamount float
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1 FROM dbo.[User] WHERE id = @userid
    )
    BEGIN
        ;THROW 50001, 'Invalid user id: the user does not exist', 1
    END

    IF @drinkid IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM dbo.Drink WHERE id = @drinkid
    )
    BEGIN
        ;THROW 50002, 'Invalid drink id: the drink does not exist', 1
    END

    IF @TotalAmount IS NULL OR @TotalAmount <= 0
    BEGIN
        ;THROW 50003, 'Invalid total amount', 1
    END

    INSERT INTO dbo.[Adds] (user_id, drink_id, total_amount)
    VALUES (@UserId, @DrinkId, @TotalAmount);
END
GO
