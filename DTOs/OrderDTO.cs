namespace ShepherdsPie.DTOs
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public int? TableNumber { get; set; }
        public DateTime Date { get; set; }
        public int TipAmount { get; set; }
        //public decimal Total { get; set; } // Uses the computed property from Order.cs
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
                if (DeliveryDriverId > 0)
                {
                    total += 5.00M;
                }
                return total;
            }
        }

        public int TookOrderId { get; set; }
        public UserProfileDTO TookOrder { get; set; } 
        public int? DeliveryDriverId { get; set; }
        public UserProfileDTO DeliveryDriver { get; set; } 

        public List<PizzaDTO> Pizzas { get; set; }
    }
}
