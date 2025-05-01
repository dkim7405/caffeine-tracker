USE FinalProject_S1G6
GO

INSERT INTO [Message] (limit_progress, message_text)
VALUES
    (50, 'You’ve reached 50% of your limit.'),
    (75, 'Caution: 75% of daily limit reached.'),
    (100, 'Limit hit! Consider stopping caffeine intake.')
GO