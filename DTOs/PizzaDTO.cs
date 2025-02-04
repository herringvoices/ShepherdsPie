namespace ShepherdsPie.DTOs
{
    public class PizzaDTO
    {
        public long Id { get; set; }
        public int OrderId { get; set; }
        public decimal Price { get; set; }
        public SizeDTO Size { get; set; }
        public CheeseDTO Cheese { get; set; }
        public SauceDTO Sauce { get; set; }
        public List<ToppingDTO> Toppings { get; set; }
    }
}
