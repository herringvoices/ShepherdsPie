import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteOrder, getOrderById } from "../../managers/orderManager";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import PizzaDetails from "./PizzaDetails";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [orderDate, setOrderDate] = useState(null);

  const navigate = useNavigate();

  async function getAndSetOrder(id) {
    try {
      const fetchedOrder = await getOrderById(id);
      setOrder(fetchedOrder);

      const date = new Date(fetchedOrder.date).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
      setOrderDate(date);
    } catch (error) {
      console.error("Failed to get order:", error);
    }
  }

  useEffect(() => {
    getAndSetOrder(id);
  }, [id]);

  return (
    <Container>
      <Row className="mt-4">
        <Col className="my-auto text-start">
          <h1>Order Details</h1>
        </Col>
        <Col xs={2} className="text-end d-flex flex-column ">
          <Button
            className="my-1"
            variant="primary"
            onClick={() => navigate(`/orders/${id}/edit`)}
          >
            Edit
          </Button>
          <Button
            className="my-1"
            variant="danger"
            onClick={() => {
              deleteOrder(id).then(() => {
                navigate("/orders");
              });
            }}
          >
            Delete
          </Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th colSpan={2} className="text-center">
                  Order Overview
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Order Number</td>
                <td>{order.id}</td>
              </tr>
              <tr>
                <td>Cashier</td>
                <td>
                  {order.tookOrder?.firstName} {order.tookOrder?.lastName}
                </td>
              </tr>
              <tr>
                <td>Order Type</td>
                <td>{order?.tableNumber ? "Dine-In" : "Delivery"}</td>
              </tr>
              {order?.tableNumber ? (
                <tr>
                  <td>Table Number</td>
                  <td>{order.tableNumber}</td>
                </tr>
              ) : (
                // Replace with the actual driver once you update the endpoint
                <tr>
                  <td>Delivery Driver</td>
                  <td>
                    {order.deliveryDriver?.firstName}{" "}
                    {order.deliveryDriver?.lastName}
                  </td>
                </tr>
              )}
              <tr>
                <td>Number of Pizzas</td>
                <td>{order.pizzas?.length}</td>
              </tr>
              <tr>
                <td>Order Date</td>
                <td>{orderDate}</td>
              </tr>
              <tr>
                <td className="fw-bold">Total</td>
                <td className="fw-bold">${order.total}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h3>Itemized Pizza List</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Pizza Number</th>
                <th>Size</th>
                <th>Cheese</th>
                <th>Sauce</th>
                <th>Toppings</th>
                <th className="text-end">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.pizzas?.map((pizza, index) => (
                <PizzaDetails
                  pizzaNumber={index + 1}
                  key={pizza.id}
                  pizza={pizza}
                />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default OrderDetails;
