using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShepherdsPie.Data;
using ShepherdsPie.DTOs;

[ApiController]
[Route("api/[controller]")]
public class CheeseController : ControllerBase
{
    private ShepherdsPieDbContext _dbContext;
    public CheeseController(ShepherdsPieDbContext context)
    {
        _dbContext = context;
    }
    [HttpGet]
    [Authorize]
    public IActionResult GetAll()
    {
        try
        {
        return Ok(_dbContext
        .Cheeses
        .Select(c => new CheeseDTO
        {
            Id = c.Id,
            Name = c.Name,
            Price = c.Price
        }));
        }
         catch (Exception ex)
        {
           return StatusCode(500, "An unexpected error occurred");
        }
    }
}