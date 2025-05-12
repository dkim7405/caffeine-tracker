CREATE PROCEDURE sp_getDailyCaffeine
  @userId INT
AS
BEGIN
  SELECT ISNULL(SUM(total_amount), 0) AS todayCaffeine
  FROM dbo.Adds
  WHERE user_id = @userId AND CAST(time_added AS DATE) = CAST(GETDATE() AS DATE)
END
GO

