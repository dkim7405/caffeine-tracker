USE FinalProject_S1G6
GO

CREATE OR ALTER PROCEDURE sp_updateAdd
    @userid INT,
    @time_added DATETIME,
    @new_drinkid INT = NULL,
    @new_totalamount FLOAT
AS
BEGIN
    SET NOCOUNT ON;

    -- If the user exists
    IF NOT EXISTS (
        SELECT 1 FROM dbo.[User] WHERE id = @userid
    )
    BEGIN
        ;THROW 50001, 'Invalid user id: the user does not exist', 1
    END

    -- If the Adds entry exists
    IF NOT EXISTS (
        SELECT 1 FROM dbo.Adds WHERE user_id = @userid AND time_added = @time_added
    )
    BEGIN
        ;THROW 50002, 'No matching entry in Adds table to update', 1
    END

    -- If the drink id is valid if not null
    IF @new_drinkid IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM dbo.Drink WHERE id = @new_drinkid
    )
    BEGIN
        ;THROW 50003, 'Invalid drink id: the drink does not exist', 1
    END

    -- Check total_amount
    IF @new_totalamount IS NULL OR @new_totalamount <= 0
    BEGIN
        ;THROW 50004, 'Invalid total amount', 1
    END

    -- Update
    UPDATE dbo.Adds
    SET drink_id = @new_drinkid,
        total_amount = @new_totalamount
    WHERE user_id = @userid AND time_added = @time_added;
END
GO
