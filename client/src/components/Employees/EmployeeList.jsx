import { useEffect, useState } from "react";
import {
  deleteUserProfile,
  getAllUserProfiles,
} from "../../managers/userProfileManager";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import "../../styles/employees.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({ id: 0, name: "" });

  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getAllUserProfiles().then(setEmployees);
  }, []);

  const handleDeleteEmployee = (employeeId) => {
    deleteUserProfile(employeeId).then(() => {
      getAllUserProfiles().then(setEmployees);
    });
  };
  return (
    <Container>
      <Row className="my-3 mx-auto">
        <Col className="mx-auto">
          <h1>Employee List</h1>
        </Col>
        <Col md={2}className="my-auto ">
          <Button
            variant="primary"
            onClick={() => navigate("/employees/create")}
          >
           <FontAwesomeIcon icon="plus" />
          </Button>
        </Col>
      </Row>
      <Row>
        {employees.map((employee) => (
          <Col key={employee.id}>
            <Card
              className="employee-card mb-3"
              onClick={() => navigate(`/employees/${employee.id}`)}
            >
              <Card.Title className="p-2">
                {employee.firstName} {employee.lastName}
              </Card.Title>
              <Card.Body>
                <Card.Text>Address: {employee.address}</Card.Text>
                <Card.Text>Email: {employee.email}</Card.Text>
                <Card.Text>Role: {employee.roles}</Card.Text>
              </Card.Body>
              <Row className="mt-auto">
                <Col>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/employees/${employee.id}/edit`);
                    }}
                  >
                    Edit
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEmployee({
                        id: employee.id,
                        name: `${employee.firstName} ${employee.lastName}`,
                      });
                      setShow(true);
                    }}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete {selectedEmployee.name}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this employee?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              setShow(false);
              handleDeleteEmployee(selectedEmployee.id);
            }}
          >
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
