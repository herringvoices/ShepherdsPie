function PizzaDetails({ pizza, pizzaNumber }) {

  return (
    <tr>
        <td>{pizzaNumber}</td>
      <td>
        {pizza.size.name} (+{pizza.size.price})
      </td>
      <td>
        {pizza.cheese.name} (+{pizza.cheese.price})
      </td>
      <td>
        {pizza.sauce.name} (+{pizza.sauce.price})
      </td>
      <td>
        {pizza.toppings.map((topping) => (
          <div key={topping.id}>
            {topping.name} (+{topping.price})
          </div>
        ))}
      </td>
      <td className="text-end">${pizza.price}</td>
    </tr>
  );
}

export default PizzaDetails;
