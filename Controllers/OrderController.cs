using System.Collections.Generic;
using System.Threading.Tasks;
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

        // POST: /api/orders
        [HttpPost]
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
                    Pizzas = orderDto
                        .Pizzas.Select(pizzaDto => new Pizza
                        {
                            SizeId = pizzaDto.Size.Id,
                            CheeseId = pizzaDto.Cheese.Id,
                            SauceId = pizzaDto.Sauce.Id,

                            // Apparently, setting the toppingId alone lets EF Core know that it's a many-to-many relationship, so it won't create a new Topping entry, but will, instead, use the existing one and add a new entry to the join table
                            Toppings = pizzaDto
                                .Toppings.Select(toppingDto => new Topping { Id = toppingDto.Id })
                                .ToList(),
                        })
                        .ToList(),
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
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
    }
}
