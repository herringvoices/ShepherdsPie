import { useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import {
  createOrder,
  getOrderById,
  updateOrder,
} from "../../managers/orderManager";
import { useNavigate, useParams } from "react-router-dom";
import { getAllUserProfiles } from "../../managers/userProfileManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pizza from "./Pizza";
import {
  getAllSizes,
  getAllCheeses,
  getAllSauces,
  getAllToppings,
} from "../../managers/pizzaOptionsManager";

function CreateOrder({ loggedInUser, edit }) {
  const [sizes, setSizes] = useState([]);
  const [cheeses, setCheeses] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [order, setOrder] = useState({
    tableNumber: 1,
    date: null,
    tipAmount: 0,
    tookOrderId: loggedInUser?.id || 0,
    deliveryDriverId: 0,
    pizzas: [
      {
        id: Date.now(),
        size: {
          id: 1,
          name: "Personal(8 in.)",
          price: 6.99,
        },
        cheese: {
          id: 1,
          name: "Mozzarella",
          price: 0,
        },
        sauce: {
          id: 1,
          name: "Marinara",
          price: 0,
        },
        toppings: [],
      },
    ],
  });
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [isDelivery, setIsDelivery] = useState(false);
  const { orderId } = useParams();

  const getAndSet = async () => {
    const employees = await getAllUserProfiles();
    setEmployees(employees);
    const sizes = await getAllSizes();
    setSizes(sizes);
    const cheeses = await getAllCheeses();
    setCheeses(cheeses);
    const sauces = await getAllSauces();
    setSauces(sauces);
    const toppings = await getAllToppings();
    setToppings(toppings);
  };

  //Initial Render
  useEffect(() => {
    if (edit) {
      getOrderById(orderId).then(setOrder);
    }
    getAndSet();
  }, []);

  //When Delivery is toggled
  useEffect(() => {
    if (isDelivery) {
      setOrder({
        ...order,
        deliveryDriverId: 1,
        tableNumber: null,
      });
    } else {
      setOrder({
        ...order,
        deliveryDriverId: null,
        tableNumber: 1,
      });
    }
  }, [isDelivery]);

  //When the Add Pizza button is clicked
  const handleAddPizza = () => {
    const newPizza = {
      id: Date.now(),
      price: 6.99,
      size: sizes[0],
      cheese: cheeses[0],
      sauce: sauces[0],
      toppings: [],
    };
    setOrder((prevOrder) => ({
      ...prevOrder,
      pizzas: [...prevOrder.pizzas, newPizza],
    }));
  };

  //When the Submit/Update button is clicked
  //Selectively POST or PUT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (edit) {
      updateOrder(order).then(() => navigate(`/orders/${order.id}`));
    } else {
      // Create a new object with the updated date
      //The new object is because setOrder is asynchronous
      const newOrder = {
        ...order,
        date: new Date().toISOString(),
      };

      createOrder(newOrder).then((res) => navigate(`/orders/${res.id}`));
    }
  };

  return (
    <Container>
      <h1 className="mt-2">Create Order</h1>
      <Form>
        <Row className="mt-3">
          <Col md={2} className="my-auto">
            <Form.Group>
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Delivery"
                checked={isDelivery}
                onChange={() => setIsDelivery((prev) => !prev)} // Anonymous function directly inside onChange
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              {isDelivery ? (
                <>
                  <Form.Label>Delivery Driver</Form.Label>
                  <Form.Select
                    value={order.deliveryDriverId}
                    onChange={(e) =>
                      setOrder({ ...order, deliveryDriverId: e.target.value })
                    }
                  >
                    <option value="">Select a Driver</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee?.firstName}
                      </option>
                    ))}
                  </Form.Select>
                </>
              ) : (
                <>
                  <Form.Label>Table Number</Form.Label>
                  <InputGroup>
                    <InputGroupText>Table</InputGroupText>
                    <Form.Control
                      type="number"
                      step="1"
                      min="1"
                      max="10"
                      value={order.tableNumber}
                      onChange={(e) =>
                        setOrder({
                          ...order,
                          tableNumber: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </InputGroup>
                </>
              )}
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Tip</Form.Label>
              <InputGroup>
                <InputGroupText>$</InputGroupText>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={order.tipAmount}
                  onChange={(e) =>
                    setOrder({
                      ...order,
                      tipAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={4}>
            <h3>Total</h3>
            <p>Total</p>
          </Col>
        </Row>
        <Row>
          <h2>
            Pizzas
            <Button
              className="mx-2"
              variant="primary"
              type="button"
              onClick={handleAddPizza}
            >
              <FontAwesomeIcon icon="fa-solid fa-plus" />
            </Button>
          </h2>
        </Row>
        <Row>
          {order.pizzas?.map((pizza) => (
            <Pizza
              key={pizza.id}
              pizza={pizza}
              sizes={sizes}
              sauces={sauces}
              cheeses={cheeses}
              toppings={toppings}
              setOrder={setOrder}
            />
          ))}
        </Row>
        <Row>
          <Col className="mx-auto mt-3">
            <Button
              variant="outline-success"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
export default CreateOrder;
