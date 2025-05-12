CREATE PROCEDURE sp_getLoginInfo
    @username NVARCHAR(50)
AS
BEGIN
    SELECT u.id AS user_id,
            l.password_hash,
            l.salt
    FROM [User] AS u
    JOIN [Login] AS l ON l.user_id = u.id
    WHERE u.username = @username;
END
GO