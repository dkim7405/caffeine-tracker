USE FinalProject_S1G6
GO

CREATE OR ALTER PROCEDURE sp_readAdd
    @userid INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the user exists
    IF NOT EXISTS (
        SELECT 1 FROM dbo.[User] WHERE id = @userid
    )
    BEGIN
        ;THROW 50001, 'Invalid user id: the user does not exist', 1
    END

    SELECT 
        a.time_added,
        a.total_amount,
        d.name AS drink_name
    FROM
        dbo.Adds a
    LEFT JOIN
        dbo.Drink d ON a.drink_id = d.id
    WHERE
        a.user_id = @userid
    ORDER BY
        a.time_added DESC
END
GO