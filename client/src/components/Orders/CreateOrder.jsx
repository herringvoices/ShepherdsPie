import { useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { getOrderById } from "../../managers/orderManager";
import { useParams } from "react-router-dom";
import { getAllUserProfiles } from "../../managers/userProfileManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pizza from "./Pizza";

function CreateOrder({ loggedInUser, edit }) {
  const [order, setOrder] = useState({
    tableNumber: 1,
    date: null,
    tipAmount: 0,
    total: 0,
    tookOrderId: loggedInUser?.id || 0,
    deliveryDriverId: 0,
    pizzas: [{ toppings: [] }],
  });

  const [employees, setEmployees] = useState([]);
  const [isDelivery, setIsDelivery] = useState(false);
  const { orderId } = useParams();

  const getAndSetEmployees = async () => {
    const employees = await getAllUserProfiles();
    setEmployees(employees);
  };

  //Initial Render
  useEffect(() => {
    if (edit) {
      getOrderById(orderId).then(setOrder);
    } else {
      setOrder({
        tableNumber: 1,
        date: null,
        tipAmount: 0,
        total: 0,
        tookOrderId: loggedInUser.id,
        deliveryDriverId: 0,
        pizzas: [
          {
            toppings: [],
          },
        ],
      });
      getAndSetEmployees();
    }
  }, []);

  //When Delivery is toggled
  useEffect(() => {
    if (isDelivery) {
      setOrder({
        ...order,
        deliveryDriverId: 1,
        tableNumber: 0,
      });
    } else {
      setOrder({
        ...order,
        deliveryDriverId: 0,
        tableNumber: 1,
      });
    }
  }, [isDelivery]);

  return (
    <Container>
      <h1 className="mt-2">Create Order</h1>
      <Form>
        <Row className="mt-3">
          <Col md={1} className="my-auto">
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
                  <Form.Label>Tip</Form.Label>
                  <InputGroup>
                    <InputGroupText>Table</InputGroupText>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
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
              onClick={() => console.log(Date.now())}
            >
              <FontAwesomeIcon icon="fa-solid fa-plus" />
            </Button>
          </h2>
        </Row>
        <Row>
          {order.pizzas?.map((pizza) => (
            <Pizza key={pizza.id} pizza={pizza} />
          ))}
        </Row>
        <Row>
          <Col className="mx-auto mt-3">
            <Button variant="outline-success" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
export default CreateOrder;
