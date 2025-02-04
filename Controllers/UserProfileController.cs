using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShepherdsPie.Data;
using ShepherdsPie.DTOs;
using ShepherdsPie.Models;

[ApiController]
[Route("api/[controller]")]
public class UserProfileController : ControllerBase
{
    private ShepherdsPieDbContext _dbContext;
    public UserProfileController(ShepherdsPieDbContext context)
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
        .UserProfiles
        .Include(up => up.IdentityUser)
        .Select(up => new UserProfileDTO
        {
            Id = up.Id,
            FirstName = up.FirstName,
            LastName = up.LastName,
            Address = up.Address,
            Email = up.IdentityUser.Email,
            UserName = up.IdentityUser.UserName,
            Roles = _dbContext
            .UserRoles
            .Where(ur => ur.UserId == up.IdentityUserId)
            .Select(ur => _dbContext.Roles
            .SingleOrDefault(r => r.Id == ur.RoleId).Name)
            .ToList()
        }));
        }
         catch (Exception ex)
        {
           return StatusCode(500, "An unexpected error occurred");
        }

    }
    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetById(int id)
    {
        UserProfile foundUser = _dbContext
        .UserProfiles
        .Include(up => up.IdentityUser)
        .SingleOrDefault(up => up.Id == id);

        if (foundUser == null)
        {
            return NotFound();
        }

        try {
        return Ok(new UserProfileDTO
        {
            Id = foundUser.Id,
            FirstName = foundUser.FirstName,
            LastName = foundUser.LastName,
            Address = foundUser.Address,
            Email = foundUser.IdentityUser.Email,
            UserName = foundUser.IdentityUser.UserName,
            Roles = _dbContext
            .UserRoles
            .Where(ur => ur.UserId == foundUser.IdentityUserId)
            .Select(ur => _dbContext.Roles
            .SingleOrDefault(r => r.Id == ur.RoleId).Name)
            .ToList()
        });
        }
        catch (Exception ex)
        {
           return StatusCode(500, "An unexpected error occurred");
        }
    }

    [HttpPut("{id}")]
    [Authorize]
    public IActionResult UpdateUser(int id, [FromBody] UserProfile userProfile, [FromQuery] string role)
    {
        UserProfile userToUpdate = _dbContext
        .UserProfiles
        .Include(up => up.IdentityUser)
        .SingleOrDefault(up => up.Id == id);

        if (userToUpdate == null)
        {
            return NotFound();
        }

        userToUpdate.FirstName = userProfile.FirstName;
        userToUpdate.LastName = userProfile.LastName;
        userToUpdate.Address = userProfile.Address;

        userToUpdate.IdentityUser.Email = userProfile.IdentityUser.Email;
        userToUpdate.IdentityUser.UserName = userProfile.IdentityUser.Email;

        //remove the current role associated with the user
        IdentityUserRole<string> oldRole = _dbContext
        .UserRoles
        .SingleOrDefault(ur => ur.UserId == userToUpdate.IdentityUserId);

        _dbContext.UserRoles.Remove(oldRole) ;

        //add the new role back
        IdentityRole findRole = _dbContext.Roles.SingleOrDefault(r => r.Name == role);

        if (findRole == null)
        {
            return BadRequest("Invalid role specified");
        }
        
        _dbContext.UserRoles.Add(new IdentityUserRole<string>
        {
            RoleId = findRole.Id,
            UserId = userToUpdate.IdentityUserId
        });
        _dbContext.SaveChanges();
        return NoContent();
    }
}