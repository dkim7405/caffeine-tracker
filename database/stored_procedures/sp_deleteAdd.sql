USE FinalProject_S1G6
GO

CREATE OR ALTER PROCEDURE sp_deleteAdd
    @userid INT,
    @time_added DATETIME
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
        ;THROW 50002, 'No matching entry in Adds table to delete', 1
    END

    -- Delete
    DELETE FROM dbo.Adds
    WHERE user_id = @userid AND time_added = @time_added;
END
GO
