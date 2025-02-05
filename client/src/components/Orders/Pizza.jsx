import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Topping from "./Topping";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Pizza({ setOrder, pizza, sizes, cheeses, sauces, toppings }) {
  //Takes the selected object and type and updates the pizza state
  //This is one handler for every select.
  const handlePizzaChange = (selectedObject, type) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      pizzas: prevOrder.pizzas.map((p) =>
        p.id === pizza.id ? { ...p, [type]: selectedObject } : p
      ),
    }));
  };

  //This is the delete button handler
  const handleDeletePizza = () => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      pizzas: prevOrder.pizzas.filter((p) => p.id !== pizza.id),
    }));
  };

  return (
    <Row className="my-3 p-3 rounded-lg shadow bg-light">
      <Col md={4}>
        <h3>Size</h3>
        <Form.Select
          onChange={(e) =>
            handlePizzaChange(sizes[e.target.selectedIndex], "size")
          }
        >
          {sizes.map((size) => (
            <option key={size.id}>{size.name}</option>
          ))}
        </Form.Select>

        <h3>Cheese</h3>
        <Form.Select
          onChange={(e) =>
            handlePizzaChange(cheeses[e.target.selectedIndex], "cheese")
          }
        >
          {cheeses.map((cheese) => (
            <option key={cheese.id}>{cheese.name}</option>
          ))}
        </Form.Select>

        <h3>Sauce</h3>
        <Form.Select
          onChange={(e) =>
            handlePizzaChange(sauces[e.target.selectedIndex], "sauce")
          }
        >
          {sauces.map((sauce) => (
            <option key={sauce.id}>{sauce.name}</option>
          ))}
        </Form.Select>
      </Col>
      <Col md={4}>
        <h3>Toppings</h3>
        {toppings.map((topping) => (
          <Topping
            key={topping.id}
            setOrder={setOrder}
            pizza={pizza}
            topping={topping}
          />
        ))}
      </Col>
      <Col className="text-end">
        <Button variant="danger" onClick={handleDeletePizza}>
          <FontAwesomeIcon icon="fa-solid fa-trash-can" />
        </Button>
      </Col>
    </Row>
  );
}
export default Pizza;
