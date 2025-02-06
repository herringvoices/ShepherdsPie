using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShepherdsPie.Data;
using ShepherdsPie.DTOs;
using ShepherdsPie.Models; // Assuming your EF Core entities are here

namespace ShepherdsPie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ShepherdsPieDbContext _context;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(ShepherdsPieDbContext context, ILogger<OrdersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        //         GET All Orders:

        // Route: GET /api/orders
        // Returns an OrderDTO and uses the provided date to filter orders—excluding orders with dates past the specified value—and orders the results by most recent.
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetOrders([FromQuery] string date)
        {
            DateTime parsedDate;
            if (!DateTime.TryParse(date, out parsedDate))
            {
                return BadRequest("Invalid date format.");
            }

            // Add one day so that the filter includes orders on the submitted date.
            // This effectively sets the filter to all orders with a Date earlier than midnight of the next day.
            DateTime filterDate = parsedDate.AddDays(1);

            var orders = await _context
                .Orders.Include(o => o.Pizzas)
                .ThenInclude(p => p.Size)
                .Include(o => o.Pizzas)
                .ThenInclude(p => p.Cheese)
                .Include(o => o.Pizzas)
                .ThenInclude(p => p.Sauce)
                .Include(o => o.Pizzas)
                .ThenInclude(p => p.Toppings)
                .Include(o => o.TookOrder)
                .ThenInclude(to => to.IdentityUser)
                .Include(o => o.DeliveryDriver)
                .ThenInclude(dd => dd.IdentityUser)
                .Where(o => o.Date < filterDate) // Using "<" to include all orders from the submitted day
                .OrderByDescending(o => o.Date)
                .ToListAsync();

            var orderDTOs = orders.Select(order => new OrderDTO
            {
                Id = order.Id,
                TableNumber = order.TableNumber,
                Date = order.Date,
                TipAmount = order.TipAmount,
                Total = order.Total, // Uses the computed property from Order Model
                TookOrderId = order.TookOrderId,
                TookOrder = new UserProfileDTO
                {
                    Id = order.TookOrder.Id,
                    FirstName = order.TookOrder.FirstName,
                    LastName = order.TookOrder.LastName,
                    Address = order.TookOrder.Address,
                    Email = order.TookOrder.IdentityUser.Email,
                },
                DeliveryDriverId = order.DeliveryDriverId,
                DeliveryDriver =
                    order.DeliveryDriver != null
                        ? new UserProfileDTO
                        {
                            Id = order.DeliveryDriver.Id,
                            FirstName = order.DeliveryDriver.FirstName,
                            LastName = order.DeliveryDriver.LastName,
                            Address = order.DeliveryDriver.Address,
                            Email = order.DeliveryDriver.IdentityUser.Email,
                        }
                        : null,
                Pizzas = order
                    .Pizzas.Select(pizza => new PizzaDTO
                    {
                        // Explicitly cast to long
                        Id = (long)pizza.Id,
                        OrderId = pizza.OrderId,
                        Price = pizza.Price,
                        Size = new SizeDTO
                        {
                            Id = pizza.Size.Id,
                            Name = pizza.Size.Name,
                            Price = pizza.Size.Price,
                        },
                        Cheese = new CheeseDTO
                        {
                            Id = pizza.Cheese.Id,
                            Name = pizza.Cheese.Name,
                            Price = pizza.Cheese.Price,
                        },
                        Sauce = new SauceDTO
                        {
                            Id = pizza.Sauce.Id,
                            Name = pizza.Sauce.Name,
                            Price = pizza.Sauce.Price,
                        },
                        Toppings = pizza
                            .Toppings.Select(topping => new ToppingDTO
                            {
                                Id = topping.Id,
                                Name = topping.Name,
                                Price = topping.Price,
                            })
                            .ToList(),
                    })
                    .ToList(),
            });

            return Ok(orderDTOs);
        }

        //GET: /api/orders/{id}
        [HttpGet("{id}")]
        // [Authorize]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _context
                .Orders.Include(o => o.Pizzas)
                .ThenInclude(p => p.Size)
                .Include(o => o.Pizzas)
                .ThenInclude(p => p.Cheese)
                .Include(o => o.Pizzas)
                .ThenInclude(p => p.Sauce)
                .Include(o => o.Pizzas)
                .ThenInclude(p => p.Toppings)
                .Include(o => o.TookOrder)
                .ThenInclude(to => to.IdentityUser)
                .Include(o => o.DeliveryDriver)
                .ThenInclude(dd => dd.IdentityUser)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            var orderDTO = new OrderDTO
            {
                Id = order.Id,
                TableNumber = order.TableNumber,
                Date = order.Date,
                Total = order.Total, // Uses the computed property from Order Model
                TipAmount = order.TipAmount,
                TookOrderId = order.TookOrderId,
                TookOrder = new UserProfileDTO
                {
                    Id = order.TookOrder.Id,
                    FirstName = order.TookOrder.FirstName,
                    LastName = order.TookOrder.LastName,
                    Address = order.TookOrder.Address,
                    Email = order.TookOrder.IdentityUser.Email,
                },
                DeliveryDriverId = order.DeliveryDriverId,
                DeliveryDriver =
                    order.DeliveryDriver != null
                        ? new UserProfileDTO
                        {
                            Id = order.DeliveryDriver.Id,
                            FirstName = order.DeliveryDriver.FirstName,
                            LastName = order.DeliveryDriver.LastName,
                            Address = order.DeliveryDriver.Address,
                            Email = order.DeliveryDriver.IdentityUser.Email,
                        }
                        : null,
                Pizzas = order
                    .Pizzas.Select(pizza => new PizzaDTO
                    {
                        // Explicitly cast to long
                        Id = (long)pizza.Id,
                        OrderId = pizza.OrderId,
                        Price = pizza.Price,
                        Size = new SizeDTO
                        {
                            Id = pizza.Size.Id,
                            Name = pizza.Size.Name,
                            Price = pizza.Size.Price,
                        },
                        Cheese = new CheeseDTO
                        {
                            Id = pizza.Cheese.Id,
                            Name = pizza.Cheese.Name,
                            Price = pizza.Cheese.Price,
                        },
                        Sauce = new SauceDTO
                        {
                            Id = pizza.Sauce.Id,
                            Name = pizza.Sauce.Name,
                            Price = pizza.Sauce.Price,
                        },
                        Toppings = pizza
                            .Toppings.Select(topping => new ToppingDTO
                            {
                                Id = topping.Id,
                                Name = topping.Name,
                                Price = topping.Price,
                            })
                            .ToList(),
                    })
                    .ToList(),
            };
            return Ok(orderDTO);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] OrderDTO orderDto)
        {
            if (orderDto == null || orderDto.Id != id)
            {
                return BadRequest("Invalid OrderDTO received.");
            }

            // Retrieve the order with its pizzas and related entities
            var order = await _context
                .Orders.Include(o => o.Pizzas)
                .ThenInclude(p => p.Toppings)
                .Include(o => o.Pizzas)
                .ThenInclude(p => p.Size)
                .Include(o => o.Pizzas)
                .ThenInclude(p => p.Cheese)
                .Include(o => o.Pizzas)
                .ThenInclude(p => p.Sauce)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            // Update order-level properties
            order.TableNumber = orderDto.TableNumber;
            order.Date = orderDto.Date;
            order.TipAmount = orderDto.TipAmount;
            order.TookOrderId = orderDto.TookOrderId;
            order.DeliveryDriverId = orderDto.DeliveryDriverId;

            // Remove pizzas that are not present in the incoming DTO
            var pizzasToRemove = order
                .Pizzas.Where(p => !orderDto.Pizzas.Any(pd => pd.Id == p.Id))
                .ToList();
            _context.Pizzas.RemoveRange(pizzasToRemove);

            // A threshold for “temporary” IDs (e.g. date-based ones)
            const long TEMPORARY_ID_THRESHOLD = 1700000000000;

            // Process each pizza from the incoming DTO
            foreach (var pizzaDto in orderDto.Pizzas)
            {
                // Safely convert the incoming ID to int (or treat as 0 if it exceeds int.MaxValue)
                int pizzaId = (pizzaDto.Id <= int.MaxValue) ? (int)pizzaDto.Id : 0;

                // Attempt to find an existing pizza in the current order
                var pizza = order.Pizzas.FirstOrDefault(p => p.Id == pizzaId);

                // If the pizza is new or has a "temporary" ID, add it as a new pizza
                if (pizza == null || pizzaDto.Id >= TEMPORARY_ID_THRESHOLD)
                {
                    pizza = new Pizza
                    {
                        OrderId = order.Id,
                        SizeId = pizzaDto.Size.Id,
                        CheeseId = pizzaDto.Cheese.Id,
                        SauceId = pizzaDto.Sauce.Id,
                        Toppings = new List<Topping>(),
                    };
                    order.Pizzas.Add(pizza);
                }
                else
                {
                    // Update the existing pizza’s properties
                    pizza.SizeId = pizzaDto.Size.Id;
                    pizza.CheeseId = pizzaDto.Cheese.Id;
                    pizza.SauceId = pizzaDto.Sauce.Id;
                }

                // Process toppings:
                // 1. Get the list of topping IDs currently linked to this pizza
                var existingToppingIds = pizza.Toppings.Select(t => t.Id).ToList();
                // 2. Get the list of topping IDs from the incoming DTO
                var incomingToppingIds = pizzaDto.Toppings.Select(t => t.Id).ToList();

                // Remove toppings that are no longer in the DTO
                pizza.Toppings = pizza
                    .Toppings.Where(t => incomingToppingIds.Contains(t.Id))
                    .ToList();

                // Add new toppings that are in the DTO but not already linked
                foreach (var toppingDto in pizzaDto.Toppings)
                {
                    if (!existingToppingIds.Contains(toppingDto.Id))
                    {
                        // Attach the existing topping rather than creating a new one
                        var existingTopping = await _context.Toppings.FindAsync(toppingDto.Id);
                        if (existingTopping != null)
                        {
                            pizza.Toppings.Add(existingTopping);
                        }
                    }
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while updating order.");
                return StatusCode(500, "A database error occurred while updating the order.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while updating order.");
                return StatusCode(500, "An unexpected error occurred while updating the order.");
            }

            return Ok(order);
        }

        // POST: /api/orders
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDTO orderDto)
        {
            if (orderDto == null || orderDto.Pizzas == null || !orderDto.Pizzas.Any())
            {
                _logger.LogWarning("Invalid OrderDTO received.");
                return BadRequest("Order must contain at least one pizza.");
            }

            try
            {
                var order = new Order
                {
                    TableNumber = orderDto.TableNumber,
                    Date = orderDto.Date,
                    TipAmount = orderDto.TipAmount,
                    TookOrderId = orderDto.TookOrderId,
                    DeliveryDriverId = orderDto.DeliveryDriverId,

                    // EF Core will generate IDs for these new pizzas
                    Pizzas = orderDto
                        .Pizzas.Select(pizzaDto => new Pizza
                        {
                            // Force EF Core to treat them as new by setting Id = 0.
                            Id = 0,
                            SizeId = pizzaDto.Size.Id,
                            CheeseId = pizzaDto.Cheese.Id,
                            SauceId = pizzaDto.Sauce.Id,

                            // Correctly link to existing toppings using the context
                            Toppings = pizzaDto
                                .Toppings.Select(toppingDto =>
                                    _context.Toppings.Find(toppingDto.Id)
                                )
                                .Where(t => t != null)
                                .ToList(),
                        })
                        .ToList(),
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while creating order.");
                return StatusCode(500, "A database error occurred.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while creating order.");
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
