-- Adding team members to the database

USE FinalProject_S1G6
GO

CREATE USER cerritem FROM LOGIN cerritem;
CREATE USER zhangy56 FROM LOGIN zhangy56;

EXEC sp_addrolemember 'db_owner', 'cerritem';
EXEC sp_addrolemember 'db_owner', 'zhangy56';
GO