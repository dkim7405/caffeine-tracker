#!/usr/bin/env bash

set -e

# Update packages and install Microsoft SQL Server ODBC driver
apt-get update
ACCEPT_EULA=Y apt-get install -y curl apt-transport-https gnupg unixodbc unixodbc-dev

# Add Microsoft package repo
curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list

# Install SQL Server ODBC driver
apt-get update
ACCEPT_EULA=Y apt-get install -y msodbcsql17
