using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShepherdsPie.Models;

public class Pizza
{
    public int Id { get; set; }
    public int SizeId { get; set; }
    public Size Size { get; set; }
    public int CheeseId { get; set; }
    public Cheese Cheese { get; set; }
    public int SauceId { get; set; }
    public Sauce Sauce { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; }
    public List<Topping> Toppings { get; set; } = new();

    //get the price based on the size, cheese, sauce, and toppings
    [NotMapped]
    public decimal Price
    {
        get
        {
            decimal price = Size.Price + Cheese.Price + Sauce.Price;
            foreach (var topping in Toppings)
            {
                price += topping.Price;
            }
            return price;
        }
    }
}
