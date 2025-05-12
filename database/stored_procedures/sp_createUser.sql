CREATE PROCEDURE sp_create_user
  @username NVARCHAR(50),
  @password_hash NVARCHAR(255),
  @salt NVARCHAR(255),
  @first_name NVARCHAR(50),
  @middle_name NVARCHAR(50) = NULL,
  @last_name NVARCHAR(50),
  @gender CHAR(1),
  @body_weight FLOAT,
  @caffeine_limit INT,
  @date_of_birth DATETIME
AS
BEGIN

  INSERT INTO dbo.[User] (username, first_name, middle_name, last_name, gender, body_weight, caffeine_limit, date_of_birth)

  VALUES (@username, @first_name, @middle_name, @last_name, @gender, @body_weight, @caffeine_limit, @date_of_birth)

  DECLARE @new_user_id INT = SCOPE_IDENTITY()

  INSERT INTO dbo.Login (user_id, password_hash,salt)
  VALUES (@new_user_id, @password_hash, @salt)

  SELECT @new_user_id AS new_id
END
GO