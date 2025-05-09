USE [FinalProject_S1G6]
GO
 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
CREATE PROCEDURE [dbo].[sp_delete_user]
  @user_id INT
AS
BEGIN
  -- check if the user exists
  IF NOT EXISTS (
    SELECT 1 FROM dbo.[User] WHERE id = @user_id
  )
  BEGIN
    RAISERROR('User ID not found.', 16, 1);
    RETURN;
  END;

  DELETE FROM dbo.Login WHERE user_id = @user_id;
 
  DELETE FROM dbo.[User] WHERE id = @user_id;
END;