USE [FinalProject_S1G6]
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_update_user]
  @user_id         INT,
  @username        NVARCHAR(50) = NULL,
  @first_name      NVARCHAR(50) = NULL,
  @middle_name     NVARCHAR(50) = NULL,
  @last_name       NVARCHAR(50) = NULL,
  @gender          CHAR(1)      = NULL,
  @body_weight     FLOAT        = NULL,
  @caffeine_limit  INT          = NULL,
  @date_of_birth   DATETIME     = NULL
AS
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM dbo.[User] WHERE id = @user_id
  )
  BEGIN
    RAISERROR('User ID not found.', 16, 1);
    RETURN;
  END;

  UPDATE dbo.[User]
  SET
    username        = ISNULL(@username, username),
    first_name      = ISNULL(@first_name, first_name),
    middle_name     = ISNULL(@middle_name, middle_name),
    last_name       = ISNULL(@last_name, last_name),
    gender          = ISNULL(@gender, gender),
    body_weight     = ISNULL(@body_weight, body_weight),
    caffeine_limit  = ISNULL(@caffeine_limit, caffeine_limit),
    date_of_birth   = ISNULL(@date_of_birth, date_of_birth)
  WHERE id = @user_id;
END;