import { Form } from "react-bootstrap";

function Topping({ topping, pizza, setOrder }) {
  const handleToppingChange = (event) => {
    const isChecked = event.target.checked;

    setOrder((prevOrder) => ({
      ...prevOrder,
      pizzas: prevOrder.pizzas.map((p) =>
        p.id === pizza.id
          ? {
              ...p,
              toppings: isChecked
                ? [...p.toppings, topping] //Add topping if checked
                : p.toppings.filter((t) => t.id !== topping.id), //Remove if unchecked
            }
          : p
      ),
    }));
  };

  return (
    <Form.Check
      type="checkbox"
      id={`topping-${topping.id}--pizza-${pizza.id}`}
      label={topping.name}
      checked={pizza.toppings.some((t) => t.id === topping.id)}
      onChange={handleToppingChange}
    />
  );
}

export default Topping;
