#!/bin/bash

# Restore .NET dependencies
echo "Restoring .NET dependencies..."
dotnet restore || { echo "Error: dotnet restore failed"; exit 1; }

# Initialize user-secrets
echo "Initializing user-secrets..."
dotnet user-secrets init || { echo "Error: user-secrets initialization failed"; exit 1; }

# Prompt for the database password securely
read -s -p "Enter your PostgreSQL password: " db_password
echo ""

# Prompt for the admin password securely
read -s -p "Enter your admin password: " admin_password
echo ""

# Set user-secrets for database connection string
echo "Setting database connection string..."
dotnet user-secrets set ShepherdsPieDbConnectionString "Host=localhost;Port=5432;Username=postgres;Password=$db_password;Database=ShepherdsPie" || { echo "Error: Failed to set database connection string"; exit 1; }

# Set user-secrets for admin password
echo "Setting admin password..."
dotnet user-secrets set AdminPassword "$admin_password" || { echo "Error: Failed to set admin password"; exit 1; }

# Add initial migration
echo "Adding initial migration..."
dotnet ef migrations add InitialCreate || { echo "Error: Failed to add migration"; exit 1; }

# Update database
echo "Updating database..."
dotnet ef database update || { echo "Error: Database update failed"; exit 1; }

echo "Setup complete!"