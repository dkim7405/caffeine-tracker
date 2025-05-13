USE FinalProject_S1G6
GO
-- Drop existing tables if they exist
IF OBJECT_ID('dbo.Adds', 'U') IS NOT NULL DROP TABLE dbo.Adds;
IF OBJECT_ID('dbo.HasDrinksType', 'U') IS NOT NULL DROP TABLE dbo.[HasDrinksType];
IF OBJECT_ID('dbo.AlertedWith', 'U') IS NOT NULL DROP TABLE dbo.[AlertedWith];
IF OBJECT_ID('dbo.ServingSize', 'U') IS NOT NULL DROP TABLE dbo.[ServingSize];
IF OBJECT_ID('dbo.Message', 'U') IS NOT NULL DROP TABLE dbo.[Message];
IF OBJECT_ID('dbo.Drink', 'U') IS NOT NULL DROP TABLE dbo.[Drink];
IF OBJECT_ID('dbo.DrinksType', 'U') IS NOT NULL DROP TABLE dbo.[DrinksType];
IF OBJECT_ID('dbo.Manufacturer', 'U') IS NOT NULL DROP TABLE dbo.[Manufacturer];
IF OBJECT_ID('dbo.User', 'U') IS NOT NULL DROP TABLE dbo.[User];
IF OBJECT_ID('dbo.Login', 'U') IS NOT NULL DROP TABLE dbo.[Login];

-- Age is computed attribute based on date_of_birth
CREATE TABLE [User] (
    [id] int PRIMARY KEY IDENTITY(1,1),
    [username] nvarchar(50) NOT NULL UNIQUE,
    [first_name] nvarchar(50),
    [middle_name] nvarchar(50),
    [last_name] nvarchar(50),
    [gender] char(1) CHECK (gender IN ('M', 'F', 'N')),
    [body_weight] float,
    [caffeine_limit] int,
    [date_of_birth] datetime,
    [age] as (DATEDIFF(YEAR, date_of_birth, GETDATE()))
);

CREATE TABLE [Manufacturer] (
    [id] int PRIMARY KEY IDENTITY(1,1),
    [name] nvarchar(150) NOT NULL UNIQUE,
    [address] nvarchar(250) NULL,
    [website] nvarchar(300) NULL
);

CREATE TABLE [Drink] (
    [id] int PRIMARY KEY IDENTITY(1,1),
    [name] nvarchar(50) NOT NULL UNIQUE,
    [mg_per_oz] float NOT NULL,
    [image_url] nvarchar(300) NOT NULL,
    [manufacturer_id] int NULL REFERENCES [Manufacturer](id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE [Message] (
    [id] int PRIMARY KEY IDENTITY(1,1),
    [limit_progress] float NOT NULL CHECK (limit_progress >= 0 AND limit_progress <= 100),
    [message_text] nvarchar(500) NULL
);

CREATE TABLE [DrinksType] (
    [id] int PRIMARY KEY IDENTITY(1,1),
    [name] nvarchar(50) NOT NULL UNIQUE
);

CREATE TABLE [ServingSize] (
    [id] int PRIMARY KEY IDENTITY(1,1),
    [name] nvarchar(50) NOT NULL,
    [amount_ml] float NOT NULL,
    [amount_oz] float NOT NULL,
    [drinks_type_id] int NOT NULL REFERENCES [DrinksType](id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE [AlertedWith] (
    [user_id] int NOT NULL REFERENCES [User](id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    [message_id] int NULL REFERENCES [Message](id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    PRIMARY KEY (user_id)
);

CREATE TABLE [HasDrinksType] (
    [drink_id] int NOT NULL REFERENCES [Drink](id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    [drinks_type_id] int NOT NULL REFERENCES [DrinksType](id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    PRIMARY KEY (drink_id, drinks_type_id)
);

CREATE TABLE [Adds] (
    [time_added] datetime NOT NULL DEFAULT GETDATE(),
    [user_id] int NOT NULL REFERENCES [User](id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    [drink_id] int NULL REFERENCES [Drink](id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    [total_amount] float NOT NULL,

    PRIMARY KEY (time_added, user_id)
);

CREATE TABLE [Login] (
    [user_id] int PRIMARY KEY REFERENCES [User](id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    [password_hash] nvarchar(255) NOT NULL,
    [salt] nvarchar(255) NOT NULL
);

