using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ShepherdsPie.Models;

namespace ShepherdsPie.Data;

public class ShepherdsPieDbContext : IdentityDbContext<IdentityUser>
{
    private readonly IConfiguration _configuration;

    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<Cheese> Cheeses { get; set; }
    public DbSet<Sauce> Sauces { get; set; }
    public DbSet<Size> Sizes { get; set; }
    public DbSet<Topping> Toppings { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Pizza> Pizzas { get; set; }

    public ShepherdsPieDbContext(
        DbContextOptions<ShepherdsPieDbContext> context,
        IConfiguration config
    )
        : base(context)
    {
        _configuration = config;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder
            .Entity<IdentityRole>()
            .HasData(
                new IdentityRole
                {
                    Id = "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
                    Name = "Admin",
                    NormalizedName = "admin",
                },
                new IdentityRole
                {
                    Id = "f57b92a3-d8e9-4b85-bd0f-0f4f9b1c527b",
                    Name = "Employee",
                    NormalizedName = "employee",
                }
            );
        modelBuilder
            .Entity<IdentityUser>()
            .HasData(
                new IdentityUser
                {
                    Id = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                    UserName = "Administrator",
                    Email = "admin@example.com",
                    PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(
                        null,
                        _configuration["AdminPassword"]
                    ),
                },
                new IdentityUser
                {
                    Id = "b01d7d09-4ed9-45c3-b872-707af77f3c99",
                    UserName = "BasicUser1",
                    Email = "BasicUser1@example.com",
                    PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(
                        null,
                        "employeepassword"
                    ),
                }
            );
        modelBuilder
            .Entity<IdentityUserRole<string>>()
            .HasData(
                new IdentityUserRole<string>
                {
                    RoleId = "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
                    UserId = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                },
                new IdentityUserRole<string>()
                {
                    RoleId = "f57b92a3-d8e9-4b85-bd0f-0f4f9b1c527b",
                    UserId = "b01d7d09-4ed9-45c3-b872-707af77f3c99",
                }
            );
        modelBuilder
            .Entity<UserProfile>()
            .HasData(
                new UserProfile
                {
                    Id = 1,
                    IdentityUserId = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                    FirstName = "Admina",
                    LastName = "Strator",
                    Address = "101 Main Street",
                },
                new UserProfile
                {
                    Id = 2,
                    IdentityUserId = "b01d7d09-4ed9-45c3-b872-707af77f3c99",
                    FirstName = "John",
                    LastName = "Basic",
                    Address = "202 Main Ave.",
                }
            );
        modelBuilder
            .Entity<Cheese>()
            .HasData(
                new Cheese[]
                {
                    new Cheese { Id = 1, Name = "Mozzarella" },
                    new Cheese { Id = 2, Name = "Gorgonzola" },
                    new Cheese { Id = 3, Name = "Provolone" },
                    new Cheese { Id = 4, Name = "Cheeseless" },
                }
            );
        modelBuilder
            .Entity<Sauce>()
            .HasData(
                new Sauce[]
                {
                    new Sauce { Id = 1, Name = "Marinara" },
                    new Sauce { Id = 2, Name = "BBQ" },
                    new Sauce { Id = 3, Name = "Mustard" },
                    new Sauce { Id = 4, Name = "Sauceless" },
                }
            );
        modelBuilder
            .Entity<Size>()
            .HasData(
                new Size[]
                {
                    new Size
                    {
                        Id = 1,
                        Name = "Personal(8 in)",
                        Price = 6.99M,
                    },
                    new Size
                    {
                        Id = 2,
                        Name = "Small(10 in.)",
                        Price = 8.99M,
                    },
                    new Size
                    {
                        Id = 3,
                        Name = "Medium(14 in.)",
                        Price = 14.50M,
                    },
                    new Size
                    {
                        Id = 4,
                        Name = "Large(18 in.)",
                        Price = 21.00M,
                    },
                }
            );
        modelBuilder
            .Entity<Topping>()
            .HasData(
                new Topping[]
                {
                    new Topping { Id = 1, Name = "Pepperoni" },
                    new Topping { Id = 2, Name = "Sausage" },
                    new Topping { Id = 3, Name = "Bacon" },
                    new Topping { Id = 4, Name = "Jalapenos" },
                    new Topping { Id = 5, Name = "Black Olives" },
                    new Topping { Id = 6, Name = "Anchovies" },
                    new Topping { Id = 7, Name = "Mushroom" },
                    new Topping { Id = 8, Name = "Extra Cheese" },
                }
            );
        modelBuilder
            .Entity<Order>()
            .HasData(
                new Order[]
                {
                    new Order
                    {
                        Id = 1,
                        TableNumber = 2,
                        Date = new DateTime(2024, 1, 12),
                        TipAmount = 4,
                        TookOrderId = 1,
                        DeliveryDriverId = null,
                    },
                    new Order
                    {
                        Id = 2,
                        TableNumber = null,
                        Date = new DateTime(2025, 2, 1),
                        TipAmount = 1,
                        TookOrderId = 2,
                        DeliveryDriverId = 1,
                    },
                }
            );
        modelBuilder
            .Entity<Pizza>()
            .HasData(
                new Pizza[]
                {
                    new Pizza
                    {
                        Id = 1,
                        SizeId = 2,
                        CheeseId = 3,
                        SauceId = 1,
                        OrderId = 1,
                    },
                    new Pizza
                    {
                        Id = 2,
                        SizeId = 3,
                        CheeseId = 1,
                        SauceId = 4,
                        OrderId = 1,
                    },
                    new Pizza
                    {
                        Id = 3,
                        SizeId = 1,
                        CheeseId = 4,
                        SauceId = 2,
                        OrderId = 2,
                    },
                }
            );
        modelBuilder
            .Entity<Pizza>()
            .HasMany(p => p.Toppings)
            .WithMany(t => t.Pizzas)
            .UsingEntity(j =>
                j.HasData(
                    new { PizzasId = 1, ToppingsId = 2 },
                    new { PizzasId = 1, ToppingsId = 1 },
                    new { PizzasId = 2, ToppingsId = 4 },
                    new { PizzasId = 2, ToppingsId = 5 },
                    new { PizzasId = 3, ToppingsId = 3 },
                    new { PizzasId = 3, ToppingsId = 7 },
                    new { PizzasId = 3, ToppingsId = 6 }
                )
            );

        modelBuilder
            .Entity<Pizza>()
            .HasOne(p => p.Order)
            .WithMany(o => o.Pizzas)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
