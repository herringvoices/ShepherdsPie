namespace ShepherdsPie.DTOs
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public int? TableNumber { get; set; }
        public DateTime Date { get; set; }
        public decimal TipAmount { get; set; }
        public decimal Total { get; set; } // Uses the computed property from Order.cs

        public int TookOrderId { get; set; }
        public UserProfileDTO TookOrder { get; set; }
        public int? DeliveryDriverId { get; set; }
        public UserProfileDTO DeliveryDriver { get; set; }

        public List<PizzaDTO> Pizzas { get; set; }
    }
}
