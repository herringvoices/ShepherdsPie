using System.ComponentModel.DataAnnotations;

namespace ShepherdsPie.Models;

public class Topping : IPizzaOptions
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }
    public decimal Price { get; set; }
}
