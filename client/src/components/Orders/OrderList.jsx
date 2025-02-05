import { useEffect, useState } from "react";
import { deleteOrder, getOrdersByDate } from "../../managers/orderManager";
import {
  Button,
  Card,
  Col,
  Row,
  Modal,
  InputGroup,
  Form,
} from "react-bootstrap";
import "../../styles/orders.css";
import { useNavigate } from "react-router-dom";

export const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [date, setDate] = useState(new Date().toISOString());
  const [show, setShow] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const navigate = useNavigate();

  const formatDate = (date) => {
    const formattedDate = date.split("T")[0];
    setDate(formattedDate);
  };

  useEffect(() => {
    formatDate(date);
    getOrdersByDate(date).then(setOrders);
  }, [date]);

  const convertToDollars = (price) => {
    const formattedPrice = price.toLocaleString("en-us", {
      style: "currency",
      currency: "USD",
    });
    return formattedPrice;
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="container">
      <Form.Group className="order-date-form">
        <Form.Label htmlFor="order-date" className="me-2">
          Select a Day
        </Form.Label>
        <Form.Control
          type="date"
          id="order-date"
          aria-describedby="orderDateFilter"
          onChange={(e) => setDate(e.target.value)}
        />
      </Form.Group>
      {orders.map((o) => (
        <Row className="mb-3" key={o.id}>
          <Col>
            <Card
              className="order-card mb-3"
              onClick={() => navigate(`/orders/${o.id}`)}
            >
              <Card.Body>
                <Card.Subtitle className="mb-4">Order# {o.id}</Card.Subtitle>
                <Row className="align-items-center g-5">
                  <Col md={6}>
                    <Card.Text>
                      Assigned to:{" "}
                      {o.tookOrder?.firstName + " " + o.tookOrder?.lastName}
                    </Card.Text>
                    {!o.tableNumber ? (
                      <Card.Text>
                        {" "}
                        Delivery Driver:{" "}
                        {o.deliveryDriver?.firstName +
                          " " +
                          o.deliveryDriver?.lastName}
                      </Card.Text>
                    ) : (
                      <Card.Text>Table Number: {o.tableNumber}</Card.Text>
                    )}
                  </Col>
                  <Col md={6}>
                    <Card.Text>Tip: {convertToDollars(o.tipAmount)}</Card.Text>
                    <Card.Text>
                      Order Total: {convertToDollars(o.total)}
                    </Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col
            className="order-btns d-flex justify-content-center align-items-center"
            md={3}
          >
            <Col>
              <Row>
                <Button
                  className="order-edit-btn mb-3"
                  onClick={() => navigate(`/orders/${o.id}/edit`)}
                >
                  Edit
                </Button>
              </Row>
              <Row>
                <Button
                  variant="danger"
                  onClick={() => {
                    setSelectedOrderId(o.id);
                    setShow(true);
                  }}
                >
                  Delete
                </Button>
              </Row>
            </Col>
          </Col>
        </Row>
      ))}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Order #{selectedOrderId}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this order?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              deleteOrder(selectedOrderId).then(() => {
                getOrdersByDate(date).then(setOrders);
                setShow(false);
              });
            }}
          >
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
