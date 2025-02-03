using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShepherdsPie.Data;
using ShepherdsPie.DTOs;

[ApiController]
[Route("api/[controller]")]
public class SauceController : ControllerBase
{
    private ShepherdsPieDbContext _dbContext;
    public SauceController(ShepherdsPieDbContext context)
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
        .Sauces
        .Select(s => new SauceDTO
        {
            Id = s.Id,
            Name = s.Name,
            Price = s.Price
        }));
        }
        catch (Exception ex)
        {
           return StatusCode(500, "An unexpected error occurred");
        }
    }
}