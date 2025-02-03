using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShepherdsPie.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int? TableNumber { get; set; }
        public DateTime Date { get; set; }
        public int TipAmount { get; set; }

        // Required (not optional) property for the user who took the order
        [Required]
        public int TookOrderId { get; set; }

        [ForeignKey("TookOrderId")]
        public UserProfile TookOrder { get; set; }

        // Optional property for the user who delivers the order
        public int? DeliveryDriverId { get; set; }

        [ForeignKey("DeliveryDriverId")]
        public UserProfile DeliveryDriver { get; set; }
        public List<Pizza> Pizzas { get; set; }

        //get total of the order based on the price of the pizzas and the tip amount
        [NotMapped]
        public decimal Total
        {
            get
            {
                decimal total = 0;
                foreach (var pizza in Pizzas)
                {
                    total += pizza.Price;
                }
                total += TipAmount;
                return total;
            }
        }
    }
}
