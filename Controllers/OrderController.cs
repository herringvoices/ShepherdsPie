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

            var orders = await _context
                .Orders
                
                .Include(o => o.Pizzas)
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
                .Where(o => o.Date <= parsedDate)
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
                    Email = order.TookOrder.IdentityUser.Email
                },
                DeliveryDriverId = order.DeliveryDriverId,
                DeliveryDriver = order.DeliveryDriver != null ? new UserProfileDTO
                {
                    Id = order.DeliveryDriver.Id,
                    FirstName = order.DeliveryDriver.FirstName,
                    LastName = order.DeliveryDriver.LastName,
                    Address = order.DeliveryDriver.Address,
                     Email = order.DeliveryDriver.IdentityUser.Email
                } : null,
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
                DeliveryDriverId = order.DeliveryDriverId,
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

            // Retrieve the order along with its pizzas and their related entities
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
                // Safely convert to int (or 0 if it's too large for int)
                int pizzaId = (pizzaDto.Id <= int.MaxValue) ? (int)pizzaDto.Id : 0;

                // Attempt to find an existing pizza
                var pizza = order.Pizzas.FirstOrDefault(p => p.Id == pizzaId);

                // If pizza doesn't exist OR the incoming ID is huge treat as new pizza
                if (pizza == null || pizzaDto.Id >= TEMPORARY_ID_THRESHOLD)
                {
                    pizza = new Pizza
                    {
                        OrderId = order.Id,
                        Id = 0, // EF Core will generate a real ID for us
                    };
                    order.Pizzas.Add(pizza);
                    _context.Entry(pizza).State = EntityState.Added;
                }

                // Update pizza’s basic properties
                pizza.SizeId = pizzaDto.Size.Id;
                pizza.CheeseId = pizzaDto.Cheese.Id;
                pizza.SauceId = pizzaDto.Sauce.Id;

                // Ensure toppings collection is initialized
                if (pizza.Toppings == null)
                {
                    pizza.Toppings = new List<Topping>();
                }

                // Convert DTO toppings into a lookup dictionary
                var dtoToppingDict = pizzaDto.Toppings.ToDictionary(t => t.Id);

                // Remove toppings that aren't in the DTO
                var toppingsToRemove = pizza
                    .Toppings.Where(t => !dtoToppingDict.ContainsKey(t.Id))
                    .ToList();
                foreach (var topping in toppingsToRemove)
                {
                    pizza.Toppings.Remove(topping);
                }

                // Add new toppings
                var existingToppingIds = pizza.Toppings.Select(t => t.Id).ToList();
                foreach (var toppingDto in pizzaDto.Toppings)
                {
                    if (!existingToppingIds.Contains(toppingDto.Id))
                    {
                        // "Attach" existing topping by its ID
                        pizza.Toppings.Add(new Topping { Id = toppingDto.Id });
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

                            // "Link" to existing toppings by Id, or create new ones if needed
                            Toppings = pizzaDto
                                .Toppings.Select(toppingDto => new Topping { Id = toppingDto.Id })
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
