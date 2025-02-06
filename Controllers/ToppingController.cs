using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShepherdsPie.Data;
using ShepherdsPie.DTOs;

[ApiController]
[Route("api/[controller]")]
public class ToppingController : ControllerBase
{
    private ShepherdsPieDbContext _dbContext;

    public ToppingController(ShepherdsPieDbContext context)
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
        .Toppings
        .Select(t => new ToppingDTO
        {
            Id = t.Id,
            Name = t.Name,
            Price = t.Price
        }));
        }
         catch (Exception ex)
        {
           return StatusCode(500, "An unexpected error occurred");
        }
     }

}